"use client";

import React, { useState, useEffect } from "react";
import Clock from "./Clock";
import styles from "./Background.module.css";

const backgroundFolders = {
  morning: "./backgrounds/morning",
  afternoon: "./backgrounds/afternoon",
  evening: "./backgrounds/evening",
  night: "./backgrounds/night",
};

const imageCount = {
  morning: 3,
  afternoon: 5,
  evening: 2,
  night: 1,
};

interface BackgroundProps {
  children: React.ReactNode;
  overlayOpacity: number;
  showClock?: boolean;
}

const Background: React.FC<BackgroundProps> = ({
  children,
  overlayOpacity,
  showClock = true,
}) => {
  const [currentImage, setCurrentImage] = useState("");

  const getRandomImage = (folder: string, count: number) => {
    const randomIndex = Math.floor(Math.random() * count) + 1;
    return `${folder}/image${randomIndex}.jpg`;
  };

  const getTimePeriod = (hour: number) => {
    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 18) return "afternoon";
    if (hour >= 18 && hour < 22) return "evening";
    return "night";
  };

  const getBackgroundImage = (force: boolean = false) => {
    const now = new Date();
    const hour = now.getHours();
    const currentPeriod = getTimePeriod(hour);

    const storedImage = localStorage.getItem("backgroundImage");
    const storedPeriod = localStorage.getItem("backgroundPeriod");

    if (!force && storedImage && storedPeriod === currentPeriod) {
      return storedImage;
    }

    const newImage = getRandomImage(
      backgroundFolders[currentPeriod],
      imageCount[currentPeriod]
    );
    localStorage.setItem("backgroundImage", newImage);
    localStorage.setItem("backgroundPeriod", currentPeriod);
    return newImage;
  };

  useEffect(() => {
    const updateBackground = () => {
      const newImage = getBackgroundImage();
      setCurrentImage(newImage);
    };

    // 초기 배경 설정
    updateBackground();

    // 다음 시간대 변경까지의 시간 계산
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    let nextChangeTime: Date;
    if (hour < 6) nextChangeTime = new Date(now.setHours(6, 0, 0, 0));
    else if (hour < 12) nextChangeTime = new Date(now.setHours(12, 0, 0, 0));
    else if (hour < 18) nextChangeTime = new Date(now.setHours(18, 0, 0, 0));
    else if (hour < 22) nextChangeTime = new Date(now.setHours(22, 0, 0, 0));
    else nextChangeTime = new Date(now.setHours(24 + 6, 0, 0, 0));

    const timeUntilNextChange = nextChangeTime.getTime() - now.getTime();

    // 다음 시간대 변경 시 배경 업데이트
    const timeout = setTimeout(() => {
      updateBackground();
      // 이후 4시간마다 체크 (가장 짧은 시간대 간격)
      setInterval(updateBackground, 4 * 60 * 60 * 1000);
    }, timeUntilNextChange);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={styles.backgroundContainer}>
      <div
        className={styles.backgroundImage}
        style={{
          backgroundImage: `url(${currentImage})`,
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
