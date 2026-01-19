import React from 'react';
import { useTranslation } from 'react-i18next';
import omit from 'lodash/omit';
import clsx from 'clsx';
import * as Yup from 'yup';
import { withFormik, FieldArray, useFormikContext } from 'formik';

import { ButtonBase } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

import { DateTime } from 'luxon';

import { CB } from '@bsport/common/lib/master-data/payment-methods.js';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import InfoIcon from '@material-ui/icons/Info';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
// @ts-expect-error
import PaymentMethodSelectorField from '#src/libs/payment/components/PaymentMethodSelectorField.component';
import { provincialTaxHelperText } from '#src/libs/theme/utils';
import ToolTip from '#src/components/Tooltip.component';

import PaymentPackListItem from '#src/libs/payment-packs/components/PaymentPackListItem.component';
// @ts-expect-error
import ShopItemListItem from '#src/libs/shop/components/ShopItemListItem.component';
import PrivatePassListItem from '#src/libs/private-service/components/pass/PrivatePassListItem.component';

import { PaymentCombo, PaymentComboItem } from '#src/libs/payment-combo/types';
import { PrivatePass } from '#src/libs/private-service/types';
import { getCurrencyDisplay } from '#src/libs/theme/selectors';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { SwitchField } from '#src/libs/custom-form/components/GenericFormik.input';
import { Tag, TagGroup } from '#src/libs/tag/types';
import TagSelector from '#src/libs/tag/components/TagSelector.selector';
import TagGroupDuplicatedAlert from '#src/libs/tag/components/TagGroupDuplicatedAlert.component';

import { useHasTagsSameGroup } from '#src/libs/tag/components/hooks';
import BookkeepingAccountSelector from '#src/libs/payment/components/BookkeepingAccountSelector';
import type { BookkeepingAccount } from '#src/libs/payment/types';
import { PaymentPack } from '#src/libs/payment-packs/types';
import { paymentPackOption } from '#src/libs/payment-packs/components/PaymentPackSelector.component';
import { shopItemOption } from '#src/libs/shop/components/ShopItemSelector.component';
import { privatePassOption } from '#src/libs/private-service/components/pass/PrivatePassSelector.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import { SelectOption } from '#src/libs/types';
import { useObjectSearch } from '#src/libs/fuzzy-search/hooks/useObjectSearch';
import { ShopItem } from '#src/libs/shop/types';
import Config from '../../../config';
import { ALMOST_100 } from '../../../constants';
import {
  TextField,
  PriceField,
  PercentField,
  CheckboxField,
  DateField,
  // @ts-expect-error
} from '../../../components/forms';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';

const { trackFormAdd, trackFormSuccess } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.PaymentCombo,
  );

