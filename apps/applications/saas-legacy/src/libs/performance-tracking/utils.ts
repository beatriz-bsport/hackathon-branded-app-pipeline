import { FieldArrayRenderProps } from 'formik';
import { PerformanceTrackingMetric } from './types';

const ADD = 1;
const MINUS = -1;
export const organize_index = (
  oldIndex: number,
  newIndex: number,
  metricList: Array<PerformanceTrackingMetric>,
  fieldArrayHelpers: FieldArrayRenderProps,
) => {
  if (oldIndex === newIndex) {
    return;
  }
  const incrementation = oldIndex > newIndex ? ADD : MINUS;
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
  const sortedRes = [...res].sort(
    (metric1, metric2) => metric1.index - metric2.index,
  );
  sortedRes.forEach((metric, index) => {
    fieldArrayHelpers.replace(index, metric);
  });
};

export const MEMBER_PROGRAM_PER_PAGE = 5;
