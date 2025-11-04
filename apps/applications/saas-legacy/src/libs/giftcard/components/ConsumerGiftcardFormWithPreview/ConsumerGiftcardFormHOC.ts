import { withFormik } from 'formik';
import { DateTime } from 'luxon';
import { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';
import { parseQueryString } from '#src/http';

import {
  getFieldActivationDateTimeMinDate,
  getConsumerGiftcardSchema,
} from './schema';
import type { ConsumerGiftcardFormValues, OuterProps } from './types';
import { GIFTCARD_TYPES } from '../../constants';

export const INITIAL_DATA: ConsumerGiftcardFormValues = {
  activation_datetime: getFieldActivationDateTimeMinDate(),
  kind: ConsumerGiftcardKind.PRINTABLE,
  date_to_send: DateTime.now()
    .set({ hour: 7, minute: 0, second: 0, millisecond: 0 })
    .toISO(),
  background_image: null,
  recipients: [],
  message_is_from: '',
  message_is_for: '',
  message_content: '',
  name: '',
  price: null,
};

export const ConsumerGiftcardFormHOC = withFormik<
  OuterProps,
  ConsumerGiftcardFormValues
>({
  mapPropsToValues: ({ giftcard }) => {
    return {
      ...INITIAL_DATA,
      name: giftcard?.name ?? '',
      price:
        giftcard?.card_type === GIFTCARD_TYPES.CUSTOM
          ? giftcard.min_price
          : null,
    };
  },
  validationSchema: ({ giftcard }: OuterProps) =>
    getConsumerGiftcardSchema({
      minValue: giftcard?.min_price,
      maxValue: giftcard?.max_price,
    }),
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    const force = !!parseQueryString(location.search || '')?.force;
    onSubmit(
      {
        ...values,
        force,
      },
      {
        onSuccess: () => {
          setSubmitting(false);
        },
        onError: () => {
          setSubmitting(false);
        },
      },
    );
  },
});
