import { useRef, useCallback, useEffect } from 'react';

import {
  MEMBERSHIP_ID_LENGTH,
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
 * @param {number} kwargs.expectedInputLength - Expected length of the scanned input. This
 * parameter determines when the `onCodeScan` callback is triggered.
 * @param {boolean} kwargs.canPerformAccessMonitoring - Flag to enable or disable the scanner
 */
export function useNumericCodeScanner(
  onCodeScan: (catchedSequence: string) => void,
  {
    expectedInputLength = MEMBERSHIP_ID_LENGTH,
    canPerformAccessMonitoring = false,
  }: {
    expectedInputLength?: number;
    canPerformAccessMonitoring?: boolean;
  },
) {
  // Reference to store the last key press time
  const lastKeyPressTimeRef = useRef(0);

  // Reference to store the current scanner input
  const scannerInputRef = useRef('');

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

        // Keep the key value in the input sequence only if the time difference is lower than the
        // soft filter delay.
        // This different filter param enables to keep more inputs, even if the scanner has an unexpected
        // transmitting delay.
        if (timeDifference > SCANNER_FILTER_SOFT_DELAY_MS) {
          scannerInputRef.current = '';
        } else if (!Number.isNaN(Number(event.key))) {
          scannerInputRef.current += event.key;
        }

        // Trigger onCodeScan callback when the input sequence reaches the expected length
        if (scannerInputRef.current.length === expectedInputLength) {
          onCodeScan(scannerInputRef.current);
          scannerInputRef.current = '';
        }

        lastKeyPressTimeRef.current = currentTime;
      }
    },
    [expectedInputLength, onCodeScan, canPerformAccessMonitoring],
  );

  // Attach and detach event listener for keydown on component mount and unmount
  useEffect(() => {
    if (canPerformAccessMonitoring) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {};
  }, [handleKeyDown, canPerformAccessMonitoring]);
}
