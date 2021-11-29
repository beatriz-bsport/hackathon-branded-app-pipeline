// @flow
import React from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { withState, compose } from 'recompose';
import NumericInput from '../../../components/input/NumericInput.component';

type Props = {
  quantity: ?number,
  setQuantity: (number) => void,
  onCancel: () => void,
  onSubmit: (data: { qty: number }) => void,
  t: TFunction,
};

export const ProvisionForm = (props: Props) => (
  <React.Fragment>
    <DialogTitle>{props.t('provision.form.title')}</DialogTitle>
    <DialogContent>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <NumericInput
          label={props.t('provision.form.quantityLabel')}
          variant="outlined"
          helperText={props.t('provision.form.quantityHelperText')}
          onChange={(ev: SyntheticEvent<HTMLElement>) =>
            props.setQuantity(parseInt(ev.target.value, 10))
          }
          value={props.quantity}
        />
      </div>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onCancel} color="secondary">
        {props.t('provision.form.cancel')}
      </Button>
      <Button
        color="primary"
        onClick={() => props.onSubmit({ qty: props.quantity })}
      >
        {props.t('provision.form.submit')}
      </Button>
    </DialogActions>
  </React.Fragment>
);

export default compose(
  withTranslation(['shop']),
  withState('quantity', 'setQuantity', null),
)(ProvisionForm);
