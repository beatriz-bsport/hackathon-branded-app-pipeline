import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Backdrop, CircularProgress, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { TFunction } from 'i18next';
import UserWithRoleList from '../../libs/role/components/UserWithRoleList.component';
import RoleList from '../../libs/role/components/RoleList.component';
import {
  fetchCompanyUserRoles,
  updateUserRole,
  deleteStaffUser,
  createStaffUser,
  createCompanyRole,
  updateCompanyRole,
  deleteCompanyRole,
} from '../../libs/role/actions';
import { getUsersWithRole, getAllRoles } from '../../libs/role/selectors';
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
  }

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }

    const { t, users, roles, classes } = this.props;

    return (
      <div className={classes.container}>
        <Typography variant="h5">{t('userRoles')}</Typography>
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
            onChangeRole={this.props.updateUserRole}
            deleteUser={this.props.deleteStaffUser}
            createUser={this.props.createStaffUser}
          />
        </Paper>
        <Typography variant="h5">{t('permissions')}</Typography>
        <Paper id="text_staff_roles" className={classes.rolePaper}>
          <RoleList
            roles={roles}
            onCreateRole={(role) => this.props.createCompanyRole(role)}
            onEditRole={(role) => this.props.updateCompanyRole(role)}
            onDeleteRole={(role) => this.props.deleteCompanyRole(role)}
          />
        </Paper>

        <Backdrop
          className={classes.backdrop}
          open={this.props.updateLoading}
          onClick={() => null}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
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
  loading: state.role.loading,
  users: getUsersWithRole(state),
  roles: getAllRoles(state),
  updateLoading: state.role.role.createOrUpdate.loading,
});

const mapDispatchToProps = {
  fetchCompanyUserRoles,
  updateUserRole,
  createStaffUser,
  deleteStaffUser,
  createCompanyRole,
  updateCompanyRole,
  deleteCompanyRole,
};

export default compose(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['role']),
  withTitle(({ t }: { t: TFunction }) => t('pageTitle')),
  connect(mapStateToProps, mapDispatchToProps),
)(RoleConfiguration);
