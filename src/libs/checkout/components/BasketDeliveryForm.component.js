// @flow

import React from 'react';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import AddressForm from '../../../components/form/AddressForm.component';
import type { Basket } from '../types';

type Props = {
  basket: Basket,
  onSubmit: (data: *) => void,
  loading: boolean,
  onCancel: () => void,

  t: TFunction,
  classes: Object,
};

type State = {
  first_name: string,
  last_name: string,
  address_line_1: string,
  address_line_2: string,
  zipcode: string,
  country: string,
  city: string,
};

export class BasketDeliveryForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      first_name: props.basket.first_name,
      last_name: props.basket.last_name,
      address_line_1: props.basket.address_line_1,
      address_line_2: props.basket.address_line_2,
      zipcode: props.basket.zipcode,
      city: props.basket.city,
      country: props.basket.country,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.basket !== prevProps.basket) {
      this.setState({
        first_name: this.props.basket.first_name,
        last_name: this.props.basket.last_name,
        address_line_1: this.props.basket.address_line_1,
        address_line_2: this.props.basket.address_line_2,
        zipcode: this.props.basket.zipcode,
        city: this.props.basket.city,
        country: this.props.basket.country,
      });
    }
  }

  onChange = (key: string) => (ev: SyntheticEvent<HTMLEvent>) => {
    this.setState({ [key]: ev.target.value });
  };

  onSubmit = () => {
    const {
      first_name,
      last_name,
      address_line_1,
      address_line_2,
      zipcode,
      city,
      country,
    } = this.state;

    this.props.onSubmit({
      first_name,
      last_name,
      address_line_1,
      address_line_2,
      zipcode,
      city,
      country,
    });
  };

  render() {
    return (
      <div>
        <div className={this.props.classes.nameContainer}>
          <TextField
            value={this.state.first_name}
            placeholder={this.props.t('forms.delivery.first_name')}
            required
            onChange={this.onChange('first_name')}
            style={{ marginRight: 16 }}
          />
          <TextField
            value={this.state.last_name}
            placeholder={this.props.t('forms.delivery.last_name')}
            required
            onChange={this.onChange('last_name')}
          />
        </div>
        <AddressForm
          address_line_1={this.state.address_line_1}
          address_line_2={this.state.address_line_2}
          zipcode={this.state.zipcode}
          country={this.state.country}
          city={this.state.city}
          onChange={this.onChange}
        />
        <div className={this.props.classes.buttonContainer}>
          {this.props.loading ? (
            <CircularProgress />
          ) : (
            <React.Fragment>
              <Button onClick={this.props.onCancel}>
                {this.props.t('forms.delivery.actions.cancel')}
              </Button>
              <Button
                onClick={this.onSubmit}
                color="primary"
                variant="contained"
              >
                {this.props.t('forms.delivery.actions.submit')}
              </Button>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}
const styles = (theme) => ({
  nameContainer: {
    paddingBottom: theme.spacing.unit * 2,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default compose(
  withNamespaces(['checkout']),
  withStyles(styles),
)(BasketDeliveryForm);
