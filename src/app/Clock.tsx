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
  const [isDigital, setIsDigital] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleClockType = () => {
    setIsDigital(!isDigital);
  };

  return (
    <div className={styles.clockContainer}>
      <button className={styles.chevronButton} onClick={toggleClockType}>
        <ChevronLeft />
      </button>
      {isDigital ? (
        <DigitalClock currentTime={currentTime} />
      ) : (
        <AnalogClock currentTime={currentTime} />
      )}
      <button className={styles.chevronButton} onClick={toggleClockType}>
        <ChevronRight />
      </button>
    </div>
  );
}

export default Clock;
