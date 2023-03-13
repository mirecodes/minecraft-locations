import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../libs/firebase";

const uploadImage = async (img: File) => {
    if (!img) return;
    try {
        const timestamp = new Date().toDateString();
        const imgRef = ref(storage, `images/${img.name}.${timestamp}`);
        const uploadResult = await uploadBytes(imgRef, img);
        const url = await getDownloadURL(uploadResult.ref);
        return url;
    } catch (err) {
        const error_message = "ERROR: Error has occured in uploadImage(img)";
        console.error(error_message, err);
        throw new Error(error_message);
    }
}   