// @ts-nocheck
import React, { ReactPropTypes } from 'react';

export type SuportedConverter =
  | 'string'
  | 'boolean'
  | 'number'
  | 'arrayNumber'
  | 'arrayString';

export default function withQueryParamsToProps([
  paramsName,
  paramsPropsName,
  type = 'string',
]: [string] | [string, string] | [string, string, SuportedConverter]) {
  return <P extends ReactPropTypes>(
    WrappedComponent: React.ComponentType<P>,
  ) => {
    return class extends React.PureComponent<any> {
      render() {
        const { search } = this.props.location;
        const regex = new RegExp(`${paramsName}=([^(&|$)]*)`);
        const match = regex.exec(search);

        return (
          <WrappedComponent
            {...this.props}
            {...{
              [paramsPropsName || paramsName]: convertToType(match?.[1], type),
            }}
          />
        );
      }
    };
  };
}

const convertToType = (data: string, type: SuportedConverter) => {
  if (!data) return null;
  switch (type) {
    case 'string':
      return data;
    case 'boolean':
      if (data === 'true') return true;
      if (data === 'false') return false;
      return null;
    case 'number':
      // eslint-disable-next-line no-case-declarations
      const value = Number.parseFloat(data);
      return Number.isNaN(value) ? null : value;
    case 'arrayNumber':
      // eslint-disable-next-line no-case-declarations
      const values = data.split(',');
      return values
        ?.filter((num) => Number.isNaN(Number.parseFloat(num)))
        ?.map((num) => Number.parseFloat(num));
    case 'arrayString':
      return data.split(',');
    default:
      return data;
  }
};
