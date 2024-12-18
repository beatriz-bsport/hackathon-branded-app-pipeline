import React, { Component } from 'react';
import { DateTime } from 'luxon';
import { compose } from 'recompose';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';

import { withTranslation, WithTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import * as Yup from 'yup';
import { withFormik } from 'formik';

import {
  TextField,
  IntervalRecurrenceSelectField,
  DateField,
  IntegerFieldEnhancedHelperTextError,
  // @ts-expect-error
} from '#src/components/forms';

import type { PaymentInstalmentData } from '#src/libs/payment/types';
import InstalmentPaymentPreview from './InstalmentPaymentPreview.component';

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
    return (
      <div className={classes.section}>
        <IntervalRecurrenceSelectField
          fullWidth
          required
          className={classes.field}
          helperText={t('instalment.form.interval.helperText')}
          label={t('instalment.form.interval.label')}
          name="interval"
        />
        <div className={classes.row}>
          <Typography variant="body2">
            {t('instalment.form.recurrence_basis.label')}
          </Typography>
          <IntegerFieldEnhancedHelperTextError
            required
            min={1}
            name="recurrence_basis"
            variant="outlined"
          />

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
          fullWidth
          required
          className={classes.field}
          label={t('instalment.form.nb_interval.label', {
            interval: t(`instalment.interval.${values.interval}`, {
              count: values.recurrence_basis,
            }),
          })}
          name="nb_interval"
        />
        <div className={classes.field}>
          <DateField
            parseAsString
            helperText={t('instalment.form.anchor_date.helperText')}
            label={t('instalment.form.anchor_date.label')}
            name="anchor_date"
          />
        </div>
        <InstalmentPaymentPreview
          anchor_date={values.anchor_date}
          // @ts-expect-error
          interval={values.interval}
          // @ts-expect-error
          nb_interval={parseInt(values.nb_interval)}
          // @ts-expect-error
          recurrence_basis={parseInt(values.recurrence_basis) || 0}
          // @ts-expect-error
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
    anchor_date: DateTime.now().toISODate(),
  }),
  validationSchema: InstalmentPaymentSchema,
  // @ts-expect-error
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
  // @ts-expect-error
  InstalmentPaymentFormStyled,
);
