// @ts-nocheck
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { withFormik } from 'formik';
import Typography from '@material-ui/core/Typography';
import * as Yup from 'yup';
import moment from 'moment-timezone';
import TypographyMultiline from '../../../components/typo/TypographyMultiline.component';

import { TextField, DateField, TimeField } from '../../../components/forms';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { Giftcard, GiftcardBackgroundImage } from '../types';
import EmailInputWithChipsField from '../../../components/input/email-input-with-chip/EmailInputWithChipsField.component';
import CarouselInputField from '../../../components/input/carousel-input/CarouselInputField.component';
import { parseQueryString } from '../../../http';
import { formatISOStringAsTime } from '../../../utils/datetime';

export type FormValues = {
  message_is_from: string;
  message_is_for: string;
  message_content: string;
  name: string;
  background_image: string;
  recipients: string[];
  date_to_send: string;
};

type Props = {
  giftcard?: Giftcard;
  values: FormValues;
  giftcardBackgroundImageList: Array<GiftcardBackgroundImage>;
  isManager: boolean;
};

export const ConsumerGiftcardForm = (props: Props) => {
  const { t } = useTranslation(['giftcard']);
  const classes = useStyles();

  const [selectedImage, setSelectedImage] = useState(null);
  const handleSelectedImage = (index: number) => {
    setSelectedImage(index);
  };

  if (!props.giftcard) return null;

  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <Typography variant="h4">{props.giftcard.name}</Typography>
        <Typography color="primary" variant="h5">
          {getCurrencyDisplayWithPrice(props.giftcard.price)}
        </Typography>
      </div>
      <TypographyMultiline
        className={classes.description}
        color="textSecondary"
        whiteSpace="pre-wrap"
      >
        {props.giftcard.description}
      </TypographyMultiline>
      <TextField
        helperText={`${props.values.name.length}/40`}
        inputProps={{ maxLength: 40 }}
        label={t('consumerGiftcard.form.name.label')}
        name="name"
      />
      <TextField
        helperText={`${props.values.message_is_from.length}/40`}
        inputProps={{ maxLength: 40 }}
        label={t('consumerGiftcard.form.message_is_from.label')}
        name="message_is_from"
      />
      <TextField
        helperText={`${props.values.message_is_for.length}/40`}
        inputProps={{ maxLength: 40 }}
        label={t('consumerGiftcard.form.message_is_for.label')}
        name="message_is_for"
      />
      <TextField
        multiline
        className={classes.multilineInput}
        helperText={`${props.values.message_content.length}/2000`}
        inputProps={{ maxLength: 2000 }}
        label={t('consumerGiftcard.form.message_content.label')}
        name="message_content"
        variant="outlined"
      />
      {props.giftcardBackgroundImageList.length > 0 && (
        <CarouselInputField
          handleSelectedImage={handleSelectedImage}
          imagesArr={props.giftcardBackgroundImageList.map((img) => img.image)}
          isManager={props.isManager}
          selectedImage={selectedImage}
          textFieldName="background_image"
          title={t('consumerGiftcard.form.select_image')}
        />
      )}

      <EmailInputWithChipsField
        emailList={props.values.recipients}
        textFieldLabel={t('consumerGiftcard.form.recipients.label')}
        textFieldName="recipients"
      />
      <DateField
        label={t('consumerGiftcard.form.date_send.label')}
        name="date_to_send"
      />
      <div className={classes.clockField}>
        <Typography className={classes.clockText}>
          {t('consumerGiftcard.form.hour_send')}
        </Typography>
        <TimeField name="date_to_send" />
      </div>
      <Typography className={classes.footer}>
        {props.giftcard?.expiration_days
          ? t('consumerGiftcard.form.footer', {
              expiration_days: props.giftcard?.expiration_days || 0,
              date_send: moment(props.values.date_to_send).format('L'),
              hour_send: formatISOStringAsTime(props.values.date_to_send),
              price: getCurrencyDisplayWithPrice(props.giftcard.price),
            })
          : t('consumerGiftcard.form.footerUnlimited', {
              date_send: moment(props.values.date_to_send).format('L'),
              hour_send: formatISOStringAsTime(props.values.date_to_send),
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
  clockField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: theme.spacing(1),
  },
  clockText: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(0.5),
  },
}));

export default ConsumerGiftcardForm;

export const ConsumerGiftcardSchema = Yup.object().shape({
  message_is_from: Yup.string().required(),
  message_is_for: Yup.object().nullable(),
  message_content: Yup.string().required(),
  name: Yup.string().required(),
  background_image: Yup.string().nullable(),
  recipients: Yup.array().of(Yup.string()),
  date_to_send: Yup.string(),
});

export const ConsumerGiftcardFormFieldHOC = withFormik({
  // eslint-disable-next-line
  mapPropsToValues: ({ giftcard }) => ({
    ...{
      message_is_from: '',
      message_is_for: '',
      message_content: '',
      name: giftcard?.name ?? '',
      background_image: null,
      recipients: [],
      date_to_send: moment()
        .hours(7)
        .minutes(0)
        .seconds(0)
        .milliseconds(0)
        .format(),
    },
  }),
  validationSchema: ConsumerGiftcardSchema,
  handleSubmit: (
    values,
    { props: { onSubmit, onSuccess, onError }, setSubmitting },
  ) => {
    // eslint-disable-next-line
    const force = !!parseQueryString(location.search || '')?.force;
    onSubmit(
      { ...values, force },
      {
        onSuccess: () => {
          if (onSuccess && typeof onSuccess === 'function') onSuccess();
          setSubmitting(false);
        },
        onError: () => {
          if (onError && typeof onError === 'function') onError();
          setSubmitting(false);
        },
      },
    );
  },
});

export const ConsumerGiftcardFormComposed =
  ConsumerGiftcardFormFieldHOC(ConsumerGiftcardForm);
