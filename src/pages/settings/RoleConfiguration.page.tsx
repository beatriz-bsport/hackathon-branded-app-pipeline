import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { TFunction } from 'i18next';
import { Backdrop, CircularProgress, Divider, Theme } from '@material-ui/core';
import UserWithRoleList from '#libs/role/components/UserWithRoleList.component';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import RoleList from '#libs/role/components/RoleList.component';
import {
  fetchCompanyUserRoles,
  updateUserRole,
  deleteStaffUser,
  createStaffUser,
  createCompanyRole,
  updateCompanyRole,
  deleteCompanyRole,
} from '#libs/role/actions';
import {
  getUsersWithRole,
  getAllRoles,
  hasRoleUpsertPermission,
} from '#libs/role/selectors';
import { fetchAssociatedCoachesList } from '#libs/associated-coach/actions';
import { getActiveCoaches } from '#libs/associated-coach/selectors';
// @ts-ignore
import withTitle from '../../hocs/with-title.hoc';
import { RootState } from '../../reducers';
import { MaterialStyleType } from '../../utils/types';

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export class RoleConfiguration extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchCompanyUserRoles();
    this.props.fetchAssociatedCoachesList();
  }

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }

    const { t, users, roles, classes, hasOwnerPermission } = this.props;

    return (
      <div className={classes.container}>
        <Typography variant="h5" className={classes.sectionTitle}>
          {t('userRoles')}
        </Typography>
        <Divider className={classes.divider} />
        <Paper className={classes.usersRolePaper}>
          <div className={classes.row}>
            <InfoOutlinedIcon fontSize="large" className={classes.leftIcon} />
            <div>
              <Typography>{t('explainStaffDo')}</Typography>
              <Typography color="error">{t('explainStaffDoNot')}</Typography>
            </div>
          </div>
          <UserWithRoleList
            users={users}
            roles={roles}
            updateUserRole={this.props.updateUserRole}
            deleteUserRole={this.props.deleteStaffUser}
            createUserRole={this.props.createStaffUser}
            coachList={this.props.coachList}
            coachListLoading={this.props.coachListLoading}
            hasOwnerPermission={hasOwnerPermission}
          />
        </Paper>
        <Typography variant="h5" className={classes.sectionTitle}>
          {t('permissions')}
        </Typography>
        <Divider className={classes.divider} />
        <Paper id="text_staff_roles" className={classes.rolePaper}>
          <RoleList
            roles={roles}
            hasOwnerPermission={hasOwnerPermission}
            onCreateRole={(role) => this.props.createCompanyRole(role)}
            onEditRole={(role) => this.props.updateCompanyRole(role)}
            onDeleteRole={(role) => this.props.deleteCompanyRole(role)}
          />
        </Paper>

        <Backdrop className={classes.backdrop} open={this.props.updateLoading}>
          <CircularProgress color="primary" />
        </Backdrop>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  container: {
    padding: theme.spacing(2),
  },
  usersRolePaper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  rolePaper: {
    marginTop: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    border: '1px solid #E2E2E2',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  backdrop: {
    zIndex: 999,
  },
});

const mapStateToProps = (state: RootState) => ({
  hasOwnerPermission: hasRoleUpsertPermission(state),
  loading: state.role.loading,
  users: getUsersWithRole(state),
  roles: getAllRoles(state),
  updateLoading: state.role.role.createOrUpdate.loading,
  coachList: getActiveCoaches(state),
  coachListLoading: state.coach.loading,
});

const mapDispatchToProps = {
  fetchCompanyUserRoles,
  updateUserRole,
  createStaffUser,
  deleteStaffUser,
  createCompanyRole,
  updateCompanyRole,
  deleteCompanyRole,
  fetchAssociatedCoachesList,
};

export default compose(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['role']),
  withTitle(({ t }: { t: TFunction }) => t('pageTitle')),
  connect(mapStateToProps, mapDispatchToProps),
)(RoleConfiguration);
