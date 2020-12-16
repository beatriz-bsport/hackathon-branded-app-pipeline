import React from 'react';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import { compose, withHandlers } from 'recompose';
import { replace as replaceRouter } from 'connected-react-router';
import { connect } from 'react-redux';

import { buildUrlParams } from '../http.ts';
import parse from '../query-string';

export default function withQueryParams([
  paramsArray,
  paramGroupName,
  paramSetterName,
]) {
  return (WrappedComponent) => {
    return compose(
      connect(
        null,
        { replace: replaceRouter },
      ),
      withHandlers({
        setParam: ({ replace, location }) => (key) => (value, callback) => {
          if (!paramsArray.includes(key)) return;
          const { search, pathname } = location;
          const allParams = parse(search);
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
      class extends React.Component<Props> {
        render() {
          const { search } = this.props.location;
          const allParams = parse(search);

          const relatedParams = pick(allParams, paramsArray);

          return (
            <WrappedComponent
              {...this.props}
              {...{
                [paramGroupName]: relatedParams,
                [paramSetterName]: this.props.setParam,
              }}
            />
          );
        }
      },
    );
  };
}
