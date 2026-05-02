/**
 * graph.js — D3.js v7 force-directed graph
 * Features: community detection (label propagation), weighted edges,
 *           node size by degree, community centroid force.
 * ES module — exports PhilosophyGraph
 */

// ── Community palette ────────────────────────────────────────────────────────
const PALETTE = [
  '#6366f1', '#f59e0b', '#10b981', '#ec4899',
  '#8b5cf6', '#3b82f6', '#f97316', '#84cc16',
  '#06b6d4', '#ef4444', '#a78bfa', '#00ffe7',
];

// ── Community detection: deterministic label propagation ─────────────────────
function detectCommunities(nodes, edges) {
  const adj = {};
  nodes.forEach(n => { adj[n.id] = {}; });
  edges.forEach(({ source, target }) => {
    const s = source?.id ?? source;
    const t = target?.id ?? target;
    if (!adj[s] || !adj[t]) return;
    adj[s][t] = (adj[s][t] || 0) + 1;
    adj[t][s] = (adj[t][s] || 0) + 1;
  });

  const label  = Object.fromEntries(nodes.map(n => [n.id, n.id]));
  const sorted = [...nodes].sort((a, b) => a.id.localeCompare(b.id));

  let changed = true, iter = 0;
  while (changed && iter++ < 200) {
    changed = false;
    for (const node of sorted) {
      const nbrs = Object.keys(adj[node.id]);
      if (!nbrs.length) continue;
      const votes = {};
      for (const nb of nbrs) {
        const l = label[nb];
        votes[l] = (votes[l] || 0) + (adj[node.id][nb] || 1);
      }
      const best = Object.entries(votes)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
      if (best !== label[node.id]) { label[node.id] = best; changed = true; }
    }
  }
  return label;
}

// ── Community centroid force (pulls same-community nodes together) ─────────────
function communityForce(labelsGetter, strength = 0.05) {
  let nodes;
  function force(alpha) {
    const labels = labelsGetter();
    if (!labels) return;
    const centroids = {};
    for (const n of nodes) {
      const c = labels[n.id];
      if (c == null) continue;
      if (!centroids[c]) centroids[c] = { x: 0, y: 0, n: 0 };
      centroids[c].x += n.x; centroids[c].y += n.y; centroids[c].n++;
    }
    for (const c of Object.values(centroids)) { c.x /= c.n; c.y /= c.n; }
    for (const n of nodes) {
      const c = centroids[labels[n.id]];
      if (!c) continue;
      n.vx += (c.x - n.x) * strength * alpha;
      n.vy += (c.y - n.y) * strength * alpha;
    }
  }
  force.initialize = ns => { nodes = ns; };
  return force;
}

// ── Main class ────────────────────────────────────────────────────────────────
export class PhilosophyGraph {
  constructor(svgEl, callbacks = {}) {
    this.svgEl       = svgEl;
    this.onNodeClick = callbacks.onNodeClick || (() => {});
    this.onNodeHover = callbacks.onNodeHover || (() => {});
    this.onNodeLeave = callbacks.onNodeLeave || (() => {});
    this.activeId    = null;
    this._communityLabels = {};
    this._communityColors = {};
    this._prevPos = {};
    this._init();
  }

  _init() {
    const W = this.svgEl.clientWidth  || 800;
    const H = this.svgEl.clientHeight || 600;
    d3.select(this.svgEl).selectAll('*').remove();
    this.svg  = d3.select(this.svgEl);
    this.W = W; this.H = H;
    this.g    = this.svg.append('g');
    const zoom = d3.zoom().scaleExtent([0.15, 6])
      .on('zoom', e => this.g.attr('transform', e.transform));
    this.svg.call(zoom);
    this.zoom  = zoom;
    this.linkG = this.g.append('g').attr('class', 'links');
    this.nodeG = this.g.append('g').attr('class', 'nodes');
  }

  /** Load (or reload) from Firestore node objects { id, title, tags, links[], body } */
  load(rawNodes) {
    // Preserve positions across live reloads
    if (this.nodes) {
      for (const n of this.nodes) {
        if (n.x != null) this._prevPos[n.id] = { x: n.x, y: n.y };
      }
    }

    // Build undirected edges from node.links[]
    const idSet   = new Set(rawNodes.map(n => n.id));
    const edgeSet = new Set();
    const edges   = [];
    for (const node of rawNodes) {
      for (const raw of (node.links || [])) {
        const t = raw.toLowerCase();
        if (!idSet.has(t)) continue;
        const key = [node.id, t].sort().join('⇒');
        if (!edgeSet.has(key)) { edgeSet.add(key); edges.push({ source: node.id, target: t }); }
      }
    }

    const nodes = rawNodes.map(n => ({ ...n, links: [...(n.links || [])], ...(this._prevPos[n.id] || {}) }));
    // Back-fill reverse links in memory so undirected graph is symmetric
    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
    for (const { source, target } of edges) {
      const tNode = nodeMap[target];
      if (tNode && !tNode.links.includes(source)) tNode.links.push(source);
    }
    this.nodes     = nodes;
    this.edges     = edges;
    this.nodeIndex = nodeMap;

    // Community detection
    this._communityLabels = detectCommunities(nodes, edges);
    const cids = [...new Set(Object.values(this._communityLabels))];
    this._communityColors = Object.fromEntries(
      cids.map((c, i) => [c, PALETTE[i % PALETTE.length]])
    );

    // Node degree (determines radius)
    this.degree = Object.fromEntries(nodes.map(n => [n.id, 0]));
    for (const e of edges) {
      this.degree[e.source] = (this.degree[e.source] || 0) + 1;
      this.degree[e.target] = (this.degree[e.target] || 0) + 1;
    }

    this._build();
    if (this.activeId) this.setActive(this.activeId);
  }

