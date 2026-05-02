"""
build.py — lê vault/*.md, extrai frontmatter YAML e [[wikilinks]],
gera app/data/index.json.

Uso: python build.py  (execute dentro de filosofia/)
"""
import os, re, json

BASE    = os.path.dirname(os.path.abspath(__file__))
VAULT   = os.path.join(BASE, 'vault')
OUT_DIR = os.path.join(BASE, 'app', 'data')
OUT     = os.path.join(OUT_DIR, 'index.json')

def parse_frontmatter(raw):
    m = re.match(r'^---\n(.*?)\n---\n(.*)', raw, re.DOTALL)
    if not m:
        return {}, raw
    yaml_block, body = m.group(1), m.group(2)
    meta = {}
    for line in yaml_block.split('\n'):
        kv = re.match(r'^(\w+):\s*(.*)', line)
        if not kv:
            continue
        k, v = kv.group(1), kv.group(2).strip()
        arr = re.match(r'^\[(.*)\]$', v)
        if arr:
            meta[k] = [s.strip().strip("'").strip('"') for s in arr.group(1).split(',') if s.strip()]
        else:
            meta[k] = v.strip("'").strip('"')
    return meta, body

def wiki_links(text):
    return list(set(hit.lower() for hit in re.findall(r'\[\[([^\]]+)\]\]', text)))

os.makedirs(OUT_DIR, exist_ok=True)

files  = sorted(f for f in os.listdir(VAULT) if f.endswith('.md'))
nodes, edges, id_set = [], [], set()

for f in files:
    slug = f.replace('.md', '').lower()
    raw  = open(os.path.join(VAULT, f), encoding='utf-8').read()
    meta, body = parse_frontmatter(raw)
    all_links = list(set(
        [l.lower() for l in (meta.get('links') or [])] + wiki_links(body)
    ))
    nodes.append({'id': slug, 'title': meta.get('title', slug),
                  'tags': meta.get('tags', []), 'body': body})
    id_set.add(slug)
    for t in all_links:
        edges.append({'source': slug, 'target': t})

valid_edges = [e for e in edges if e['source'] in id_set and e['target'] in id_set]
data = {'nodes': nodes, 'edges': valid_edges}

with open(OUT, 'w', encoding='utf-8') as fh:
    json.dump(data, fh, ensure_ascii=False, indent=2)

print(f'OK: {len(nodes)} nodes, {len(valid_edges)} edges -> {OUT}')
