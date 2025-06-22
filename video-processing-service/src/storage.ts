// Storage layer for the application:
// 1. Google Cloud Storage file interactions
// 2. Local file interactions

import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();

// Globally unique identifiers for the raw and processed video buckets
const rawVideoBucketName = "barebone-video-app-raw-videos-bucket";
const processedVideoBucketName = "barebone-video-app-processed-videos-bucket";

// Paths of raw and processed video files in the local file system
const localRawVideoPath = "./raw-videos"; // Download from this bucket
const localProcessedVideoPath = "./processed-videos"; // Upload to this bucket

// This function creates local directories for the docker container for
// The raw and processed video files
export function setupDirectories() {
  ensureDirectoryExists(localRawVideoPath);
  ensureDirectoryExists(localProcessedVideoPath);
}

// @param rawVideoName - The name of the raw video file from {@link localRawVideoPath}
// @param processedVideoName - The name of the processed video file to be saved in {@link localProcessedVideoPath}
// @returns - A promise that resolves to the path of the processed video file (After processing is completed)
export function convertVideo(rawVideoName: string, processedVideoName: string) {
  // If we execute the ffmpeg processing directly, when it'll be called in other function,
  // There will be no way to know when the processing is completed.
  // So we return a promise that resolves when the processing is completed.
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
      .outputOptions("-vf", "scale=1280:720") // apply video filter and scale it to 1280x720 resolution
      .on("end", () => {
        // When Video processing is completed
        console.log("Video processing completed");
        resolve(); // Resolve the promise to indicate processing is done
      })
      .on("error", (err) => {
        // console.error(`Error processing video: ${err}`);
        console.log(`Internal server error: ${err.message}`);
        reject(err); // Reject the promise with the error
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  });
}

// File system operations regarding Google Cloud Storage

// @param fileName - The name of the file to be downloaded
// from the {@link rawVideoBucketName} to the {@link localRawVideoPath} folder
// @returns - A promise that resolves to the path of the downloaded file

// Basically download rawVideoBucketName -> localRawVideoPath
export async function downloadRawVideo(fileName: string) {
  await storage
    .bucket(rawVideoBucketName)
    .file(fileName)
    .download({
      destination: `${localRawVideoPath}/${fileName}`,
    });

  // the .download method returns a promise that resolves when the file is downloaded
  // That's why we used await in storage bucket before logging
  // That's why the function is async
  console.log(
    `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}`
  );
}

// @param fileName - The name of the file to be uploaded
// from the {@link localProcessedVideoPath} to the {@link processedVideoBucketName} folder
// @returns - A promise that resolves to the path of the uploaded file

// Basically upload localProcessedVideoPath -> processedVideoBucketName
export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVideoBucketName);

  await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
    destination: fileName,
  });

  console.log(
    `Processed video file: ${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}`
  );

  await bucket.file(fileName).makePublic(); // Make the file public
}

// File Cleanup

// Delete raw video files
// @param fileName - The name of the raw video file to be deleted from the local file system
// from the {@link localRawVideoPath} folder
// @returns - A promise that resolves when the file is deleted
export function deleteRawVideo(fileName: string) {
  return deleteFile(`${localRawVideoPath}/${fileName}`);
}

// Delete raw video files
// @param fileName - The name of the raw video file to be deleted from the local file system
// from the {@link localProcessedVideoPath} folder
// @returns - A promise that resolves when the file is deleted
export function deleteProcessedVideo(fileName: string) {
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

// ^ These are the exported functions
// Below function is a helper function to delete a file from the local file system

// @param filePath - The path of the file to be deleted from the local file system
// @returns - A promise that resolves when the file is deleted
function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`File deletion failed: ${err}`);
          reject(err); // Reject the promise with the error
        } else {
          console.log(`File deleted successfully: ${filePath}`);
          resolve(); // Resolve the promise when the file is deleted
        }
      });
    } else {
      console.log(`File not found: ${filePath}, skipping deletion.`);
      resolve(); // Resolve the promise even if the file does not exist
    }
  });
}

// Helper function to check if a directory exists in the local file system
// If not, it creates the directory
// @param {string} directoryPath - The path of the directory to be checked or created
function ensureDirectoryExists(directoryPath: string) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    // recursive: true enables creating nested directories
    console.log(`Directory created at: ${directoryPath}`);
  }
}
