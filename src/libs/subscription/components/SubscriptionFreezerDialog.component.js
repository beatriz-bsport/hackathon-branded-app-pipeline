// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Form, withFormik } from 'formik';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import * as Yup from 'yup';
import { Submit, TextField, IntegerField } from '../../../components/forms';

type Props = {
  t: TFunction,
  open: boolean,
  classes: Object,
  onCancel: () => void,
  isSubmitting: boolean,
};

export const SubscriptionFreezerDialog = (props: Props) => {
  return (
    <Dialog open={props.open}>
      <Form>
        <DialogTitle>{props.t('subscription.freeze.form.title')}</DialogTitle>
        <DialogContent>
          <Typography>{props.t('subscription.freeze.form.explain')}</Typography>
          <TextField
            name="name"
            label={props.t('subscription.freeze.form.name.label')}
            placeholder={props.t('subscription.freeze.form.name.placeholder')}
            required
            fullWidth
          />
          <IntegerField
            name="days"
            label={props.t('subscription.freeze.form.days.label')}
            required
            fullWidth
          />
          <div className={props.classes.row}>
            <WarningIcon className={props.classes.leftIcon} color="error" />
            <Typography>
              {props.t('subscription.freeze.form.explainWarning')}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>
            {props.t('subscription.freeze.form.cancel')}
          </Button>
          <Submit disabled={props.isSubmitting}>
            {props.t('subscription.freeze.form.submit')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.unit,
    backgroundColor: '#EFEFEF',
    borderRadius: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
});

export const PriceUpdaterSchema = Yup.object().shape({
  subscription: Yup.number().required(),
  days: Yup.number().required(),
  name: Yup.string().required(),
});

export const SubscriptionFreezerFormikHoc = withFormik({
  mapPropsToValues: ({ subscription }) => ({
    name: '',
    days: 14,
    subscription: subscription.id,
  }),
  validationSchema: PriceUpdaterSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default compose(
  withNamespaces(['subscription']),
  withStyles(styles),
  SubscriptionFreezerFormikHoc,
)(SubscriptionFreezerDialog);
