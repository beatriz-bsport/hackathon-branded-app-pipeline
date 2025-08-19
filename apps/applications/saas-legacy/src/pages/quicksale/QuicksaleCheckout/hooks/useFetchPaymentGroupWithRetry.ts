import { useCallback, useEffect, useRef } from 'react';
import type { OptionCallback } from '#src/state/types';

type UseFetchPaymentGroupWithRetryProps = {
  paymentGroupId: number | null;
  fetchPaymentGroup: (
    params: { id: number },
    options?: OptionCallback<any>,
  ) => void;
  getInvoiceReceiptUrl: (
    invoiceId: string,
    options?: OptionCallback<string>,
  ) => void;
  setQrCodeValue: (value: string) => void;
  snackbarErrorMsg: (msg: string) => void;
  maxRetries?: number;
  retryDelayMs?: number;
};

/**
 * Custom hook to fetch a payment group with retry logic.
 * Retries fetching the payment group up to `maxRetries` times if the group or invoice is invalid,
 * and stops after a successful fetch or after reaching the retry limit.
 *
 * Usage:
 *   const fetchPaymentGroupWithRetry = useFetchPaymentGroupWithRetry({...});
 *   fetchPaymentGroupWithRetry();
 *
 * @param props - See UseFetchPaymentGroupWithRetryProps
 * @returns Function to trigger the fetch with retry logic.
 */
const useFetchPaymentGroupWithRetry = ({
  paymentGroupId,
  fetchPaymentGroup,
  getInvoiceReceiptUrl,
  setQrCodeValue,
  snackbarErrorMsg,
  maxRetries = 4,
  retryDelayMs = 1000,
}: UseFetchPaymentGroupWithRetryProps) => {
  /** Tracks the current retry count. */
  const retryCountRef = useRef(0);
  /** Prevents further fetches after success or max retries. */
  const finishedRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Triggers the fetch logic with retry.
   * Will not run if already finished.
   */
  const fetchWithRetry = useCallback(() => {
    if (finishedRef.current) {
      finishedRef.current = false;
    }
    retryCountRef.current = 0;

    /**
     * Attempts to fetch the payment group, retrying if necessary.
     */
    const attemptFetch = () => {
      if (!paymentGroupId || finishedRef.current) return;

      fetchPaymentGroup(
        { id: paymentGroupId },
        {
          onSuccess: (paymentGroup) => {
            // Retry if paymentGroup or invoice is missing/invalid
            const invoiceId =
              paymentGroup && typeof paymentGroup.invoice === 'string'
                ? paymentGroup.invoice
                : '';

            if (!invoiceId) {
              if (retryCountRef.current < maxRetries) {
                retryCountRef.current += 1;
                setTimeout(() => {
                  if (isMountedRef.current) {
                    attemptFetch();
                  }
                }, retryDelayMs);
              } else {
                finishedRef.current = true;
                snackbarErrorMsg('invoice.receipt.genericError');
              }
              return;
            }

            // Success: fetch receipt URL and mark as finished
            finishedRef.current = true;
            getInvoiceReceiptUrl(invoiceId, {
              onSuccess: (receiptUrl) => setQrCodeValue(receiptUrl || ''),
              onError: () => {
                snackbarErrorMsg('invoice.receipt.genericError');
              },
            });
          },
          onError: () => {
            // Retry on error
            if (retryCountRef.current < maxRetries) {
              retryCountRef.current += 1;
              setTimeout(() => {
                if (isMountedRef.current) {
                  attemptFetch();
                }
              }, retryDelayMs);
            } else {
              finishedRef.current = true;
              snackbarErrorMsg('invoice.receipt.genericError');
            }
          },
        },
      );
    };

    attemptFetch();
  }, [
    paymentGroupId,
    fetchPaymentGroup,
    getInvoiceReceiptUrl,
    setQrCodeValue,
    snackbarErrorMsg,
    maxRetries,
    retryDelayMs,
  ]);

  return fetchWithRetry;
};

export default useFetchPaymentGroupWithRetry;
