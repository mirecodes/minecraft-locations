import { DocumentSnapshot, arrayRemove, arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../libs/firebase";

// Models
type TInternalData = {
    following_index: string;
    worlds_list: string[];
}

// Collection & Document References
const worldsCollRef = collection(firestore, 'worlds');
const intlDataDocRef = doc(worldsCollRef, 'internal_data');

// Auxiliary APIs
export const getWorldsFollowingIndex = async () => {
    try {
        const docSnapshot = await getDoc(intlDataDocRef) as DocumentSnapshot<TInternalData>;
        if (docSnapshot.exists()) {
            const following_index = docSnapshot.data().following_index;
            return following_index;
        } else {
            throw new Error(`ERROR: Can't find following index`);
        }
    } catch (err) {
        const error_message = "ERROR: Error has occured in getWorldsFollowingIndex()";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}

export const getAllWorldsInList = async () => {
    try {
        const docSnapshot = await getDoc(intlDataDocRef) as DocumentSnapshot<TInternalData>;
        if (docSnapshot.exists()) {
            const worlds_list = docSnapshot.data().worlds_list;
            return worlds_list;
        } else {
            throw new Error(`ERROR: Can't read worlds_list`);
        }
    } catch (err) {
        const error_message = "ERROR: Error has occured in getAllWorldsInList()";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}

export const addWorldInList = async (name: string) => {
    try {
        const docSnapshot = await getDoc(intlDataDocRef) as DocumentSnapshot<TInternalData>;
        if (docSnapshot.exists()) {
            const worlds_list = docSnapshot.data().worlds_list;
            if (!(name in worlds_list)) {
                const res = updateDoc(intlDataDocRef, { worlds_list: arrayUnion([name]) });
                console.log(`INFO: World '${name}' has been added in worlds_list`);
            } else {
                throw new Error(`ERROR: World '${name}' already exists`)
            }
        }
    } catch (err) {
        const error_message = "ERROR: Error has occured in addWorldInList(name)";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}

export const deleteWorldInList = async (name: string) => {
    try {
        const docSnapshot = await getDoc(intlDataDocRef) as DocumentSnapshot<TInternalData>;
        if (docSnapshot.exists()) {
            const worlds_list = docSnapshot.data().worlds_list;
            if (name in worlds_list) {
                const res = updateDoc(intlDataDocRef, { worlds_list: arrayRemove([name]) });
                console.log(`INFO: World '${name}' has been added in worlds_list`);
            } else {
                throw new Error(`Error: World '${name}' doesn't exists`)
            }
        }
    } catch (err) {
        const error_message = "ERROR: Error has occured in deleteWorldInList(name)";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}

export const updateWorldInList = async (prev: string, next: string) => {
    try {
        const docSnapshot = await getDoc(intlDataDocRef) as DocumentSnapshot<TInternalData>;
        if (docSnapshot.exists()) {
            const worlds_list = docSnapshot.data().worlds_list;
            if (prev in worlds_list) {
                const res1 = updateDoc(intlDataDocRef, { worlds_list: arrayRemove([prev]) });
                const res2 = updateDoc(intlDataDocRef, { worlds_list: arrayUnion([next]) });
                console.log(`INFO: World '${prev}' has updated to '${next}' in worlds_list`);
            } else {
                throw new Error(`Error: World '${prev}' doesn't exists`)
            }
        }
    } catch (err) {
        const error_message = "ERROR: Error has occured in updateWorldInList(prev, next)";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}
