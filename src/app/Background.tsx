"use client";

import React, { useState, useEffect } from "react";
import Clock from "./Clock";
import { Slider } from "@/components/ui/slider";

const backgroundImages = [
  "./backgrounds/image1.jpg",
  "./backgrounds/image2.jpg",
  "./backgrounds/image3.jpg",
  // Add more image paths as needed
];

const Background = ({ children }: { children: React.ReactNode }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }}
    >
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <Clock />
      </div>
      <div className="z-10 text-white text-center">{children}</div>
      <div className="absolute bottom-4 left-4 w-64 z-20">
        <Slider
          value={[overlayOpacity]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={([value]) => setOverlayOpacity(value)}
        />
        <p className="text-white text-sm mt-2">
          Overlay Opacity: {Math.round(overlayOpacity * 100)}%
        </p>
      </div>
    </div>
  );
};

export default Background;
