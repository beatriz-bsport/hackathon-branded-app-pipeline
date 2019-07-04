// @flow
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import AddressForm from '../../../components/form/AddressForm.component';
import type { AddressType, DeliveryData } from '../types';

type Props = {
  consumerProfile: {
    first_name: ?string,
    last_name: ?string,
    address: ?AddressType,
  },
  onChange: (DeliveryData) => void,
  classes: Object,
  t: TFunction,
};

type State = DeliveryData;

const fromPropsToState = (props: Props): State => {
  const address = props.consumerProfile.address || {
    address_line_1: '',
    address_line_2: '',
    zipcode: '',
    country: '',
    city: '',
  };
  return {
    ...address,
    first_name: props.consumerProfile.first_name || '',
    last_name: props.consumerProfile.last_name || '',
  };
};

export class DeliveryForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = fromPropsToState(props);
    props.onChange(this.state);
  }

  onChange = (id: string) => (event: SyntheticEvent<HTMLElement>) => {
    this.setState({ [id]: event.target.value }, () =>
      this.props.onChange(this.state),
    );
  };

  render() {
    return (
      <div>
        <div className={this.props.classes.nameContainer}>
          <TextField
            value={this.state.first_name}
            placeholder={this.props.t('form.delivery.first_name')}
            required
            onChange={this.onChange('first_name')}
            style={{ marginRight: 16 }}
          />
          <TextField
            value={this.state.last_name}
            placeholder={this.props.t('form.delivery.last_name')}
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
      </div>
    );
  }
}

const styles = (theme) => ({
  nameContainer: {
    paddingBottom: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['order']),
  withStyles(styles),
)(DeliveryForm);
