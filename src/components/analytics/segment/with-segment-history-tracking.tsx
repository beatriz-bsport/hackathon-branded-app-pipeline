import React from 'react';
import { Analytics } from '@segment/analytics-next';
import history from '../../../history';
import { parseQueryString } from '../../../http';

type Props = {};
type State = {
  segmentAnalytics: Analytics | undefined;
  prevPath: string | null;
  prevSearch: string | null;
};
export const withSegmentHistoryTracker = (
  WrappedComponent: React.ComponentType,
) => {
  return class extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        segmentAnalytics: window.bsportSegment,
        prevPath: null,
        prevSearch: null,
      };
      history.listen((location) => {
        if (
          location.pathname !== this.state.prevPath ||
          location.search != this.state.prevPath
        ) {
          this.setState({
            prevPath: location.pathname,
            prevSearch: location.search,
          });
        }
      });
    }
    componentDidUpdate(_, prevState: State) {
      if (
        prevState.prevPath !== this.state.prevPath ||
        prevState.prevSearch !== this.state.prevSearch
      ) {
        const parsedQueryString = parseQueryString(this.state.prevSearch);
        this.state.segmentAnalytics?.page(
          { params: parsedQueryString },
          {
            All: false,
            Intercom: true,
            Amplitude: true,
          },
        );
      }
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withSegmentHistoryTracker;
