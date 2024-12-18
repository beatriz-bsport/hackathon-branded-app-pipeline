import { MutableRefObject, EventHandler, useEffect } from 'react';

const useOnScrollOutside = (
  ref: MutableRefObject<any>,
  onScrollOutside: EventHandler<any>,
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      // Do nothing if scrolling ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      onScrollOutside(event);
    };
    document.addEventListener('scroll', listener, true);
    document.addEventListener('touchmove', listener, true);
    return () => {
      document.removeEventListener('scroll', listener, true);
      document.removeEventListener('touchmove', listener, true);
    };
  }, [ref, onScrollOutside]);
};

export default useOnScrollOutside;
