// @ts-nocheck
import React from 'react';
import { compose } from 'recompose';
import cloneDeep from 'lodash/cloneDeep';

import TextField from '@material-ui/core/TextField';
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
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import ConditionalWrapper from '#components/ConditionnalWrapper.component';
import { Actions } from '#components/forms';
import {
  DEFAULT_OBJECT_LEVEL_PERMISSIONS,
  OBJECT_LEVEL_PERMISSIONS_DEPENDENCIES_MAP,
} from '#libs/role/constants';

import { RolePermission, Role, ObjectLevelPermissions } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import {
  deepMerge,
  getRoleDescription,
  getRoleName,
  setAllValuesInObject,
} from '../utils';
import RecursiveCheckBoxComponent from './RecursiveCheckBox.component';
import type { FeatureList } from '#libs/company/types';
import { hasUpsell } from '#libs/platform-billing/utils';
import { UPSELL_IDENTIFIER_ACCESS_MONITORING } from '#libs/platform-billing/upsell-identifiers';

type OwnProps = {
  featureList: FeatureList;
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
  objectLevelPermissions: ObjectLevelPermissions;
  restrictedPathNew: string;
  hasBookingOverrideControl: boolean;
  showAdvanced: boolean;
};

/**
 * `hideAccessMonitoring` is a function that determines whether to hide the access monitoring permission.
 *
 * @function
 * @param {FeatureList} featureList - The list of upsells the company have. If the user is a franchisor, it will be undefined.
 * @param {boolean} isFranchisor - A flag indicating whether the user is a franchisor.
 * @returns {boolean} Returns false if the user is a franchisor, otherwise it checks if the company has the upsell.
 */
const hideAccessMonitoring = (
  featureList: FeatureList,
  isFranchisor: boolean,
) => {
  if (isFranchisor) {
    return true;
  }
  return !hasUpsell(featureList, UPSELL_IDENTIFIER_ACCESS_MONITORING);
};

/**
 * `hideAccessMonitoringStudioOnly` is a function that determines whether to hide the access monitoring permission for studios.
 * If the user is a franchisor, it will return false.
 *
 * @function
 * @param {FeatureList} featureList - The list of upsells the company have. If the user is a franchisor, it will be undefined.
 * @param {boolean} isFranchisor - A flag indicating whether the user is a franchisor.
 * @returns {boolean} Returns false if the user is a franchisor, otherwise it checks if the company has the upsell.
 */
const hideAccessMonitoringStudioOnly = (
  featureList: FeatureList,
  isFranchisor: boolean,
) => {
  if (isFranchisor) {
    return false;
  }
  return !hasUpsell(featureList, UPSELL_IDENTIFIER_ACCESS_MONITORING);
};

