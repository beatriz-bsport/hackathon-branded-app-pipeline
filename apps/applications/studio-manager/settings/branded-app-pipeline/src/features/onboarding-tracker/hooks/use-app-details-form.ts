import { useCallback, useEffect, useState } from "react";

export interface AppDetails {
  appName: string;
  duns: string;
  dunsSubmittedAt: string;
  googlePlayUrl: string;
  appStoreUrl: string;
}

const EMPTY_APP_DETAILS: AppDetails = {
  appName: "",
  duns: "",
  dunsSubmittedAt: "",
  googlePlayUrl: "",
  appStoreUrl: "",
};

const STORAGE_KEY = "brandedAppPipeline.onboardingTracker.appDetails";

const readAppDetails = (): AppDetails => {
  try {
    return {
      ...EMPTY_APP_DETAILS,
      ...(JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "{}",
      ) as Partial<AppDetails>),
    };
  } catch {
    return EMPTY_APP_DETAILS;
  }
};

export const useAppDetailsForm = () => {
  const [details, setDetails] = useState<AppDetails>(readAppDetails);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
  }, [details]);

  const updateField = useCallback(
    <K extends keyof AppDetails>(field: K, value: AppDetails[K]) => {
      setDetails((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  return { details, updateField };
};
