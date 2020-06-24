// @flow

import React from 'react';

/* eslint-disable */
export default function(WrappedComponent) {
  return class extends React.Component {
    state = { error: null };

    componentDidCatch(error) {
      this.setState({ error });
    }

    render() {
      if (this.state.error) {
        return <div />;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
}
/* eslint-enable */
