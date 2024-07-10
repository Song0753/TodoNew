"use client";

import React, { useState, useEffect } from "react";
import styles from "./Clock.module.css";

const Clock = () => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const setCurrentTime = () => setTime(new Date());
    setCurrentTime(); // Set initial time

    const timer = setInterval(setCurrentTime, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return "00:00:00";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className={styles.clockContainer}>
      <div className={styles.clockTime}>{formatTime(time)}</div>
    </div>
  );
};

export default Clock;
