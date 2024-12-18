import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation, WithTranslation } from 'react-i18next';

import { compose } from 'recompose';
import { Theme, WithStyles, createStyles } from '@material-ui/core';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

import type { DeliveryConfiguration, DeliveryFee } from '#src/libs/order/types';

type Props = {
  deliveryFees: Array<DeliveryFee>;
  configuration?: DeliveryConfiguration;
  onSubmit: (deliveryFeeConfiguration: DeliveryConfiguration) => void;
} & WithTranslation &
  WithStyles<typeof styles>;

type State = {
  configuration: DeliveryConfiguration;
};

export class OrderConfigrationForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      configuration: props.configuration,
    };
  }

  handleChange = (value: number) => {
    this.setState({ configuration: { default_delivery_fee: value } });
  };

  compareStateAndProps = () =>
    this.props.configuration?.default_delivery_fee ===
    this.state.configuration?.default_delivery_fee;

  submit = () => {
    const default_delivery_fee =
      this.state.configuration.default_delivery_fee === -1
        ? null
        : this.state.configuration.default_delivery_fee;
    this.props.onSubmit({ ...this.state.configuration, default_delivery_fee });
  };

  render() {
    const { t, classes, deliveryFees } = this.props;

    return (
      <div className={classes.container}>
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="default-delivery-fee">
              {t('configuration.defaultDeliveryFee')}
            </InputLabel>
            <ObjectLevelPermissionWrapper requiredPermission="product.shopReworked.allowed_actions.editSettings">
              <Select
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  this.handleChange(parseInt(event.target.value, 10))
                }
                value={this.state.configuration?.default_delivery_fee ?? -1}
              >
                <MenuItem value={-1}>
                  {t('configuration.noDefaultDeliveryFee')}
                </MenuItem>
                {(deliveryFees || []).map((deliveryFee) => (
                  <MenuItem key={deliveryFee.id} value={deliveryFee.id}>
                    {deliveryFee.name}
                  </MenuItem>
                ))}
              </Select>
            </ObjectLevelPermissionWrapper>
          </FormControl>
        </div>
        <ObjectLevelPermissionWrapper
          forcedBehavior="hidden"
          requiredPermission="product.shopReworked.allowed_actions.editSettings"
        >
          <Button
            color="primary"
            disabled={this.compareStateAndProps()}
            onClick={this.submit}
            variant="contained"
          >
            {t('configuration.forms.onSubmit')}
          </Button>
        </ObjectLevelPermissionWrapper>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
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
  withTranslation(['order']),
  withStyles(styles),
)(OrderConfigrationForm);
