import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import useDebouncedCallback from '../useDebouncedCallBack';
import type {
  ResizeObserverContentRect,
  UseParentSizeOptions,
  UseParentSizeResult,
  Writeable,
} from './types';

export const identity = <T,>(o: T): T => o;

const initialContentRect: Partial<ResizeObserverContentRect> = {
  bottom: undefined,
  height: undefined,
  left: undefined,
  width: undefined,
  right: undefined,
  top: undefined,
  x: undefined,
  y: undefined,
};

/**
 * Custom React hook for obtaining the size and position of a parent element.
 *
 * @template E - The type of the observed element.
 * @param {React.RefObject<E>} ref - Reference to the observed element.
 * @param {Partial<UseParentSizeOptions>} options - Options for the hook.
 * @returns {UseParentSizeResult} - Result containing the current content rectangle.
 */
export const useParentSize = <E extends Element>(
  ref: React.RefObject<E>, // Reference to the observed element.
  {
    debounceDelay = 500, // Delay in milliseconds for debouncing updates.
    initialValues = initialContentRect, // Initial values for the content rectangle.
    transformFunc = (o: Partial<ResizeObserverContentRect>) =>
      o as ResizeObserverContentRect, // Function to transform the content rectangle.
    maxDifference = 10, // Maximum allowed difference in size before triggering an update.
    callback = identity, // Callback function to be executed after a size change.
  }: Partial<UseParentSizeOptions> = {},
): UseParentSizeResult => {
  // State to hold the current content rectangle.
  const [contentRect, setContentRect] =
    React.useState<ResizeObserverContentRect>({
      ...initialContentRect,
      ...initialValues,
    } as ResizeObserverContentRect);

  // Ref to store the previous content rectangle.
  const previousContentRect = React.useRef<
    Writeable<ResizeObserverContentRect>
  >(initialValues as ResizeObserverContentRect);

  // Memoized transformer function to transform the content rectangle.
  const transformer = React.useCallback(transformFunc, [transformFunc]);

  !ref && console.error('You must pass a valid ref to useParentSize');

  // Debounced callback for handling size changes.
  const debouncedCallback = useDebouncedCallback(
    (value: ResizeObserverContentRect) => {
      setContentRect(value);
      callback(value);
    },
    debounceDelay,
    {
      // @ts-expect-error
      leading: true,
    },
  );

  // Get the current element from the ref.
  const refElement = ref?.current;

  // Setting up the observer
  React.useEffect(() => {
    // Create a new ResizeObserver instance.
    const resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        if (!Array.isArray(entries) || entries.length !== 1) {
          return;
        }

        const entry = entries[0];
        const newWidth = Math.round(entry.contentRect.width);
        const newHeight = Math.round(entry.contentRect.height);

        const widthDiff = Math.abs(
          newWidth - (previousContentRect.current.width ?? 0),
        );
        const heightDiff = Math.abs(
          newHeight - (previousContentRect.current.height ?? 0),
        );

        // Check if the size difference exceeds the maximum allowed difference.
        if (widthDiff > maxDifference || heightDiff > maxDifference) {
          previousContentRect.current.height = newHeight;
          previousContentRect.current.width = newWidth;
          debouncedCallback(entry.contentRect);
        }
      },
    );

    // Avoiding : typeError: Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element'
    refElement &&
      requestAnimationFrame(() => resizeObserver?.observe(refElement));

    // Cleanup function to unobserve the element when component is unmounted.
    return () => {
      if (refElement) {
        resizeObserver?.unobserve(refElement);
      }
    };
  }, [
    maxDifference,
    debouncedCallback,
    refElement,
    initialValues,
    contentRect,
  ]);

  return React.useMemo(
    () => transformer(contentRect),
    [contentRect, transformer],
  );
};

export default useParentSize;
