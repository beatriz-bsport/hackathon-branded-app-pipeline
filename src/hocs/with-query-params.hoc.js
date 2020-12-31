/* eslint-disable */

import React from 'react';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import { compose, withHandlers } from 'recompose';
import { replace as replaceRouter } from 'connected-react-router';
import { connect } from 'react-redux';

import { buildUrlParams, parseQueryString } from '../http';

const convertParams = (params, mode) => {
  if (!mode || mode === 'string') {
    return params;
  }
  if (mode === 'arrayNumber') {
    const parsedParams = {};
    Object.entries(params).forEach(([key, value]) => {
      parsedParams[key] = (value || '')
        .replace('[', '')
        .replace(']', '')
        .split(',')
        .map((v) => parseInt(v, 10))
        .filter((v) => Number.isInteger(v));
    });
    return parsedParams;
  }
};

export default function withQueryParams([
  paramsArray,
  paramGroupName,
  paramSetterName,
  mode: string = 'string',
]) {
  return (WrappedComponent) => {
    return compose(
      connect(null, { replace: replaceRouter }),
      withHandlers({
        setParam: ({ replace, location }) => (key) => (value, callback) => {
          if (!paramsArray.includes(key)) return;
          const { search, pathname } = location;
          const allParams = parseQueryString(search);
          if (value === 'null' || value === '' || value === null) {
            replace(pathname + buildUrlParams({ ...omit(allParams, key) }));
          } else {
            replace(pathname + buildUrlParams({ ...allParams, [key]: value }));
          }
          if (callback) {
            callback();
          }
        },
      }),
    )(
      class extends React.PureComponent<Props> {
        render() {
          const { search } = this.props.location;
          const allParams = parseQueryString(search);

          const relatedParams = pick(allParams, paramsArray);

          const parsedRelatedParams = convertParams(relatedParams, mode);

          return (
            <WrappedComponent
              {...this.props}
              {...{
                [paramGroupName]: parsedRelatedParams,
                [paramSetterName]: this.props.setParam,
              }}
            />
          );
        }
      },
    );
  };
}
