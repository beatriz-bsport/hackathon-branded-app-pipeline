import React from 'react';

import keyBy from 'lodash/keyBy';
import keys from 'lodash/keys';
import mapValues from 'lodash/mapValues';
import mapKeys from 'lodash/mapKeys';
import pick from 'lodash/pick';

// When adding a new type you only need to update the converter
const converters = {
  number: (x: string) => +x,
};

type SupportedType = keyof typeof converters;
type ParamWithType = `${string}:${SupportedType}`;
type ParamsMap = string[] | Record<string, ParamWithType>;

type Props = {
  match: { params: Record<string, string> };
};

export default function mapRouterParamsToProps(paramsMapper: ParamsMap) {
  const mapper = Array.isArray(paramsMapper)
    ? keyBy(paramsMapper, (x) => x)
    : paramsMapper;

  const mapperConv = mapValues(mapper, (key: string) => {
    const bits = key.split(':');
    if (bits.length <= 1) {
      return { key, converter: (x: string) => x };
    }
    const targetType = bits[1] as SupportedType;
    return { key: bits[0], converter: converters[targetType] };
  });

  return (WrappedComponent: React.FC<unknown>) => {
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
