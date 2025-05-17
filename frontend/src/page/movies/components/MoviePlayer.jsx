import React from "react";

export default function MoviePlayer({ videoSrc, setIsPlaying }) {
  return (
    <video
      src={videoSrc}
      className="w-full h-full object-cover"
      controls
      autoPlay
      onEnded={() => setIsPlaying(false)}
    />
  );
}
