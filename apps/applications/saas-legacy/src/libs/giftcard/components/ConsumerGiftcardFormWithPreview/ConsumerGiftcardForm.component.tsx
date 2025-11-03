import React, { type FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';

import TypographyMultiline from '#src/components/typo/TypographyMultiline.component';
// @ts-expect-error Importing components from a JS file
import { TextField, DateField, TimeField } from '#src/components/forms';
import EmailInputWithChipsField from '#src/components/input/email-input-with-chip/EmailInputWithChipsField.component';
import CarouselInputField from '#src/components/input/carousel-input/CarouselInputField.component';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { formatAsDate } from '#src/utils/datetime';

import type { ConsumerGiftcardFormWithPreviewProps } from './types';
import {
  getFieldActivationDateTimeMaxDate,
  getFieldActivationDateTimeMinDate,
  FIELD_MESSAGE_CONTENT_MAX_LENGTH_DIGITAL,
  FIELD_MESSAGE_CONTENT_MAX_LENGTH_PRINTABLE,
} from './schema';

export const ConsumerGiftcardForm: FC<ConsumerGiftcardFormWithPreviewProps> = ({
  errors,
  giftcard,
  giftcardBackgroundImageList = [],
  isManager = false,
  setFieldValue,
  values,
}) => {
  const { t } = useTranslation(['giftcard']);
  const classes = useStyles();

  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const handleSelectedImage = (index: number) => {
    setSelectedImage(index);
  };

  const activationDate = useMemo(() => {
    const activationDatetime = values.activation_datetime;
    return activationDatetime && activationDatetime.toISO() !== null
      ? formatAsDate(activationDatetime.toISO() as string)
      : null;
  }, [values.activation_datetime]);

  const handleChangeKind = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setFieldValue('kind', parseInt(event.target.value, 10)),
    [setFieldValue],
  );

  if (!giftcard) return null;

  const dateToSend =
    typeof values.date_to_send === 'string'
      ? DateTime.fromISO(values.date_to_send)
      : values.date_to_send;

  const messageContentFieldMaxCharCount =
    values.kind === ConsumerGiftcardKind.PRINTABLE
      ? FIELD_MESSAGE_CONTENT_MAX_LENGTH_PRINTABLE
      : FIELD_MESSAGE_CONTENT_MAX_LENGTH_DIGITAL;

  const minDate = getFieldActivationDateTimeMinDate();
  const maxDate = getFieldActivationDateTimeMaxDate(minDate);

  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <Typography variant="h4">{giftcard.name}</Typography>
        <Typography color="primary" variant="h5">
          {getCurrencyDisplayWithPrice(giftcard.price)}
        </Typography>
      </div>

      <TypographyMultiline
        className={classes.description}
        color="textSecondary"
        whiteSpace="pre-wrap"
      >
        {giftcard.description}
      </TypographyMultiline>

      <TextField
        helperText={`${values.name.length}/40`}
        inputProps={{ maxLength: 40 }}
        label={t('consumerGiftcard.form.name.label')}
        name="name"
      />

      <TextField
        helperText={`${values.message_is_from.length}/40`}
        inputProps={{ maxLength: 40 }}
        label={t('consumerGiftcard.form.message_is_from.label')}
        name="message_is_from"
      />

      <TextField
        helperText={`${values.message_is_for.length}/40`}
        inputProps={{ maxLength: 40 }}
        label={t('consumerGiftcard.form.message_is_for.label')}
        name="message_is_for"
      />

      <TextField
        multiline
        className={classes.multilineInput}
        helperText={`${values.message_content.length}/${messageContentFieldMaxCharCount}`}
        inputProps={{ maxLength: messageContentFieldMaxCharCount }}
        label={t('consumerGiftcard.form.message_content.label')}
        name="message_content"
        variant="outlined"
      />

      <FormControl component="fieldset">
        <FormLabel component="legend">
          {t('consumerGiftcard.form.type.label')}
        </FormLabel>
        <RadioGroup name="kind" onChange={handleChangeKind} value={values.kind}>
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

      {values.kind === ConsumerGiftcardKind.PRINTABLE &&
        !!giftcard.expiration_days && (
          <>
            <DateField
              helperText={
                errors.activation_datetime
                  ? t('consumerGiftcard.form.activationDate.errorMaxDate')
                  : t('consumerGiftcard.form.activationDate.helperText')
              }
              initialFocusedDate={minDate}
              label={t('consumerGiftcard.form.activationDate.label')}
              maxDate={maxDate}
              minDate={minDate}
              name="activation_datetime"
              value={activationDate}
            />
            {!!values.activation_datetime && (
              <Alert className={classes.footer} severity="info">
                {t('consumerGiftcard.form.footerPhysical', {
                  activation_date: formatAsDate(
                    values.activation_datetime.toISO() as string,
                  ),
                  activation_date_until: formatAsDate(
                    values.activation_datetime
                      .plus({
                        days: giftcard?.expiration_days ?? 0,
                      })
                      .toISO() as string,
                  ),
                  duration: giftcard?.expiration_days ?? 0,
                })}
              </Alert>
            )}
          </>
        )}

      {values.kind === ConsumerGiftcardKind.PRINTABLE &&
        !giftcard.expiration_days && (
          <Alert severity="info">
            {t('consumerGiftcard.form.footerPhysicalUnlimited')}
          </Alert>
        )}

      {values.kind === ConsumerGiftcardKind.DIGITAL && (
        <>
          {giftcardBackgroundImageList.length > 0 && (
            <CarouselInputField
              handleSelectedImage={handleSelectedImage}
              imagesArr={giftcardBackgroundImageList.map((img) => img.image)}
              isManager={isManager}
              selectedImage={selectedImage}
              textFieldName="background_image"
              title={t('consumerGiftcard.form.select_image')}
            />
          )}

          {/* @ts-expect-error */}
          <EmailInputWithChipsField
            emailList={values.recipients}
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
            {giftcard?.expiration_days
              ? t('consumerGiftcard.form.footer', {
                  expiration_days: giftcard?.expiration_days || 0,
                  date_send: dateToSend.toLocaleString(DateTime.DATE_SHORT),
                  hour_send: dateToSend.toLocaleString(DateTime.TIME_SIMPLE),
                  price: getCurrencyDisplayWithPrice(giftcard.price),
                })
              : t('consumerGiftcard.form.footerUnlimited', {
                  date_send: dateToSend.toLocaleString(DateTime.DATE_SHORT),
                  hour_send: dateToSend.toLocaleString(DateTime.TIME_SIMPLE),
                  price: getCurrencyDisplayWithPrice(giftcard.price),
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
