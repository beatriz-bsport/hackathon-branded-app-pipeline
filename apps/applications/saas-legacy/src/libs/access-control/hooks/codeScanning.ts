import { useRef, useCallback, useEffect } from 'react';

import {
  BARCODE_CHARS_PATTERN,
  MEMBERSHIP_ID_MIN_LENGTH,
  SCANNER_FILTER_DELAY_MS,
  SCANNER_FILTER_SOFT_DELAY_MS,
} from '../constants';

/**
 * Custom hook designed to capture numeric code scanner input and prevent interference
 * from regular keyboard input.
 *
 * Listens for keydown events, filters the input based on a specified delay
 * (SCANNER_FILTER_DELAY), and triggers the provided onCodeScan callback when the scanned
 * sequence reaches the expected length.
 *
 * **Note:** Be cautious of potential keyboard typing latency when using this component.
 * The SCANNER_FILTER_DELAY should be kept as short as possible to mitigate this issue.
 *
 * **Important:** To capture all characters in the input sequence, it is essential to
 * prefix the sequence with a capital letter, assuming the typing sequence is initiated
 * with the `Shift` key. This ensures the time counter for detecting quick typing is reset.
 *
 * @param {(catchedSequence: string) => void} onCodeScan - Callback function executed when
 * a valid code is scanned.
 * @param {number} kwargs.expectedInputMinLength - Minimum expected length of the scanned input. This
 * parameter determines when the `onCodeScan` callback is triggered.
 * @param {boolean} kwargs.canPerformAccessMonitoring - Flag to enable or disable the scanner
 */
export function useNumericCodeScanner(
  onCodeScan: (catchedSequence: string) => void,
  {
    expectedInputMinLength = MEMBERSHIP_ID_MIN_LENGTH,
    canPerformAccessMonitoring = false,
  }: {
    expectedInputMinLength?: number;
    canPerformAccessMonitoring?: boolean;
  },
) {
  const lastKeyPressTimeRef = useRef(0);
  const scannerInputRef = useRef('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Callback function to handle keydown events and catch a scanner input.
   *
   * @param {object} event - The keydown event object.
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (canPerformAccessMonitoring) {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - lastKeyPressTimeRef.current;

        // Block keydown event if the time difference is smaller than the filter delay.
        // This way, the pressed key won't affect any text input.
        if (timeDifference <= SCANNER_FILTER_DELAY_MS) {
          event.preventDefault();
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // If the time difference is greater than the soft filter delay, reset accumulated input
        // and skip this key (the code here assume that barcode reader send a first initialization `Shift` key)
        if (timeDifference > SCANNER_FILTER_SOFT_DELAY_MS) {
          scannerInputRef.current = '';
        } else if (BARCODE_CHARS_PATTERN.test(event.key)) {
          // Only accumulate alphanumeric characters if we're in an active scan sequence
          scannerInputRef.current += event.key;
        }

        // Set timeout to trigger callback after scanning completes
        // Only set timeout if we have accumulated characters
        if (scannerInputRef.current.length > 0) {
          timeoutRef.current = setTimeout(() => {
            if (scannerInputRef.current.length >= expectedInputMinLength) {
              onCodeScan(scannerInputRef.current);
            }
            scannerInputRef.current = '';
          }, SCANNER_FILTER_SOFT_DELAY_MS);
        }

        lastKeyPressTimeRef.current = currentTime;
      }
    },
    [expectedInputMinLength, onCodeScan, canPerformAccessMonitoring],
  );

  // Attach and detach event listener for keydown on component mount and unmount
  useEffect(() => {
    if (canPerformAccessMonitoring) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
    return () => {};
  }, [handleKeyDown, canPerformAccessMonitoring]);
}