const getDefaultPermissions = (
  featureList: FeatureList,
  isFranchisor: boolean,
): RolePermission => ({
  navigationMenu: {
    dashboard: true,
    calendar: true,
    schedule: true,
    ...(!hideAccessMonitoring(featureList, isFranchisor)
      ? {
          accessMonitoring: { perform: false, monitor: false, settings: false },
        }
      : {}),
    myClub: {
      activities: true,
      workshops: true,
      appointments: true,
      teachers: true,
      establishments: true,
      programs: true,
      replacement: true,
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
      cadence: true,
    },
    digitalOffer: {
      videos: true,
      playlists: true,
    },
    inbox: true,
    member: true,
    reporting: true,
    settings: {
      generals: true,
      marketplace: true,
      widgets: true,
      staffs: true,
      personalization: true,
      memberForms: true,
      coachUserspace: true,
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
      quicksale: true,
      referral: true,
    },
    tutorial: true,
  },
  appbarButtons: {
    ledger: true,
    notificationCenter: true,
    communicationAlerts: true,
  },
  navigation: true,
  checkin: false,
  restrictedPaths: [],
});

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
      permissions: getDefaultPermissions(props.featureList, props.isFranchisor),
      objectLevelPermissions: DEFAULT_OBJECT_LEVEL_PERMISSIONS,
      restrictedPathNew: '',
      showAdvanced: false,
      hasBookingOverrideControl: true,
    };

    if (props.role) {
      state.name = props.role.name;
      state.description = props.role.description;
      state.hasBookingOverrideControl = props.role.has_booking_override_control;

      if (props.role.permissions) {
        const rolePermissions = cloneDeep(props.role.permissions);
        if (hideAccessMonitoring(props.featureList, props.isFranchisor)) {
          delete rolePermissions.navigationMenu?.accessMonitoring;
        }
        state.permissions = deepMerge(
          rolePermissions,
          setAllValuesInObject(
            getDefaultPermissions(props.featureList, props.isFranchisor),
            false,
          ),
        ) as RolePermission;
      }

      // By default, if some keys are not found in props.role.object_level_permissions
      // then they are initialized to true
      if (props.role.object_level_permissions) {
        state.objectLevelPermissions = deepMerge(
          cloneDeep(props.role.object_level_permissions),
          setAllValuesInObject(DEFAULT_OBJECT_LEVEL_PERMISSIONS, true),
        ) as ObjectLevelPermissions;
      }
    }
    if (
      hideAccessMonitoringStudioOnly(props.featureList, props.isFranchisor) &&
      !!state.objectLevelPermissions.report.Club?.access_monitoring
    ) {
      delete state.objectLevelPermissions.report.Club.access_monitoring;
    }

    if (!state.permissions.restrictedPaths) {
      state.permissions.restrictedPaths = [];
    }

    return state;
  };

  updateObjectLevelPermissions = (
    objectLevelPermissions: ObjectLevelPermissions,
  ) => {
    this.setState({ objectLevelPermissions });
  };

  onSubmit = (ev: any) => {
    ev.preventDefault();

    const {
      name,
      description,
      permissions,
      objectLevelPermissions,
      hasBookingOverrideControl,
    } = this.state;
    if (!(this.props.isFranchisor || name) || !permissions) return;
    this.props.onSubmit({
      ...this.props.role,
      name,
      description,
      permissions,
      object_level_permissions: objectLevelPermissions,
      has_booking_override_control: hasBookingOverrideControl,
    });
    this.setState({
      name: '',
      description: '',
      permissions: getDefaultPermissions(
        this.props.featureList,
        this.props.isFranchisor,
      ),
      objectLevelPermissions: DEFAULT_OBJECT_LEVEL_PERMISSIONS,
      restrictedPathNew: '',
      hasBookingOverrideControl: true,
    });
  };

  onPrevious = (ev: any) => {
    ev.preventDefault();

    const {
      name,
      description,
      permissions,
      objectLevelPermissions,
      hasBookingOverrideControl,
    } = this.state;
    this.props.onPrevious({
      ...this.props.role,
      name,
      description,
      permissions,
      object_level_permissions: objectLevelPermissions,
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
          <GenericResponsiveDialog
            maxWidth="sm"
            onClose={this.props.onClose}
            open={this.props.open}
          >
            {children}
          </GenericResponsiveDialog>
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
                  required
                  disabled={disabled}
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
                  onChange={(ev) =>
                    this.setState({ description: ev.target.value })
                  }
                  rows={5}
                  value={description}
                  variant="outlined"
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

            <div className={classes.checkboxesContainer}>
              {Object.keys(this.state.objectLevelPermissions).map((key) => (
                <RecursiveCheckBoxComponent
                  key={key}
                  checkBoxData={this.state.objectLevelPermissions}
                  dependencyMap={OBJECT_LEVEL_PERMISSIONS_DEPENDENCIES_MAP}
                  disabled={this.props.role && !this.props.role.editable}
                  keysAccumulator={[key]}
                  keysToHide={['allowed_actions']}
                  permissions={this.state.objectLevelPermissions}
                  rightKey={key}
                  translationKeyPrefix="objectLevelPermissions"
                  updatePermission={this.updateObjectLevelPermissions}
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
                className={classes.advancedOptionsHeader}
                onClick={() =>
                  this.setState((prevState) => ({
                    showAdvanced: !prevState.showAdvanced,
                  }))
                }
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
                        disabled={disabled}
                        onChange={(ev) =>
                          this.onChangeRestrictedPath(ev.target.value, i)
                        }
                        placeholder={t(
                          'forms.role.create.restrictedUrlPlaceholder',
                        )}
                        value={path}
                      />

                      <ButtonBase
                        className={classes.marginLeft}
                        disabled={disabled}
                        onClick={() => this.onClickRemoveRestrictedPath(i)}
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
                    disabled={disabled}
                    onChange={(ev) =>
                      this.setState({ restrictedPathNew: ev.target.value })
                    }
                    placeholder={t(
                      'forms.role.create.restrictedUrlPlaceholder',
                    )}
                    value={this.state.restrictedPathNew}
                  />
                  <ButtonBase
                    className={classes.marginLeft}
                    disabled={disabled}
                    onClick={this.onClickAddRestrictedPath}
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
                            checked={!!this.state.hasBookingOverrideControl}
                            color="secondary"
                            indeterminate={
                              this.state.hasBookingOverrideControl === undefined
                            }
                            name="checkManagerControl"
                            onChange={this.onCheckManagerControl}
                          />
                        }
                        label={
                          <Typography>
                            {t('forms.role.create.authorizeManagerAction')}
                          </Typography>
                        }
                      />
                    </div>
                    <Typography color="textSecondary" variant="caption">
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
              color="secondary"
              onClick={
                this.props.isFranchisor ? this.onPrevious : this.props.onClose
              }
            >
              {this.props.isFranchisor
                ? t('forms.role.franchise.create.buttons.previous')
                : t('forms.user.create.cancel')}
            </Button>
            <Button
              className={classes.marginRight}
              color="primary"
              disabled={disabled && !this.props.isFranchisor}
              onClick={
                disabled && this.props.isFranchisor
                  ? this.props.onClose
                  : this.onSubmit
              }
              variant="contained"
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
    marginRight: {
      marginRight: theme.spacing(3),
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
