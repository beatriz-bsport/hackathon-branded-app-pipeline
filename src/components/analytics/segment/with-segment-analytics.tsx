import React from 'react';
import { Analytics } from '@segment/analytics-next';
import { segmentTrackEnum, WithSegmentAnalyticsHandlers } from './utils';

type Props = {};
type State = {
  segmentAnalytics: Analytics | undefined;
};

declare global {
  interface Window {
    bsportSegment: Analytics;
  }
}
export const withSegmentAnalytics = <P extends WithSegmentAnalyticsHandlers>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return class extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        segmentAnalytics: window.bsportSegment,
      };
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          segmentAnalytics={segmentTrackEnum(this.state.segmentAnalytics)}
        />
      );
    }
  };
};

export default withSegmentAnalytics;
