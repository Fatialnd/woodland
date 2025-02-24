import { useEffect, useRef } from "react";

interface UseOutsideClickHandler {
  (): void;
}

interface UseOutsideClickReturn {
  ref: React.RefObject<HTMLDivElement | null>;
}

export function useOutsideClick(
  handler: UseOutsideClickHandler,
  listenCapturing = true
): UseOutsideClickReturn {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) handler();
      }

      document.addEventListener("click", handleClick, listenCapturing);

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return { ref };
}
