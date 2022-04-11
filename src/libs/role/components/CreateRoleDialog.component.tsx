import React from 'react';
import { compose } from 'recompose';
import cloneDeep from 'lodash/cloneDeep';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { ButtonBase, Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import { WithTranslation, withTranslation } from 'react-i18next';

import { Permission, Role } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import {
  deepMerge,
  getRoleDescription,
  getRoleName,
  setAllValuesInObject,
} from '../utils';
import RecursiveCheckBoxComponent from './RecursiveCheckBox.component';

type OwnProps = {
  onSubmit: (data: Role) => void;
  open: boolean;
  role?: Role | null;
  onClose: () => void;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  name: string;
  description: string;
  permissions: Permission;
  restrictedPathNew: string;
  showAdvanced: boolean;
};

const defaultPermissions: Permission = {
  appbarButtons: {
    ledger: true,
    notificationCenter: true,
  },
  navigation: true,
  checkin: false,
  offer: {
    create: true,
    delete: true,
    edit: true,
  },
  member: {
    retrieve: true,
    search: true,
    create: true,
  },
  restrictedPaths: [],
  navigationMenu: {
    dashboard: true,
    calendar: true,
    schedule: true,
    myClub: {
      activities: true,
      workshops: true,
      appointments: true,
      teachers: true,
      establishments: true,
      programs: true,
    },
    products: {
      paymentPack: true,
      privatePass: true,
      shop: true,
      packs: true,
      giftcards: true,
      promotions: true,
      contracts: true,
    },
    payments: {
      billings: true,
      directDebits: true,
      teachers: true,
      orders: true,
      expenses: true,
      installments: true,
      clockIn: {
        selfClockIn: true,
        clockInForOther: false,
        canAccessHistory: false,
      },
    },
    marketing: {
      templates: true,
      customForms: true,
      smartlists: true,
      notifications: true,
      tags: true,
      strategies: true,
    },
    digitalOffer: {
      videos: true,
      playlists: true,
    },
    member: true,
    reporting: true,
    settings: {
      generals: true,
      marketplace: true,
      widgets: true,
      staffs: true,
      personalization: true,
      memberForms: true,
      liveStreaming: true,
      transactionnalEmail: true,
      teacherPayrollRules: true,
      paymentMethods: true,
      company: true,
      billing: true,
      waitingList: true,
      webShop: true,
      webHook: true,
      partnership: true,
      quickBooks: true,
      activeCampaign: true,
      subscription: true,
      mobilePersonalization: true,
    },
  },
};

const HIDDEN_PARAMS = [
  'restrictedPaths',
  'navigation',
  'checkin',
  'appbarActions',
  'navigationMenu.search',
];

export class CreateRoleDialog extends React.Component<Props, State> {
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
      restrictedPathNew: '',
      showAdvanced: false,
    };

    if (props.role) {
      state.name = props.role.name;
      state.description = props.role.description;
      state.permissions = deepMerge(
        cloneDeep(props.role.permissions),
        setAllValuesInObject(defaultPermissions, false),
      ) as Permission;
    }

    if (!state.permissions.restrictedPaths) {
      state.permissions.restrictedPaths = [];
    }

    return state;
  };

  onSubmit = (ev: any) => {
    ev.preventDefault();

    const { name, description, permissions } = this.state;
    if (!name || !permissions) return;
    this.props.onSubmit({
      ...this.props.role,
      name,
      description,
      permissions,
    });
    this.setState({
      name: '',
      description: '',
      permissions: defaultPermissions,
      restrictedPathNew: '',
    });
  };

  onClickAddRestrictedPath = () => {
    this.setState((prevState: State) => {
      const permissions = cloneDeep(prevState.permissions);
      permissions.restrictedPaths.push(prevState.restrictedPathNew);
      return {
        permissions,
        restrictedPathNew: '',
      };
    });
  };

  onChangeRestrictedPath = (value: string, i: number) => {
    this.setState((prevState: State) => {
      const permissions = cloneDeep(prevState.permissions);
      permissions.restrictedPaths[i] = value;
      return {
        permissions,
      };
    });
  };

  onClickRemoveRestrictedPath = (i: number) => {
    this.setState((prevState: State) => {
      const permissions = cloneDeep(prevState.permissions);
      permissions.restrictedPaths.splice(i, 1);
      return {
        permissions,
      };
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
      <Dialog open={this.props.open} onClose={this.props.onClose}>
        <form onSubmit={this.onSubmit} id="role-creation-form">
          <DialogTitle>{t('forms.role.create.title')}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              value={name}
              onChange={(ev) => this.setState({ name: ev.target.value })}
              label={t('forms.role.create.name')}
              required
              disabled={disabled}
            />
            <TextField
              fullWidth
              value={description}
              className={classes.marginTop4}
              onChange={(ev) => this.setState({ description: ev.target.value })}
              label={t('forms.role.create.description')}
              variant="outlined"
              multiline
              rows={5}
              required
              disabled={disabled}
            />

            <div className={classes.marginTop2} />
            <Typography variant="h6">
              {t('forms.role.create.permissions')}
            </Typography>
            <div className={classes.marginTop1} />

            <div className={classes.checkboxesContainer}>
              {Object.keys(this.state.permissions)
                .filter((key) => !HIDDEN_PARAMS.includes(key))
                .map((key) => (
                  <RecursiveCheckBoxComponent
                    key={key}
                    rightKey={key}
                    checkBoxData={this.state.permissions}
                    keysAccumulator={[key]}
                    disabled={this.props.role && !this.props.role.editable}
                    permissions={this.state.permissions}
                    updatePermission={(permissions) => {
                      this.setState({
                        permissions,
                      });
                    }}
                  />
                ))}
            </div>

            <div className={classes.marginTop4} />

            {!this.state.showAdvanced ? (
              <ButtonBase onClick={() => this.setState({ showAdvanced: true })}>
                <Typography color="primary">
                  {t('forms.role.create.showAdvanced')}
                </Typography>
              </ButtonBase>
            ) : (
              <>
                <Typography variant="h6">
                  {t('forms.role.create.restrictedUrl')}
                </Typography>
                <Typography>
                  {t('forms.role.create.restrictedUrlExplain')}
                </Typography>
                <div className={classes.marginTop1} />
                {this.state.permissions.restrictedPaths.map((path, i) => {
                  return (
                    <div className={classes.restrictedPathContainer}>
                      <TextField
                        fullWidth
                        value={path}
                        onChange={(ev) =>
                          this.onChangeRestrictedPath(ev.target.value, i)
                        }
                        placeholder={t(
                          'forms.role.create.restrictedUrlPlaceholder',
                        )}
                        disabled={disabled}
                      />

                      <ButtonBase
                        className={classes.marginLeft}
                        onClick={() => this.onClickRemoveRestrictedPath(i)}
                        disabled={disabled}
                      >
                        <RemoveCircleIcon
                          color={disabled ? 'disabled' : 'error'}
                        />
                      </ButtonBase>
                    </div>
                  );
                })}

                <div className={classes.restrictedPathContainer}>
                  <TextField
                    fullWidth
                    value={this.state.restrictedPathNew}
                    onChange={(ev) =>
                      this.setState({ restrictedPathNew: ev.target.value })
                    }
                    placeholder={t(
                      'forms.role.create.restrictedUrlPlaceholder',
                    )}
                    disabled={disabled}
                  />
                  <ButtonBase
                    onClick={this.onClickAddRestrictedPath}
                    className={classes.marginLeft}
                    disabled={disabled}
                  >
                    <AddIcon color={disabled ? 'disabled' : 'primary'} />
                  </ButtonBase>
                </div>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} color="secondary">
              {t('forms.user.create.cancel')}
            </Button>
            <Button
              disabled={disabled}
              type="submit"
              color="primary"
              form="role-creation-form"
            >
              {t('forms.user.create.submit')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

const styles = (theme: Theme) => ({
  checkboxesContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  restrictedPathContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    height: 45,
  },
  marginTop1: {
    marginTop: theme.spacing(1),
  },
  marginTop2: {
    marginTop: theme.spacing(2),
  },
  marginTop4: {
    marginTop: theme.spacing(4),
  },
  marginLeft: {
    marginLeft: theme.spacing(1),
  },
  dialogActionContainer: {
    position: 'absolute',
    width: '100%',
    height: 50,
    bottom: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default compose<any, OwnProps>(
  withTranslation(['role']),
  withStyles(styles),
)(CreateRoleDialog);
