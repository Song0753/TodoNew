"use client";

import React, { useState, useEffect } from "react";
import Clock from "./Clock";
import styles from "./Background.module.css";

const backgroundImages = [
  "./backgrounds/image1.jpg",
  "./backgrounds/image2.jpg",
  "./backgrounds/image3.jpg",
  // Add more image paths as needed
];

interface BackgroundProps {
  children: React.ReactNode;
  overlayOpacity?: number;
  showClock?: boolean;
}

const Background: React.FC<BackgroundProps> = ({ 
  children, 
  overlayOpacity = 0.2,
  showClock = true 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);

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
        {showClock && (
          <div className={styles.clockContainer}>
            <Clock />
          </div>
        )}
        <div className={styles.childrenContainer}>{children}</div>
      </div>
    </div>
  );
};

export default Background;