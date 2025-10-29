import { withFormik } from 'formik';
import * as Yup from 'yup';
import { CB } from '@bsport/common/lib/master-data/payment-methods.js';

import type { GiftcardDataAPIKeys } from '../../types';

import { trackFormSuccess } from './trackers';
import type { OuterProps, GiftcardFormValues } from './types';

const GiftcardSchema = Yup.object().shape({
  name: Yup.string().required(),
  cover: Yup.object().nullable(),
  description: Yup.string().required(),
  price: Yup.number().required().min(1),
  manager_only: Yup.boolean(),
  unlimited: Yup.boolean(),
  available_payment_method_identifiers: Yup.array().of(Yup.number()),
  expiration_days: Yup.number().nullable().min(1),
  tags_on_consumer_item_creation: Yup.array().of(Yup.number().integer()),
  bookkeeping_account: Yup.number().nullable(),
});

export const GiftcardFormHOC = withFormik<OuterProps, GiftcardFormValues>({
  /**
   * Use props to define Formik values, that can be accessed with props.values
   * Return GiftcardFormValues
   */
  mapPropsToValues: ({ initial }) => {
    if (!initial) {
      return {
        name: '',
        cover: '',
        description: '',
        price: 1,
        manager_only: false,
        unlimited: false,
        expiration_days: 30,
        available_payment_method_identifiers: [CB.id],
        tags_on_consumer_item_creation: [],
        bookkeeping_account: null,
        is_shared_giftcard: false,
      };
    }

    return {
      // Default data that are in Giftcard but not in GiftcardTemplate
      bookkeeping_account: null,
      tags_on_consumer_item_creation: [],
      is_shared_giftcard: false,
      // Override with values of the initial object
      ...initial,
      // Transform data to fit Form usage
      price: initial.price ? Number(initial.price) : 1,
      unlimited: !initial.expiration_days,
      expiration_days: initial.expiration_days || 30,
    };
  },
  validationSchema: GiftcardSchema,
  enableReinitialize: true,
  handleSubmit: (values, { props, setSubmitting }) => {
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
    appendField('price', values.price);
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
