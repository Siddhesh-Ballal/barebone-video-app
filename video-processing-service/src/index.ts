import express from "express";
// import ffmpeg from "fluent-ffmpeg";
import { Request, Response } from "express";
import {
  convertVideo,
  deleteProcessedVideo,
  deleteRawVideo,
  downloadRawVideo,
  setupDirectories,
  uploadProcessedVideo,
} from "./storage";

setupDirectories(); // Ensure directories for raw and processed videos are set up

const app = express();
app.use(express.json()); // Middleware to parse/ handle JSON request bodies

app.post(
  "/process-video",
  async (req: Request, res: Response): Promise<void> => {
    // Everytime a video is uploaded to the Raw Video Bucket,
    // this endpoint will be called to process the video via CLoud Pub/Sub
    let data;
    try {
      const message = Buffer.from(req.body.message.data, "base64").toString(
        "utf-8"
      );
      data = JSON.parse(message);
      if (!data.name) {
        throw new Error("Invalid meassage payload: 'name' field is required");
      }
    } catch (err) {
      console.error(`Error parsing message: ${err}`);
      res.status(400).send("Bad request: Invalid message format");
      return;
    }

    const inputVideoName = data.name; // The name of the raw video file (from the raw video bucket)
    const outputVideoName = `${inputVideoName}-processed`; // The name of the processed video file

    // Download the raw video file from Google Cloud Storage
    await downloadRawVideo(inputVideoName);

    // Process the video using ffmpeg -> Convert to 720p resolution
    try {
      await convertVideo(inputVideoName, outputVideoName);
    } catch (err) {
      // If there is an wrror and we end up creating corrupted video file,
      // we should delete it to avoid confusion later on.
      await Promise.all([
        deleteRawVideo(inputVideoName),
        deleteProcessedVideo(outputVideoName),
      ]); // Better this than individually awaiting each deletion

      // If there is an error during video processing, log it and return a 500 error
      console.error(`Error processing video: ${err}`);
      res.status(500).send("Internal server error: Video processing failed");
      return;
    }

    // Upload the processed video file to Google Cloud Storage
    await uploadProcessedVideo(outputVideoName);

    // We should clean up after successful processing as well.
    await Promise.all([
      deleteRawVideo(inputVideoName),
      deleteProcessedVideo(outputVideoName),
    ]);

    res.status(200).send("Video processed successfully");
    return;
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Video Processing Service is listening at http://localhost:${PORT}`
  );
});
