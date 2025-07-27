import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");
export const getVideosFunction = httpsCallable(functions, "getVideos");
// ^ This only works because we have specified firebaseConfig in firebase.ts

export interface Video {
  id?: string;
  uid?: string;
  filename?: string;
  status?: "processing" | "processed";
  title?: string;
  description?: string;
}

export async function uploadVideo(file: File) {
  const response: any = await generateUploadUrl({
    fileExtension: file.name.split(".").pop(),
  });

  // Upload the file via signed URL
  await fetch(response?.data?.url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  return;
}


export async function getVideos() {
  const response = await getVideosFunction();
  return response.data as Video[];
}