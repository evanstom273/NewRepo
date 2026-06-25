const DB_NAME = 'newrepo-image-store';
const DB_VERSION = 1;
const STORE_NAME = 'images';

export type StoredImageRecord = {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: number;
  blob: Blob;
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open image database'));
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

function waitForTransaction(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed'));
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted'));
  });
}

export async function listImages(): Promise<StoredImageRecord[]> {
  const db = await openDatabase();
  try {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const records = await requestToPromise<StoredImageRecord[]>(store.getAll());
    return records.sort((a, b) => b.createdAt - a.createdAt);
  } finally {
    db.close();
  }
}

export async function saveImage(file: File): Promise<StoredImageRecord> {
  const db = await openDatabase();
  const record: StoredImageRecord = {
    id: crypto.randomUUID(),
    name: file.name,
    type: file.type || 'image/*',
    size: file.size,
    createdAt: Date.now(),
    blob: file,
  };

  try {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).add(record);
    await waitForTransaction(transaction);
    return record;
  } finally {
    db.close();
  }
}

export async function deleteImage(id: string): Promise<void> {
  const db = await openDatabase();
  try {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(id);
    await waitForTransaction(transaction);
  } finally {
    db.close();
  }
}
