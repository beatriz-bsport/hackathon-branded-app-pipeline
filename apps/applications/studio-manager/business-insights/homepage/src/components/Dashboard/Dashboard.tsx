import type { FC } from "react";

import {
  DashboardContent,
  type DashboardContentProps,
} from "./DashboardContent";

type DashboardProps = DashboardContentProps;

export const Dashboard: FC<DashboardProps> = (props) => {
  return (
    <div className="w-full rounded-lg overflow-hidden">
      <DashboardContent {...props} />
    </div>
  );
};
