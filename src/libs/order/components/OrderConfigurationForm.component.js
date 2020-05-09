// @flow
import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { compose } from 'recompose';
import type { DeliveryFee } from '../types';

type Props = {
  deliveryFees: Array<DeliveryFee>,
  configuration: *,
  onSubmit: (DeliveryFee) => void,
  t: TFunction,
  classes: *,
};

type State = {
  configuration: *,
};

export class OrderConfigrationForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      configuration: props.configuration,
    };
  }

  handleChange = (key: string) => (value: *) => {
    this.setState({ configuration: { [key]: value } });
  };

  compareStateAndProps = () =>
    this.props.configuration.default_delivery_fee ===
    this.state.configuration.default_delivery_fee;

  submit = () => {
    const default_delivery_fee =
      this.state.configuration.default_delivery_fee === -1
        ? null
        : this.state.configuration.default_delivery_fee;
    this.props.onSubmit({ ...this.state.configuration, default_delivery_fee });
  };

  render() {
    const { t, classes, deliveryFees } = this.props;
    const { configuration } = this.state;
    return (
      <div className={classes.container}>
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="default-delivery-fee">
              {t('configuration.defaultDeliveryFee')}
            </InputLabel>
            <Select
              value={
                configuration.default_delivery_fee === null
                  ? -1
                  : configuration.default_delivery_fee
              }
              onChange={(ev) =>
                this.handleChange('default_delivery_fee')(
                  parseInt(ev.target.value, 10),
                )
              }
            >
              <MenuItem value={-1}>
                {t('configuration.noDefaultDeliveryFee')}
              </MenuItem>
              {deliveryFees.map((df) => (
                <MenuItem key={df.id} value={df.id}>
                  {df.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Button
          disabled={this.compareStateAndProps()}
          variant="contained"
          color="primary"
          onClick={this.submit}
        >
          {t('configuration.forms.onSubmit')}
        </Button>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  formControl: {
    paddingBottom: theme.spacing(2),
    minWidth: 260,
  },
});

export default compose(
  withNamespaces(['order']),
  withStyles(styles),
)(OrderConfigrationForm);
