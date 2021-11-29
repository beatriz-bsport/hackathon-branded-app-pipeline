// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { withTranslation, TFunction } from 'react-i18next';
import omit from 'lodash/omit';

import * as Yup from 'yup';
import { withFormik, FieldArray } from 'formik';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CB } from '@bsport/common/lib/master-data/payment-methods';
import PaymentMethodSelectorField from '../../payment/components/PaymentMethodSelectorField.component';

import {
  TextField,
  PriceField,
  PercentField,
  CheckboxField,
} from '../../../components/forms';

import PaymentPackListItem from '../../payment-packs/components/PaymentPackListItem.component';
import PaymentPackSelector from '../../payment-packs/components/PaymentPackSelector.component';
import ShopItemListItem from '../../shop/components/ShopItemListItem.component';
import ShopItemSelector from '../../shop/components/ShopItemSelector.component';
import PrivatePassSelector from '../../private-service/components/pass/PrivatePassSelector.component';
import PrivatePassListItem from '../../private-service/components/pass/PrivatePassListItem.component';

import type { PaymentPack } from '../../payment-packs/types';
import type { ShopItem } from '../../shop/types';
import type { PrivatePass } from '../../private-service/types';

type Props = {
  t: TFunction,
  classes: Object,
  paymentPackList: Array<PaymentPack>,
  shopItemList: Array<ShopItem>,
  privatePassList: Array<PrivatePass>,
  values: PaymentComboFieldsSchema,
  privatePassListLoading: boolean,
  relatedPrivatePass: Array<PrivatePass>,
};

function repeat(arr, n) {
  const a = [];
  // eslint-disable-next-line
  for (let i = 0; i < n; [i++].push.apply(a, arr));
  return a;
}

const repeatQuantity = (combo_items) => [
  ...combo_items.reduce(
    (acc, pp) => [...acc, ...repeat([pp.id], pp.quantity)],
    [],
  ),
];

export const PaymentComboForm = (props: Props) => (
  <div>
    <TextField
      name="name"
      label={props.t('form.name.label')}
      required
      fullWidth
    />
    <div className={props.classes.description}>
      <TextField
        name="description"
        label={props.t('form.description.label')}
        multiline
        variant="outlined"
        rows={10}
        fullWidth
        required
      />
    </div>
    <TextField
      id="textfield_restrictions_maxpurchase"
      label={props.t('form.maxPurchasePerMember.label')}
      type="number"
      fullWidth
      name="max_purchase_per_member"
      helperText={props.t('form.maxPurchasePerMember.helperText')}
    />
    <fieldset className={props.classes.fieldset}>
      <legend>{props.t('form.content')}</legend>
      <FieldArray name="payment_pack_ids">
        {({
          push,
          remove,
          form: {
            values: { payment_pack_ids },
          },
        }) => (
          <div>
            <PaymentPackSelector
              paymentPacks={props.paymentPackList}
              nullCurrentValue
              helperText={props.t('form.selectorPlaceholder.paymentPack')}
              onChange={(id) => {
                if (id) push(id);
              }}
            />
            {payment_pack_ids.map((id, i) => (
              <PaymentPackListItem
                key={`${id}-${i}`}
                pack={props.paymentPackList.find((pp) => pp.id === id)}
                onDelete={() => remove(i)}
              />
            ))}
          </div>
        )}
      </FieldArray>
      <FieldArray name="shop_item_ids">
        {({
          push,
          remove,
          form: {
            values: { shop_item_ids },
          },
        }) => (
          <div>
            <ShopItemSelector
              shopItemList={props.shopItemList}
              nullCurrentValue
              helperText={props.t('form.selectorPlaceholder.shopitem')}
              onChange={(id) => {
                if (id) push(id);
              }}
            />
            {shop_item_ids.map((id, i) => (
              <ShopItemListItem
                key={`${id}-${i}`}
                dense
                shopitem={props.shopItemList.find((si) => si.id === id)}
                onDelete={() => remove(i)}
              />
            ))}
          </div>
        )}
      </FieldArray>
      <FieldArray name="private_pass_ids">
        {({
          push,
          remove,
          form: {
            values: { private_pass_ids },
          },
        }) => (
          <div>
            <PrivatePassSelector
              privatePassList={props.privatePassList}
              helperText={props.t('form.selectorPlaceholder.privatePass')}
              nullCurrentValue
              onChange={(id) => {
                if (id) push(id);
              }}
            />
            {props.privatePassListLoading ? (
              <div>{props.relatedPrivatePass && <CircularProgress />}</div>
            ) : (
              private_pass_ids.map((id, i) => {
                const passes = Object.values(
                  props.relatedPrivatePass || {},
                ).concat(Object.values(props.privatePassList));
                const pass = passes.find((pp) => pp.id === id);
                if (pass) {
                  return (
                    <PrivatePassListItem
                      key={`${id}-${i}`}
                      dense
                      pass={pass}
                      onDelete={() => remove(i)}
                    />
                  );
                }
                return null;
              })
            )}
          </div>
        )}
      </FieldArray>
    </fieldset>
    <PriceField
      name="price"
      fullWidth
      required
      label={props.t('form.price.label')}
    />
    <PercentField
      name="tax"
      fullWidth
      required
      step={0.005}
      label={props.t('form.tax.label')}
    />
    <CheckboxField
      label={props.t('form.manager_only.label')}
      name="manager_only"
    />
    <div className={props.classes.fieldset}>
      <PaymentMethodSelectorField
        name="available_payment_method_identifiers"
        disabled={props.values.manager_only}
        asFieldset
        label={props.t('form.available_payment_method_identifiers.label')}
        helperText={props.t(
          'form.available_payment_method_identifiers.helperText',
        )}
      />
    </div>
    <CheckboxField
      label={props.t('form.new_member_only.label')}
      name="new_member_only"
      disabled={props.values.manager_only}
    />
  </div>
);

const styles = (theme) => ({
  description: {
    marginTop: theme.spacing(4),
  },
  max_purchase_per_member: null,
  fieldset: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
});

export const PaymentComboFieldsSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  max_purchase_per_member: Yup.number().nullable(),
  price: Yup.number().min(0),
  tax: Yup.number().min(0).max(100),
  manager_only: Yup.boolean(),
  new_member_only: Yup.boolean(),
  available_payment_method_identifiers: Yup.array()
    .of(Yup.number().integer())
    .min(1),
});

export const PaymentComboFormHoc = withFormik({
  mapPropsToValues: ({ initial }) => {
    if (initial) {
      return {
        ...initial,
        payment_pack_ids: repeatQuantity(initial.payment_packs),
        shop_item_ids: repeatQuantity(initial.shop_items),
        private_pass_ids: repeatQuantity(initial.private_passes),
        new_member_only: initial.new_member_only,
      };
    }
    return {
      name: '',
      description: '',
      max_purchase_per_member: 0,
      price: 10,
      tax: 20,
      manager_only: false,
      new_member_only: false,
      shop_item_ids: [],
      payment_pack_ids: [],
      private_pass_ids: [],
      available_payment_method_identifiers: [CB.id],
    };
  },
  validationSchema: PaymentComboFieldsSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(omit(values, ['payment_packs', 'private_passes', 'shop_items']), {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default compose(
  withTranslation(['paymentCombo']),
  withStyles(styles),
)(PaymentComboForm);
