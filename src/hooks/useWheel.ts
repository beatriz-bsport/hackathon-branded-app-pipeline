// @ts-nocheck
import React, { useEffect } from 'react';

type Callback = () => void;

export const useWheel = ({
  ref,
  onScrollUp,
  onScrollDown,
}: {
  ref: React.MutableRefObject<any>;
  onScrollUp?: Callback;
  onScrollDown?: Callback;
}) => {
  useEffect(() => {
    const currentElement = ref.current;

    const handleWheel: EventListener = (ev: WheelEvent) => {
      ev.preventDefault();
      const scrollDirectionY = ev.deltaY > 0 ? 'down' : 'up';

      if (scrollDirectionY === 'up' && onScrollUp) onScrollUp();
      if (scrollDirectionY === 'down' && onScrollDown) onScrollDown();
    };

    currentElement.addEventListener('wheel', handleWheel, {
      passive: false,
    });

    return () => {
      currentElement.removeEventListener('wheel', handleWheel);
    };
  }, [onScrollDown, onScrollUp, ref]);
};
