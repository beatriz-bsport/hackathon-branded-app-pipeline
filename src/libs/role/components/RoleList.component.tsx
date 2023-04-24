// @ts-nocheck
import React from 'react';
import { compose, withState } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItem,
  Theme,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';

import {
  Role,
  RolePermission,
  FranchiseRole,
  FranchiseRolePermission,
  UserRole,
} from '../types';
import { MaterialStyleType } from '../../../utils/types';

import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import RedButton from '../../../components/button/RedButton.component';
import CreateRoleDialog from './CreateRoleDialog.component';
import CreateFranchiseRoleDialog from '#libs/franchise/components/FranchiseCreateRoleDialog.component';
import { getRoleDescription, getRoleName } from '../utils';

type OwnProps = {
  isFranchisor?: boolean;
  hasOwnerPermission: boolean;
  roles: Role[] | FranchiseRole[];
  onCreateRole: (data: {
    name: string;
    description: string;
    permissions: RolePermission | FranchiseRolePermission;
    has_booking_override_control?: boolean;
  }) => void;
  onEditRole: (role: Role | FranchiseRole) => void;
  onDeleteRole: (role: Role | FranchiseRole) => void;
  users?: UserRole[];
  openCreateRoleDialog: boolean;
  setOpenCreateRoleDialog: (v: boolean) => void;
  currentRole: null | Role | FranchiseRole;
  setCurrentRole: (value: null | Role | FranchiseRole) => void;
};

type WithStateType = {
  openDeleteDialog: boolean;
  setOpenDeleteDialog: (value: boolean) => void;

  openFailDeleteDialog: boolean;
  setOpenFailDeleteDialog: (value: boolean) => void;
};

type Props = OwnProps &
  WithStateType &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export class RoleList extends React.PureComponent<Props> {
  onSubmit = (role: Role | FranchiseRole) => {
    this.props.setOpenCreateRoleDialog(false);
    typeof role.id === 'number'
      ? this.props.onEditRole(role)
      : this.props.onCreateRole(role);
  };

  onCloseCreateRoleDialog = () => {
    this.props.setOpenCreateRoleDialog(false);
    this.props.setCurrentRole(null);
  };

  onDelete = (role: Role | FranchiseRole) => {
    this.props.setCurrentRole(role);
    this.props.setOpenDeleteDialog(true);
  };

  onFailDelete = () => this.props.setOpenFailDeleteDialog(true);

  userHaveRole = (role: Role | FranchiseRole) =>
    this.props.isFranchisor
      ? this.props.users?.some((user) => user.franchise_role === role.id)
      : this.props.users?.some((user) => user.role === role.id);

  render() {
    const { t, classes, roles, isFranchisor, hasOwnerPermission } = this.props;

    return (
      <List disablePadding>
        {roles.map((role) => (
          <ListItem divider className={classes.item}>
            <div key={role.id}>
              <Typography variant="subtitle2">
                {getRoleName(role, t)}
              </Typography>
              <Typography>{getRoleDescription(role, t)}</Typography>
            </div>

            <ListItemResponsiveAction
              actions={[
                ...(hasOwnerPermission
                  ? [
                      {
                        icon: role.editable ? EditIcon : InfoIcon,
                        label: t('serviceGroup.edit'),
                        color: role.editable ? 'primary' : 'textSecondary',
                        onClick: () => {
                          this.props.setCurrentRole(role);
                          this.props.setOpenCreateRoleDialog(true);
                        },
                      },
                    ]
                  : []),
                ...(role.editable && hasOwnerPermission
                  ? [
                      {
                        icon: DeleteIcon,
                        label: t('serviceGroup.delete'),
                        onClick: () => {
                          this.userHaveRole(role)
                            ? this.onFailDelete()
                            : this.onDelete(role);
                        },
                      },
                    ]
                  : []),
              ]}
            />
          </ListItem>
        ))}
        {isFranchisor ? (
          <CreateFranchiseRoleDialog
            open={this.props.openCreateRoleDialog}
            onClose={this.onCloseCreateRoleDialog}
            franchisorRole={this.props.currentRole}
            onSubmit={this.onSubmit}
          />
        ) : (
          <CreateRoleDialog
            open={this.props.openCreateRoleDialog}
            onClose={this.onCloseCreateRoleDialog}
            role={this.props.currentRole}
            onSubmit={this.onSubmit}
          />
        )}

        <Dialog open={this.props.openDeleteDialog}>
          <DialogTitle>{t('forms.role.delete.title')}</DialogTitle>
          <DialogContent>{t('forms.role.delete.content')}</DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.props.setOpenDeleteDialog(false);
              }}
            >
              {t('forms.role.delete.cancel')}
            </Button>
            <RedButton
              onClick={() => {
                this.props.onDeleteRole(this.props.currentRole);
                this.props.setOpenDeleteDialog(false);
              }}
            >
              {t('forms.role.delete.confirm')}
            </RedButton>
          </DialogActions>
        </Dialog>
        <Dialog open={this.props.openFailDeleteDialog}>
          <DialogTitle>{t('forms.role.failDelete.title')}</DialogTitle>
          <DialogContent>{t('forms.role.failDelete.content')}</DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.props.setOpenFailDeleteDialog(false);
              }}
            >
              {t('forms.role.failDelete.close')}
            </Button>
          </DialogActions>
        </Dialog>
      </List>
    );
  }
}

const styles = (theme: Theme) => ({
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marginRight: {
    marginRight: theme.spacing(1),
  },
  buttonContainer: {
    padding: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  withTranslation(['role']),
  // @ts-ignore
  withStyles(styles),
  withState('openDeleteDialog', 'setOpenDeleteDialog', false),
  withState('openFailDeleteDialog', 'setOpenFailDeleteDialog', false),
)(RoleList);
