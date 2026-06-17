// useDoubleClick.ts
import { useRef } from "react";

export default function useDoubleClick() {
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSmartClick = (onDouble: () => void) => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      onDouble();
    } else {
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null;
      }, 250);
    }
  };

  return handleSmartClick;
}