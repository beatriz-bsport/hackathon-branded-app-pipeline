// @flow

import React from 'react';

import keyBy from 'lodash/keyBy';
import keys from 'lodash/keys';
import mapValues from 'lodash/mapValues';
import mapKeys from 'lodash/mapKeys';
import pick from 'lodash/pick';

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
    ? keyBy(paramsMapper, (x) => x)
    : paramsMapper;

  const mapperConv = mapValues(mapper, (key) => {
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
        const params = pick((match && match.params) || {}, keys(mapperConv));

        // Convert params if needed
        const convertedParams = mapValues(params, (value, key) => {
          return mapperConv[key].converter(value);
        });

        // Create final props
        const mappedProps = mapKeys(convertedParams, (value, key) => {
          return mapperConv[key].key;
        });
        return <WrappedComponent {...this.props} {...mappedProps} />;
      }
    };
  };
}
