import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme as MaterialTheme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { MaterialStyleType } from '../../utils/types';

interface Address {
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  zipcode?: string;
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
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  zipcode?: string;
  country?: string;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = Address;

export class AddressForm extends Component<Props, State> {
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
            required
            autoComplete={autoComplete ? 'addres-line1' : null}
            value={this.state.address_line_1 || this.props.address_line_1}
            name="address_line_1"
            fullWidth
            label={t('form.address.addressLine1')}
            onChange={this.handleChange('address_line_1')}
          />
          <TextField
            name="address_line_2"
            value={this.state.address_line_2 || this.props.address_line_2}
            autoComplete={autoComplete ? 'address-line2' : null}
            fullWidth
            label={t('form.address.addressLine2')}
            onChange={this.handleChange('address_line_2')}
          />
          <Grid container direction="row" spacing={2} className={classes.city}>
            <Grid item>
              <TextField
                name="city"
                value={this.state.city || this.props.city}
                autoComplete={autoComplete ? 'city' : null}
                label={t('form.address.city')}
                required
                onChange={this.handleChange('city')}
              />
            </Grid>
            <Grid item>
              <TextField
                name="zipcode"
                value={this.state.zipcode || this.props.zipcode}
                autoComplete={autoComplete ? 'zipcode' : null}
                label={t('form.address.zipcode')}
                required
                onChange={this.handleChange('zipcode')}
              />
            </Grid>
          </Grid>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <TextField
              name="country"
              value={this.state.country || this.props.country}
              autoComplete={autoComplete ? 'country' : null}
              required
              label={t('form.address.country')}
              onChange={this.handleChange('country')}
            />
          </div>
        </div>
        {(this.props.onCancel || this.props.onSubmit || this.props.onSkip) && (
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-between"
            className={classes.bottomButtons}
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
                direction="row"
                alignItems="center"
                justify="flex-end"
              >
                {this.props.onSkip && (
                  <Button
                    id="btn-signup-skip"
                    color="secondary"
                    onClick={this.onSkip}
                  >
                    {t('common.skip')}
                  </Button>
                )}
                {this.props.onSubmit && (
                  <Button
                    id="btn-signup"
                    color="primary"
                    variant="contained"
                    type="submit"
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
    flexDirection: 'row',
  },
  city: {
    flexDirection: 'row',
  },
  bottomButtons: {
    paddingTop: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(),
)(AddressForm);
