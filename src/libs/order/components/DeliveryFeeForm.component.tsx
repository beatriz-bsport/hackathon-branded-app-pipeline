import React from 'react';

import TextField from '@material-ui/core/TextField';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import { Theme, WithStyles, createStyles } from '@material-ui/core';
import PriceInput from '#components/input/PriceInput.component';
import {
  DeliveryFee,
  DeliveryFeeCreationOrUpdatePayload,
} from '#libs/order/types';

type Props = {
  initial?: DeliveryFee;
  onCancel: () => void;
  onSubmit: (data: DeliveryFeeCreationOrUpdatePayload) => void;
} & WithTranslation &
  WithStyles<typeof styles>;

type State = {
  data: DeliveryFeeCreationOrUpdatePayload;
};

export class DeliveryFeeDialogForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.initial) {
      this.state = {
        data: {
          name: props.initial.name,
          fee: props.initial.fee,
          free_threshold: props.initial.free_threshold,
          id: props.initial.id,
        },
      };
    } else {
      this.state = {
        data: {
          name: '',
          fee: '0.0',
          free_threshold: '20.0',
        },
      };
    }
  }

  handleChange = (key: string) => (value: string) => {
    this.setState((prevState) => ({
      data: { ...prevState.data, [key]: value },
    }));
  };

  onSubmit = () => {
    const data = {
      name: this.state.data.name,
      fee: this.state.data.fee || 0,
      free_threshold: this.state.data.free_threshold,
      id: this.state.data.id,
    };
    // @ts-expect-error
    this.props.onSubmit(data);
  };

  render() {
    const { t, classes } = this.props;
    const { name, fee, free_threshold } = this.state.data;
    return (
      <div className={classes.container}>
        <div className={classes.field}>
          <TextField
            className={classes.field}
            label={t('deliveryFee.forms.nameLabel')}
            onChange={(ev) => this.handleChange('name')(ev.target.value)}
            value={name}
          />
        </div>
        <div className={classes.field}>
          <PriceInput
            required
            className={classes.field}
            label={t('deliveryFee.forms.feeLabel')}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              this.handleChange('fee')(ev.target.value)
            }
            // @ts-expect-error
            value={fee}
          />
        </div>
        <div className={classes.field}>
          <PriceInput
            required
            helperText={t('deliveryFee.forms.freeThresholdHelper')}
            label={t('deliveryFee.forms.freeThresholdLabel')}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              this.handleChange('free_threshold')(ev.target.value)
            }
            // @ts-expect-error
            value={free_threshold}
          />
        </div>
        <div className={classes.buttons}>
          <Button color="secondary" onClick={this.props.onCancel}>
            {t('deliveryFee.forms.onCancel')}
          </Button>
          <Button color="primary" onClick={this.onSubmit}>
            {t('deliveryFee.forms.onSubmit')}
          </Button>
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    buttons: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: theme.spacing(2),
    },
    field: {
      marginBottom: theme.spacing(1),
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
  });

export default compose(
  withStyles(styles),
  withTranslation(['order']),
)(DeliveryFeeDialogForm);
