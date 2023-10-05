import React from 'react';

import MetricSlider from './MetricSlider.component';
import { PerformanceTrackingMetric } from '#libs/performance-tracking/types';

type Props = {
  value: number;
  metric: PerformanceTrackingMetric;
  isPreventUpdateMetricValue?: boolean;
  changeMemberMetricValue: (value: number, metric: number) => void;
};

export const SliderForm: React.FC<Props> = ({
  value,
  metric,
  isPreventUpdateMetricValue,
  changeMemberMetricValue,
}) => (
  <MetricSlider
    isPreventUpdateMetricValue={isPreventUpdateMetricValue}
    metric={metric}
    onChange={(sliderValue) => {
      changeMemberMetricValue(sliderValue, metric?.id);
    }}
    value={value}
  />
);

export default React.memo(SliderForm);
