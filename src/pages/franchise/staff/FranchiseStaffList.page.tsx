import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { TFunction } from 'i18next';
import { Backdrop, CircularProgress, Theme } from '@material-ui/core';
import UserWithRoleList from '#libs/role/components/UserWithRoleList.component';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import InfoBox from '#components/box/InfoBox.component';

import {
  fetchFranchiseUserRoles,
  fetchFranchiseRoles,
  updateFranchiseUserRole,
  deleteStaffFranchiseUser,
  createStaffFranchiseUser,
} from '#libs/role/actions';
import { fetchFranchise } from '#libs/franchise/actions';
import {
  getFranchiseUsersWithRole,
  getAllFranchiseRoles,
  hasFranchiseRoleUpsertPermission,
} from '#libs/role/selectors';
// @ts-ignore
import withTitle from '#hocs/with-title.hoc';
import { RootState } from '../../../reducers';
import { MaterialStyleType } from '../../../utils/types';
import { getFranchiseCompanies } from '#libs/franchise/selectors';

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export class FranchiseStaffConfiguration extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchFranchise();
    this.props.fetchFranchiseUserRoles();
    this.props.fetchFranchiseRoles();
  }

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }

    const { t, users, franchiseRoles, classes, hasOwnerPermission } =
      this.props;
    return (
      <div className={classes.container}>
        <InfoBox
          content={t('staff.explainStaff')}
          className={classes.infoBox}
        />
        <UserWithRoleList
          franchiseeList={this.props.franchiseeList}
          franchiseeListLoading={this.props.franchiseeListLoading}
          createUserRole={this.props.createStaffFranchiseUser}
          deleteUserRole={this.props.deleteStaffFranchiseUser}
          isFranchisor
          franchiseRoles={franchiseRoles}
          updateUserRole={this.props.updateFranchiseUserRole}
          hasOwnerPermission={hasOwnerPermission}
          users={users}
        />
        <Backdrop className={classes.backdrop} open={this.props.updateLoading}>
          <CircularProgress color="primary" />
        </Backdrop>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  infoBox: {
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  container: {
    padding: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  backdrop: {
    zIndex: 999,
  },
});

const mapStateToProps = (state: RootState) => ({
  hasOwnerPermission: hasFranchiseRoleUpsertPermission(state),
  loading: state.role.loading,
  users: getFranchiseUsersWithRole(state),
  franchiseRoles: getAllFranchiseRoles(state),
  updateLoading: state.role.franchiseRole.createOrUpdate.loading,
  franchiseeList: getFranchiseCompanies(state),
  franchiseeListLoading: state.franchise.loading.payload,
});

const mapDispatchToProps = {
  fetchFranchise,
  fetchFranchiseUserRoles,
  fetchFranchiseRoles,
  updateFranchiseUserRole,
  createStaffFranchiseUser,
  deleteStaffFranchiseUser,
};

export default compose(
  // @ts-ignore
  withStyles(styles),
  withTranslation('franchise'),
  withTitle(({ t }: { t: TFunction }) => t('staff.staffAccountPageTitle')),
  connect(mapStateToProps, mapDispatchToProps),
)(FranchiseStaffConfiguration);
