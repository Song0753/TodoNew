"use client";

import React, { useState, useEffect } from "react";
import Clock from "./Clock";
import { Slider } from "@/components/ui/slider";
import styles from "./Background.module.css";

const backgroundImages = [
  "./backgrounds/image1.jpg",
  "./backgrounds/image2.jpg",
  "./backgrounds/image3.jpg",
  // Add more image paths as needed
];

const Background = ({ children }: { children: React.ReactNode }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [overlayOpacity, setOverlayOpacity] = useState(0.2);

  useEffect(() => {
    const preloadImage = (index: number) => {
      const img = new Image();
      img.src = backgroundImages[index];
    };

    const interval = setInterval(() => {
      setCurrentImageIndex(nextImageIndex);
      setNextImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
      preloadImage((nextImageIndex + 1) % backgroundImages.length);
    }, 5000);

    // Preload the next image
    preloadImage(nextImageIndex);

    return () => clearInterval(interval);
  }, [nextImageIndex]);

  return (
    <div className={styles.backgroundContainer}>
      <div
        className={styles.backgroundImage}
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
        }}
      />
      <div
        className={styles.backgroundImage}
        style={{
          backgroundImage: `url(${backgroundImages[nextImageIndex]})`,
          opacity: currentImageIndex === nextImageIndex ? 1 : 0,
        }}
      />
      <div className={styles.overlay} style={{ opacity: overlayOpacity }} />
      <div className={styles.content}>
        <div className={styles.clockContainer}>
          <Clock />
        </div>
        <div className={styles.childrenContainer}>{children}</div>
        <div className={styles.sliderContainer}>
          <Slider
            value={[overlayOpacity]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([value]) => setOverlayOpacity(value)}
          />
          <p className={styles.sliderLabel}>
            Overlay Opacity: {Math.round(overlayOpacity * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Background;
