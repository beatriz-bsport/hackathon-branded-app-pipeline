import React from 'react';

import { PerformanceTrackingMetric } from '#libs/performance-tracking/types';
import MetricSlider from './MetricSlider.component';

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
      <MetricSlider
        metric={metric}
        value={value}
        onChange={(val) => {
          changeMemberMetricValue(val, metric?.id);
        }}
      />
    </>
  );
};

export default SliderForm;
