import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { FormikProps, withFormik } from 'formik';
import Typography from '@material-ui/core/Typography';
import * as Yup from 'yup';
import { DateTime } from 'luxon';
import TypographyMultiline from '../../../components/typo/TypographyMultiline.component';
// @ts-expect-error
import { TextField, DateField, TimeField } from '../../../components/forms';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import {
  Giftcard,
  GiftcardBackgroundImage,
  GiftcardFormValues,
} from '../types';
import EmailInputWithChipsField from '../../../components/input/email-input-with-chip/EmailInputWithChipsField.component';
import CarouselInputField from '../../../components/input/carousel-input/CarouselInputField.component';
import { parseQueryString } from '../../../http';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';
import { Alert } from '@material-ui/lab';
import { formatAsDate } from '#src/utils/datetime';

const ACTIVATION_DATE_MAX_DATE = DateTime.now().plus({ months: 2 });
const INTIAL_ACTIVATION_DATE = DateTime.now().startOf('day');

type Props = FormikProps<Omit<GiftcardFormValues, 'force'>> & {
  giftcard?: Giftcard;
  values: Omit<GiftcardFormValues, 'force'>;
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

  const activationDate = useMemo(
    () => formatAsDate(props.values.activation_datetime.toISO()),
    [props.values.activation_datetime],
  );

  const handleChangeKind = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      props.setFieldValue('kind', parseInt(event.target.value, 10)),
    [props],
  );

  if (!props.giftcard) return null;

  const dateToSend =
    typeof props.values.date_to_send === 'string'
      ? DateTime.fromISO(props.values.date_to_send)
      : props.values.date_to_send;

  const messageContentFieldMaxCharCount =
    props.values.kind === ConsumerGiftcardKind.PRINTABLE ? 150 : 2000;

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
        helperText={`${props.values.message_content.length}/${messageContentFieldMaxCharCount}`}
        inputProps={{ maxLength: messageContentFieldMaxCharCount }}
        label={t('consumerGiftcard.form.message_content.label')}
        name="message_content"
        variant="outlined"
      />
      <FormControl component="fieldset">
        <FormLabel component="legend">
          {t('consumerGiftcard.form.type.label')}
        </FormLabel>
        <RadioGroup
          name="kind"
          onChange={handleChangeKind}
          value={props.values.kind}
        >
          <FormControlLabel
            control={<Radio color="primary" />}
            label={t('consumerGiftcard.form.type.option.physical')}
            value={ConsumerGiftcardKind.PRINTABLE}
          />
          <FormControlLabel
            control={<Radio color="primary" />}
            label={t('consumerGiftcard.form.type.option.digital')}
            value={ConsumerGiftcardKind.DIGITAL}
          />
        </RadioGroup>
      </FormControl>
      {props.values.kind === ConsumerGiftcardKind.PRINTABLE &&
        !!props.giftcard.expiration_days && (
          <>
            <DateField
              helperText={
                props.errors.activation_datetime
                  ? t(props.errors.activation_datetime as string)
                  : t('consumerGiftcard.form.activationDate.helperText')
              }
              initialFocusedDate={INTIAL_ACTIVATION_DATE}
              label={t('consumerGiftcard.form.activationDate.label')}
              maxDate={ACTIVATION_DATE_MAX_DATE}
              minDate={INTIAL_ACTIVATION_DATE}
              name="activation_datetime"
              value={activationDate}
            />
            {!!props.values.activation_datetime && (
              <Alert className={classes.footer} severity="info">
                {t('consumerGiftcard.form.footerPhysical', {
                  activation_date: formatAsDate(
                    props.values.activation_datetime.toISO(),
                  ),
                  activation_date_until: formatAsDate(
                    props.values.activation_datetime
                      .plus({
                        days: props.giftcard?.expiration_days ?? 0,
                      })
                      .toISO(),
                  ),
                  duration: props.giftcard?.expiration_days ?? 0,
                })}
              </Alert>
            )}
          </>
        )}
      {props.values.kind === ConsumerGiftcardKind.PRINTABLE &&
        !props.giftcard.expiration_days && (
          <Alert severity="info">
            {t('consumerGiftcard.form.footerPhysicalUnlimited')}
          </Alert>
        )}
      {props.values.kind === ConsumerGiftcardKind.DIGITAL && (
        <>
          {props.giftcardBackgroundImageList.length > 0 && (
            // @ts-expect-error
            <CarouselInputField
              handleSelectedImage={handleSelectedImage}
              imagesArr={props.giftcardBackgroundImageList.map(
                (img) => img.image,
              )}
              isManager={props.isManager}
              selectedImage={selectedImage}
              textFieldName="background_image"
              title={t('consumerGiftcard.form.select_image')}
            />
          )}
          {/* @ts-expect-error */}
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
          <Alert className={classes.footer} severity="info">
            {props.giftcard?.expiration_days
              ? t('consumerGiftcard.form.footer', {
                  expiration_days: props.giftcard?.expiration_days || 0,
                  date_send: dateToSend.toLocaleString(DateTime.DATE_SHORT),
                  hour_send: dateToSend.toLocaleString(DateTime.TIME_SIMPLE),
                  price: getCurrencyDisplayWithPrice(props.giftcard.price),
                })
              : t('consumerGiftcard.form.footerUnlimited', {
                  date_send: dateToSend.toLocaleString(DateTime.DATE_SHORT),
                  hour_send: dateToSend.toLocaleString(DateTime.TIME_SIMPLE),
                  price: getCurrencyDisplayWithPrice(props.giftcard.price),
                })}
          </Alert>
        </>
      )}
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
    marginTop: theme.spacing(2),
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
  message_content: Yup.string()
    .required()
    .when('kind', (value, schema) => {
      if (value === ConsumerGiftcardKind.PRINTABLE) {
        return schema.max(150);
      }
      return schema.max(2000);
    }),
  name: Yup.string().required(),
  background_image: Yup.string().nullable(),
  recipients: Yup.array().of(Yup.string()),
  date_to_send: Yup.string(),
  kind: Yup.number().oneOf([
    ConsumerGiftcardKind.DIGITAL,
    ConsumerGiftcardKind.PRINTABLE,
  ]),
  activation_datetime: Yup.date()
    .nullable()
    .test(
      'is-date-too-far',
      `consumerGiftcard.form.activationDate.errorMaxDate`,
      (value: Date) =>
        DateTime.fromJSDate(value)
          .diff(INTIAL_ACTIVATION_DATE, 'months')
          .as('months') <= 2,
    ),
});

export const ConsumerGiftcardFormFieldHOC = withFormik({
  // @ts-expect-error
  mapPropsToValues: ({ giftcard }) => ({
    ...{
      message_is_from: '',
      message_is_for: '',
      message_content: '',
      name: giftcard?.name ?? '',
      background_image: null,
      recipients: [],
      date_to_send: DateTime.now()
        .set({ hour: 7, minute: 0, second: 0, millisecond: 0 })
        .toISO(),
      kind: ConsumerGiftcardKind.PRINTABLE,
      activation_datetime: INTIAL_ACTIVATION_DATE,
    },
  }),
  validationSchema: ConsumerGiftcardSchema,
  handleSubmit: (
    values,
    // @ts-expect-error
    { props: { onSubmit, onSuccess, onError }, setSubmitting },
  ) => {
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
