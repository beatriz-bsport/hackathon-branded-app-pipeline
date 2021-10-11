import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { CB } from '@bsport/common/lib/master-data/payment-methods';
import Collapse from '@material-ui/core/Collapse';
import PaymentMethodSelectorField from '../../payment/components/PaymentMethodSelectorField.component';
import {
  TextField,
  PriceField,
  IntegerField,
  CheckboxField,
  SwitchField,
} from '../../../components/forms';
import ImageField from '../../../components/forms/ImageField.component';

type Props = {
  values: any;
};

const GiftcardForm = (props: Props) => {
  const { t } = useTranslation(['giftcard']);
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <ImageField name="cover" />
      <TextField
        label={t('form.giftcard.name.label')}
        className={classes.fullwidth}
        name="name"
      />
      <TextField
        className={classes.fullwidth}
        name="description"
        multiline
        variant="outlined"
        label={t('form.giftcard.description.label')}
      />
      <fieldset className={classes.parameterContainer}>
        <legend>{t('form.giftcard.section.parameters.title')}</legend>
        <PriceField
          name="price"
          label={t('form.giftcard.price.label')}
          helperText={t('form.giftcard.price.helperText')}
        />
        <Collapse in={!props.values.unlimited}>
          <IntegerField
            name="expiration_days"
            label={t('form.giftcard.expiration_days.label')}
            helperText={t('form.giftcard.expiration_days.helperText')}
          />
        </Collapse>
        <CheckboxField
          name="unlimited"
          label={t('form.giftcard.unlimited.label')}
        />
      </fieldset>
      <SwitchField
        name="manager_only"
        label={t('form.giftcard.manager_only.label')}
      />
      <PaymentMethodSelectorField
        name="available_payment_method_identifiers"
        disabled={props.values.manager_only}
        asFieldset
        label={t('form.giftcard.available_payment_method_identifiers.label')}
        helperText={t(
          'form.giftcard.available_payment_method_identifiers.helperText',
        )}
      />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    '&>*': {
      marginBottom: theme.spacing(3),
    },
  },
  fullwidth: {
    width: '100%',
  },
  parameterContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    '&>*': {
      marginBottom: theme.spacing(1),
    },
  },
}));

export default GiftcardForm;

export const GiftcardSchema = Yup.object().shape({
  name: Yup.string().required(),
  cover: Yup.object().nullable(),
  description: Yup.string().required(),
  price: Yup.number().required().min(1),
  manager_only: Yup.boolean(),
  unlimited: Yup.boolean(),
  available_payment_method_identifiers: Yup.array().of(Yup.number()),
  expiration_days: Yup.number().nullable().min(1),
});

export const GiftcardFormFieldHOC = withFormik({
  // eslint-disable-next-line
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
      };
    }
    return {
      ...initial,
      unlimited: !initial.expiration_days,
      expiration_days: initial.expiration_days || 30,
    };
  },
  validationSchema: GiftcardSchema,
  handleSubmit: (
    values,
    {
      props,
      setSubmitting,
    }: { props: Props; setSubmitting: (state: boolean) => void },
  ) => {
    const keys = [
      'description',
      'name',
      'price',
      'manager_only',
      'expiration_days',
    ];
    const { cover } = values;
    const formData = new FormData();
    if (typeof cover !== 'string' && !!cover) {
      formData.append('cover', cover);
    }
    keys.forEach((key) => {
      if (key === 'expiration_days') {
        if (values.unlimited) {
          formData.append(key, '');
        } else {
          formData.append(key, values.expiration_days);
        }
      } else {
        formData.append(key, values[key]);
      }
    });
    formData.append(
      'available_payment_method_identifiers[]',
      JSON.stringify(values.available_payment_method_identifiers),
    );
    props.onSubmit(formData, {
      onSuccess: () => {
        if (props.onSuccess && typeof props.onSuccess === 'function')
          props.onSuccess();
        setSubmitting(false);
      },
      onError: () => {
        if (props.onError && typeof props.onError === 'function')
          props.onError();
        setSubmitting(false);
      },
    });
  },
});

export const GiftcardFormComposed = GiftcardFormFieldHOC(GiftcardForm);
