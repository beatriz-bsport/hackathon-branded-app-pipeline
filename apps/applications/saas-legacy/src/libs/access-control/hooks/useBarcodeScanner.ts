import { useRef, useCallback, useEffect } from 'react';

import {
  BARCODE_CHARS_PATTERN,
  MEMBERSHIP_ID_MIN_LENGTH,
  SCANNER_FILTER_DELAY_MS,
} from '../constants';

/**
 *
 * Detects barcode scanner input by timing keystrokes: scanners type faster than humans.
 *
 * **Important:** We expect users to have setup a prefix on their barcode scanners.
 * See:
 *   - https://www.notion.so/bright-shovel-41b/Newland-barcode-scanner-configuration-c37fdd537a804652a7626e357568bb20
 *   - https://www.notion.so/bright-shovel-41b/Honeywell-barcode-scanner-configuration-add3ba7f62fc4a08be98f9b81d25d0aa
 *
 */
export function useBarcodeScanner(
  onCodeScan: (catchedSequence: string) => void,
  { enabled = false }: { enabled?: boolean },
) {
  const lastKeyPressTimeRef = useRef(0);
  const scannerInputRef = useRef('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (enabled) {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - lastKeyPressTimeRef.current;

        if (timeDifference <= SCANNER_FILTER_DELAY_MS) {
          // Prevent scan to affect text input
          event.preventDefault();
        }

        // 1. The first char will never be in `scannerInputRef`
        //    (because it will always have a big time difference)
        //    This is ok because barcode scanner are sending "Clear" and "Shift"
        // 2. "Clear" and "Shift", even if sent within the delay will be skipped
        if (timeDifference > SCANNER_FILTER_DELAY_MS) {
          scannerInputRef.current = '';
        } else if (BARCODE_CHARS_PATTERN.test(event.key)) {
          scannerInputRef.current += event.key;
        }

        // Use timeout to debounce input
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (scannerInputRef.current.length > 0) {
          timeoutRef.current = setTimeout(() => {
            if (scannerInputRef.current.length >= MEMBERSHIP_ID_MIN_LENGTH) {
              const [_prefix, ...barcodeChars] = scannerInputRef.current;
              const barcode = barcodeChars.join('');
              onCodeScan(barcode);
            }
            scannerInputRef.current = '';
          }, SCANNER_FILTER_DELAY_MS);
        }

        lastKeyPressTimeRef.current = currentTime;
      }
    },
    [onCodeScan, enabled],
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
    return () => {};
  }, [handleKeyDown, enabled]);
}
