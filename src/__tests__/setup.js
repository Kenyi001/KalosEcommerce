import { vi } from 'vitest';

// Mock Firebase SDK
const mockFirestore = {
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  setDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  startAfter: vi.fn(),
  startAt: vi.fn(),
  endAt: vi.fn(),
  endBefore: vi.fn(),
};

const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
};

const mockStorage = {
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
  deleteObject: vi.fn(),
};

const mockApp = {
  name: '[DEFAULT]',
  options: {},
};

// Mock Firebase functions
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => mockApp),
  getApps: vi.fn(() => [mockApp]),
  getApp: vi.fn(() => mockApp),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => mockFirestore),
  connectFirestoreEmulator: vi.fn(),
  collection: vi.fn(() => mockFirestore.collection()),
  doc: vi.fn(() => mockFirestore.doc()),
  getDoc: vi.fn(() => mockFirestore.getDoc()),
  getDocs: vi.fn(() => mockFirestore.getDocs()),
  addDoc: vi.fn(() => mockFirestore.addDoc()),
  updateDoc: vi.fn(() => mockFirestore.updateDoc()),
  deleteDoc: vi.fn(() => mockFirestore.deleteDoc()),
  setDoc: vi.fn(() => mockFirestore.setDoc()),
  query: vi.fn(() => mockFirestore.query()),
  where: vi.fn(() => mockFirestore.where()),
  orderBy: vi.fn(() => mockFirestore.orderBy()),
  limit: vi.fn(() => mockFirestore.limit()),
  startAfter: vi.fn(() => mockFirestore.startAfter()),
  startAt: vi.fn(() => mockFirestore.startAt()),
  endAt: vi.fn(() => mockFirestore.endAt()),
  endBefore: vi.fn(() => mockFirestore.endBefore()),
  serverTimestamp: vi.fn(() => ({ seconds: Date.now() / 1000 })),
  arrayUnion: vi.fn((items) => ({ _methodName: 'arrayUnion', _elements: items })),
  arrayRemove: vi.fn((items) => ({ _methodName: 'arrayRemove', _elements: items })),
  increment: vi.fn((value) => ({ _methodName: 'increment', _operand: value })),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => mockAuth),
  connectAuthEmulator: vi.fn(),
  signInWithEmailAndPassword: vi.fn(() => mockAuth.signInWithEmailAndPassword()),
  createUserWithEmailAndPassword: vi.fn(() => mockAuth.createUserWithEmailAndPassword()),
  signOut: vi.fn(() => mockAuth.signOut()),
  onAuthStateChanged: vi.fn(() => mockAuth.onAuthStateChanged()),
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => mockStorage),
  connectStorageEmulator: vi.fn(),
  ref: vi.fn(() => mockStorage.ref()),
  uploadBytes: vi.fn(() => mockStorage.uploadBytes()),
  getDownloadURL: vi.fn(() => mockStorage.getDownloadURL()),
  deleteObject: vi.fn(() => mockStorage.deleteObject()),
}));

// Export mocks for use in tests
export {
  mockFirestore,
  mockAuth,
  mockStorage,
  mockApp,
};