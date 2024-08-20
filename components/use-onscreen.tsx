import { useState, useEffect, RefObject } from "react";

export function useOnScreen(ref: RefObject<HTMLDivElement> | null) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref || !ref.current) return;

    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}
