import { type FC, type PropsWithChildren, useEffect, useState } from "react";

import { setCurrencyCode, setCurrencyDisplay } from "@bsport/currency";
import { getEnv } from "@bsport/envs";
import { setCompanyTimezone } from "@bsport/timezone-utils";

import { fetchSharedData } from "#src/api";
import { LoadingPage } from "#src/components/LoadingPage";
import { dataAccessLayer } from "#src/data-access-layer";

export const DataLayerWrapper: FC<PropsWithChildren> = ({ children }) => {
  const [isLoadingSharedData, setIsLoadingSharedData] = useState(true);
  const userAccess = dataAccessLayer.useUserAccess();
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const companyCurrencyCode = companyTheme?.currency;
  const companyCurrencyDisplay = companyTheme?.currency_display;
  const companyTimezone = companyTheme?.timezone_name;

  useEffect(() => {
    const asyncFetchSharedData = async () => {
      await fetchSharedData();
      setIsLoadingSharedData(false);
    };

    asyncFetchSharedData();
  }, []);

  useEffect(() => {
    if (companyCurrencyCode) {
      setCurrencyCode(companyCurrencyCode, "local");
    }
    if (companyCurrencyDisplay) {
      setCurrencyDisplay(companyCurrencyDisplay, "local");
    }
    if (companyTimezone) {
      setCompanyTimezone(companyTimezone, "local");
    }
  }, [companyCurrencyCode, companyCurrencyDisplay, companyTimezone]);

  if (isLoadingSharedData) {
    return <LoadingPage />;
  }

  const isLocal = getEnv() === "local";

  const isManager = userAccess?.is_manager;

  if (!isManager) {
    if (isLocal) {
      console.warn(
        "[BACKBONE] You would have been redirected to '/' in a deployed environment.",
      );
    } else {
      // Redirect to bsport default Router
      window.location.assign("/");
      return null;
    }
  }

  const hasRevampAccess =
    userAccess?.has_enabled_revamped_backoffice &&
    companyTheme?.revamped_backoffice_enabled;

  if (!hasRevampAccess) {
    if (isLocal) {
      console.warn(
        "[BACKBONE] You would have been redirected to '/calendar' in a deployed environment.",
      );
    } else {
      // Redirect to Backoffice default page
      window.location.assign("/calendar");
      return null;
    }
  }

  return children;
};
