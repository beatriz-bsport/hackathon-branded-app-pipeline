import React from 'react';

import ConsumerAppBarContainer from '../pages/checkout/ConsumerAppBar.container';

export function consumerAppBarHOC<P>(): (
  component: React.ComponentType<P>,
) => typeof React.Component {
  return (WrappedComponent: React.ComponentType<P>) => {
    class Wrapper extends React.Component<P> {
      render() {
        return (
          // @ts-expect-error
          <ConsumerAppBarContainer backgroundColor="white">
            <WrappedComponent {...this.props} />
          </ConsumerAppBarContainer>
        );
      }
    }
    return Wrapper;
  };
}
