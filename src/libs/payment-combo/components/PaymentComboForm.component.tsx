// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import omit from 'lodash/omit';
import * as Yup from 'yup';
import { withFormik, FieldArray, useFormikContext } from 'formik';

import makeStyles from '@material-ui/core/styles/makeStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

import moment from 'moment-timezone';
import { CB } from '@bsport/common/lib/master-data/payment-methods';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import InfoIcon from '@material-ui/icons/Info';
import Collapse from '@material-ui/core/Collapse';
import PaymentMethodSelectorField from '../../payment/components/PaymentMethodSelectorField.component';
import { provincialTaxHelperText } from '../../theme/utils';
import {
  TextField,
  PriceField,
  PercentField,
  CheckboxField,
  DateField,
} from '../../../components/forms';
import ToolTip from '#components/Tooltip.component';

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
import { getCurrencyDisplay } from '#libs/theme/selectors';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { SwitchField } from '#libs/custom-form/components/GenericFormik.input';

const { trackFormAdd, trackFormSuccess } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.PaymentCombo,
  );

type Props = {
  provincialTax: number;
  paymentPackList: Array<PaymentPack>;
  shopItemList: Array<ShopItem>;
  privatePassList: Array<PrivatePass>;
  values: PaymentCombo;
  privatePassListLoading: boolean;
  relatedPrivatePassList: Array<PrivatePass>;
  initial: PaymentCombo;
};

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
}) => {
  const { t } = useTranslation('paymentCombo');
  const classes = useStyles();

  React.useEffect(() => {
    trackFormAdd(initial?.id);

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

  const isEmpty =
    !valuesFormik.payment_pack_ids.length &&
    !valuesFormik.shop_item_ids.length &&
    !valuesFormik.private_pass_ids.length;

  return (
    <div className={classes.container}>
      <TextField fullWidth required label={t('form.name.label')} name="name" />
      <div className={classes.description}>
        <TextField
          fullWidth
          multiline
          required
          label={t('form.description.label')}
          name="description"
          rows={10}
          variant="outlined"
        />
      </div>
      <TextField
        fullWidth
        helperText={t('form.maxPurchasePerMember.helperText')}
        id="textfield_restrictions_maxpurchase"
        label={t('form.maxPurchasePerMember.label')}
        name="max_purchase_per_member"
        type="number"
      />
      <fieldset className={classes.fieldset}>
        <legend>{t('form.content')}</legend>
        <FieldArray name="payment_pack_ids">
          {(f) => (
            <div>
              <PaymentPackSelector
                nullCurrentValue
                helperText={t('form.selectorPlaceholder.paymentPack')}
                onChange={(id: number) => {
                  if (id) f.push(id);
                }}
                paymentPacks={selectablePaymentPacks}
              />
              {f.form.values.payment_pack_ids.map((id: number, i: number) => (
                <PaymentPackListItem
                  key={`${id}-${i}`}
                  onDelete={() => f.remove(i)}
                  pack={paymentPackList.find((pp) => pp.id === id)}
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
                nullCurrentValue
                helperText={t('form.selectorPlaceholder.shopitem')}
                onChange={(id: number) => {
                  if (id) push(id);
                }}
                shopItemList={shopItemList.filter((item) => !item.disabled)}
              />
              {shop_item_ids.map((id: number, i: number) => (
                <ShopItemListItem
                  key={`${id}-${i}`}
                  dense
                  onDelete={() => remove(i)}
                  shopitem={shopItemList.find((si) => si.id === id)}
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
                nullCurrentValue
                helperText={t('form.selectorPlaceholder.privatePass')}
                onChange={(id: number) => {
                  if (id) push(id);
                }}
                privatePassList={selectablePrivatePasses}
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
                        onDelete={() => remove(i)}
                        pass={pass}
                      />
                    );
                  }
                  return null;
                })
              )}
            </div>
          )}
        </FieldArray>
        {isEmpty && (
          <Typography color="error" variant="body2">
            {t('form.error.atLeastOneThing')}
          </Typography>
        )}
      </fieldset>
      <PriceField
        fullWidth
        required
        label={t('form.price.label')}
        name="price"
      />
      <CheckboxField
        helperText={t('form.usePaymentComboTaxOnItems.helperText')}
        label={t('form.usePaymentComboTaxOnItems.label')}
        name="use_payment_combo_tax_on_items"
      />
      {valuesFormik.use_payment_combo_tax_on_items && (
        <PercentField
          fullWidth
          required
          FormHelperTextProps={{
            classes: { root: classes.helperTextError },
          }}
          helperText={provincialTaxText}
          label={t('form.tax.label')}
          name="tax"
          step={0.005}
        />
      )}

      <SwitchField label={t('form.manager_only.label')} name="manager_only" />
      <SwitchField
        label={t('form.unusableByStaff.label')}
        name="unusable_by_staff"
      />
      <div className={classes.row}>
        <SwitchField
          label={t('form.expiration_date.label')}
          name="expiration_date_active"
        />
        <ToolTip title={t('form.expiration_date.tooltip')}>
          <InfoIcon color="disabled" />
        </ToolTip>
      </div>

      <Collapse in={values.expiration_date_active}>
        <InputLabel className={classes.inputLabelExpirationDate}>
          {t('form.expiration_date.helperText')}
        </InputLabel>
        <DateField
          allowNullValue
          format="L"
          minDate={moment.now()}
          name="expiration_date"
        />
      </Collapse>

      <div className={classes.fieldset}>
        <PaymentMethodSelectorField
          asFieldset
          disabled={values.manager_only}
          helperText={t('form.available_payment_method_identifiers.helperText')}
          label={t('form.available_payment_method_identifiers.label')}
          name="available_payment_method_identifiers"
        />
      </div>
      <CheckboxField
        disabled={values.manager_only}
        helperText={t('member:forms.newMemberOnlyHelperText', {
          currency: getCurrencyDisplay(),
        })}
        label={t('form.new_member_only.label')}
        name="new_member_only"
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
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
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabelExpirationDate: { marginTop: theme.spacing(1), fontSize: 12 },
}));

export const PaymentComboFieldsSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  max_purchase_per_member: Yup.number().min(0).nullable(),
  price: Yup.number().min(0),
  use_payment_combo_tax_on_items: Yup.boolean(),
  tax: Yup.number().min(0).max(100).default(0),
  manager_only: Yup.boolean(),
  new_member_only: Yup.boolean(),
  available_payment_method_identifiers: Yup.array()
    .of(Yup.number().integer())
    .min(1),
  shop_item_ids: Yup.array().of(Yup.number()),
  private_pass_ids: Yup.array().of(Yup.number()),
  unusable_by_staff: Yup.boolean(),
  expiration_date: Yup.date().nullable(),
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
        unusable_by_staff: !initial.is_usable_by_staff,
        expiration_date_active: !!initial?.expiration_date,
      };
    }
    return {
      name: '',
      description: '',
      max_purchase_per_member: null,
      price: 10,
      use_payment_combo_tax_on_items: false,
      tax: 0,
      manager_only: false,
      new_member_only: false,
      shop_item_ids: [],
      payment_pack_ids: [],
      private_pass_ids: [],
      available_payment_method_identifiers: [CB.id],
      unusable_by_staff: false,
      expiration_date: null,
      expiration_date_active: false,
    };
  },
  validationSchema: PaymentComboFieldsSchema,
  handleSubmit: (
    valuesFormik,
    { props: { onSubmit, initial }, setSubmitting },
  ) => {
    const valuesFormikBase = {
      ...valuesFormik,
      max_purchase_per_member: valuesFormik.max_purchase_per_member || '0',
      is_usable_by_staff: !valuesFormik.unusable_by_staff,
      expiration_date:
        valuesFormik.expiration_date_active && valuesFormik.expiration_date
          ? moment(valuesFormik.expiration_date).format('YYYY-MM-DD')
          : null,
    };

    onSubmit(
      omit(valuesFormikBase, ['payment_packs', 'private_passes', 'shop_items']),
      {
        onSuccess: () => {
          setSubmitting(false);

          trackFormSuccess(initial?.id);
        },
        onError: () => setSubmitting(false),
      },
    );
  },
});

export default PaymentComboForm;
