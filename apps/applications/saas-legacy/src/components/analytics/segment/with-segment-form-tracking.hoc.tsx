import React from 'react';
import { Analytics } from '@segment/analytics-next';
import { segmentTrackEnum, TrackProperties } from './utils';
import { SegmentAnalyticsFormObjectIdentifier } from './constants';

type Props = {};
type State = {
  segmentAnalytics: Analytics | undefined;
};

type AnalyticsHOCParams = {
  object_identifier: SegmentAnalyticsFormObjectIdentifier;
};

export default function withFormTrackingHOC<P>(params: AnalyticsHOCParams) {
  return (WrappedComponent: React.ComponentType<P>) => {
    return class extends React.Component<Props, State> {
      constructor(props: Props) {
        super(props);
        this.state = {
          segmentAnalytics: window.bsportSegment,
        };
      }

      render() {
        const segmentAnalytics = segmentTrackEnum(this.state.segmentAnalytics);
        return (
          // @ts-expect-error
          <WrappedComponent
            {...this.props}
            {...(params.object_identifier
              ? {
                  formAdd: (properties?: TrackProperties) =>
                    segmentAnalytics?.form(
                      `${params.object_identifier}_add`,
                      properties,
                    ),
                  formSubmitIntent: (properties?: TrackProperties) =>
                    segmentAnalytics?.form(
                      `${params.object_identifier}_submit_intent`,
                      properties,
                    ),
                  formSuccess: (properties?: TrackProperties) =>
                    segmentAnalytics?.form(
                      `${params.object_identifier}_submit_success`,
                      properties,
                    ),
                  formCancel: (properties?: TrackProperties) =>
                    segmentAnalytics?.form(
                      `${params.object_identifier}_cancel`,
                      properties,
                    ),
                }
              : {})}
          />
        );
      }
    };
  };
}
