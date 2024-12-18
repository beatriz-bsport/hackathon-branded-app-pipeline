// @flow

import React from 'react';

/* eslint-disable */
export default (mapProps) => (WrappedComponent) => {
  return class extends React.Component {
    componentDidMount() {
      const { id, fetch, loading } = mapProps(this.props);
      if (id) {
        fetch(id);
      }
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};
/* eslint-enable */
