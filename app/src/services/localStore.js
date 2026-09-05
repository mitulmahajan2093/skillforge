// Tiny localStorage "collections" store that mimics the shape of
// Firestore calls (async, returns plain objects with `id`). Used only
// when isFirebaseConfigured is false, so the whole app is demoable
// with zero setup. Real Firebase-backed services live alongside these
// in each service file and share the exact same function signatures.

const NS = "skillforge:";

function read(collection) {
  try {
    const raw = localStorage.getItem(NS + collection);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(collection, data) {
  localStorage.setItem(NS + collection, JSON.stringify(data));
}

export function seedIfEmpty(collection, seedData) {
  if (read(collection) === null) write(collection, seedData);
}

export function getAll(collection) {
  return Promise.resolve([...(read(collection) || [])]);
}

export function getById(collection, id) {
  const items = read(collection) || [];
  const found = items.find((i) => i.id === id) || null;
  return Promise.resolve(found);
}

export function add(collection, doc) {
  const items = read(collection) || [];
  const id = doc.id || `${collection.slice(0, 3)}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const withId = { ...doc, id };
  items.push(withId);
  write(collection, items);
  return Promise.resolve(withId);
}

export function update(collection, id, patch) {
  const items = read(collection) || [];
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return Promise.reject(new Error(`${collection}/${id} not found`));
  items[idx] = { ...items[idx], ...patch };
  write(collection, items);
  return Promise.resolve(items[idx]);
}

export function remove(collection, id) {
  const items = read(collection) || [];
  write(collection, items.filter((i) => i.id !== id));
  return Promise.resolve(true);
}

export function query(collection, predicate) {
  const items = read(collection) || [];
  return Promise.resolve(items.filter(predicate));
}

// Simulates minor network latency so loading states are visible/testable.
export function withLatency(promiseFactory, ms = 300) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      promiseFactory().then(resolve).catch(reject);
    }, ms);
  });
}
