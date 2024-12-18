import { useCallback, useState, TouchEvent } from 'react';

type Callback = () => void;

export const useSwipe = ({
  minDistance = 40,
  onSwipeUp,
  onSwipeRight,
  onSwipeDown,
  onSwipeLeft,
}: {
  minDistance?: number;
  onSwipeUp?: Callback;
  onSwipeRight?: Callback;
  onSwipeDown?: Callback;
  onSwipeLeft?: Callback;
}): [
  (event: TouchEvent<HTMLElement>) => void,
  (event: TouchEvent<HTMLElement>) => void,
] => {
  const [touchStartCoordinates, setTouchStartCoordinates] = useState({
    x: 0,
    y: 0,
  });

  const onTouchStart = useCallback((event: TouchEvent<HTMLElement>) => {
    const firstTouch = event.touches[0];
    setTouchStartCoordinates({ x: firstTouch.clientX, y: firstTouch.clientY });
  }, []);

  const onTouchEnd = useCallback(
    (event: TouchEvent<HTMLElement>) => {
      const lastTouch = event.changedTouches[0];
      const xDistance = lastTouch.clientX - touchStartCoordinates.x;
      const yDistance = lastTouch.clientY - touchStartCoordinates.y;

      if (Math.abs(xDistance) < Math.abs(yDistance)) {
        if (yDistance > minDistance) {
          if (onSwipeDown) onSwipeDown();
        } else if (yDistance < -minDistance) {
          if (onSwipeUp) onSwipeUp();
        }
      } else if (xDistance > minDistance) {
        if (onSwipeRight) onSwipeRight();
      } else if (xDistance < -minDistance) {
        if (onSwipeLeft) onSwipeLeft();
      }
    },
    [
      touchStartCoordinates.x,
      touchStartCoordinates.y,
      minDistance,
      onSwipeDown,
      onSwipeUp,
      onSwipeRight,
      onSwipeLeft,
    ],
  );

  return [onTouchStart, onTouchEnd];
};
