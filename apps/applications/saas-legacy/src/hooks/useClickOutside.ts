import { MutableRefObject, EventHandler, useEffect } from 'react';

const useOnClickOutside = (
  ref: MutableRefObject<any>,
  onClickOutside: EventHandler<any>,
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      onClickOutside(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, onClickOutside]);
};

export default useOnClickOutside;
