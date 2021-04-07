import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { RootState } from '../../../reducers';
import { getPermissions } from '../selectors';
import { Permission } from '../types';
import { checkRequiredPermissions } from '../utils';

type OwnProps = {
  check?: (permissions: Permission) => boolean;
  /** e.g: "offer.create,member.retrieve */
  requiredPermissions?: string;
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

class CheckPermission extends React.PureComponent<Props> {
  render() {
    const { requiredPermissions, permissions, check, children } = this.props;

    if (requiredPermissions) {
      if (checkRequiredPermissions(requiredPermissions, permissions)) {
        return children;
      }
    }

    if (check) {
      if (check(permissions)) {
        return children;
      }
    }

    return null;
  }
}

const mapStateToProps = (state: RootState) => ({
  permissions: getPermissions(state),
});

export default compose(connect(mapStateToProps))(CheckPermission);
