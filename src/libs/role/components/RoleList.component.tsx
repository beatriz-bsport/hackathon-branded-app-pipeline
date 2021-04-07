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
import AddIcon from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/Info';

import { Role, Permission } from '../types';
import { MaterialStyleType } from '../../../utils/types';

import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import RedButton from '../../../components/button/RedButton.component';
import CreateRoleDialog from './CreateRoleDialog.component';
import { getRoleDescription, getRoleName } from '../utils';

type OwnProps = {
  roles: Role[];
  onCreateRole: (data: {
    name: string;
    description: string;
    permissions: Permission;
  }) => void;
  onEditRole: (role: Role) => void;
  onDeleteRole: (role: Role) => void;
};

type WithStateType = {
  openCreateDialog: boolean;
  setOpenCreateDialog: (v: boolean) => void;

  currentRole: null | Role;
  setCurrentRole: (value: null | Role) => void;

  openDeleteDialog: boolean;
  setOpenDeleteDialog: (value: boolean) => void;
};

type Props = OwnProps &
  WithStateType &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export class RoleList extends React.PureComponent<Props> {
  onSubmit = (role: Role) => {
    this.props.setOpenCreateDialog(false);
    typeof role.id === 'number'
      ? this.props.onEditRole(role)
      : this.props.onCreateRole(role);
  };

  render() {
    const { t, classes, roles } = this.props;

    return (
      <List disablePadding>
        {roles.map((role) => (
          <ListItem divider={true} className={classes.item}>
            <div key={role.id}>
              <Typography variant="subtitle2">
                {getRoleName(role, t)}
              </Typography>
              <Typography>{getRoleDescription(role, t)}</Typography>
            </div>

            <ListItemResponsiveAction
              actions={[
                {
                  icon: role.editable ? EditIcon : InfoIcon,
                  label: t('serviceGroup.edit'),
                  color: role.editable ? 'primary' : 'textSecondary',
                  onClick: () => {
                    this.props.setCurrentRole(role);
                    this.props.setOpenCreateDialog(true);
                  },
                },
                role.editable && {
                  icon: DeleteIcon,
                  label: t('serviceGroup.delete'),
                  onClick: () => {
                    this.props.setCurrentRole(role);
                    this.props.setOpenDeleteDialog(true);
                  },
                },
              ]}
            />
          </ListItem>
        ))}

        <div className={classes.buttonContainer}>
          <Button
            variant="outlined"
            color="primary"
            id="button_staff_add"
            onClick={() => {
              this.props.setCurrentRole(null);
              this.props.setOpenCreateDialog(true);
            }}
          >
            <AddIcon className={classes.marginRight} />
            {t('forms.role.create.buttonCreate')}
          </Button>
        </div>

        <CreateRoleDialog
          open={this.props.openCreateDialog}
          onClose={() => {
            this.props.setOpenCreateDialog(false);
            this.props.setCurrentRole(null);
          }}
          role={this.props.currentRole}
          onSubmit={this.onSubmit}
        />

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
  withState('openCreateDialog', 'setOpenCreateDialog', false),
  withState('openDeleteDialog', 'setOpenDeleteDialog', false),
  withState('currentRole', 'setCurrentRole', null),
)(RoleList);
