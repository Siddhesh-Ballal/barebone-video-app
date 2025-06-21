import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import { Request, Response } from 'express'

const app = express();
app.use(express.json()); // Middleware to parse/ handle JSON request bodies 

app.post('/process-video', async (req: Request, res: Response): Promise<void> => {
    // Get input and output file paths from the request body
    const inputFilePath = req.body.inputFilePath; // Assume input file is provided in the request body
    const outputFilePath = req.body.outputFilePath; // Assume output file path is provided in the request body

    // Error handling for missing parameters
    if (!inputFilePath) {
        res.status(400).send('Bad request: Input file path is required');
        return;
    }
    else if (!outputFilePath) {
        res.status(400).send('Bad request: Output file path is required');
        return;
    }

    // Use ffmpeg to process the video
    ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=1280:720") // apply video filter and scale it to 1280x720 resolution 
    .on("end", () => {
        // When Video processing is completed 
        res.status(200).send("Video processing completed");
    })
    .on("error", (err) => {
        console.error(`Error processing video: ${err}`);
        res.status(500).send(`Internal server error: ${err.message}`);
    })
    .save(outputFilePath);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Video Processing Service is listening at http://localhost:${PORT}`);
});