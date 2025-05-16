import { useState, useEffect } from "react";
import moment from "moment-timezone";
import "./countdown.css";

const Timer = () => {
  const calculateTimeLeft = () => {
    const now = moment();
    const targetDate = moment.tz("2025-06-07 14:00:00", "America/New_York");

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
        expired: true,
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
  }, [timeLeft]);

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (
      !timeLeft.expired &&
      timeLeft[interval] !== undefined &&
      timeLeft[interval] !== null
    ) {
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
      {/* <span>- - : - -</span> */}
    </div>
  );
};

export default Timer;
