<img src="https://github.com/user-attachments/assets/753ebea5-5721-4c9e-a920-f7387b9b4e83" width="24" />
# Barebone Video Application

A simplified skeleton of YouTube, designed and implemented as part of the [Full Stack Development course by NeetCode](https://neetcode.io/courses/full-stack-dev/0).

---

## Project Objective

The goal of this project is to explore the fundamental building blocks of a video-sharing platform and implement a scalable backend/frontend pipeline using modern cloud tools. It emphasizes architectural simplicity while incorporating real-world concerns like scalability, async processing, and secure access.

---

## Features

-  User authentication with Google Sign-In (Firebase Auth)
-  Video uploads for signed-in users
-  Automatic video transcoding into multiple formats (e.g., 360p, 720p)
-  Video metadata storage and retrieval (Firestore)
-  Public video listing and viewing
-  Fully serverless and cloud-native architecture

---

## Tech Stack

| Area                 | Tech Used                                                                 |
|----------------------|---------------------------------------------------------------------------|
| Frontend             | [Next.js](https://nextjs.org/)                                            |
| Backend/API          | [Firebase Functions](https://firebase.google.com/docs/functions)          |
| Authentication       | [Firebase Auth](https://firebase.google.com/docs/auth)                    |
| Storage              | [Google Cloud Storage](https://cloud.google.com/storage)                  |
| Messaging Queue      | [Google Cloud Pub/Sub](https://cloud.google.com/pubsub)                   |
| Video Processing     | [FFmpeg](https://ffmpeg.org/) + [Cloud Run](https://cloud.run/)           |
| Database             | [Firestore](https://firebase.google.com/docs/firestore)                   |
| Hosting              | Cloud Run                                                                 |

---

## Architecture Overview

<img width="741" height="481" alt="HighLevelDesignArchitecture drawio" src="https://github.com/user-attachments/assets/b391be50-5df0-46d5-8e36-443fd8b88453" />

- **Cloud Storage**: Stores both raw and processed videos.
- **Cloud Pub/Sub**: Handles video upload events asynchronously.
- **Cloud Run**: Processes videos using FFmpeg with auto-scaling workers.
- **Firestore**: Stores metadata (title, URL, upload status, etc.).
- **Firebase Functions**: Serves as the backend API for upload requests and metadata.
- **Next.js Client**: Authenticated frontend for users to upload and view videos.

<img width="1071" height="291" alt="image" src="https://github.com/user-attachments/assets/7dd917d4-099e-4a04-bb8d-cd82b057235a" />

---

## Functional Breakdown

### 1. **Authentication**
- Users authenticate using their Google accounts via Firebase Auth.
- A Firestore document is created for each new user with additional metadata (profile, name, etc.).
- User document creation is handled via Firebase Auth triggers to ensure consistency.

### 2. **Video Upload**
- Authenticated users upload videos using signed URLs.
- Upload requests trigger a Cloud Function that returns a signed URL to securely upload to Cloud Storage.

### 3. **Video Processing**
- After upload, a message is published to a Cloud Pub/Sub topic.
- A Cloud Run video worker consumes this message and:
  - Transcodes the video using FFmpeg
  - Uploads processed formats back to Cloud Storage
  - Updates Firestore with metadata and status

### 4. **Video Viewing**
- Public pages display processed videos and their metadata using data from Firestore.

---

## Limitations

- Cloud Run request timeout: 3600 seconds max
- Pub/Sub redelivery behavior may result in duplicate processing (after 600s)
- No content moderation or safety checks for uploads

These limitations reflect a tradeoff between simplicity and robustness for the sake of learning.

---

## Getting Started (Dev Setup)

> Ensure you have Firebase CLI, Google Cloud CLI, and Node.js installed.

```bash
# Clone the repo
git clone https://github.com/your-username/barebone-video-app.git
cd barebone-video-app

# Install dependencies
npm install

# Setup Firebase project
firebase login
firebase init

# Deploy Firebase Functions
firebase deploy --only functions

# Start local development
npm run dev
