import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./database";

const UploadFile = async(file, setImageUrl) => {
    if (!file) return;
  
    const storageRef = ref(storage, `fotos_receitas/${file.name}`);  // Reference to the file in Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    // Listen to state changes during upload
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error("Error during file upload:", error);
      },
      () => {
        // Get the download URL after a successful upload
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);  // Set the image URL in state
        });
      }
    );
  };

export default UploadFile