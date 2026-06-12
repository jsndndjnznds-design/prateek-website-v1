"use client";

import { useEffect, useState } from "react";

export function useCountdown(hoursFromNow = 14) {
  const [timeLeft, setTimeLeft] = useState(hoursFromNow * 60 * 60 * 1000);

  useEffect(() => {
    const target = Date.now() + hoursFromNow * 60 * 60 * 1000;

    const timer = window.setInterval(() => {
      setTimeLeft(Math.max(target - Date.now(), 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [hoursFromNow]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isDone: timeLeft <= 0 };
}
