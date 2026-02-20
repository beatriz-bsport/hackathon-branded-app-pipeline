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
        // In widget full-page mode there is no React Router, so location can be undefined
        const search = this.props.location?.search ?? '';
        const regex = new RegExp(`${paramsName}=([^(&|$)]*)`);
        const match = regex.exec(search);

        return (
          // @ts-expect-error
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
      const value = Number.parseFloat(data);
      return Number.isNaN(value) ? null : value;
    case 'arrayNumber':
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
