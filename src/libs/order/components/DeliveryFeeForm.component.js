// @flow
import React from 'react';

import TextField from '@material-ui/core/TextField';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';

import PriceInput from '../../../components/input/PriceInput.component';
import type { DeliveryFee } from '../types';

type Props = {
  t: TFunction,
  initial: ?DeliveryFee,
  onCancel: () => void,
  onSubmit: (data: DeliveryFee) => void,
  classes: any,
};

type State = {
  data: DeliveryFee,
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
          fee: '0.00',
          free_threshold: '20.00',
        },
      };
    }
  }

  handleChange = (key: string) => (value: *) => {
    this.setState((prevState) => ({
      data: { ...prevState.data, [key]: value },
    }));
  };

  onSubmit = () => {
    this.props.onSubmit({ ...this.state.data });
  };

  render() {
    const { t, classes } = this.props;
    const { name, fee, free_threshold } = this.state.data;
    return (
      <div className={classes.container}>
        <div className={classes.field}>
          <TextField
            className={classes.field}
            value={name}
            label={t('deliveryFee.forms.nameLabel')}
            onChange={(ev) => this.handleChange('name')(ev.target.value)}
          />
        </div>
        <div className={classes.field}>
          <PriceInput
            value={fee}
            className={classes.field}
            required
            label={t('deliveryFee.forms.feeLabel')}
            onChange={(ev) => this.handleChange('fee')(ev.target.value)}
          />
        </div>
        <div className={classes.field}>
          <PriceInput
            value={free_threshold}
            label={t('deliveryFee.forms.freeThresholdLabel')}
            helperText={t('deliveryFee.forms.freeThresholdHelper')}
            required
            onChange={(ev) =>
              this.handleChange('free_threshold')(ev.target.value)
            }
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

const styles = (theme) => ({
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
