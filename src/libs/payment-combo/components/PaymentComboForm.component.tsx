import React from 'react';
import { useTranslation } from 'react-i18next';
import omit from 'lodash/omit';
import * as Yup from 'yup';
import { withFormik, FieldArray, useFormikContext } from 'formik';

import makeStyles from '@material-ui/core/styles/makeStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

import { CB } from '@bsport/common/lib/master-data/payment-methods';
import PaymentMethodSelectorField from '../../payment/components/PaymentMethodSelectorField.component';
import { provincialTaxHelperText } from '../../theme/utils';
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

import { PaymentCombo, PaymentComboItem } from '../types';
import { PaymentPack } from '../../payment-packs/types';
import { ShopItem } from '../../shop/types';
import { PrivatePass } from '../../private-service/types';
import { WithSegmentAnalyticsFormTrackerHandlers } from '#components/analytics/segment';
import { getCurrencyDisplay } from '#libs/theme/selectors';

type Props = {
  provincialTax: number;
  paymentPackList: Array<PaymentPack>;
  shopItemList: Array<ShopItem>;
  privatePassList: Array<PrivatePass>;
  values: PaymentCombo;
  privatePassListLoading: boolean;
  relatedPrivatePassList: Array<PrivatePass>;
  initial: PaymentCombo;
} & WithSegmentAnalyticsFormTrackerHandlers;

function repeat(arr: number[], n: number) {
  const a: number[] = [];
  for (let i = 0; i < n; [(i += 1)].push.apply(a, arr));
  return a;
}

const repeatQuantity = (combo_items: PaymentComboItem[]) => [
  ...combo_items.reduce(
    (acc, pp) => [...acc, ...repeat([pp.id], pp.quantity)],
    [],
  ),
];

export const PaymentComboForm: React.FC<Props> = ({
  provincialTax,
  paymentPackList,
  shopItemList,
  privatePassList,
  values,
  privatePassListLoading,
  relatedPrivatePassList,
  initial,
  formAdd,
}) => {
  const { t } = useTranslation('paymentCombo');
  const classes = useStyles();

  React.useEffect(() => {
    if (formAdd) {
      formAdd(initial && initial.id ? { payment_combo_id: initial.id } : {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const provincialTaxText = React.useMemo(
    () => provincialTaxHelperText(values.tax, provincialTax, t),
    [values.tax, provincialTax, t],
  );

  const { values: valuesFormik } = useFormikContext();

  const selectablePaymentPacks = paymentPackList
    ? paymentPackList.filter(
        (pp: PaymentPack) =>
          !pp.linked_private_pass ||
          !valuesFormik.private_pass_ids.includes(pp.linked_private_pass),
      )
    : [];

  const selectablePrivatePasses = privatePassList
    ? privatePassList.filter(
        (pp: PrivatePass) =>
          !pp.linked_payment_pack ||
          !valuesFormik.payment_pack_ids.includes(pp.linked_payment_pack),
      )
    : [];
  return (
    <div>
      <TextField name="name" label={t('form.name.label')} required fullWidth />
      <div className={classes.description}>
        <TextField
          name="description"
          label={t('form.description.label')}
          multiline
          variant="outlined"
          rows={10}
          fullWidth
          required
        />
      </div>
      <TextField
        id="textfield_restrictions_maxpurchase"
        label={t('form.maxPurchasePerMember.label')}
        type="number"
        fullWidth
        name="max_purchase_per_member"
        helperText={t('form.maxPurchasePerMember.helperText')}
      />
      <fieldset className={classes.fieldset}>
        <legend>{t('form.content')}</legend>
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
                paymentPacks={selectablePaymentPacks}
                nullCurrentValue
                helperText={t('form.selectorPlaceholder.paymentPack')}
                onChange={(id: number) => {
                  if (id) push(id);
                }}
              />
              {payment_pack_ids.map((id: number, i: number) => (
                <PaymentPackListItem
                  key={`${id}-${i}`}
                  pack={paymentPackList.find((pp) => pp.id === id)}
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
                shopItemList={shopItemList.filter((item) => !item.disabled)}
                nullCurrentValue
                helperText={t('form.selectorPlaceholder.shopitem')}
                onChange={(id: number) => {
                  if (id) push(id);
                }}
              />
              {shop_item_ids.map((id: number, i: number) => (
                <ShopItemListItem
                  key={`${id}-${i}`}
                  dense
                  shopitem={shopItemList.find((si) => si.id === id)}
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
                privatePassList={selectablePrivatePasses}
                helperText={t('form.selectorPlaceholder.privatePass')}
                nullCurrentValue
                onChange={(id: number) => {
                  if (id) push(id);
                }}
              />
              {privatePassListLoading ? (
                <div>{relatedPrivatePassList && <CircularProgress />}</div>
              ) : (
                private_pass_ids.map((id: number, i: number) => {
                  const passes = Object.values(relatedPrivatePassList).concat(
                    Object.values(privatePassList),
                  );
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
        label={t('form.price.label')}
      />
      <CheckboxField
        label={t('form.usePaymentComboTaxOnItems.label')}
        helperText={t('form.usePaymentComboTaxOnItems.helperText')}
        name="use_payment_combo_tax_on_items"
      />
      {valuesFormik.use_payment_combo_tax_on_items && (
        <PercentField
          name="tax"
          fullWidth
          required
          step={0.005}
          label={t('form.tax.label')}
          helperText={provincialTaxText}
          FormHelperTextProps={{
            classes: { root: classes.helperTextError },
          }}
        />
      )}

      <CheckboxField label={t('form.manager_only.label')} name="manager_only" />
      <div className={classes.fieldset}>
        <PaymentMethodSelectorField
          name="available_payment_method_identifiers"
          disabled={values.manager_only}
          asFieldset
          label={t('form.available_payment_method_identifiers.label')}
          helperText={t('form.available_payment_method_identifiers.helperText')}
        />
      </div>
      <CheckboxField
        label={t('form.new_member_only.label')}
        name="new_member_only"
        disabled={values.manager_only}
        helperText={t('member:forms.newMemberOnlyHelperText', {
          currency: getCurrencyDisplay(),
        })}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  description: {
    marginTop: theme.spacing(4),
  },
  max_purchase_per_member: null,
  fieldset: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  helperTextError: {
    color: theme.palette.error.main,
  },
}));

export const PaymentComboFieldsSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  max_purchase_per_member: Yup.number().nullable(),
  price: Yup.number().min(0),
  use_payment_combo_tax_on_items: Yup.boolean(),
  tax: Yup.number().min(0).max(100).default(0),
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
      use_payment_combo_tax_on_items: false,
      tax: 0,
      manager_only: false,
      new_member_only: false,
      shop_item_ids: [],
      payment_pack_ids: [],
      private_pass_ids: [],
      available_payment_method_identifiers: [CB.id],
    };
  },
  validationSchema: PaymentComboFieldsSchema,
  handleSubmit: (
    valuesFormik,
    { props: { onSubmit, formSuccess, initial }, setSubmitting },
  ) => {
    onSubmit(
      omit(valuesFormik, ['payment_packs', 'private_passes', 'shop_items']),
      {
        onSuccess: () => {
          setSubmitting(false);
          if (formSuccess) {
            formSuccess(
              initial && initial.id ? { payment_combo_id: initial.id } : {},
            );
          }
        },
        onError: () => setSubmitting(false),
      },
    );
  },
});

export default PaymentComboForm;
