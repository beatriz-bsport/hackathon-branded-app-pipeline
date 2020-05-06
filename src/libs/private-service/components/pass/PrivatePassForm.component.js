// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';

import NumericInput from '../../../../components/input/NumericInput.component';
import PriceInput from '../../../../components/input/PriceInput.component';

type Props = {
  initial: PrivatePass,
  t: TFunction,
  onSubmit: (data: {
    name: string,
    tax: string,
    credits: number,
    price: string,
    manager_only: boolean,
  }) => void,
  classes: Object,
  onCancel: () => void,
};

type State = {
  name: ?string,
  tax: ?string,
  credits: number,
  price: ?string,
  manager_only: boolean,
};

export class PrivatePassForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.initial) {
      this.state = {
        name: props.initial.name,
        tax: props.initial.tax,
        credits: props.initial.credits,
        price: props.initial.price,
        manager_only: props.initial.manager_only,
        duration_days: props.initial.duration_days,
        duration_months: props.initial.duration_months,
        duration_years: props.initial.duration_years,
      };
    } else {
      this.state = {
        name: null,
        tax: 0,
        credits: 1,
        price: null,
        manager_only: false,
        duration_days: 0,
        duration_months: 0,
        duration_years: 1,
      };
    }
  }

  onSubmit = (ev: SyntheticEvent<HTMLElement>) => {
    ev.preventDefault();
    this.props.onSubmit({
      name: this.state.name,
      tax: this.state.tax,
      credits: this.state.credits,
      price: this.state.price,
      manager_only: this.state.manager_only,
      duration_days: this.state.duration_days,
      duration_months: this.state.duration_months,
      duration_years: this.state.duration_years,
    });
  };

  render() {
    const { t, classes } = this.props;
    return (
      <form onSubmit={this.onSubmit} className={classes.container}>
        <div className={classes.field}>
          <TextField
            value={this.state.name}
            fullWidth
            onChange={(ev) => this.setState({ name: ev.target.value })}
            label={t('privatePass.form.name.label')}
          />
        </div>
        <div className={classes.field}>
          <NumericInput
            value={this.state.credits}
            fullWidth
            onChange={(ev) => this.setState({ credits: ev.target.value })}
            label={t('privatePass.form.credits.label')}
            helperText={t('privatePass.form.credits.helperText')}
          />
        </div>
        <div className={classes.field}>
          <PriceInput
            value={this.state.price}
            fullWidth
            onChange={(ev) => this.setState({ price: ev.target.value })}
            label={t('privatePass.form.price.label')}
          />
        </div>
        <div className={classes.field}>
          <TextField
            value={this.state.tax}
            fullWidth
            onChange={(ev) => this.setState({ tax: ev.target.value })}
            label={t('privatePass.form.tax.label')}
            type="number"
            required
            max={100}
            InputProps={{
              inputProps: { min: 0, max: 100, step: 0.01 },
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
          <div className={classes.durationNbBlock}>
            <div className={classes.row}>
              <Icon className={classes.leftIcon} />
              <NumericInput
                value={this.state.duration_days}
                onChange={(ev) =>
                  this.setState({
                    duration_days: parseInt(ev.target.value, 10),
                  })
                }
                label={t('privatePass.form.durationDays.label')}
                helperText={t('privatePass.form.durationDays.helperText')}
                InputProps={{ min: 0, max: 30, step: 1 }}
                fullWidth
              />
            </div>
            <div className={classes.row}>
              <AddIcon className={classes.leftIcon} />
              <NumericInput
                value={this.state.duration_months}
                onChange={(ev) =>
                  this.setState({
                    duration_months: parseInt(ev.target.value, 10),
                  })
                }
                label={t('privatePass.form.durationMonths.label')}
                helperText={t('privatePass.form.durationMonths.helperText')}
                InputProps={{ min: 0, max: 24, step: 1 }}
                fullWidth
              />
            </div>
            <div className={classes.row}>
              <AddIcon className={classes.leftIcon} />
              <NumericInput
                value={this.state.duration_years}
                onChange={(ev) =>
                  this.setState({
                    duration_years: parseInt(ev.target.value, 10),
                  })
                }
                label={t('privatePass.form.durationYears.label')}
                helperText={t('privatePass.form.durationYears.helperText')}
                InputProps={{ min: 0, max: 30, step: 1 }}
                fullWidth
              />
            </div>
          </div>
        </div>
        <div className={classes.field}>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.manager_only}
                onChange={(ev) =>
                  this.setState({ manager_only: ev.target.checked })
                }
              />
            }
            label={t('privatePass.form.managerOnly.label')}
          />
        </div>
        <div className={classes.buttonContainer}>
          <Button onClick={this.props.onCancel}>
            {t('privatePass.form.actions.cancel')}
          </Button>
          <Button color="primary" type="submit">
            {t('privatePass.form.actions.submit')}
          </Button>
        </div>
      </form>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  field: {
    marginBottom: theme.spacing.unit,
  },
  buttonContainer: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.unit * 2,
  },
  durationNbBlock: {
    marginTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    paddingBottom: 0,
    marginBottom: theme.spacing.unit,
    border: '1px solid #E2E2E2',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(PrivatePassForm);
