import type { FormikHelpers } from 'formik';
import type { TFunction } from 'i18next';

import type { OnboardFiskalyCompanyResponse } from '#src/libs/invoice/types';
import type { Dispatch } from '#src/state/types';
import type { FormValues } from '#src/libs/invoice/sign-es/types';
import { snackbarError, snackbarSuccess } from '#src/libs/snackbar/actions';

export type SignEsOnboardRegulation = 'verifactu' | 'ticketbai';

type Params = {
  regulation: SignEsOnboardRegulation;
  data: OnboardFiskalyCompanyResponse | undefined;
  dispatch: Dispatch;
  t: TFunction;
  setAgreementUrl: (url: string | null) => void;
  setIsOnboarded: (onboarded: boolean) => void;
  formikHelpers?: FormikHelpers<FormValues>;
  resolve?: () => void;
};

/**
 * Applies POST onboard_company success for VERI*FACTU (agreement URL) vs TicketBAI (device certificate serial).
 */
export function applyOnboardFiskalyCompanySuccess({
  regulation,
  data,
  dispatch,
  t,
  setAgreementUrl,
  setIsOnboarded,
  formikHelpers,
  resolve,
}: Params): void {
  const finish = () => {
    formikHelpers?.setSubmitting(false);
    resolve?.();
  };

  if (regulation === 'ticketbai') {
    if (data?.device_certificate_serial_number) {
      dispatch(
        snackbarSuccess(
          t('configuration.ticketbai.onboarding.device_registered'),
        ),
      );
      setAgreementUrl(null);
      setIsOnboarded(true);
      finish();
      return;
    }

    console.error(
      'Sign-ES ticketbai onboard response missing device certificate serial',
    );
    dispatch(
      snackbarError(t('configuration.ticketbai.onboarding.device_error')),
    );
    finish();
    return;
  }

  if (regulation === 'verifactu') {
    if (data?.agreement_url) {
      dispatch(
        snackbarSuccess(
          t('configuration.verifactu.onboarding.agreement_created'),
        ),
      );
      setAgreementUrl(data.agreement_url);
      setIsOnboarded(true);
      finish();
      return;
    }

    console.error('Sign-ES verifactu onboard response missing agreement URL');
    dispatch(
      snackbarError(t('configuration.verifactu.onboarding.agreement_error')),
    );
    finish();
    return;
  }

  console.error(`Unsupported Sign-ES regulation: ${regulation}`);
  dispatch(
    snackbarError(
      regulation === 'ticketbai'
        ? t('configuration.ticketbai.onboarding.device_error')
        : t('configuration.verifactu.onboarding.agreement_error'),
    ),
  );
  finish();
}
