import { useState, useEffect } from "react";
import moment, { Moment } from "moment-timezone";
import "./countdown.css";

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  expired: boolean;
}

const calculateTimeLeft = (): TimeLeft => {
  const now: Moment = moment();
  const targetDate: Moment = moment.tz(
    "2025-06-07 14:00:00",
    "America/New_York"
  );

  console.log("targetDate", targetDate);
  console.log("now", now);

  const difference: number = targetDate.diff(now);
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: true,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
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

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const timerComponents = [];
  const timeKeys: (keyof TimeLeft)[] = ["days", "hours", "minutes", "seconds"];

  timeKeys.forEach((interval) => {
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
      {/* {timerComponents.length ? timerComponents : <span>GAME TIME!!</span>} */}
      <span>- - : - -</span>
    </div>
  );
};

export default Timer;
