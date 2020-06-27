// @flow
import React from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Paper from '@material-ui/core/Paper';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import UserWithRoleList from '../../libs/role/components/UserWithRoleList.component';
import PermissionList from '../../libs/role/components/PermissionList.component';
import {
  fetchCompanyRoles,
  updateUserRole,
  deleteStaffUser,
  createStaffUser,
} from '../../libs/role/actions';
import { getUsersWithRole, getPermissionsSet } from '../../libs/role/selectors';
import type { Permission } from '../../libs/role/types';
import withTitle from '../../hocs/with-title.hoc';

type Props = {
  loading: boolean,
  permissions: Array<Permission>,
  deleteStaffUser: (id: number) => void,
  updateUserRole: (userId: number, roleId: number) => void,
  createStaffUser: ({ email: string, password: string, role: number }) => void,
  users: Array<UserRole>,
  fetchRoles: () => void,
  classes: Object,
  t: TFunction,
};

export class RoleConfiguration extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchRoles();
  }

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }
    const { t, users, permissions, classes } = this.props;
    return (
      <div className={classes.container}>
        <Typography variant="h5">{t('userRoles')}</Typography>
        <Paper className={classes.paperContainer}>
          <div className={classes.row}>
            <InfoOutlinedIcon fontSize="large" className={classes.leftIcon} />
            <div>
              <Typography>{t('explainStaffDo')}</Typography>
              <Typography color="error">{t('explainStaffDoNot')}</Typography>
            </div>
          </div>
          <UserWithRoleList
            users={users}
            permissions={permissions}
            onChangeRole={this.props.updateUserRole}
            deleteUser={this.props.deleteStaffUser}
            createUser={this.props.createStaffUser}
          />
        </Paper>
        <Typography variant="h5">{t('permissions')}</Typography>
        <Paper className={classes.paperContainer}>
          <PermissionList permissions={permissions} />
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  paperContainer: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
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
});

export default compose(
  withStyles(styles),
  withTranslation(['role']),
  withTitle(({ t }) => t('pageTitle')),
  connect(
    (state) => ({
      loading: state.role.loading,
      users: getUsersWithRole(state),
      permissions: getPermissionsSet(state),
    }),
    {
      fetchRoles: fetchCompanyRoles,
      updateUserRole,
      createStaffUser,
      deleteStaffUser,
    },
  ),
)(RoleConfiguration);
