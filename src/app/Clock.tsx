"use client";

import React, { useState, useEffect } from "react";

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
    <div className="w-40 h-40 rounded-full border-4 border-white flex items-center justify-center bg-black bg-opacity-50">
      <div className="text-2xl font-bold text-white">{formatTime(time)}</div>
    </div>
  );
};

export default Clock;
