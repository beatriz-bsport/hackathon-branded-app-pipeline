// @flow

import React from 'react';

export default (eventName, secondToTrack) =>
  function (WrappedComponent) {
    return class extends React.Component {
      componentDidMount() {
        this.timeoutList = (secondToTrack ?? []).map((second) =>
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

      componentWillUnmount() {
        try {
          (this.timeoutList ?? []).map((timeout) => clearTimeout(timeout));
        } catch (err) {
          console.error(err);
        }
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    };
  };
