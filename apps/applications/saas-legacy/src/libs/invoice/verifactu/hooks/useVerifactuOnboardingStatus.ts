import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  checkFiskalyOnboardingStatus,
  getFiskalyOnboardingRequirements,
  getLastUploadedSignedAgreement,
  onboardFiskalyCompany,
} from '#src/libs/invoice/actions';
import { FiskalyOnboardingRequirement } from '#src/libs/invoice/types';
import { fetchPlatformCustomerEntityRepresentatives } from '#src/libs/platform-billing/actions';

/**
 * Hook that fetches and manages Verifactu onboarding status and related data.
 *
 * On component mount, it:
 * 1. Checks the current onboarding status (is_onboarded)
 * 2. Fetches platform customer entity representatives
 * 3. Fetches onboarding requirements (VAT ID, business address, etc.)
 * 4. If the company is already onboarded:
 *    - Fetches the agreement URL for the download button
 *    - Fetches the signed agreement file status (if uploaded)
 *
 * Returns all state values and setters needed to manage the onboarding flow
 * and determine which step of the process to display (form, sign & upload, or active).
 */
export const useVerifactuOnboardingStatus = () => {
  const dispatch = useDispatch();
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

          dispatch(
            fetchPlatformCustomerEntityRepresentatives({
              onError: () => console.error('Failed to fetch representatives'),
            }),
          );

          // If company is onboarded, fetch agreement URL and signed agreement status
          if (data.is_onboarded) {
            // Fetch agreement URL for download button
            dispatch(
              onboardFiskalyCompany({
                onSuccess: (onboardData) => {
                  if (onboardData?.agreement_url) {
                    setAgreementUrl(onboardData.agreement_url);
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
  }, [dispatch]);

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
