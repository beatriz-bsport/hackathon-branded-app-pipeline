// @ts-nocheck
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import AddIcon from '@material-ui/icons/Add';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import { TFunction } from 'i18next';
import { Backdrop, CircularProgress, Theme } from '@material-ui/core';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import RoleList from '#libs/role/components/RoleList.component';
import {
  fetchCompanyRoles,
  fetchFranchiseRoles,
  createFranchiseRole,
  updateFranchiseRole,
  deleteFranchiseRole,
} from '#libs/role/actions';
import {
  getUsersWithRole,
  getAllFranchiseRoles,
  withFranchiseeRoles,
  hasFranchiseRoleUpsertPermission,
} from '#libs/role/selectors';
// @ts-expect-error
import withTitle from '#hocs/with-title.hoc';
import { RootState } from '../../../reducers';
import { MaterialStyleType } from '../../../utils/types';
import { FranchiseRole, Role } from '#libs/role/types';
import BottomActionsButtonCustom from '#components/button/BottomActionsButtonCustom.component';

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>> &
  State;

type State = {
  openCreateRoleDialog: boolean;
  currentRole: null | Role | FranchiseRole;
};

export class RoleConfiguration extends React.Component<Props, State> {
  state: State = {
    currentRole: null,
    openCreateRoleDialog: false,
  };

  setOpenCreateRoleDialog = (value: boolean) => {
    this.setState({ openCreateRoleDialog: value });
  };

  setCurrentRole = (value: null | Role | FranchiseRole) => {
    this.setState({ currentRole: value });
  };

  componentDidMount() {
    this.props.fetchCompanyRoles();
    this.props.fetchFranchiseRoles();
  }

  createFranchiseRole = (franchiseRole: FranchiseRole) => {
    this.props.createFranchiseRole(franchiseRole, {
      onSuccess: () => this.props.fetchCompanyRoles(),
    });
  };

  updateFranchiseRole = (franchiseRole: FranchiseRole) => {
    this.props.updateFranchiseRole(franchiseRole, {
      onSuccess: () => this.props.fetchCompanyRoles(),
    });
  };

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }

    const { t, roles, classes } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.rolePaper} id="text_staff_roles">
          <RoleList
            isFranchisor
            currentRole={this.state.currentRole}
            hasOwnerPermission={this.props.hasOwnerPermission}
            onCreateRole={this.createFranchiseRole}
            onDeleteRole={this.props.deleteFranchiseRole}
            onEditRole={this.updateFranchiseRole}
            openCreateRoleDialog={this.state.openCreateRoleDialog}
            roles={roles}
            setCurrentRole={this.setCurrentRole}
            setOpenCreateRoleDialog={this.setOpenCreateRoleDialog}
            users={this.props.users}
          />
        </Paper>
        <BottomActionsButtonCustom
          buttonsProperties={[
            {
              onClick: this.setOpenCreateRoleDialog,
              text: t('forms.role.create.buttonCreate'),
              icon: <AddIcon />,
              color: 'primary',
            },
          ]}
        />
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
  rolePaper: {
    marginTop: theme.spacing(1),
  },
  backdrop: {
    zIndex: 999,
  },
});

const mapStateToProps = (state: RootState) => ({
  hasOwnerPermission: hasFranchiseRoleUpsertPermission(state),
  loading: state.role.loading,
  users: getUsersWithRole(state),
  roles: withFranchiseeRoles(getAllFranchiseRoles)(state),
  updateLoading: state.role.role.createOrUpdate.loading,
});

const mapDispatchToProps = {
  fetchCompanyRoles,
  fetchFranchiseRoles,
  createFranchiseRole,
  updateFranchiseRole,
  deleteFranchiseRole,
};

export default compose(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['role']),
  withTitle(({ t }: { t: TFunction }) => t('navigation:franchiseMenu.staff')),
  connect(mapStateToProps, mapDispatchToProps),
)(RoleConfiguration);
