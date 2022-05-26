import React, { useRef, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

/**
 * Check if an element is in viewport

 * @param {number} offset - Number of pixels up to the observable element from the top
 * @param {number} debounceMilliseconds - debounce observable listener, in ms
 * @param {function} onEnterVisible - Execute callback when the end is reached
 * @returns {[boolean, ref]} - [isVisible, triggerElement]
 */
export default function useVisibility<Element extends HTMLElement>(
  offset: number = 0,
  debounceMilliseconds: number = 100,
  onEnterVisible: () => void = () => {},
): [Boolean, React.RefObject<Element>] {
  const [isVisible, setIsVisible] = useState(false);
  const currentElement = useRef<Element>();

  const _onEnterVisible = throttle(() => {
    onEnterVisible();
  }, debounceMilliseconds);

  const onScroll = debounce(() => {
    if (!currentElement.current) {
      setIsVisible(false);
      return;
    }

    const top = currentElement.current.getBoundingClientRect()?.top ?? 0;
    if (!isVisible && top + offset >= 0 && top - offset <= window.innerHeight) {
      _onEnterVisible();
    }

    setIsVisible(top + offset >= 0 && top - offset <= window.innerHeight);
  }, debounceMilliseconds);

  useEffect(() => {
    document.addEventListener('scroll', onScroll, true);
    return () => document.removeEventListener('scroll', onScroll, true);
  });

  return [isVisible, currentElement];
}
