import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  getSequentialNumberingStatus,
  initializeLegalIdentifierLegacy,
} from '#src/libs/invoice/actions';
import type { InitializeLegalIdentifierLegacyRequest } from '#src/libs/invoice/types';
import { OptionCallback } from '#src/state/types';
import type { RootState } from '#src/reducers';
import { snackbarSuccess } from '#src/actions/snackbar.actions';

/**
 * Custom hook to manage sequential invoice numbering status and activation.
 *
 * - On mount, fetches status including whether sequential numbering is activated
 *   and the last invoice before the end of the previous month (to recommend the next number).
 * - Exposes state for:
 *    - last invoice from last month (or null)
 *    - legal identifier activation status (boolean)
 *    - loading state (boolean)
 * - Provides `initializeLegalIdentifier` method: initializes the legal identifier config,
 *   then re-fetches status on success.
 */
export const useSequentialNumberingStatus = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('b2b_invoice');
  const sequentialNumberingStatus = useSelector(
    (state: RootState) => state.invoice.sequentialNumberingStatus,
  );
  const initializeLegacyLoading = useSelector(
    (state: RootState) => state.invoice.initializeLegalIdentifierLegacy.loading,
  );

  const { result, loading: sequentialStatusLoading } =
    sequentialNumberingStatus;

  const isLoading = sequentialStatusLoading || initializeLegacyLoading;

  const lastInvoice = result?.last_invoice_before_end_of_last_month ?? null;
  const legalIdentifierActivated = result?.legal_identifier_activated ?? false;
  const firstTimestampToCheck = result?.first_timestamp_to_check ?? null;
  const invoicePrefix = result?.invoice_prefix ?? null;
  const invoiceSuffix = result?.invoice_suffix ?? null;
  const invoiceIdentifierFormat = result?.invoice_identifier_format ?? null;
  const bsportFirstInvoiceNumber = result?.bsport_first_invoice_number ?? null;

  const fetchStatus = useCallback(() => {
    dispatch(getSequentialNumberingStatus());
  }, [dispatch]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const initializeLegalIdentifier = useCallback(
    (
      data: InitializeLegalIdentifierLegacyRequest,
      options?: OptionCallback,
    ) => {
      dispatch(
        initializeLegalIdentifierLegacy(data, {
          onSuccess: () => {
            fetchStatus();
            dispatch(
              snackbarSuccess(
                t('configuration.sequentialNumbering.saveSuccess'),
              ),
            );
            options?.onSuccess?.();
          },
          onError: options?.onError,
        }),
      );
    },
    [dispatch, fetchStatus, t],
  );

  return {
    initializeLegalIdentifier,
    isLoading,
    lastInvoice,
    legalIdentifierActivated,
    firstTimestampToCheck,
    invoicePrefix,
    invoiceSuffix,
    invoiceIdentifierFormat,
    bsportFirstInvoiceNumber,
  };
};
