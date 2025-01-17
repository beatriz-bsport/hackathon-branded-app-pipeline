// @flow

import React from 'react';

export default (pageName) =>
  function (WrappedComponent) {
    return class extends React.Component {
      componentDidMount() {
        window.Intercom &&
          window.Intercom('trackEvent', 'Open ' + pageName, {
            eventType: 'open',
            id: pageName,
          });
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    };
  };
