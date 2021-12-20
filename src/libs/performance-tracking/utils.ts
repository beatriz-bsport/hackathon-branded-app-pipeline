import { PerformanceTrackingMetric } from './types';

export const organize_index = (
  oldIndex: number,
  newIndex: number,
  metricList: Array<PerformanceTrackingMetric>,
) => {
  if (oldIndex === newIndex) {
    return metricList;
  }
  const incrementation = oldIndex > newIndex ? 1 : -1;
  const min_index = Math.min(oldIndex, newIndex);
  const max_index = Math.max(oldIndex, newIndex);
  const res = metricList.map((metric) => {
    if (metric.index < min_index || metric.index > max_index) {
      return metric;
    }
    if (metric.index === oldIndex) {
      return { ...metric, index: newIndex };
    }

    return { ...metric, index: metric.index + incrementation };
  });
  return [...res].sort((metric1, metric2) => metric1.index - metric2.index);
};

export const MEMBER_PROGRAM_PER_PAGE = 5;
