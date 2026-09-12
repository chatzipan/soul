import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/**
 * The Firebase app and the shared Firestore handle.
 *
 * This lives here, and not in index.ts, on purpose. The functions entry point
 * must export deployable functions and nothing else. firebase-functions v7
 * walks every exported object looking for nested function groups, and the
 * Firestore client is a circular object graph, so exporting it from index.ts
 * sends the loader into infinite recursion and no functions load at all.
 */
initializeApp();

export const db = getFirestore();
