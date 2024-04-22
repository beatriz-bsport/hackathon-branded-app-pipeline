import React from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { RootState } from '../../../reducers';
import { getPermissions } from '../selectors';
import { RolePermission } from '../types';
import { checkRequiredPermissions } from '../utils';

type OwnProps = {
  check?: (permissions: RolePermission) => boolean;
  /** e.g: "member.allowed_actions.accessProfile" */
  requiredPermissions?: string;
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

class CheckPermission extends React.PureComponent<Props> {
  render() {
    const { requiredPermissions, permissions, check, children } = this.props;

    if (requiredPermissions) {
      if (checkRequiredPermissions(requiredPermissions, permissions)) {
        return children || null;
      }
    }

    if (check) {
      if (check(permissions)) {
        return children || null;
      }
    }

    return null;
  }
}

const mapStateToProps = (state: RootState) => ({
  permissions: getPermissions(state),
});

export default compose(connect(mapStateToProps))(CheckPermission);
