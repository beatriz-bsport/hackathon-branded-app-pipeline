import React from 'react';
import { compose } from 'recompose';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import {
  ButtonBase,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { cloneDeep } from 'lodash';
import Immutable from 'seamless-immutable';

import { WithTranslation, withTranslation } from 'react-i18next';

import { Permission, Role } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import { getRoleDescription, getRoleName } from '../utils';

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
  appbarActions: true,
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
  },
  restrictedPaths: [],
  navigationMenu: {
    search: true,
    dashboard: true,
    calendar: true,
    schedule: true,
    myClub: true,
    products: true,
    payments: true,
    marketing: true,
    digitalOffer: true,
    member: true,
    reporting: true,
    settings: true,
  },
};

const HIDDEN_PARAMS = ['restrictedPaths', 'navigation', 'checkin'];

type DeepKeyBoolean = { [key: string]: boolean | DeepKeyBoolean };

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
      state.permissions = cloneDeep(props.role.permissions);
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

  /**
   * Return true if all keys = true deeply
   * Return false if all keys = false deeply
   * Return undefined if keys are either false | true
   * If keys have different values return undefined
   * @param obj
   */
  getBooleanOrUndefinedForObject = (obj: DeepKeyBoolean) => {
    let x: boolean | null | undefined = null;

    Object.keys(obj).forEach((key) => {
      let value = obj[key];

      if (typeof value === 'object') {
        value = this.getBooleanOrUndefinedForObject(value);
      }

      if (x === null) {
        x = value;
      }

      if (x !== value) {
        x = undefined;
      }
    });

    return x;
  };

  getValueForKey = (key: string, keysAccumulator: string[]) => {
    let obj: any = this.state.permissions;

    for (let i = 0; i < keysAccumulator.length; i += 1) {
      obj = obj[keysAccumulator[i]];
    }

    if (typeof obj[key] === 'boolean') {
      return obj[key];
    }

    return this.getBooleanOrUndefinedForObject(obj[key]);
  };

  setValuesDeep = (obj: any, value: boolean) => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'boolean') {
        /* eslint-disable-next-line */
        obj[key] = value;
      } else if (typeof obj[key] === 'object') {
        this.setValuesDeep(obj[key], value);
      }
    });
  };

  changeValueForKey = (key: string, keysAccumulator: string[]) => {
    let obj: any = cloneDeep(this.state.permissions);

    for (let i = 0; i < keysAccumulator.length; i += 1) {
      obj = obj[keysAccumulator[i]];
    }

    let toChange = obj[key];

    if (typeof toChange === 'object') {
      const value = this.getBooleanOrUndefinedForObject(toChange);
      this.setValuesDeep(toChange, !value);
    }

    if (typeof toChange === 'boolean') {
      toChange = !toChange;
    }

    const permissions = Immutable(cloneDeep(this.state.permissions)).setIn(
      [...keysAccumulator, key],
      toChange,
    );

    // @ts-ignore
    this.setState({ permissions: cloneDeep(permissions) });
  };

  renderDeepCheckBox = (object: DeepKeyBoolean, keysAccumulator: string[]) => {
    const { classes, t } = this.props;

    const disabled = this.props.role && !this.props.role.editable;

    return (
      <div className={classes.checkboxesContainer}>
        {Object.keys(object).map((key) => {
          if (HIDDEN_PARAMS.includes(key) && !keysAccumulator.length) {
            return null;
          }

          const value = object[key];
          const checked = this.getValueForKey(key, keysAccumulator);

          const label = t(
            `role:rolePermissions.${[...keysAccumulator, key].join(
              '.',
            )}._label`,
          );
          const helpertext = t(
            `role:rolePermissions.${[...keysAccumulator, key].join(
              '.',
            )}._helper`,
          );

          return (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    indeterminate={checked === undefined}
                    checked={!!checked}
                    onChange={() =>
                      this.changeValueForKey(key, keysAccumulator)
                    }
                    name="checkedB"
                    color="primary"
                    disabled={disabled}
                  />
                }
                label={label}
              />
              {!!helpertext && !helpertext.includes('_help') && (
                <div style={{ marginTop: -12, marginLeft: 32 }}>
                  <FormHelperText margin="dense">{helpertext}</FormHelperText>
                </div>
              )}
              {typeof value === 'object' && (
                <div className={classes.innerCheckBoxContainer}>
                  {this.renderDeepCheckBox(value, [...keysAccumulator, key])}
                </div>
              )}
            </>
          );
        })}
      </div>
    );
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
      <Dialog open={this.props.open}>
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

            <div>{this.renderDeepCheckBox(this.state.permissions, [])}</div>

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
  innerCheckBoxContainer: {
    display: 'flex',
    width: '100%',
    paddingLeft: theme.spacing(4),
    borderStyle: 'solid',
    borderWidth: 0,
    borderLeftWidth: 1,
    borderColor: theme.palette.primary.main,
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
