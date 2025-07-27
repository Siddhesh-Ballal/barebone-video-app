import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";

// Calling InitializeApp, but this time adding credentials
initializeApp({ credential: credential.applicationDefault() });
// This gives access to Firestore (only 1 instance per project so no need to specify)
const firestore = new Firestore();

// Note: This requires setting an env variable in Cloud Run
/** if (process.env.NODE_ENV !== 'production') {
  firestore.settings({
      host: "localhost:8080", // Default port for Firestore emulator
      ssl: false
  });
} */

const VideoCollectionId = "videos";

//Video interface for storing video metadata
export interface Video {
  id?: string;
  uid?: string;
  filename?: string;
  status?: "processing" | "processed";
  title?: string;
  description?: string;
}

async function getVideo(videoId: string) {
  // Gets a snapshotof the data
  const snapshot = await firestore
    .collection(VideoCollectionId)
    .doc(videoId)
    .get();
  return (snapshot.data() as Video) ?? {};
}
export function setVideo(videoId: string, video: Video) {
  // Paramenters are videoId and the metadata in form of the video Interface declared above
  firestore
    .collection(VideoCollectionId)
    .doc(videoId)
    .set(video, { merge: true });
  // merge: true updates(overwrites) the document instead of deleting original data and rewriting everything
}

export async function isVideoNew(videoId: string) {
  const video = await getVideo(videoId);
  return video?.status === undefined;
  // If the status was "processing" or "processed", the video is not new
}
