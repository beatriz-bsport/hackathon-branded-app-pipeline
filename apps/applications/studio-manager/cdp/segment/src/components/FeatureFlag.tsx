import { type ReactNode } from "react";
import { Navigate } from "react-router";

import { SMARTLIST_APP_LINKS } from "#src/urls";
import { type FlagName, useFlag } from "#src/utils/feature-flags";

type Props = {
  flag: FlagName;
  children: ReactNode;
  fallback?: ReactNode;
};

export const FeatureFlag = ({
  flag,
  children,
  fallback = <Navigate to={SMARTLIST_APP_LINKS.index()} replace />,
}: Props) => {
  const isEnabled = useFlag(flag);

  return isEnabled ? children : fallback;
};
