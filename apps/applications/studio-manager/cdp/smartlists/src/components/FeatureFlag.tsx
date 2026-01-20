import { type ReactNode } from "react";
import { Navigate } from "react-router";

import { URLS } from "#src/urls";
import { type FlagName, useFlag } from "#src/utils/feature-flags";

type Props = {
  flag: FlagName;
  children: ReactNode;
  fallback?: ReactNode;
};

export const FeatureFlag = ({
  flag,
  children,
  fallback = <Navigate to={URLS.INDEX} replace />,
}: Props) => {
  const isEnabled = useFlag(flag);

  return isEnabled ? children : fallback;
};
