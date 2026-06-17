import { useEffect, useState } from "react";

export default function useClock() {
  const [now, setNow] = useState(new Date());

  const timeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { now, timeZone };
}