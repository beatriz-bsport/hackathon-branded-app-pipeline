import React from 'react';

import { PerformanceTrackingMetric } from '#libs/performance-tracking/types';
import MetricSlider from './MetricSlider.component';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

type OwnProps = {
  value: number;
  metric: PerformanceTrackingMetric;
  changeMemberMetricValue: (value: number, metric: number) => void;
};
type Props = OwnProps;
export const SliderForm = (props: Props) => {
  const { value, metric, changeMemberMetricValue } = props;

  return (
    <>
      <ObjectLevelPermissionProvider requiredPermission="reservation.privateBooking.allowed_actions.editPerformance">
        {(hasEditPerformancePermission: boolean) => (
          <MetricSlider
            hasEditPerformancePermission={hasEditPerformancePermission}
            metric={metric}
            onChange={(val) => {
              changeMemberMetricValue(val, metric?.id);
            }}
            value={value}
          />
        )}
      </ObjectLevelPermissionProvider>
    </>
  );
};

export default SliderForm;
