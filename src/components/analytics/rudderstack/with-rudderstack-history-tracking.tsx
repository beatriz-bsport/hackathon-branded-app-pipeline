import React from 'react';
import history from '../../../history';
import { parseQueryString } from '../../../http';
import { rudderStackPage } from './utils';

type State = {
  prevPath: string | null;
  prevSearch: string | null;
  unlisten: () => void;
};
export function withRudderStackHistoryTracker<P> (
  WrappedComponent: React.ComponentType<P>,
)  {
  return class extends React.Component<P,State> {
    constructor(props:P) {
      super(props);
      this.state = {
        prevPath: null,
        prevSearch: null,
        unlisten : history.listen((location) => {
          if (
            location.pathname !== this.state.prevPath ||
            location.search != this.state.prevPath
          ) {
            this.setState({
              prevPath: location.pathname,
              prevSearch: location.search,
            });
          }
        })
      };
    }

    componentWillUnmount() {
      this.state.unlisten();
    }

    componentDidUpdate(_, prevState: State) {
      if (
        prevState.prevPath !== this.state.prevPath ||
        prevState.prevSearch !== this.state.prevSearch
      ) {
        const parsedQueryString = parseQueryString(this.state.prevSearch);
        rudderStackPage(
          parsedQueryString 
        );
      }
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withRudderStackHistoryTracker;
