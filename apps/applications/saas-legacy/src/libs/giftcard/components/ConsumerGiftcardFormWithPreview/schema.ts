import * as Yup from 'yup';
import { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';
import { DateTime } from 'luxon';

export const FIELD_MESSAGE_CONTENT_MAX_LENGTH_PRINTABLE = 150;
export const FIELD_MESSAGE_CONTENT_MAX_LENGTH_DIGITAL = 2000;

export const getFieldActivationDateTimeMinDate = () =>
  DateTime.now().startOf('day');
export const getFieldActivationDateTimeMaxDate = (minDate?: DateTime<true>) =>
  (minDate ?? getFieldActivationDateTimeMinDate()).plus({ months: 2 });

export const ConsumerGiftcardSchema = Yup.object().shape({
  message_is_from: Yup.string().required(),
  message_is_for: Yup.string().nullable(),
  message_content: Yup.string()
    .required()
    .when('kind', (value, schema) => {
      if (value === ConsumerGiftcardKind.PRINTABLE) {
        return schema.max(FIELD_MESSAGE_CONTENT_MAX_LENGTH_PRINTABLE);
      }
      return schema.max(FIELD_MESSAGE_CONTENT_MAX_LENGTH_DIGITAL);
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
    .max(getFieldActivationDateTimeMaxDate().toJSDate())
    .min(getFieldActivationDateTimeMinDate().toJSDate()),
});
