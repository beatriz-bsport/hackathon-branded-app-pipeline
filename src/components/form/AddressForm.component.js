// @flow
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  onCancel: () => void,
  onSubmit: (data: [*]) => void,
  onChange: ?(id: string) => (Object) => void,
  submitText: ?string,
  autoComplete: ?boolean,
  onSkip: ?() => void,
  address_line_1: ?string,
  address_line_2: ?string,
  city: ?string,
  zipcode: ?string,
  country: ?string,
  t: TFunction,
  classes: Object,
};
type State = {
  address_line_1: ?string,
  address_line_2: ?string,
  city: ?string,
  zipcode: ?string,
  country: ?string,
};

export class AddressForm extends Component<Props, State> {
  /*
   Works on controlled or uncontrolled mode, depending on wether onChange
   props was passed.

   if uncontrolled, provides cancel/submit buttons
  */
  state = {
    address_line_1: null,
    address_line_2: null,
    city: null,
    zipcode: null,
    country: null,
  };

  handleChange = (id: string) => (event: Object) => {
    event.persist();
    if (this.props.onChange) {
      this.props.onChange(id)(event);
    } else {
      this.setState({ [id]: event.target.value });
    }
  };

  collectAddressData = (event: Object) => {
    event.preventDefault();
    if (!this.props.onChange) {
      const {
        address_line_1,
        address_line_2,
        city,
        zipcode,
        country,
      } = this.state;
      this.props.onSubmit({
        address_line_1,
        address_line_2,
        city,
        zipcode,
        country,
      });
    }
  };

  render() {
    const { classes, t, onCancel, autoComplete, onSkip } = this.props;
    return (
      <form onSubmit={this.collectAddressData}>
        <div className={classes.container}>
          <TextField
            required
            autoComplete={autoComplete ? 'addres-line1' : null}
            value={this.state.address_line_1 || this.props.address_line_1}
            shrink={Boolean(
              this.state.address_line_1 || this.props.address_line_1,
            )}
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
            shrink={Boolean(
              this.state.address_line_2 || this.props.address_line_2,
            )}
            label={t('form.address.addressLine2')}
            onChange={this.handleChange('address_line_2')}
          />
          <Grid container direction="row" spacing={16} className={classes.city}>
            <Grid item>
              <TextField
                name="city"
                value={this.state.city || this.props.city}
                autoComplete={autoComplete ? 'city' : null}
                shrink={Boolean(this.state.city || this.props.city)}
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
                shrink={Boolean(this.state.zipcode || this.props.zipcode)}
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
              shrink={Boolean(this.state.country || this.props.country)}
              autoComplete={autoComplete ? 'country' : null}
              required
              label={t('form.address.country')}
              onChange={this.handleChange('country')}
            />
          </div>
        </div>
        {this.props.onChange ? null : (
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-between"
            className={classes.bottomButtons}
          >
            <Grid item>
              <Button color="secondary" onClick={onCancel}>
                {t('common.previous')}
              </Button>
            </Grid>
            <Grid item>
              <Grid
                container
                item
                direction="row"
                alignItems="center"
                justify="flex-end"
              >
                <Button id="btn-signup-skip" color="secondary" onClick={onSkip}>
                  {t('common.skip')}
                </Button>
                <Button
                  id="btn-signup"
                  color="primary"
                  variant="contained"
                  type="submit"
                >
                  {this.props.submitText || t('form.save')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
      </form>
    );
  }
}

const styles = (theme) => ({
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
    paddingTop: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(withNamespaces()(AddressForm));
