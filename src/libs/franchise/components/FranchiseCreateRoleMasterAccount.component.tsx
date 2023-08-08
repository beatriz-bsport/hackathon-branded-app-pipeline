// @ts-nocheck
import React from 'react';
import { compose } from 'recompose';
import cloneDeep from 'lodash/cloneDeep';
import InfoIcon from '@material-ui/icons/Info';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Divider, Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { createStyles, Theme } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';

import { WithTranslation, withTranslation } from 'react-i18next';
import { Actions, Submit } from '#components/forms';

import {
  FranchiseRolePermission,
  FranchiseRoleMasterAccountData,
} from '#libs/role/types';
import { MaterialStyleType } from '../../../utils/types';
import {
  deepMerge,
  getRoleDescription,
  getRoleName,
  setAllValuesInObject,
} from '#libs/role/utils';
import RecursiveCheckBoxComponent from '#libs/role/components/RecursiveCheckBox.component';

type OwnProps = {
  onNext: (data: FranchiseRoleMasterAccountData) => void;
  open: boolean;
  role?: FranchiseRoleMasterAccountData | null;
  onClose: () => void;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  name: string;
  description: string;
  permissions: FranchiseRolePermission;
};

const defaultPermissions: FranchiseRolePermission = {
  franchiseMenu: {
    franchises: true,
    members: true,
    products: {
      paymentPackTemplates: true,
      privatePassTemplates: true,
      giftcardTemplates: true,
      couponTemplates: true,
    },
    emailTemplates: true,
    tag: true,
    notificationRules: true,
    reporting: true,
    widgets: true,
    staff: true,
    settings: true,
  },
};

const FRANCHISE_ROLE_NAME_MAX_LENGTH = 50;

export class CreateRoleMasterAccountDialog extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = this.getInitialState(props);
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.role !== this.props.role) {
      const state = this.getInitialState(this.props);
      this.setState({ ...state });
    }
  };

  getInitialState = (props: Props) => {
    const state = {
      name: '',
      description: '',
      permissions: defaultPermissions,
    };

    if (props.role) {
      state.name = props.role.name;
      state.description = props.role.description;
      if (props.role.permissions) {
        state.permissions = deepMerge(
          cloneDeep(props.role.permissions),
          setAllValuesInObject(defaultPermissions, false),
        ) as FranchiseRolePermission;
      }
    }

    return state;
  };

  onNext = (ev: any) => {
    ev.preventDefault();

    const { name, description, permissions } = this.state;
    if (!name || !permissions) return;
    this.props.onNext({
      ...this.props.role,
      name,
      description,
      permissions,
    });
  };

  render() {
    const { t, classes } = this.props;

    const disabled = this.props.role && !this.props.role.editable;

    const name = disabled ? getRoleName(this.props.role, t) : this.state.name;

    const description = disabled
      ? getRoleDescription(this.props.role, t)
      : this.state.description;

    return (
      <form id="role-creation-form" onSubmit={this.onNext}>
        <div className={classes.content}>
          <div className={classes.infoText}>
            <InfoIcon color="action" />
            <Typography variant="h6">
              {t('forms.user.create.generalInfo.title')}
            </Typography>
          </div>
          <TextField
            fullWidth
            required
            disabled={disabled}
            inputProps={{ maxLength: FRANCHISE_ROLE_NAME_MAX_LENGTH }}
            label={t('forms.role.create.name')}
            onChange={(ev) => this.setState({ name: ev.target.value })}
            value={name}
          />
          <TextField
            fullWidth
            multiline
            required
            className={classes.marginTop4}
            disabled={disabled}
            label={t('forms.role.create.description')}
            onChange={(ev) => this.setState({ description: ev.target.value })}
            rows={5}
            value={description}
            variant="outlined"
          />

          <Divider className={classes.divider} />

          <div className={classes.infoText}>
            <CheckIcon color="action" />
            <Typography variant="h6">
              {t('forms.role.create.permissions')}
            </Typography>
          </div>
          <div className={classes.checkboxesContainer}>
            {Object.keys(this.state.permissions).map((key) => (
              <RecursiveCheckBoxComponent
                key={key}
                checkBoxData={this.state.permissions}
                disabled={this.props.role && !this.props.role.editable}
                keysAccumulator={[key]}
                permissions={this.state.permissions}
                rightKey={key}
                updatePermission={(permissions) => {
                  this.setState({
                    permissions,
                  });
                }}
              />
            ))}
          </div>

          <Divider className={classes.divider} />
        </div>
        <Actions>
          <Button color="secondary" onClick={this.props.onClose}>
            {t('forms.user.create.cancel')}
          </Button>
          <Submit form="role-creation-form">
            {t('forms.role.franchise.create.buttons.next')}
          </Submit>
        </Actions>
      </form>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    content: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    divider: {
      marginLeft: theme.spacing(-7),
      marginRight: theme.spacing(-7),
      marginTop: theme.spacing(4),
    },
    checkboxesContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      marginTop: theme.spacing(1),
    },
    infoText: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(2),
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(2),
    },
    marginTop4: {
      marginTop: theme.spacing(4),
    },
  });

export default compose<any, OwnProps>(
  withTranslation(['role']),
  withStyles(styles),
)(CreateRoleMasterAccountDialog);
