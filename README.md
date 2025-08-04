<img src="https://github.com/user-attachments/assets/753ebea5-5721-4c9e-a920-f7387b9b4e83" width="50">

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

## Working of the application

1. The App interface ![WhatsApp Image 2025-08-03 at 22 33 49_b2414b1d](https://github.com/user-attachments/assets/7d7b5564-fae8-41e3-9cfa-1a33d970a0b4)
2. Sign in using Google Firebase authenticator ![WhatsApp Image 2025-08-03 at 22 33 49_8f2dc369](https://github.com/user-attachments/assets/24bf342e-7c83-4b5d-b8a0-43c40c016b03)
3. Upload video ![WhatsApp Image 2025-08-03 at 22 33 49_809562a5](https://github.com/user-attachments/assets/70f7dc20-3506-4b6c-9e8d-04ae378e26a1)
4. Upload successful ![WhatsApp Image 2025-08-03 at 22 33 50_f0481f43](https://github.com/user-attachments/assets/c0f17cab-c5a9-4a5f-921b-43630feba402)
5. Video uploaded to the raw videos bucket (Around 15 MB) ![WhatsApp Image 2025-08-03 at 22 33 50_8ac0d244](https://github.com/user-attachments/assets/f69f50a3-b343-40ad-a6f5-7a285af5e6e5)
6. Logs from Cloud run video-processing-service showing successful processing and upload to processed videos bucket ![WhatsApp Image 2025-08-03 at 22 33 50_46ba4c68](https://github.com/user-attachments/assets/407b431f-9c1c-496a-a3e2-2fdb9d0bbda7)
7. Processed video in processed videod bucket (Around 1.9 MB) ![WhatsApp Image 2025-08-03 at 22 33 50_a0026077](https://github.com/user-attachments/assets/f52c75d8-e1d9-412e-9a86-f92158d171a0)
8. Metadata updated in Firestore database ![WhatsApp Image 2025-08-03 at 22 33 51_90e21ca8](https://github.com/user-attachments/assets/22a06a82-0b99-41f8-9dcb-9b0625c71b4d)
9. Processed video playing in the web client ![WhatsApp Image 2025-08-03 at 22 33 51_b6add3e8](https://github.com/user-attachments/assets/d72b234c-4376-4095-a13e-aa211d5f781f)

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
