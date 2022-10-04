import React from 'react';
import { compose } from 'recompose';
import cloneDeep from 'lodash/cloneDeep';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { ButtonBase, Collapse, Divider, Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { createStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import LinkIcon from '@material-ui/icons/Link';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { WithTranslation, withTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Actions } from '#components/forms';

import { RolePermission, Role } from '../types';
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
  onPrevious?: (data: any) => void;
  isFranchisor?: boolean;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  name: string;
  description: string;
  permissions: RolePermission;
  restrictedPathNew: string;
  hasBookingOverrideControl: boolean;
  showAdvanced: boolean;
};

const defaultPermissions: RolePermission = {
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
    tutorial: true,
  },
};

const HIDDEN_PARAMS = [
  'restrictedPaths',
  'navigation',
  'checkin',
  'appbarActions',
  'navigationMenu.search',
];

const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: {
  condition: boolean;
  wrapper: (children: React.ReactElement) => React.ReactElement;
  children: React.ReactElement;
}) => (condition ? wrapper(children) : children);

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
      hasBookingOverrideControl: true,
    };

    if (props.role) {
      state.name = props.role.name;
      state.description = props.role.description;
      if (props.role.permissions) {
        state.permissions = deepMerge(
          cloneDeep(props.role.permissions),
          setAllValuesInObject(defaultPermissions, false),
        ) as RolePermission;
        state.hasBookingOverrideControl =
          props.role.has_booking_override_control;
      }
    }

    if (!state.permissions.restrictedPaths) {
      state.permissions.restrictedPaths = [];
    }

    return state;
  };

  onSubmit = (ev: any) => {
    ev.preventDefault();

    const { name, description, permissions, hasBookingOverrideControl } =
      this.state;
    if (!(this.props.isFranchisor || name) || !permissions) return;
    this.props.onSubmit({
      ...this.props.role,
      name,
      description,
      permissions,
      has_booking_override_control: hasBookingOverrideControl,
    });
    this.setState({
      name: '',
      description: '',
      permissions: defaultPermissions,
      restrictedPathNew: '',
      hasBookingOverrideControl: true,
    });
  };

  onPrevious = (ev: any) => {
    ev.preventDefault();

    const { name, description, permissions, hasBookingOverrideControl } =
      this.state;
    this.props.onPrevious({
      ...this.props.role,
      name,
      description,
      permissions,
      has_booking_override_control: hasBookingOverrideControl,
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

  onCheckManagerControl = () => {
    this.setState((prevState: State) => ({
      hasBookingOverrideControl: !prevState.hasBookingOverrideControl,
    }));
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

    const showAdvancedSection =
      this.state.showAdvanced ||
      this.state.permissions.restrictedPaths.length > 0;

    return (
      <ConditionalWrapper
        condition={!this.props.isFranchisor}
        wrapper={(children) => (
          <Dialog open={this.props.open} onClose={this.props.onClose}>
            {children}
          </Dialog>
        )}
      >
        <form id="role-creation-form">
          {!this.props.isFranchisor && (
            <DialogTitle>{t('forms.role.create.title')}</DialogTitle>
          )}
          <div className={classes.content}>
            {!this.props.isFranchisor && (
              <>
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
                  onChange={(ev) =>
                    this.setState({ description: ev.target.value })
                  }
                  label={t('forms.role.create.description')}
                  variant="outlined"
                  multiline
                  rows={5}
                  required
                  disabled={disabled}
                />
                <div className={classes.marginTop2} />
              </>
            )}

            <div className={classes.infoText}>
              <CheckIcon color="action" />
              <Typography variant="h6">
                {t('forms.role.create.permissions')}
              </Typography>
            </div>
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

            <Divider
              className={classNames({
                [classes.divider]: !this.props.isFranchisor,
                [classes.dividerFranchisor]: this.props.isFranchisor,
              })}
            />
            <div className={classes.advancedOptionsSection}>
              <ButtonBase
                onClick={() =>
                  this.setState((prevState) => ({
                    showAdvanced: !prevState.showAdvanced,
                  }))
                }
                className={classes.advancedOptionsHeader}
              >
                <LinkIcon />
                <Typography variant="h6">
                  {t('forms.role.create.restrictedUrl')}
                </Typography>
                {showAdvancedSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ButtonBase>
              <Collapse in={showAdvancedSection}>
                <div className={classes.marginTop4} />
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
                {!disabled && (
                  <>
                    <div className={classes.checkboxManagerContainer}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            indeterminate={
                              this.state.hasBookingOverrideControl === undefined
                            }
                            checked={!!this.state.hasBookingOverrideControl}
                            onChange={this.onCheckManagerControl}
                            name="checkManagerControl"
                            color="secondary"
                          />
                        }
                        label={
                          <Typography>
                            {t('forms.role.create.authorizeManagerAction')}
                          </Typography>
                        }
                      />
                    </div>
                    <Typography variant="caption" color="textSecondary">
                      {t('forms.role.create.authorizeManagerExplain')}
                    </Typography>
                  </>
                )}
              </Collapse>
            </div>
            <Divider
              className={classNames({
                [classes.divider]: !this.props.isFranchisor,
                [classes.dividerFranchisor]: this.props.isFranchisor,
              })}
            />
          </div>
          <Actions>
            <Button
              onClick={
                this.props.isFranchisor ? this.onPrevious : this.props.onClose
              }
              color="secondary"
            >
              {this.props.isFranchisor
                ? t('forms.role.franchise.create.buttons.previous')
                : t('forms.user.create.cancel')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={
                disabled && this.props.isFranchisor
                  ? this.props.onClose
                  : this.onSubmit
              }
              disabled={disabled && !this.props.isFranchisor}
            >
              {disabled && this.props.isFranchisor
                ? t('forms.role.franchise.create.buttons.close')
                : t('forms.user.create.submit')}
            </Button>
          </Actions>
        </form>
      </ConditionalWrapper>
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
      marginLeft: theme.spacing(-3),
      marginRight: theme.spacing(-3),
    },
    dividerFranchisor: {
      marginLeft: theme.spacing(-7),
      marginRight: theme.spacing(-7),
    },
    checkboxManagerContainer: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
    },
    checkboxesContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    infoText: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(2),
      marginBottom: theme.spacing(3),
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
    advancedOptionsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: theme.spacing(2),
    },
    advancedOptionsSection: {
      display: 'flex',
      flexDirection: 'column',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  });

export default compose<any, OwnProps>(
  withTranslation(['role']),
  withStyles(styles),
)(CreateRoleDialog);
