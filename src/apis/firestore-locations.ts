import { DocumentSnapshot, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestore } from "../libs/firebase";
import { getLocationsFollowingIndex } from './firestore-locations-intl-data';

// Models
export type TLocation = {
    idx: string;
    title: string;
    Description: string;
    worldType: 'overworld' | 'nether' | 'end';
    coordinate: {
        x: string;
        y: string;
        z: string;
    }
    biome: string;
    imgUrl: string;
    timestamp: Date;
}

export type TAddLocation = {
    title: string;
    Description: string;
    worldType: 'overworld' | 'nether' | 'end';
    coordinate: {
        x: string;
        y: string;
        z: string;
    }
    biome: string;
    imgUrl: string;
}

export type TUpdateLocation = {
    title?: string;
    Description?: string;
    worldType?: 'overworld' | 'nether' | 'end';
    coordinate?: {
        x: string;
        y: string;
        z: string;
    }
    biome?: string;
    imgUrl?: string;
}

// Collection & Document References
const worldsCollRef = collection(firestore, 'worlds');

// Auxiliary APIs
export const getLocationsCollRef = (world_id: string) => {
    const worldsDocRef = doc(worldsCollRef, world_id);
    const locationsCollRef = collection(worldsDocRef, 'locations');
    return locationsCollRef;
}

export const getLocationsDocRefByIndex = async (world_id: string, idx: string) => {
    const locationsCollRef = getLocationsCollRef(world_id);
    try {
        const qry = query(locationsCollRef, where('idx', '==', idx));
        const querySnapshot = await getDocs(qry) as QuerySnapshot<TLocation>;
        const docId = querySnapshot.docs[0].id;
        const docRef = doc(locationsCollRef, docId);
        return docRef;
    } catch (err) {
        const error_message = "ERROR: Error has occured in getLocationByIndex(world_id, idx)";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}

// Primary APIs
export const getAllLocations = async (world_id: string) => {
    const locationsCollRef = getLocationsCollRef(world_id);
    try {
        const querySnapshot = await getDocs(locationsCollRef) as QuerySnapshot<TLocation>;
        const locationsDocs: TLocation[] = [];
        querySnapshot.forEach((location) => locationsDocs.push(location.data()));
        return locationsDocs;
    } catch (err) {
        const error_message = "ERROR: Error has occured in getAllLocations(world_id)";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}

export const getLocationByIndex = async (world_id: string, idx: string) => {
    try {
        const docRef = await getLocationsDocRefByIndex(world_id, idx);
        const docSnapshot = await getDoc(docRef) as DocumentSnapshot<TLocation>;
        if (docSnapshot.exists()) {
            const res = docSnapshot.data();
            return res;
        } else {
            throw new Error(`ERROR: Can't find location of the index ${idx}`);
        }
    } catch (err) {
        const error_message = "ERROR: Error has occured in getLocationByIndex(world_id, idx)";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}

export const addLocationsDoc = async (world_id: string, add_location: TAddLocation) => {
    const locationsCollRef = getLocationsCollRef(world_id);
    try {
        const nextLocation: TLocation = {
            ...add_location,
            idx: await getLocationsFollowingIndex(world_id),
            timestamp: new Date()
        }
        const docRef = await addDoc(locationsCollRef, nextLocation);
        console.log(`INFO: The location has been added (doc_id=${docRef.id})`);
        return docRef;
    } catch (err) {
        const error_message = "ERROR: Error has occured in addLocationsDoc(world_id, add_location)";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}

export const deleteLocationsDoc = async (world_id: string, idx: string) => {
    try {
        const docRef = await getLocationsDocRefByIndex(world_id, idx);
        const docSnapshot = await getDoc(docRef) as DocumentSnapshot<TLocation>;
        if (docSnapshot.exists()) {
            const world = docSnapshot.data();
            const res = await deleteDoc(docRef);
            console.log(`INFO: world has been removed (doc_id=${docRef.id})`);
        } else {
            throw new Error(`ERROR: Can't find world of the index ${idx}`);
        }
    } catch (err) {
        const error_message = "ERROR: Error has occured in deleteLocationsDoc(world)";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}

export const updateLocationsDoc = async (world_id: string, prevIdx: string, update_location: TUpdateLocation) => {
    try {
        const docRef = await getLocationsDocRefByIndex(world_id, prevIdx);
        const docSnapshot = await getDoc(docRef) as DocumentSnapshot<TLocation>;
        if (docSnapshot.exists()) {
            const prevWorld = docSnapshot.data();
            const res = await updateDoc(docRef, update_location);
            console.log(`INFO: world with index ${prevIdx} has been updated`);
        } else {
            throw new Error(`ERROR: Can't find world of the index ${prevIdx}`);
        }
    } catch (err) {
        const error_message = "ERROR: Error has occured in updateLocationsDoc(world_id, prevIdx, update_location)";
        console.error(error_message, err);
        throw new Error(error_message);
    }

}