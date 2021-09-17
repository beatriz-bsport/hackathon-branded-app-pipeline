import React, { Component } from 'react';
import { compose } from 'recompose';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';

import { withTranslation, WithTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';

import * as Yup from 'yup';
import { withFormik } from 'formik';

import {
  TextField,
  IntervalRecurrenceSelectField,
  DateField,
} from '../../../../components/forms';

import InstalmentPaymentPreview from './InstalmentPaymentPreview.component';
import { PaymentInstalmentData } from '../../types';

const styles = (theme: Theme) =>
  createStyles({
    recurrenceSumup: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconLeft: {
      marginRight: theme.spacing(1),
    },
    field: {
      marginBottom: theme.spacing(3),
    },
    fieldMain: { marginBottom: theme.spacing(5) },
    section: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      '&>*': {
        marginRight: theme.spacing(1),
      },
    },
  });

type OwnProps = { values: PaymentInstalmentData };

type Props = OwnProps & WithStyles & WithTranslation;

export class InstalmentPaymentForm extends Component<Props> {
  render() {
    const { classes, t, values } = this.props;
    console.log(this.props.values.anchor_date);
    return (
      <div className={classes.section}>
        <IntervalRecurrenceSelectField
          name="interval"
          label={t('instalment.form.interval.label')}
          helperText={t('instalment.form.interval.helperText')}
          className={classes.field}
          required
          fullWidth
        />
        <div className={classes.row}>
          <Typography variant="body2">
            {t('instalment.form.recurrence_basis.label')}
          </Typography>
          <TextField name="recurrence_basis" required variant="outlined" />
          <Typography variant="body2">
            {t(
              `instalment.form.recurrence_basis.intervalName.${values.interval}`,
              {
                count: values.recurrence_basis,
              },
            )}
          </Typography>
        </div>
        <TextField
          name="nb_interval"
          label={t('instalment.form.nb_interval.label', {
            interval: t(`instalment.interval.${values.interval}`, {
              count: values.recurrence_basis,
            }),
          })}
          className={classes.field}
          required
          fullWidth
        />
        <div className={classes.field}>
          <DateField
            label={t('instalment.form.anchor_date.label')}
            helperText={t('instalment.form.anchor_date.helperText')}
            name="anchor_date"
            parseAsString
          />
        </div>
        <InstalmentPaymentPreview
          interval={values.interval}
          recurrence_basis={parseInt(values.recurrence_basis)}
          nb_interval={parseInt(values.nb_interval)}
          anchor_date={values.anchor_date}
          totalPriceCts={this.props.totalPriceCts}
        />
      </div>
    );
  }
}

export const InstalmentPaymentSchema = Yup.object().shape({
  nb_interval: Yup.number().integer().min(1).max(90).required(),
  recurrence_basis: Yup.number().integer().min(1).required(),
  interval: Yup.string().required(),
  anchor_date: Yup.string().required(),
});

export const InstalPaymentFormHOC = withFormik({
  // eslint-disable-next-line
  mapPropsToValues: () => ({
    nb_interval: '12',
    recurrence_basis: '1',
    interval: 'month',
    anchor_date: moment().format('YYYY-MM-DD'),
  }),
  validationSchema: InstalmentPaymentSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export const InstalmentPaymentFormStyled = compose(
  withStyles(styles),
  withTranslation(['payment']),
)(InstalmentPaymentForm);

export default InstalmentPaymentFormStyled;

export const InstalmentPaymentFormComposed = InstalPaymentFormHOC(
  InstalmentPaymentFormStyled,
);
