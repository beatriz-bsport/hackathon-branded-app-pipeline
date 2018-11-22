// @flow

import lodash from 'lodash';
import React from 'react';

export default function(paramsMapper) {
  const mapper = paramsMapper.length
    ? lodash.keyBy(paramsMapper, (x) => x)
    : paramsMapper;
  return (WrappedComponent) => {
    return class extends React.Component {
      render() {
        const { match } = this.props;
        const params = lodash.pick(
          (match && match.params) || {},
          lodash.keys(mapper),
        );
        const mappedProps = lodash.mapKeys(params, (value, key) => {
          return mapper[key];
        });
        return <WrappedComponent {...this.props} {...mappedProps} />;
      }
    };
  };
}
