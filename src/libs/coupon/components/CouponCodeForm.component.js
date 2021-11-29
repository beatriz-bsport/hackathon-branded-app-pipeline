// @flow
import React from 'react';

import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { compose, pure } from 'recompose';

type Props = {
  onSubmit: (code: string, options: OptionCallback) => void,
  t: TFunction,
  classes: Object,
  code: string,
  loading?: boolean,
  disabled?: Boolean,
};

export const CouponCodeForm = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState('');

  const onSubmit = () =>
    props.onSubmit(code, {
      onSuccess: () => {
        setOpen(false);
        setCode('');
      },
    });

  return (
    <div className={props.classes.container}>
      <Button
        disabled={props.loading || props.disabled}
        onClick={() => setOpen(true)}
        color="primary"
      >
        {props.t('code.addCoupon.label')}
      </Button>
      <Dialog open={open}>
        <DialogContent>
          <TextField
            onChange={(ev) => setCode(ev.target.value)}
            value={props.code}
            shrink
            variant="outlined"
            placeholder={props.t('code.addCoupon.placeholder')}
            label={props.t('code.addCoupon.label')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            {props.t('code.addCoupon.cancel')}
          </Button>
          <Button color="primary" onClick={onSubmit}>
            {props.t('code.addCoupon.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['coupon']),
  pure,
)(CouponCodeForm);
