import { useState, useEffect } from "react";
import "./countdown.css";

const Timer = () => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const targetDate = new Date("April 20, 2024 20:00:00 EST");

    const difference = targetDate - now;
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (timeLeft[interval] !== undefined && timeLeft[interval] !== null) {
      timerComponents.push(
        <span key={interval}>
          {timeLeft[interval]} {interval}{" "}
        </span>
      );
    }
  });

  return (
    <div id="timer">
      {timerComponents.length ? timerComponents : <span>GAME TIME!!</span>}
    </div>
  );
};

export default Timer;
