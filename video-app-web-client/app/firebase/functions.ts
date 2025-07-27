import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

export const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");
// ^ This only works because we have specified firebaseConfig in firebase.ts

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
