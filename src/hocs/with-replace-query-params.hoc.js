/* eslint-disable */

import React from 'react';

import { replace } from 'connected-react-router';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { branch, renderComponent } from 'recompose';
import { buildUrlParams } from '../http';
import parse from '../query-string';

export default function withReplaceQueryParams(
  paramsListToReplace,
  newParamsList,
) {
  return branch(
    (props) =>
      paramsListToReplace.reduce((test, oldName) => {
        const hasIt = Object.keys(parse(props.location.search)).includes(
          oldName,
        );
        return hasIt || test;
      }, false),
    renderComponent(
      withRouter(
        connect(null, { replace })(
          class extends React.Component {
            componentDidMount() {
              this.props.replace(
                this.props.location.pathname +
                  buildUrlParams(
                    Object.entries(parse(this.props.location.search)).reduce(
                      (acc, [key, value]) => {
                        const idx = paramsListToReplace.findIndex(
                          (k) => k === key,
                        );
                        if (idx >= 0) {
                          acc[newParamsList[idx]] = value;
                        } else {
                          acc[key] = value;
                        }
                        return acc;
                      },
                      {},
                    ),
                  ),
              );
            }

            render() {
              return null;
            }
          },
        ),
      ),
    ),
  );
}
