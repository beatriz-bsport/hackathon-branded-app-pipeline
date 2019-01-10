// @flow

import lodash from 'lodash';
import React from 'react';

type ParamsMap = string[] | { [string]: string };

const converters = {
  number: (x) => +x,
};

type Props = {
  match: ?{
    params: { [string]: * },
  },
};

export default function mapRouterParamsToProps(paramsMapper: ParamsMap) {
  // Convert mapper to canonical form { [string]: string }
  const mapper = paramsMapper.length
    ? lodash.keyBy(paramsMapper, (x) => x)
    : paramsMapper;

  const mapperConv = lodash.mapValues(mapper, (key) => {
    const bits = key.split(':');
    if (bits.length <= 1) {
      return { key, converter: (x) => x };
    }
    return { key: bits[0], converter: converters[bits[1]] };
  });

  return (WrappedComponent) => {
    return class extends React.Component<Props> {
      render() {
        const { match } = this.props;

        // Pick only expected params
        const params = lodash.pick(
          (match && match.params) || {},
          lodash.keys(mapperConv),
        );

        // Convert params if needed
        const convertedParams = lodash.mapValues(params, (value, key) => {
          return mapperConv[key].converter(value);
        });

        // Create final props
        const mappedProps = lodash.mapKeys(convertedParams, (value, key) => {
          return mapperConv[key].key;
        });
        return <WrappedComponent {...this.props} {...mappedProps} />;
      }
    };
  };
}
