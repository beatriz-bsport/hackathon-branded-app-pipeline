import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { TFunction } from 'i18next';
import AddIcon from '@material-ui/icons/Add';
import { Backdrop, CircularProgress, Divider, Theme } from '@material-ui/core';
import UserWithRoleList from '#src/libs/role/components/UserWithRoleList.component';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import RoleList from '#src/libs/role/components/RoleList.component';
import { Role, FranchiseRole } from '#src/libs/role/types';
import {
  fetchCompanyUserRoles,
  updateUserRole,
  deleteStaffUser,
  createStaffUser,
  createCompanyRole,
  updateCompanyRole,
  deleteCompanyRole,
  updateUserCommission,
} from '#src/libs/role/actions';
import {
  getUsersWithRole,
  getAllRoles,
  hasRoleUpsertPermission,
} from '#src/libs/role/selectors';
import { fetchAssociatedCoachesList } from '#src/libs/associated-coach/actions';
import { getActiveCoaches } from '#src/libs/associated-coach/selectors';
import BottomActionsButtonCustom from '#src/components/button/BottomActionsButtonCustom.component';
import {
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
  fetchEstablishments as fetchEstablishmentsAction,
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
} from '#src/libs/establishment/actions';
import {
  getAvailableEstablishmentList,
  getAssociatedEstablishmentGroup,
  getEnabledEstablishmentBillingGroups,
} from '#src/libs/establishment/selectors';
import { getTheme } from '#src/libs/theme/selectors';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import { UPSELL_IDENTIFIER_ACCESS_MONITORING } from '#src/libs/platform-billing/upsell-identifiers';
import { MaterialStyleType } from '../../utils/types';
import { RootState } from '../../reducers';
import withTitle from '../../hocs/with-title.hoc';

type ConnectedProps = WithTranslation &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  ReturnType<typeof mapStateToProps> &
  State;

type State = {
  openCreateStaffDialog: boolean;
  openCreateRoleDialog: boolean;
  currentRole: null | Role | FranchiseRole;
};

export class RoleConfiguration extends React.Component<ConnectedProps, State> {
  state: State = {
    openCreateStaffDialog: false,
    currentRole: null,
    openCreateRoleDialog: false,
  };

  setOpenCreateStaffDialog = (value: boolean) =>
    this.setState({ openCreateStaffDialog: value });

  setOpenCreateRoleDialog = (value: boolean) => {
    this.setState({ openCreateRoleDialog: value });
  };

  setCurrentRole = (value: null | Role | FranchiseRole) => {
    this.setState({ currentRole: value });
  };

