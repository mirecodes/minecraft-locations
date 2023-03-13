import { DocumentReference, DocumentSnapshot, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestore } from "../libs/firebase";
import { addWorldInList, deleteWorldInList, getWorldsFollowingIndex, updateWorldInList } from './firestore-worlds-intl-data';

// Models
type TWorld = {
    idx: string;
    name: string;
    timestamp: Date;
    id?: string;
}

type TAddWorld = {
    name: string;
}

type TUpdateWorld = {
    name: string;
}

// Collection & Document References
const worldsCollRef = collection(firestore, 'worlds');

// Auxiliary APIs
export const getWorldsDocRefById = (id: string) => {
    const docRef = doc(worldsCollRef, id);
    return docRef;
}

export const getWorldsDocRefByIndex = async (idx: string) => {
    try {
        const qry = query(worldsCollRef, where('idx', '==', idx));
        const querySnapshot = await getDocs(qry) as QuerySnapshot<TWorld>;
        const docId = querySnapshot.docs[0].id;
        const docRef = getWorldsDocRefById(docId);
        return docRef;
    } catch (err) {
        const error_message = "ERROR: Error has occured in getWorldsDocRefByIndex(idx)";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}

// Primary APIs
export const getAllWorlds = async () => {
    try {
        const querySnapshot = await getDocs(worldsCollRef) as QuerySnapshot<TWorld>;
        const worldsDocs: TWorld[] = [];
        querySnapshot.forEach((world) => worldsDocs.push({ ...world.data(), id: world.id }));
        return worldsDocs;
    } catch (err) {
        const error_message = "ERROR: Error has occured in getAllWorldsDocs()";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}

export const getWorldByIndex = async (idx: string) => {
    try {
        const docRef = await getWorldsDocRefByIndex(idx);
        const docSnapshot = await getDoc(docRef) as DocumentSnapshot<TWorld>;
        if (docSnapshot.exists()) {
            const res = { ...docSnapshot.data(), id: docSnapshot.id } as TWorld;
            return res;
        } else {
            throw new Error(`ERROR: Can't find world of the index ${idx}`);
        }
    } catch (err) {
        const error_message = "ERROR: Error has occured in getWorldByIndex(idx)";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}

export const addWorldsDoc = async (add_world: TAddWorld) => {
    try {
        const nextWorld: TWorld = {
            idx: await getWorldsFollowingIndex(),
            name: add_world.name,
            timestamp: new Date()
        }
        const res = await addWorldInList(nextWorld.name);
        const docRef = await addDoc(worldsCollRef, nextWorld);
        console.log(`INFO: world has been added (doc_id=${docRef.id})`);
        return docRef;
    } catch (err) {
        const error_message = "ERROR: Error has occured in addWorldsDoc(world)";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}

export const deleteWorldsDoc = async (idx: string) => {
    try {
        const docRef = await getWorldsDocRefByIndex(idx) as DocumentReference;
        const docSnapshot = await getDoc(docRef) as DocumentSnapshot<TWorld>;
        if (docSnapshot.exists()) {
            const world = docSnapshot.data();
            const res1 = await deleteWorldInList(world.name);
            const res2 = await deleteDoc(docRef);
            console.log(`INFO: world has been removed (doc_id=${docRef.id})`);
        } else {
            throw new Error(`ERROR: Can't find world of the index ${idx}`);
        }
    } catch (err) {
        const error_message = "ERROR: Error has occured in deleteWorldsDoc(world)";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}

export const updateWorldsDoc = async (prevIdx: string, update_world: TUpdateWorld) => {
    try {
        const docRef = await getWorldsDocRefByIndex(prevIdx);
        const docSnapshot = await getDoc(docRef) as DocumentSnapshot<TWorld>;
        if (docSnapshot.exists()) {
            const prevWorld = docSnapshot.data();
            const res1 = await updateWorldInList(prevWorld.name, update_world.name);
            const res2 = await updateDoc(docRef, update_world);
            console.log(`INFO: world with index ${prevIdx} has been updated`);
        } else {
            throw new Error(`ERROR: Can't find world of the index ${prevIdx}`);
        }
    } catch (err) {
        const error_message = "ERROR: Error has occured in updateWorldsDoc(prevIdx, update_world)";
        console.error(error_message, err);
        throw new Error(error_message);
    }

}