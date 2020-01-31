// @flow
import React from 'react';

import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import Fab from '@material-ui/core/Fab';
import type { TFunction } from 'react-i18next';

import { compose, pure, withState, withProps } from 'recompose';

type Props = {
  handleChange: (ev: SyntheticEvent<any>) => void,
  submitCode: () => void,
  t: TFunction,
  classes: Object,
  code: string,
};

export const CouponCodeForm = (props: Props) => {
  const AddButton = props.code ? (
    <Fab
      className={props.classes.iconButton}
      color="primary"
      onClick={props.submitCode}
    >
      <AddIcon />
    </Fab>
  ) : (
    <IconButton className={props.classes.iconButton} onClick={props.submitCode}>
      <AddIcon />
    </IconButton>
  );
  return (
    <div className={props.classes.container}>
      {AddButton}
      <TextField
        onChange={props.handleChange}
        value={props.code}
        variant="outlined"
        placeholder={props.t('code.addCoupon.placeholder')}
        label={props.t('code.addCoupon.label')}
      />
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
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['coupon']),
  withState('code', 'setCode', ''),
  withProps(({ onSubmit, code, setCode }) => ({
    handleChange: (ev) => setCode(ev.target.value),
    submitCode: () => onSubmit(code, { onSuccess: () => setCode('') }),
  })),
  pure,
)(CouponCodeForm);
