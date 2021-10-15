import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { withFormik } from 'formik';
import Typography from '@material-ui/core/Typography';
import * as Yup from 'yup';
import moment from 'moment-timezone';
import { TextField, DateField } from '../../../components/forms';

import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { Giftcard } from '../types';
import { EmailInputWithChipsField } from '../../../components/input/EmailInputWithChipsGenerator.component';

type Props = {
  giftcard: Giftcard;
  values: {
    message_is_from: string;
    message_is_for: string;
    message_content: string;
    name: string;
    background_image: any;
    recipients: Array<string>;
    date_send: string;
  };
};

export const ConsumerGiftcardForm = (props: Props) => {
  const { t } = useTranslation(['giftcard']);
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <Typography variant="h4">{props.giftcard.name}</Typography>
        <Typography variant="h5" color="primary">
          {getCurrencyDisplayWithPrice(props.giftcard.price)}
        </Typography>
      </div>
      <Typography className={classes.description} color="textSecondary">
        {props.giftcard.description}
      </Typography>
      <TextField
        name="name"
        label={t('consumerGiftcard.form.name.label')}
        helperText={`${props.values.name.length}/40`}
        inputProps={{ maxLength: 40 }}
      />
      <TextField
        name="message_is_from"
        label={t('consumerGiftcard.form.message_is_from.label')}
        helperText={`${props.values.message_is_from.length}/40`}
        inputProps={{ maxLength: 40 }}
      />
      <TextField
        name="message_is_for"
        label={t('consumerGiftcard.form.message_is_for.label')}
        helperText={`${props.values.message_is_for.length}/40`}
        inputProps={{ maxLength: 40 }}
      />
      <TextField
        name="message_content"
        label={t('consumerGiftcard.form.message_content.label')}
        multiline
        variant="outlined"
        className={classes.multilineInput}
        helperText={`${props.values.message_content.length}/2000`}
        inputProps={{ maxLength: 2000 }}
      />
      <EmailInputWithChipsField
        emailList={props.values.recipients}
        textFieldLabel={t('consumerGiftcard.form.recipients.label')}
        textFieldName="recipients"
      />
      <DateField
        label={t('consumerGiftcard.form.date_send.label')}
        name="date_to_send"
      />
      <Typography className={classes.footer}>
        {props.giftcard?.expiration_days
          ? t('consumerGiftcard.form.footer', {
              expiration_days: props.giftcard?.expiration_days || 0,
              date_send: moment(props.values.date_send).format('L'),
              price: getCurrencyDisplayWithPrice(props.giftcard.price),
            })
          : t('consumerGiftcard.form.footerUnlimited', {
              date_send: moment(props.values.date_send).format('L'),
              price: getCurrencyDisplayWithPrice(props.giftcard.price),
            })}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    padding: theme.spacing(2),
    flexDirection: 'column',
    '&>*': {
      marginBottom: theme.spacing(1),
    },
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  multilineInput: {
    marginTop: theme.spacing(4),
  },
  description: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  footer: {
    marginTop: theme.spacing(3),
  },
}));

export default ConsumerGiftcardForm;

export const ConsumerGiftcardSchema = Yup.object().shape({
  message_is_from: Yup.string().required(),
  message_is_for: Yup.object().nullable(),
  message_content: Yup.string().required(),
  name: Yup.string().required(),
  // background_image: Yup.number().required(),
  recipients: Yup.array().required(),
  date_to_send: Yup.string(),
});

export const ConsumerGiftcardFormFieldHOC = withFormik({
  // eslint-disable-next-line
  mapPropsToValues: ({ giftcard }) => ({...{
      message_is_from: '',
      message_is_for: '',
      message_content: '',
      name: giftcard.name,
      background_image: null,
      recipients: [],
      date_send: moment().format('YYYY-MM-DD'),
    },
  }),
  validationSchema: ConsumerGiftcardSchema,
  handleSubmit: (
    values,
    { props: { onSubmit, onSuccess, onError }, setSubmitting },
  ) => {
    // const keys = [
    //   'description',
    //   'price',
    //   'manager_only',
    //   'unlimited',
    //   'can_pay_credit',
    //   'expiration_days',
    //   'available_payment_method_identifiers',
    // ];
    // const { cover } = values;
    // const data = {
    //   ...pick(values, keys),
    // };
    // if (typeof cover !== 'string' && !!cover) {
    //   data.cover = cover;
    // }
    onSubmit(values, {
      onSuccess: () => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess();
        setSubmitting(false);
      },
      onError: () => {
        if (onError && typeof onError === 'function') onError();
        setSubmitting(false);
      },
    });
  },
});

export const ConsumerGiftcardFormComposed = ConsumerGiftcardFormFieldHOC(
  ConsumerGiftcardForm,
);
