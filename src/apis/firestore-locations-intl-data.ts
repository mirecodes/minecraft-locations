import { DocumentSnapshot, arrayRemove, arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../libs/firebase";
import { getLocationsCollRef } from "./firestore-locations";

// Models
type TInternalData = {
    following_index: string;
}

// Collection & Document References

// Auxiliary APIs
export const getLocationsFollowingIndex = async (world_id: string) => {
    try {
        const locationsCollRef = getLocationsCollRef(world_id);
        const intlDataDocRef = doc(locationsCollRef, 'internal_data');
        const docSnapshot = await getDoc(intlDataDocRef) as DocumentSnapshot<TInternalData>;
        if (docSnapshot.exists()) {
            const following_index = docSnapshot.data().following_index;
            return following_index;
        } else {
            const intlData: TInternalData = { following_index: '1' };
            const res = setDoc(intlDataDocRef, intlData);
            return intlData.following_index;
        }
    } catch (err) {
        const error_message = "ERROR: Error has occured in getLocationsFollowingIndex()";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}