  componentDidMount() {
    this.props.fetchCompanyUserRoles();
    this.props.fetchAssociatedCoachesList();
    if (this.props.theme?.enable_multi_localization) {
      this.props.fetchEstablishmentGroups();
      this.props.fetchEstablishmentBillingGroups({
        ...(this.props.theme?.company && {
          params: { company: this.props.theme.company },
        }),
      });
    }
    if (
      hasUpsell(this.props.featureList, UPSELL_IDENTIFIER_ACCESS_MONITORING)
    ) {
      this.props.fetchEstablishments();
    }
  }

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }

    const {
      t,
      users,
      roles,
      classes,
      hasOwnerPermission,
      establishmentBillingGroups,
    } = this.props;

    return (
      <div className={classes.container}>
        <Typography className={classes.sectionTitle} variant="h5">
          {t('userRoles')}
        </Typography>
        <Divider className={classes.divider} />
        <Paper className={classes.usersRolePaper}>
          {this.props.createOrUpdateLoading && <LinearProgress />}

          <div className={classes.row}>
            <InfoOutlinedIcon className={classes.leftIcon} fontSize="large" />
            <div>
              <Typography>{t('explainStaffDo')}</Typography>
              <Typography color="error">{t('explainStaffDoNot')}</Typography>
            </div>
          </div>
          <UserWithRoleList
            coachList={this.props.coachList}
            coachListLoading={this.props.coachListLoading}
            createUserRole={this.props.createStaffUser}
            deleteUserRole={this.props.deleteStaffUser}
            establishmentBillingGroups={establishmentBillingGroups}
            // @ts-expect-error
            establishmentGroupList={this.props.establishmentGroupList}
            establishmentGroupListLoading={
              this.props.establishmentGroupListLoading
            }
            establishmentList={this.props.establishmentList}
            establishmentListLoading={this.props.establishmentListLoading}
            hasAccessMonitoringUpsell={hasUpsell(
              this.props.featureList,
              UPSELL_IDENTIFIER_ACCESS_MONITORING,
            )}
            hasMultiLocationUpsell={this.props.theme?.enable_multi_localization}
            hasOwnerPermission={hasOwnerPermission}
            openCreateStaffDialog={this.state.openCreateStaffDialog}
            roles={roles}
            setOpenCreateStaffDialog={this.setOpenCreateStaffDialog}
            updateCommission={this.props.updateUserCommission}
            updateUserRole={this.props.updateUserRole}
            // @ts-expect-error
            users={users}
          />
        </Paper>
        <Typography className={classes.sectionTitle} variant="h5">
          {t('permissions')}
        </Typography>
        <Divider className={classes.divider} />
        <Paper className={classes.rolePaper} id="text_staff_roles">
          <RoleList
            currentRole={this.state.currentRole}
            displayNewWebshop={this.props.theme?.display_new_webshop}
            // @ts-expect-error
            featureList={this.props.featureList}
            hasOwnerPermission={hasOwnerPermission}
            // @ts-expect-error
            onCreateRole={(role) => this.props.createCompanyRole(role)}
            // @ts-expect-error
            onDeleteRole={(role) => this.props.deleteCompanyRole(role)}
            // @ts-expect-error
            onEditRole={(role) => this.props.updateCompanyRole(role)}
            openCreateRoleDialog={this.state.openCreateRoleDialog}
            roles={roles}
            setCurrentRole={this.setCurrentRole}
            setOpenCreateRoleDialog={this.setOpenCreateRoleDialog}
          />
        </Paper>

        <Backdrop className={classes.backdrop} open={this.props.updateLoading}>
          <CircularProgress color="primary" />
        </Backdrop>
        <BottomActionsButtonCustom
          buttonsProperties={[
            {
              // @ts-expect-error
              onClick: this.setOpenCreateStaffDialog,
              text: t('forms.user.create.buttonLabel'),
              icon: <AddIcon />,
            },
            {
              // @ts-expect-error
              onClick: this.setOpenCreateRoleDialog,
              text: t('forms.role.create.buttonCreate'),
              icon: <AddIcon />,
            },
          ]}
        />
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
    paddingBottom: '20vh',
  },
  usersRolePaper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  rolePaper: {
    marginTop: theme.spacing(1),
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
  leftIcon: {
    marginRight: theme.spacing(2),
  },
});

const mapStateToProps = (state: RootState) => ({
  hasOwnerPermission: hasRoleUpsertPermission(state),
  loading: state.role.loading,
  createOrUpdateLoading: state.role.createOrUpdate.loading,
  users: getUsersWithRole(state),
  roles: getAllRoles(state),
  updateLoading: state.role.role.createOrUpdate.loading,
  coachList: getActiveCoaches(state),
  coachListLoading: state.coach.loading,
  featureList: state.company.feature.data,
  theme: getTheme(state),
  establishmentListLoading: state.establishment.loading,
  establishmentList: getAvailableEstablishmentList(state),
  establishmentGroupListLoading: state.establishment.establishmentGroup.loading,
  establishmentGroupList: getAssociatedEstablishmentGroup(state),
  establishmentBillingGroups: getEnabledEstablishmentBillingGroups(state),
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
  fetchEstablishments: fetchEstablishmentsAction,
  fetchEstablishmentGroups: fetchAllEstablishmentGroupAction,
  fetchEstablishmentBillingGroups: fetchAllEstablishmentBillingGroupAction,
  updateUserCommission,
};

export default compose(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['role']),
  withTitle(({ t }: { t: TFunction }) => t('pageTitle')),
  connect(mapStateToProps, mapDispatchToProps),
)(RoleConfiguration);
