import { type FC, type PropsWithChildren, useEffect, useState } from "react";

import { setCurrencyCode, setCurrencyDisplay } from "@bsport/currency";
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

  const isManager = userAccess?.is_manager;
  const hasRevampAccess =
    userAccess?.has_enabled_revamped_backoffice &&
    companyTheme?.revamped_backoffice_enabled;

  if (!isManager || !hasRevampAccess) {
    window.location.assign("/");
    return null;
  }

  return children;
};