type Props = {
  provincialTax: number;
  values: PaymentCombo;
  privatePassListLoading: boolean;
  relatedPrivatePassList: Array<PrivatePass>;
  initial: PaymentCombo;
  tagList: Array<Tag<TagGroup>>;
  bookkeepingAccounts: BookkeepingAccount[];
  bookkeepingAccountById: Record<number, BookkeepingAccount>;
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
  values,
  privatePassListLoading,
  relatedPrivatePassList,
  initial,
  tagList,
  bookkeepingAccountById,
  bookkeepingAccounts,
}) => {
  const { t } = useTranslation('paymentCombo');
  const classes = useStyles();

  const [openAdvancedOptions, setOpenAdvancedOptions] = React.useState(false);

  React.useEffect(() => {
    trackFormAdd(initial?.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const provincialTaxText = React.useMemo(
    () => provincialTaxHelperText(values.tax, provincialTax, t),
    [values.tax, provincialTax, t],
  );

  const { values: valuesFormik, setFieldValue } = useFormikContext();

  const { getResultsById } = useObjectSearch();

  const shouldDisplayNewSubscriptionContracts = useSafeFlag(
    FeatureFlags.NEW_SUBSCRIPTION_CONTRACTS,
  );

  const isEmpty =
    // @ts-expect-error
    !valuesFormik.payment_pack_ids.length &&
    // @ts-expect-error
    !valuesFormik.shop_item_ids.length &&
    // @ts-expect-error
    !valuesFormik.private_pass_ids.length;

  const onChangeTagsOnAcquisition = React.useCallback(
    (items: Array<{ label: string; value: number; tag: Tag<TagGroup> }>) => {
      return setFieldValue(
        'tags_on_consumer_item_creation',
        items.map((item) => item.value),
      );
    },
    [setFieldValue],
  );

  const formatOptions = React.useCallback(
    (options: PrivatePass[] | ShopItem[] | PaymentPack[]) => {
      /**
       * Here the use of "pp" is because we use the components from the old selectors, which require it.
       * Those will be refactored when deleting the old selectors.
       */
      return options.map((option) => ({
        label: option.name,
        value: option.id,
        pp: option,
      }));
    },
    [],
  );

  const setBookkeepingAccount = React.useCallback(
    (bookkeepingAccountId: number) => {
      setFieldValue('bookkeeping_account', bookkeepingAccountId);
      const tax = bookkeepingAccountById[bookkeepingAccountId]?.vat_rate;
      if (tax) {
        setFieldValue('tax', tax);
        setFieldValue('use_payment_combo_tax_on_items', true);
      } else {
        setFieldValue('tax', initial?.tax || 0);
        setFieldValue(
          'use_payment_combo_tax_on_items',
          initial?.use_payment_combo_tax_on_items || false,
        );
      }
    },
    [
      setFieldValue,
      bookkeepingAccountById,
      initial?.tax,
      initial?.use_payment_combo_tax_on_items,
    ],
  );

  const onDeleteTagsOnAcquisition = React.useCallback(
    (itemId: number) =>
      setFieldValue(
        'tags_on_consumer_item_creation',
        values?.tags_on_consumer_item_creation?.filter(
          (tagId) => tagId !== itemId,
        ),
      ),
    [setFieldValue, values?.tags_on_consumer_item_creation],
  );

  const allPackTagIds = React.useMemo(() => {
    const selectedPaymentPackTags = (values.payment_packs ?? [])
      .map(
        (paymentComboItem) =>
          getResultsById('payment_pack')[paymentComboItem.id],
      )
      .filter((paymentPack) => !!paymentPack)
      .map((paymentPack) => paymentPack?.tags_on_consumer_item_creation)
      .flat();

    const selectedShopItemTags = (values.shop_items ?? [])
      .map(
        (paymentComboItem) => getResultsById('shop_item')[paymentComboItem.id],
      )
      .filter((shopItem) => !!shopItem)
      .map((shopItem) => shopItem?.tags_on_purchase)
      .flat();

    const selectedPrivatePassTags = (values.private_passes ?? [])
      .map(
        (paymentComboItem) =>
          getResultsById('private_pass')[paymentComboItem.id],
      )
      .filter((privatePass) => !!privatePass)
      .map((privatePass) => privatePass?.tags_on_consumer_item_creation)
      .flat();

    const allPackTags = [].concat(
      selectedPaymentPackTags,
      selectedShopItemTags,
      selectedPrivatePassTags,
      values?.tags_on_consumer_item_creation,
    );

    return [...new Set(allPackTags)];
  }, [
    getResultsById,
    values.payment_packs,
    values.private_passes,
    values.shop_items,
    values?.tags_on_consumer_item_creation,
  ]);

  const hasItemsWithTagsSameGroup = useHasTagsSameGroup({
    selectedTagsIds: allPackTagIds,
    tagsWithGroup: tagList,
  });
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
              <ObjectSearchComponent
                additionalParams={{
                  id__not_in: f.form.values.payment_pack_ids,
                  ...(shouldDisplayNewSubscriptionContracts && {
                    from_subscription: false,
                  }),
                }}
                components={{
                  Option: paymentPackOption,
                }}
                initialValues={f.form.values.payment_pack_ids}
                onChange={({ value }: SelectOption<number>) => {
                  f.push(value);
                }}
                optionsFormatter={formatOptions}
                placeholder={t('form.selectorPlaceholder.paymentPack')}
                searchedObjectType="payment_pack"
                value={[]}
              />
              {f.form.values.payment_pack_ids.map((id: number, i: number) => (
                <PaymentPackListItem
                  key={`${id}-${i}`}
                  asStandardPass
                  dense
                  isPaperVariant
                  onDelete={() => f.remove(i)}
                  pack={getResultsById('payment_pack')[id]}
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
              <ObjectSearchComponent
                additionalParams={{
                  disabled: false,
                  id__not_in: shop_item_ids,
                }}
                components={{
                  Option: shopItemOption,
                }}
                onChange={({ value }: SelectOption<number>) => {
                  push(value);
                }}
                optionsFormatter={formatOptions}
                placeholder={
                  !['production', 'staging'].includes(
                    Config.REACT_APP_SENTRY_ENVIRONMENT,
                  )
                    ? t('form.selectorPlaceholder.shopItemExcludingvariant')
                    : t('form.selectorPlaceholder.shopitem')
                }
                searchedObjectType="shop_item"
                value={[]}
              />
              {shop_item_ids.map((id: number, i: number) => (
                <ShopItemListItem
                  key={`${id}-${i}`}
                  dense
                  isPaperVariant
                  onDelete={() => remove(i)}
                  shopitem={getResultsById('shop_item')[id]}
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
              <ObjectSearchComponent
                additionalParams={{
                  id__not_in: private_pass_ids,
                  ...(shouldDisplayNewSubscriptionContracts && {
                    from_subscription: false,
                  }),
                }}
                components={{
                  Option: privatePassOption,
                }}
                getOptionLabel={(option) => option.label}
                onChange={({ value }: SelectOption<number>) => {
                  push(value);
                }}
                optionsFormatter={formatOptions}
                placeholder={t('form.selectorPlaceholder.privatePass')}
                searchedObjectType="private_pass"
                value={[]}
              />

              {privatePassListLoading ? (
                <div>{relatedPrivatePassList && <CircularProgress />}</div>
              ) : (
                private_pass_ids.map((id: number, i: number) => {
                  const pass =
                    getResultsById('private_pass')[id] ||
                    Object.values(relatedPrivatePassList).find(
                      (p) => p.id === id,
                    );
                  if (pass) {
                    return (
                      <PrivatePassListItem
                        key={`${id}-${i}`}
                        asStandardPass
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
      <div className={classes.fieldset}>
        <PriceField
          fullWidth
          required
          label={t('form.price.label')}
          name="price"
        />
      </div>

      <div className={clsx(classes.fieldset, classes.container)}>
        <SwitchField
          label={t('form.highlightedAsRecommended.label')}
          name="highlighted_as_recommended"
        />
        <Typography color="textSecondary" variant="caption">
          {t('form.highlightedAsRecommended.helperText')}
        </Typography>
      </div>
      <CheckboxField
        // @ts-expect-error
        disabled={!!valuesFormik.bookkeeping_account}
        helperText={t('form.usePaymentComboTaxOnItems.helperText')}
        label={t('form.usePaymentComboTaxOnItems.label')}
        name="use_payment_combo_tax_on_items"
      />
      {
        // @ts-expect-error
        valuesFormik.use_payment_combo_tax_on_items && (
          <PercentField
            fullWidth
            required
            // @ts-expect-error
            disabled={!!valuesFormik.bookkeeping_account}
            FormHelperTextProps={{
              classes: { root: classes.helperTextError },
            }}
            helperText={provincialTaxText}
            label={t('form.tax.label')}
            name="tax"
            step={0.005}
          />
        )
      }
      {
        // @ts-expect-error
        valuesFormik.use_payment_combo_tax_on_items && (
          <BookkeepingAccountSelector
            bookkeepingAccountById={bookkeepingAccountById}
            bookkeepingAccounts={bookkeepingAccounts}
            // @ts-expect-error
            selectedBookkeepingAccountId={valuesFormik.bookkeeping_account}
            setFieldValue={setBookkeepingAccount}
          />
        )
      }
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

      <Collapse
        // @ts-expect-error
        in={values.expiration_date_active}
      >
        <InputLabel className={classes.inputLabelExpirationDate}>
          {t('form.expiration_date.helperText')}
        </InputLabel>
        <DateField
          allowNullValue
          format="D"
          minDate={DateTime.now()}
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

      <div className={classes.section} id="payment-combo-form-advanced-section">
        <ButtonBase
          className={classes.advancedOptionsHeader}
          onClick={() => setOpenAdvancedOptions(!openAdvancedOptions)}
        >
          <SettingsIcon
            // @ts-expect-error
            className={classes.settings}
          />
          <Typography variant="h6">
            {t('form.advancedOptions.header')}
          </Typography>
          {openAdvancedOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ButtonBase>

        <Collapse in={openAdvancedOptions}>
          <div className={classes.section}>
            <Typography className={classes.title}>
              {t('form.advancedOptions.tag.tagsOnAcquisition')}
            </Typography>
            <Typography
              // @ts-expect-error
              className={classes.helperText}
              variant="caption"
            >
              {t('form.advancedOptions.tag.tagsOnAcquisitionHelper')}
            </Typography>
            <TagSelector
              closeMenuOnSelect
              inScrollBar
              isClearable
              allTagsWithTagGroup={tagList || []}
              onChange={onChangeTagsOnAcquisition}
              onDeleteTag={onDeleteTagsOnAcquisition}
              placeholder={t('form.advancedOptions.tag.selectTags')}
              selectedTags={values.tags_on_consumer_item_creation}
              variant={'exclusive'}
            />
            {hasItemsWithTagsSameGroup && (
              <TagGroupDuplicatedAlert
                tagGroupDuplicatedText={t(
                  'form.advancedOptions.tag.tagGroupDuplicated',
                )}
              />
            )}
          </div>
        </Collapse>
      </div>
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
  advancedOptionsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(2),
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  title: {
    fontWeight: 500,
    color: '#000',
  },
}));

export const PaymentComboFieldsSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  max_purchase_per_member: Yup.number().min(0).nullable(),
  price: Yup.number().min(0),
  use_payment_combo_tax_on_items: Yup.boolean(),
  tax: Yup.number().min(0).max(ALMOST_100).default(0),
  manager_only: Yup.boolean(),
  new_member_only: Yup.boolean(),
  available_payment_method_identifiers: Yup.array()
    .of(Yup.number().integer())
    .min(1),
  shop_item_ids: Yup.array().of(Yup.number()),
  private_pass_ids: Yup.array().of(Yup.number()),
  unusable_by_staff: Yup.boolean(),
  expiration_date: Yup.date().nullable(),
  highlighted_as_recommended: Yup.boolean(),
  tags_on_consumer_item_creation: Yup.array().of(Yup.number().integer()),
});

export const PaymentComboFormHoc = withFormik({
  // @ts-expect-error
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
        expiration_date: initial.expiration_date
          ? DateTime.fromISO(initial.expiration_date)
          : null,
        tags_on_consumer_item_creation:
          initial.tags_on_consumer_item_creation || [],
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
      highlighted_as_recommended: false,
      tags_on_consumer_item_creation: [],
    };
  },
  validationSchema: PaymentComboFieldsSchema,
  handleSubmit: (
    valuesFormik,
    // @ts-expect-error
    { props: { onSubmit, initial }, setSubmitting },
  ) => {
    const valuesFormikBase = {
      ...valuesFormik,
      max_purchase_per_member: valuesFormik.max_purchase_per_member || '0',
      is_usable_by_staff: !valuesFormik.unusable_by_staff,
      expiration_date:
        valuesFormik.expiration_date_active && valuesFormik.expiration_date
          ? valuesFormik.expiration_date.toISODate()
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
