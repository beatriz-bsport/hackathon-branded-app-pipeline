import React, { PureComponent } from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme as MaterialTheme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { MaterialStyleType } from '../../utils/types';

import { ALLOWED_COUNTRIES_FOR_STATES } from '../../libs/member/constants';

interface Address {
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  zipcode?: string;
  state?: string;
  country?: string;
}

type OwnProps = {
  onCancel?: () => void;
  onSkip?: () => void;
  onSubmit?: (address: Address) => void;
  onChange?: (
    id: string,
  ) => (value: React.ChangeEvent<HTMLInputElement>) => void;
  submitText?: string;
  autoComplete?: boolean;
  companyCountry?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  zipcode?: string;
  state?: string;
  country?: string;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = Address;

export class AddressForm extends PureComponent<Props, State> {
  /*
   Works on controlled or uncontrolled mode, depending on wether onChange
   props was passed.

   if uncontrolled, provides cancel/submit buttons
  */
  state: State = {
    address_line_1: null,
    address_line_2: null,
    city: null,
    zipcode: null,
    state: null,
    country: null,
  };

  handleChange =
    (id: keyof Address) => (event: React.ChangeEvent<HTMLInputElement>) => {
      event.persist();
      if (this.props.onChange) {
        this.props.onChange(id)(event);
      } else {
        this.setState({ [id]: event.target.value });
      }
    };

  onSkip = () => {
    this.props.onSkip();
  };

  onSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.onSubmit(this.state);
  };

  render() {
    const { classes, t, onCancel, autoComplete } = this.props;
    return (
      <form onSubmit={this.onSubmit}>
        <div className={classes.container}>
          <TextField
            fullWidth
            required
            autoComplete={autoComplete ? 'addres-line1' : null}
            className={classes.addressField}
            label={t('form.address.addressLine1')}
            name="address_line_1"
            onChange={this.handleChange('address_line_1')}
            value={this.state.address_line_1 || this.props.address_line_1}
          />
          <TextField
            fullWidth
            autoComplete={autoComplete ? 'address-line2' : null}
            className={classes.addressField}
            label={t('form.address.addressLine2')}
            name="address_line_2"
            onChange={this.handleChange('address_line_2')}
            value={this.state.address_line_2 || this.props.address_line_2}
          />
          <Grid container className={classes.city} direction="row" spacing={2}>
            <Grid item>
              <TextField
                required
                autoComplete={autoComplete ? 'city' : null}
                label={t('form.address.city')}
                name="city"
                onChange={this.handleChange('city')}
                value={this.state.city || this.props.city}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                autoComplete={autoComplete ? 'zipcode' : null}
                label={t('form.address.zipcode')}
                name="zipcode"
                onChange={this.handleChange('zipcode')}
                value={this.state.zipcode || this.props.zipcode}
              />
            </Grid>
            {ALLOWED_COUNTRIES_FOR_STATES.includes(
              this.props.companyCountry,
            ) && (
              <Grid item>
                <TextField
                  required
                  autoComplete={autoComplete ? 'state' : null}
                  label={t('form.address.state')}
                  name="state"
                  onChange={this.handleChange('state')}
                  value={this.state.state || this.props.state}
                />
              </Grid>
            )}
          </Grid>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <TextField
              required
              autoComplete={autoComplete ? 'country' : null}
              className={classes.addressField}
              label={t('form.address.country')}
              name="country"
              onChange={this.handleChange('country')}
              value={this.state.country || this.props.country}
            />
          </div>
        </div>
        {(this.props.onCancel || this.props.onSubmit || this.props.onSkip) && (
          <Grid
            container
            alignItems="center"
            className={classes.bottomButtons}
            direction="row"
            justify="space-between"
          >
            <Grid item>
              {this.props.onCancel && (
                <Button color="secondary" onClick={onCancel}>
                  {t('common.previous')}
                </Button>
              )}
            </Grid>
            <Grid item>
              <Grid
                container
                item
                alignItems="center"
                direction="row"
                justify="flex-end"
              >
                {this.props.onSkip && (
                  <Button
                    color="secondary"
                    id="btn-signup-skip"
                    onClick={this.onSkip}
                  >
                    {t('common.skip')}
                  </Button>
                )}
                {this.props.onSubmit && (
                  <Button
                    color="primary"
                    id="btn-signup"
                    type="submit"
                    variant="contained"
                  >
                    {this.props.submitText || t('form.save')}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
      </form>
    );
  }
}

const styles = (theme: MaterialTheme) => ({
  container: {
    padding: 0,
  },
  street: {
    flexDirection: 'row' as 'row',
  },
  city: {
    flexDirection: 'row' as 'row',
    rowGap: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  bottomButtons: {
    paddingTop: theme.spacing(2),
  },
  addressField: {
    paddingBottom: theme.spacing(2),
  },
});

export default compose<Props, OwnProps>(
  withStyles(styles),
  withTranslation(),
)(AddressForm);
