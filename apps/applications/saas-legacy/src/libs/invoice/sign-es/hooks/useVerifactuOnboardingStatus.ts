import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkFiskalyOnboardingStatus,
  getDeviceCertificateSerialNumber,
  getIsCompanyAllSetup,
  getFiskalyOnboardingRequirements,
  getLastUploadedSignedAgreement,
  getLastGeneratedAgreementUrl,
} from '#src/libs/invoice/actions';
import { FiskalyOnboardingRequirement } from '#src/libs/invoice/types';
import { fetchPlatformCustomerEntityRepresentatives } from '#src/libs/platform-billing/actions';
import type { RootState } from '#src/reducers';

/**
 * Hook that fetches and manages Verifactu onboarding status and related data.
 *
 * On component mount, it:
 * 1. Checks the current onboarding status (is_onboarded)
 * 2. Fetches platform customer entity representatives
 * 3. Fetches onboarding requirements (VAT ID, business address, etc.)
 * 4. If the company is already onboarded:
 *    - Fetches the last generated agreement URL for the download button
 *    - Fetches the signed agreement file status (if uploaded)
 *
 * Returns all state values and setters needed to manage the onboarding flow
 * and determine which step of the process to display (form, sign & upload, or active).
 *
 * @param options.skipAgreementFetch - When true (TicketBAI), skip collaborator-agreement URL / signed-PDF fetches after onboarding.
 * @param options.skipRepresentativesFetch - When true (TicketBAI), do not load platform representative data.
 * @param options.fetchDeviceCertificateIfMissing - When true (TicketBAI), if onboarded and serial is missing in state, fetch it from onboarding API.
 */
export const useVerifactuOnboardingStatus = (options?: {
  skipAgreementFetch?: boolean;
  skipRepresentativesFetch?: boolean;
  fetchDeviceCertificateIfMissing?: boolean;
}) => {
  const skipAgreementFetch = options?.skipAgreementFetch ?? false;
  const skipRepresentativesFetch = options?.skipRepresentativesFetch ?? false;
  const fetchDeviceCertificateIfMissing =
    options?.fetchDeviceCertificateIfMissing ?? false;
  const dispatch = useDispatch();
  const deviceCertificateSerialNumber = useSelector(
    (state: RootState) =>
      state.invoice.fiskalyOnboarding.deviceCertificateSerialNumber,
  );
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoadingOnboarding, setIsLoadingOnboarding] = useState(true);
  const [agreementUrl, setAgreementUrl] = useState<string | null>(null);
  const [signedAgreementFile, setSignedAgreementFile] = useState<string | null>(
    null,
  );
  const [isLoadingSignedAgreement, setIsLoadingSignedAgreement] =
    useState(false);
  const [requirements, setRequirements] = useState<
    FiskalyOnboardingRequirement[]
  >([]);

  useEffect(() => {
    dispatch(
      checkFiskalyOnboardingStatus({
        onSuccess: (data) => {
          setIsLoadingOnboarding(false);

          if (!data) return;

          setIsOnboarded(data.is_onboarded);

          if (!skipRepresentativesFetch) {
            dispatch(
              fetchPlatformCustomerEntityRepresentatives({
                onError: () => console.error('Failed to fetch representatives'),
              }),
            );
          }

          // If company is onboarded, fetch agreement URL and signed agreement status
          if (data.is_onboarded && !skipAgreementFetch) {
            // Fetch agreement URL for download button
            dispatch(
              getLastGeneratedAgreementUrl({
                onSuccess: (agreementData) => {
                  if (agreementData?.agreement_url) {
                    setAgreementUrl(agreementData.agreement_url);
                  }
                },
                onError: () => {
                  console.error('Failed to fetch agreement URL');
                },
              }),
            );

            // Fetch signed agreement status
            setIsLoadingSignedAgreement(true);
            dispatch(
              getLastUploadedSignedAgreement({
                onSuccess: (agreementData) => {
                  setSignedAgreementFile(
                    agreementData?.signed_agreement_url || null,
                  );
                  setIsLoadingSignedAgreement(false);
                },
                onError: () => {
                  setSignedAgreementFile(null);
                  setIsLoadingSignedAgreement(false);
                },
              }),
            );
          } else if (data.is_onboarded && skipAgreementFetch) {
            setIsLoadingSignedAgreement(false);
            const fetchCompanyAllSetup = () => {
              dispatch(getIsCompanyAllSetup());
            };
            if (
              fetchDeviceCertificateIfMissing &&
              !deviceCertificateSerialNumber
            ) {
              dispatch(
                getDeviceCertificateSerialNumber({
                  onSuccess: () => {
                    fetchCompanyAllSetup();
                  },
                  onError: () => {
                    console.error(
                      'Failed to fetch device certificate serial number',
                    );
                    fetchCompanyAllSetup();
                  },
                }),
              );
            } else {
              fetchCompanyAllSetup();
            }
          } else {
            dispatch(
              getFiskalyOnboardingRequirements({
                onSuccess: (requirementsData) => {
                  if (requirementsData) {
                    setRequirements(requirementsData.requirements || []);
                  }
                },
                onError: () =>
                  console.error('Failed to fetch onboarding requirements'),
              }),
            );
          }
        },
        onError: () => {
          console.error('Failed to check onboarding status');
          setIsLoadingOnboarding(false);
          setIsOnboarded(false);
        },
      }),
    );
  }, [
    deviceCertificateSerialNumber,
    dispatch,
    fetchDeviceCertificateIfMissing,
    skipAgreementFetch,
    skipRepresentativesFetch,
  ]);

  return {
    isOnboarded,
    setIsOnboarded,
    isLoadingOnboarding,
    agreementUrl,
    setAgreementUrl,
    signedAgreementFile,
    setSignedAgreementFile,
    isLoadingSignedAgreement,
    requirements,
  };
};
