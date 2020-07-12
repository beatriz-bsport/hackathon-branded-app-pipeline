// @flow

import React from 'react';

/* eslint-disable */
export default (eventName, secondToTrack) =>
  function(WrappedComponent) {
    return class extends React.Component {
      componentDidMount() {
        (secondToTrack || []).map((second) =>
          setTimeout(() => {
            window.Intercom &&
              window.Intercom(
                'trackEvent',
                'Stay ' + eventName + ' ' + second + 's',
                {
                  pause: second,
                  eventType: 'stay',
                  id: eventName,
                },
              );
          }, second * 1000),
        );
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    };
  };
/* eslint-enable */
