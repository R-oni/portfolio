/**
 * firebase.js — Firestore integration for the philosophy graph
 * Exports: db, getNodes, getNode, saveNode, deleteNode, onNodesChange, seedIfEmpty
 */

import { initializeApp }           from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            'AIzaSyBDNz5u4T7OeaVu2wdZU041RRnnmdmlt5g',
  authDomain:        'filosofia-3eae2.firebaseapp.com',
  projectId:         'filosofia-3eae2',
  storageBucket:     'filosofia-3eae2.firebasestorage.app',
  messagingSenderId: '623138302529',
  appId:             '1:623138302529:web:4164b602e9b0e45c9d74c0',
};

const _app = initializeApp(firebaseConfig);
export const db   = getFirestore(_app);
const COLL = 'nodes';

// ── CRUD ─────────────────────────────────────────────────────────────────────

/** Returns all nodes as { id, title, tags, links, body }[] */
export async function getNodes() {
  const snap = await getDocs(collection(db, COLL));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Returns one node or null */
export async function getNode(id) {
  const snap = await getDoc(doc(db, COLL, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Creates or updates a node.
 * @param {string} id  — document ID (slug)
 * @param {{ title, tags, links, body }} data
 */
export async function saveNode(id, data) {
  const { id: _strip, ...rest } = { ...data };
  await setDoc(doc(db, COLL, id), rest, { merge: true });
}

/** Deletes a node by id */
export async function deleteNode(id) {
  await deleteDoc(doc(db, COLL, id));
}

/**
 * Subscribes to real-time changes on the nodes collection.
 * @param {(nodes: object[]) => void} callback
 * @returns unsubscribe function
 */
export function onNodesChange(callback) {
  return onSnapshot(collection(db, COLL), snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

/**
 * Seeds Firestore from a local index.json if the collection is empty.
 * Returns true if seeded, false if data already existed.
 */
export async function seedIfEmpty(jsonUrl) {
  const existing = await getDocs(collection(db, COLL));
  if (!existing.empty) return false;

  const { nodes, edges } = await fetch(jsonUrl).then(r => r.json());

  // Build per-node link sets from directed edges in the JSON
  const linkMap = {};
  for (const { source, target } of edges) {
    if (!linkMap[source]) linkMap[source] = new Set();
    linkMap[source].add(target);
  }

  const batch = writeBatch(db);
  for (const { id, title, tags, body } of nodes) {
    batch.set(doc(db, COLL, id), {
      title,
      tags:  tags  || [],
      links: [...(linkMap[id] || [])],
      body:  body  || '',
    });
  }
  await batch.commit();
  console.log(`[firebase] Seeded ${nodes.length} nodes from ${jsonUrl}`);
  return true;
}
