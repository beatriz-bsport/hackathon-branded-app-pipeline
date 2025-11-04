import { withFormik } from 'formik';
import { CB } from '@bsport/common/lib/master-data/payment-methods.js';

import { GIFTCARD_TYPES } from '../../constants';
import type { GiftcardDataAPIKeys } from '../../types';

import { trackFormSuccess } from './trackers';
import type { OuterProps, GiftcardFormValues } from './types';
import {
  GiftcardSchema,
  FIELD_PRICE_MAX,
  FIELD_PRICE_MIN,
  FIELD_ERROR_MAX_PRICE_LOWER_THAN_MIN_PRICE,
} from './schema';

const INITIAL_FORM_DATA: GiftcardFormValues = {
  name: '',
  cover: undefined,
  description: '',
  price: FIELD_PRICE_MIN,
  manager_only: false,
  unlimited: false,
  expiration_days: 365,
  available_payment_method_identifiers: [CB.id],
  tags_on_consumer_item_creation: [],
  bookkeeping_account: null,
  is_shared_giftcard: false,
  hasCustomPrice: false,
  min_price: FIELD_PRICE_MIN,
  max_price: FIELD_PRICE_MAX,
};

export const GiftcardFormHOC = withFormik<OuterProps, GiftcardFormValues>({
  /**
   * Use props to define Formik values, that can be accessed with props.values
   * Return GiftcardFormValues
   */
  mapPropsToValues: ({ initial }) => {
    if (!initial) {
      return INITIAL_FORM_DATA;
    }

    return {
      // Default data that are in Giftcard but not in GiftcardTemplate
      bookkeeping_account: INITIAL_FORM_DATA.bookkeeping_account,
      tags_on_consumer_item_creation:
        INITIAL_FORM_DATA.tags_on_consumer_item_creation,
      is_shared_giftcard: INITIAL_FORM_DATA.is_shared_giftcard,
      // Override with values of the initial object
      ...initial,
      // Transform data to fit Form usage and prefill numeric fields
      price: initial.price ? Number(initial.price) : INITIAL_FORM_DATA.price,
      max_price: initial.max_price ?? INITIAL_FORM_DATA.max_price,
      min_price: initial.min_price ?? INITIAL_FORM_DATA.min_price,
      expiration_days:
        initial.expiration_days ?? INITIAL_FORM_DATA.expiration_days,
      unlimited: !initial.expiration_days,
      hasCustomPrice: !initial.price,
    };
  },
  validationSchema: GiftcardSchema,
  enableReinitialize: true,
  handleSubmit: (values, { props, setSubmitting, setFieldError }) => {
    /**
     * Sanitize prices values to correspond to backend
     */
    const { price, minPrice, maxPrice, cardType } = values.hasCustomPrice
      ? {
          minPrice: values.min_price,
          maxPrice: values.max_price,
          price: null,
          cardType: GIFTCARD_TYPES.CUSTOM,
        }
      : {
          minPrice: null,
          maxPrice: null,
          price: values.price,
          cardType: GIFTCARD_TYPES.FIXED,
        };

    // Check that minPrice < maxPrice. If not, raises a specific error.
    if (values.hasCustomPrice && minPrice && maxPrice && minPrice > maxPrice) {
      setFieldError('max_price', FIELD_ERROR_MAX_PRICE_LOWER_THAN_MIN_PRICE);
      setSubmitting(false);
      return;
    }

    /**
     * Transform Form Values (FE form) into form-data (BE payload)
     */
    const formData = new FormData();

    const appendField = (key: GiftcardDataAPIKeys, value: unknown) => {
      if (value === undefined || value === null) {
        return; // skip nulls (or use formData.append(key, '') if backend wants empty)
      }

      if (value instanceof Blob) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        // Append a [] at the end of the key to inform it's array
        formData.append(`${key}[]`, JSON.stringify(value));
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        // number, string, boolean
        formData.append(key, String(value));
      }
    };

    // Append fields
    appendField('name', values.name);
    appendField('description', values.description);
    appendField('price', price);
    appendField('manager_only', values.manager_only);
    appendField(
      'expiration_days',
      values.unlimited ? '' : values.expiration_days,
    );
    appendField('bookkeeping_account', values.bookkeeping_account);
    appendField(
      'available_payment_method_identifiers',
      values.available_payment_method_identifiers,
    );
    appendField(
      'tags_on_consumer_item_creation',
      values.tags_on_consumer_item_creation,
    );
    appendField('min_price', minPrice);
    appendField('max_price', maxPrice);
    appendField('card_type', cardType);

    // Cover: only append if it's a file (not an existing URL)
    if (values.cover && typeof values.cover !== 'string') {
      appendField('cover', values.cover);
    }

    // Submit transformed data
    props.onSubmit(formData, {
      onSuccess: () => {
        trackFormSuccess(props.initial?.id);
        setSubmitting(false);
      },
      onError: () => {
        setSubmitting(false);
      },
    });
  },
});
