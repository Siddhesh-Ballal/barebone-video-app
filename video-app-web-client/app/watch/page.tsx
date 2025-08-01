"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VideoPlayer() {
  const videoPrefix =
    "https://storage.googleapis.com/barebone-video-app-processed-videos-bucket/";
  const videoSrc = useSearchParams().get("v");
  const videoPath = videoPrefix + videoSrc;

  return <video controls src={videoPath} />;
}

export default function Watch() {
  return (
    <div>
      <h1> Watch Page </h1>
      <Suspense fallback={<>Loading video...</>}>
        <VideoPlayer />
      </Suspense>
    </div>
  );
}