  _color(node) {
    const c = this._communityLabels[node.id];
    return c ? (this._communityColors[c] || '#888899') : '#888899';
  }

  _radius(node) {
    return 7 + Math.sqrt(this.degree[node.id] || 0) * 2.4;
  }

  _build() {
    if (this.sim) this.sim.stop();

    this.adj = {};
    for (const { source: s, target: t } of this.edges) {
      (this.adj[s] = this.adj[s] || new Set()).add(t);
      (this.adj[t] = this.adj[t] || new Set()).add(s);
    }

    const labs = () => this._communityLabels;

    this.sim = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.edges).id(d => d.id)
        // Shorter distance + stronger pull for same-community links
        .distance(e => {
          const s = e.source?.id ?? e.source, t = e.target?.id ?? e.target;
          return this._communityLabels[s] === this._communityLabels[t] ? 65 : 140;
        })
        .strength(e => {
          const s = e.source?.id ?? e.source, t = e.target?.id ?? e.target;
          return this._communityLabels[s] === this._communityLabels[t] ? 0.7 : 0.18;
        })
      )
      .force('charge',    d3.forceManyBody().strength(-310))
      .force('center',    d3.forceCenter(this.W / 2, this.H / 2))
      .force('collision', d3.forceCollide(d => this._radius(d) + 10))
      .force('community', communityForce(labs, 0.05))
      .on('tick', () => this._tick());

    // Links
    this.link = this.linkG.selectAll('line')
      .data(this.edges, e => {
        const s = e.source?.id ?? e.source, t = e.target?.id ?? e.target;
        return [s, t].sort().join('⇒');
      })
      .join('line').attr('class', 'link');

    // Nodes (enter/update/exit)
    this.nodeG.selectAll('g.node')
      .data(this.nodes, d => d.id)
      .join(
        enter  => { const g = enter.append('g').attr('class', 'node'); g.append('circle'); g.append('text').attr('text-anchor', 'middle'); return g; },
        update => update,
        exit   => exit.remove()
      );

    this.node = this.nodeG.selectAll('g.node');

    this.node.select('circle')
      .attr('r',    d => this._radius(d))
      .attr('fill', d => this._color(d));

    this.node.select('text')
      .attr('dy', d => this._radius(d) + 13)
      .text(d => d.title);

    const drag = d3.drag()
      .clickDistance(5)
      .on('start', (e, d) => { if (!e.active) this.sim.alphaTarget(.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag',  (e, d) => { d.fx = e.x; d.fy = e.y; })
      .on('end',   (e, d) => { if (!e.active) this.sim.alphaTarget(0); d.fx = null; d.fy = null; });

    this.node
      .call(drag)
      .on('click',     (e, d) => { e.stopPropagation(); this.setActive(d.id); this.onNodeClick(d); })
      .on('mouseover', (e, d) => this.onNodeHover(e, d))
      .on('mouseout',  (e, d) => this.onNodeLeave(e, d));

    const hasPrev = this.nodes.some(n => n.x != null);
    this.sim.alpha(hasPrev ? 0.2 : 1).restart();
  }

  _tick() {
    if (!this.link || !this.node) return;
    this.link
      .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    this.node.attr('transform', d => `translate(${d.x},${d.y})`);
  }

  setActive(id) {
    this.activeId = id;
    if (!this.node) return;
    const adj = this.adj;
    this.node
      .classed('active', d => d.id === id)
      .classed('dimmed', d => id ? (d.id !== id && !adj[id]?.has(d.id)) : false);
    this.link.classed('highlighted', d => {
      if (!id) return false;
      const s = d.source.id || d.source, t = d.target.id || d.target;
      return s === id || t === id;
    });
  }

  clearActive() {
    this.activeId = null;
    if (this.node) { this.node.classed('active', false).classed('dimmed', false); }
    if (this.link) { this.link.classed('highlighted', false); }
  }

  filter(ids) {
    if (!this.node) return;
    this.node.style('opacity', ids ? d => ids.has(d.id) ? 1 : 0.06 : null);
    this.link.style('opacity', ids ? d => {
      const s = d.source.id || d.source, t = d.target.id || d.target;
      return ids.has(s) && ids.has(t) ? 1 : 0.02;
    } : null);
  }

  focusNode(id) {
    const n = this.nodeIndex?.[id];
    if (!n || n.x == null) return;
    const t = d3.zoomIdentity.translate(this.W / 2 - n.x, this.H / 2 - n.y);
    this.svg.transition().duration(420).call(this.zoom.transform, t);
  }

  resize() {
    const W = this.svgEl.clientWidth, H = this.svgEl.clientHeight;
    this.W = W; this.H = H;
    if (this.sim) this.sim.force('center', d3.forceCenter(W / 2, H / 2)).alpha(.15).restart();
  }
}
