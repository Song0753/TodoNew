"use client";
import React, { useState, useEffect } from "react";
import styles from "./Clock.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const DigitalClock = ({ currentTime }) => {
  return (
    <div className={styles.digitalClock}>
      {currentTime.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}
    </div>
  );
};

const AnalogClock = ({ currentTime }) => {
  const seconds = currentTime.getSeconds();
  const minutes = currentTime.getMinutes();
  const hours = currentTime.getHours() % 12;

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = (((hours % 12) + minutes / 60) / 12) * 360;
  return (
    <div className={styles.analogClock}>
      <div className={styles.clockHands}>
        <div className={styles.hourHandWrapper}>
          <Image
            src="/Clock/Clock001_H.svg"
            alt="Hour Hand"
            width={7}
            height={76}
            className={styles.hourHand}
            style={{ transform: `rotate(${hourDegrees}deg)` }}
          />
        </div>
        <div className={styles.minuteHandWrapper}>
          <Image
            src="/Clock/Clock001_M.svg"
            alt="Minute Hand"
            width={89.895}
            height={90.684}
            className={styles.minuteHand}
            style={{ transform: `rotate(${minuteDegrees}deg)` }}
          />
        </div>
        <div className={styles.secondHandWrapper}>
          <Image
            src="/Clock/Clock001_S.svg"
            alt="Second Hand"
            width={90.958}
            height={92.19}
            className={styles.secondHand}
            style={{ transform: `rotate(${secondDegrees}deg)` }}
          />
        </div>
      </div>
      <div className={styles.clockFace}>
        <Image
          src="/Clock/Clock001_Back.svg"
          alt="Clock Face"
          width={224}
          height={224}
        />
      </div>
    </div>
  );
};

function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDigital, setIsDigital] = useState(true); // 기본값을 true로 설정
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedIsDigital = localStorage.getItem("clockIsDigital");
    if (savedIsDigital !== null) {
      setIsDigital(JSON.parse(savedIsDigital));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("clockIsDigital", JSON.stringify(isDigital));
    }
  }, [isDigital, isClient]);

  const toggleClockType = () => {
    setIsDigital(!isDigital);
  };

  if (!isClient) {
    return null; // 또는 로딩 표시
  }

  return (
    <div
      className={styles.clockContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className={`${styles.chevronButton} ${styles.leftButton} ${
          isHovered ? styles.visible : ""
        }`}
        onClick={toggleClockType}
      >
        <ChevronLeft />
      </button>
      <div className={styles.clockWrapper}>
        {isDigital ? (
          <DigitalClock currentTime={currentTime} />
        ) : (
          <AnalogClock currentTime={currentTime} />
        )}
      </div>
      <button
        className={`${styles.chevronButton} ${styles.rightButton} ${
          isHovered ? styles.visible : ""
        }`}
        onClick={toggleClockType}
      >
        <ChevronRight />
      </button>
    </div>
  );
}

export default Clock;
