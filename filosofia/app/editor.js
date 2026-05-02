/**
 * editor.js — View + Edit modes for philosopher nodes
 * ES module — exports Editor
 */
import { getNode, saveNode as _saveNodeFS } from './firebase.js';

// Configure marked once at module level.
// Supports {#id} shorthand in headings: ## My Section {#my-id}
marked.use({
  breaks: true,
  gfm: true,
  renderer: {
    heading({ text, depth }) {
      const m = text.match(/^(.*?)\s*\{#([\w-]+)\}$/);
      const id = m
        ? m[2]
        : text.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
            .replace(/^-+|-+$/g, '');
      const clean = m ? m[1] : text;
      return `<h${depth} id="${id}">${clean}</h${depth}>\n`;
    },
  },
});

export class Editor {
  constructor({ onSave, onDelete, onLinkClick } = {}) {
    // View-mode elements
    this.$viewHeader = document.getElementById('view-header');
    this.$title      = document.getElementById('content-title');
    this.$tags       = document.getElementById('content-tags');
    this.$body       = document.getElementById('content-body');
    this.$btnEdit    = document.getElementById('btn-edit');

    // Edit-mode elements
    this.$editPanel  = document.getElementById('edit-panel');
    this.$editTitle  = document.getElementById('edit-title');
    this.$editTags   = document.getElementById('edit-tags-input');
    this.$editLinks  = document.getElementById('edit-links-input');
    this.$editBody   = document.getElementById('edit-body-input');
    this.$btnSave    = document.getElementById('btn-save');
    this.$btnCancel  = document.getElementById('btn-cancel');
    this.$btnDelete  = document.getElementById('btn-delete');

    // Empty state
    this.$empty = document.getElementById('empty-state');

    this.onSave      = onSave      || (() => {});
    this.onDelete    = onDelete    || (() => {});
    this.onLinkClick = onLinkClick || (() => {});

    this._mode  = 'empty';  // 'empty' | 'view' | 'edit'
    this._node  = null;
    this._isNew = false;

    this._bind();
  }

  _bind() {
    this.$btnEdit.addEventListener('click', () => this._enterEdit());
    this.$btnSave.addEventListener('click', () => this._save());
    this.$btnCancel.addEventListener('click', () => this._cancel());
    this.$btnDelete.addEventListener('click', () => this._delete());

    // Ctrl+S saves in edit mode
    this.$editBody.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); this._save(); }
    });

    // Anchor links (#section) scroll within the content div; wiki-links navigate nodes
    this.$body.addEventListener('click', e => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const target = this.$body.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (a.dataset.wiki) { e.preventDefault(); this.onLinkClick(a.dataset.wiki); }
    });
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  showView(node) {
    this._node  = node;
    this._isNew = false;
    this._mode  = 'view';
    this._render();
  }

  showEdit(node) {
    this._node  = node;         // null = new node
    this._isNew = !node;
    this._mode  = 'edit';
    this._render();
  }

  clear() {
    this._mode = 'empty';
    this._node = null;
    this._render();
  }

  /** Call when Firestore updates the currently-viewed node */
  refreshIfViewing(node) {
    if (this._mode === 'view' && this._node?.id === node.id) {
      this._node = node;
      this._renderView();
    }
  }

  // ── Internals ───────────────────────────────────────────────────────────────

  _render() {
    const v = this._mode === 'view', e = this._mode === 'edit';
    this._toggle(this.$viewHeader, v,    'flex');
    this._toggle(this.$body,       v,    'block');
    this._toggle(this.$editPanel,  e,    'flex');
    this._toggle(this.$empty,      !v && !e, 'flex');
    if (v) this._renderView();
    if (e) this._renderEdit();
  }

  _toggle(el, on, displayType) {
    el.style.display = on ? displayType : 'none';
  }

  _renderView() {
    const n = this._node;
    this.$title.textContent = n.title || '';
    this.$tags.innerHTML = (n.tags || [])
      .map(t => `<span class="tag-pill">${this._esc(t)}</span>`).join('');

    // Render markdown, then linkify [[wikilinks]]
    const raw = marked.parse(n.body || '');
    this.$body.innerHTML = raw.replace(
      /\[\[([^\]]+)\]\]/g,
      (_, slug) => `<a class="wiki-link" href="#" data-wiki="${this._esc(slug.toLowerCase())}">${this._esc(slug)}</a>`
    );
    this.$body.scrollTop = 0;
  }

  _renderEdit() {
    const n = this._node || {};
    this.$editTitle.value = n.title || '';
    this.$editTags.value  = (n.tags  || []).join(', ');
    this.$editLinks.value = (n.links || []).join(', ');
    this.$editBody.value  = n.body   || '';
    this.$btnDelete.style.display = this._isNew ? 'none' : '';
    requestAnimationFrame(() => this.$editTitle.focus());
  }

  _enterEdit() {
    this._isNew = false;
    this._mode  = 'edit';
    this._render();
  }

  _collectForm() {
    return {
      title: this.$editTitle.value.trim(),
      tags:  this.$editTags.value.split(',').map(s => s.trim()).filter(Boolean),
      links: this.$editLinks.value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
      body:  this.$editBody.value,
    };
  }

  _slugify(title) {
    return title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  async _save() {
    const data = this._collectForm();
    if (!data.title) { this.$editTitle.focus(); return; }

    const id = this._isNew ? this._slugify(data.title) : this._node.id;

    // Auto-collect [[wikilinks]] from body and merge into links[]
    const wikiRe = /\[\[([^\]]+)\]\]/g;
    let m;
    const bodyLinks = new Set(data.links.map(l => l.toLowerCase()));
    while ((m = wikiRe.exec(data.body)) !== null) {
      const slug = this._slugify(m[1]);
      if (slug) bodyLinks.add(slug);
    }
    data.links = [...bodyLinks];

    this.$btnSave.disabled    = true;
    this.$btnSave.textContent = '…';

    try {
      await this.onSave(id, data);

      // Create stub nodes for any referenced slug that doesn't exist yet
      for (const slug of bodyLinks) {
        if (slug === id) continue;
        const existing = await getNode(slug);
        if (!existing) {
          await _saveNodeFS(slug, { title: slug, tags: [], links: [], body: '' });
        }
      }

      this._node  = { id, ...data };
      this._isNew = false;
      this._mode  = 'view';
      this._render();
    } finally {
      this.$btnSave.disabled    = false;
      this.$btnSave.textContent = 'Salvar';
    }
  }

  _cancel() {
    if (this._isNew || !this._node) {
      this.clear();
    } else {
      this._mode = 'view';
      this._render();
    }
  }

  async _delete() {
    if (!this._node || this._isNew) return;
    if (!confirm(`Deletar "${this._node.title}"?\nEssa ação não pode ser desfeita.`)) return;
    this.$btnDelete.disabled = true;
    try {
      await this.onDelete(this._node.id);
      this.clear();
    } finally {
      this.$btnDelete.disabled = false;
    }
  }
}
