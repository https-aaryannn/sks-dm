import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Borrower } from '../types';

const COLLECTION_NAME = 'borrowers';

export const getBorrowers = async (): Promise<Borrower[]> => {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(d => ({ ...d.data(), id: d.id } as Borrower));
};

export const addBorrower = async (borrower: Omit<Borrower, 'id'>): Promise<Borrower> => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), borrower);
    return { ...borrower, id: docRef.id } as Borrower;
};

export const updateBorrower = async (borrower: Borrower): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, borrower.id);
    const { id, ...data } = borrower;
    await updateDoc(docRef, data as any);
};

export const deleteBorrower = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
};
