"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./Clock.module.css";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  const updateTime = useCallback(() => {
    setTime(new Date());
  }, []);

  useEffect(() => {
    updateTime(); // 컴포넌트 마운트 시 즉시 시간 업데이트
    const timer = setInterval(updateTime, 60000);

    return () => {
      clearInterval(timer);
    };
  }, [updateTime]);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className={styles.clockContainer}>
      <div className={styles.clockTime}>{formatTime(time)}</div>
    </div>
  );
};

export default Clock;
