import React, { useCallback, useState } from 'react';

import { useFormikContext } from 'formik';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import CardMedia from '@material-ui/core/CardMedia';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { provincialTaxHelperText } from '#src/libs/theme/utils';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';

import { useHasTagsSameGroup } from '#src/libs/tag/components/hooks';

import NumericInput from '#src/components/input/NumericInput.component';
import PriceInput from '#src/components/input/PriceInput.component';
// @ts-expect-error
import ImageUploader from '#src/components/input/ImageUploader.component';
import PaymentMethodSelectorInput from '#src/libs/payment/components/PaymentMethodSelectorInput.component';
import BookkeepingAccountSelector from '#src/libs/payment/components/BookkeepingAccountSelector';
import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
import TagSelector from '#src/libs/tag/components/TagSelector.selector';
import TagGroupDuplicatedAlert from '#src/libs/tag/components/TagGroupDuplicatedAlert.component';

import type {
  ShopItemBarcodeUnicity,
  ShopSupplier,
  ShopSupplierTemplate,
} from '#src/libs/shop/types';
import type { ShopItemFormValues } from '#src/libs/shop/components/ShopItemFormReworked/types';
import type { BookkeepingAccount } from '#src/libs/payment/types';
import type { SelectOption } from '#src/libs/types';
import type { Tag, TagGroup, TagGroupAPI } from '#src/libs/tag/types';
import type { OptionCallback } from '#src/state/types';

import { ALMOST_100 } from '#src/constants';
import { MAX_DESCRIPTION_LENGTH } from '#src/libs/shop/constants';

const SHOP_ITEM_SUPPLIER_FIELD_LABEL = 'shop-item-supplier-selector-label';
const FRANCHISOR_SHOP_ITEM_COMPANY_FIELD_LABEL =
  'franchisor-shop-item-company-selector-label';

const ShopItemPreview: React.FC<{
  previewURL?: string;
}> = ({ previewURL }) => {
  const classes = useStyles();

  return previewURL ? (
    <CardMedia className={classes.shopItemPreviewMedia} image={previewURL} />
  ) : (
    <div className={classes.shopItemPreviewContainer}>
      <Grid
        container
        item
        alignItems="center"
        className={classes.shopItemPreviewGrid}
        justifyContent="center"
      >
        <LocalDrinkIcon className={classes.shopItemPreivewIcon} />
      </Grid>
    </div>
  );
};

type Props = {
  handleCancel: () => void;
  isLoading?: boolean;
  isEditForm?: boolean;
  provincialTax?: number;
  supplierList: ShopSupplier[] | ShopSupplierTemplate[];
  franchiseCompanyListOptions?: SelectOption[];
  bookkeepingAccounts?: BookkeepingAccount[];
  bookkeepingAccountById?: Record<number, BookkeepingAccount>;
  initialValues: ShopItemFormValues;
  tagList?: Tag<TagGroupAPI>[];
  showBarcodeUnicityWarning?: boolean;
  checkBarcodeUnicity?: (
    barcode: string,
    options?: OptionCallback<ShopItemBarcodeUnicity>,
  ) => void;
};

const ShopItemFormProductStep: React.FC<Props> = ({
  handleCancel,
  isLoading,
  isEditForm,
  provincialTax,
  supplierList,
  franchiseCompanyListOptions,
  bookkeepingAccounts,
  bookkeepingAccountById,
  initialValues,
  tagList,
  showBarcodeUnicityWarning,
  checkBarcodeUnicity,
}) => {
  const { t } = useTranslation(['translation', 'theme', 'common', 'shop']);

  const classes = useStyles();

  const { values, errors, handleChange, setFieldValue } =
    useFormikContext<ShopItemFormValues>();

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const hasTagsSameGroup = useHasTagsSameGroup({
    selectedTagsIds: values?.tagsOnPurchase,
    // @ts-expect-error
    tagsWithGroup: tagList ?? [],
  });

  const handleSelectPaymentMethods = useCallback(
    (paymentMethodIdentifiers: number[]) => {
      setFieldValue(
        'availablePaymentMethodIdentifiers',
        paymentMethodIdentifiers,
      );
    },
    [setFieldValue],
  );

  const handleBookkeepingAccountChange = useCallback(
    (bookkeepingAccountId: number) => {
      setFieldValue('bookkeepingAccount', bookkeepingAccountId);
      if (bookkeepingAccountId) {
        const vat_rate = bookkeepingAccountById[bookkeepingAccountId].vat_rate;
        setFieldValue('tva', vat_rate);
      } else {
        setFieldValue('tva', initialValues?.tva || 0);
      }
    },
    [setFieldValue, bookkeepingAccountById, initialValues.tva],
  );

  const handleChangeCover = useCallback(
    (cover: File) => {
      if (cover) {
        setFieldValue('cover', cover);
      }
    },
    [setFieldValue],
  );

  const handleChangeFranchiseComanyList = useCallback(
    (companyList: SelectOption[]) => {
      setFieldValue('franchiseCompanyList', companyList);
    },
    [setFieldValue],
  );

  const handleToggleAdvancedSettings = useCallback(
    () => setShowAdvancedSettings((prevState) => !prevState),
    [],
  );

  const handleDeleteTagOnPurchase = useCallback(
    (id: number) => {
      const filteredTagList = values.tagsOnPurchase.filter(
        (tagId) => tagId !== id,
      );
      setFieldValue('tagsOnPurchase', filteredTagList);
    },
    [setFieldValue, values.tagsOnPurchase],
  );

  const handleChangeTagOnPurchase = useCallback(
    (options: { label: string; value: number; tag: Tag<TagGroup> }[]) =>
      setFieldValue(
        'tagsOnPurchase',
        options.map((option) => option.value),
      ),
    [setFieldValue],
  );

  const handleCheckBarcodeUnicity = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const target = event.target;
      if (target.value && target.value !== initialValues?.barcode) {
        checkBarcodeUnicity?.(target.value);
      }
    },
    [checkBarcodeUnicity, initialValues?.barcode],
  );

  const provincialTaxText = provincialTaxHelperText(
    values.tva,
    provincialTax,
    t,
  );

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <div className={classes.paddingTop}>
            <ImageUploader initial={values.cover} onChange={handleChangeCover}>
              <ShopItemPreview />
            </ImageUploader>
          </div>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            error={!!errors.name}
            helperText={t(errors.name)}
            inputProps={{ maxLength: 200 }}
            label={t('translation:form.shop.item.name')}
            name="name"
            onChange={handleChange}
            value={values.name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            error={!!errors.subtitle}
            helperText={t(errors.subtitle)}
            label={t('translation:form.shop.item.subtitle')}
            name="subtitle"
            onChange={handleChange}
            value={values.subtitle}
          />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.description}>
            <TextField
              fullWidth
              multiline
              color="secondary"
              error={!!errors.description}
              helperText={t(errors.description)}
              inputProps={{ maxLength: MAX_DESCRIPTION_LENGTH }}
              label={t('translation:form.shop.item.description')}
              minRows={5}
              name="description"
              onChange={handleChange}
              value={values.description}
              variant="outlined"
            />
          </div>
        </Grid>
        <Grid item xs={6}>
          <PriceInput
            fullWidth
            required
            error={!!errors.price}
            helperText={t(errors.price)}
            label={t('translation:common.price')}
            name="price"
            onChange={handleChange}
            value={values.price}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <PriceInput
            fullWidth
            required
            error={!!errors.supplierPrice}
            helperText={t(errors.supplierPrice)}
            label={t('translation:shop.supplier_price')}
            name="supplierPrice"
            onChange={handleChange}
            value={values.supplierPrice}
            variant="outlined"
          />
        </Grid>
        {!!bookkeepingAccountById && !!bookkeepingAccounts && (
          <Grid item xs={12}>
            <BookkeepingAccountSelector
              bookkeepingAccountById={bookkeepingAccountById}
              bookkeepingAccounts={bookkeepingAccounts}
              selectedBookkeepingAccountId={values.bookkeepingAccount}
              setFieldValue={handleBookkeepingAccountChange}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <NumericInput
            fullWidth
            required
            disabled={!!values.bookkeepingAccount}
            error={!!errors.tva}
            helperText={t(errors.tva)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputProps: { min: 0, max: ALMOST_100, step: 0.005 },
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            label={t('translation:form.shop.item.tva')}
            name="tva"
            onChange={handleChange}
            value={values.tva}
            variant="outlined"
          />
          {!!provincialTaxText && (
            <Typography color="error" variant="body2">
              {provincialTaxText}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel
              className={classes.supplierSelectorLabel}
              id={SHOP_ITEM_SUPPLIER_FIELD_LABEL}
            >
              {t('translation:form.shop.item.supplier')}
            </InputLabel>
            <Select
              label={t('translation:form.shop.item.supplier')}
              labelId={SHOP_ITEM_SUPPLIER_FIELD_LABEL}
              name="supplier"
              onChange={handleChange}
              value={values.supplier}
              variant="outlined"
            >
              <MenuItem disabled value="">
                {t('translation:form.shop.item.supplier')}
              </MenuItem>
              {(supplierList || []).map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {franchiseCompanyListOptions?.length > 0 && (
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel
                className={classes.supplierSelectorLabel}
                id={FRANCHISOR_SHOP_ITEM_COMPANY_FIELD_LABEL}
              >
                {t('translation:form.shop.item.studios')}
              </InputLabel>
              <MaterialUISelector
                isMulti
                defaultNumberShown={1}
                error={!!errors.franchiseCompanyList}
                name="franchiseCompanyList"
                onChange={handleChangeFranchiseComanyList}
                options={franchiseCompanyListOptions}
                placeholder={t('translation:form.shop.item.studios')}
                value={values.franchiseCompanyList}
              />
            </FormControl>
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={<Checkbox checked={values.marketplaceEnabled} />}
          label={t('translation:form.shop.item.marketplace_enabled')}
          name="marketplaceEnabled"
          onChange={handleChange}
        />
      </Grid>
      <div className={classes.marketplaceSettings}>
        <Grid item xs={12}>
          <PaymentMethodSelectorInput
            disabled={!values.marketplaceEnabled}
            helperText={t(
              'translation:form.shop.item.available_payment_method_identifiers.helperText',
            )}
            label={t(
              'translation:form.shop.item.available_payment_method_identifiers.label',
            )}
            onChange={handleSelectPaymentMethods}
            paymentMethodIds={values.availablePaymentMethodIdentifiers}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={values.featured}
                disabled={!values.marketplaceEnabled}
              />
            }
            label={t('translation:form.shop.item.featured')}
            name="featured"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={values.sellOnlyOnProvision}
                disabled={!values.marketplaceEnabled}
              />
            }
            label={t('translation:form.shop.item.sell_only_on_provision')}
            name="sellOnlyOnProvision"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={values.isDeliverable}
                disabled={!values.marketplaceEnabled}
              />
            }
            label={t('translation:form.shop.item.is_deliverable')}
            name="isDeliverable"
            onChange={handleChange}
          />
        </Grid>
      </div>
      <Grid container className={classes.barcodeContainer} spacing={4}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            color="secondary"
            error={!!errors.barcode}
            helperText={t(errors.barcode)}
            label={t('translation:form.shop.item.barcode')}
            name="barcode"
            onBlur={handleCheckBarcodeUnicity}
            onChange={handleChange}
            value={values.barcode}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            color="secondary"
            error={!!errors.stockKeepingUnit}
            helperText={t(errors.stockKeepingUnit)}
            label={t('translation:form.shop.item.sku')}
            name="stockKeepingUnit"
            onChange={handleChange}
            value={values.stockKeepingUnit}
            variant="outlined"
          />
        </Grid>
      </Grid>

      {(tagList ?? []).length > 0 && (
        <Grid item xs={12}>
          <ButtonBase
            className={classes.advancedSettingsButton}
            onClick={handleToggleAdvancedSettings}
          >
            <SettingsIcon />
            <Typography variant="h6">
              {t('translation:form.shop.item.advancedOptions.header')}
            </Typography>
            {showAdvancedSettings ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ButtonBase>

          <Collapse in={showAdvancedSettings}>
            <Grid
              container
              className={classes.advancedSettingsContainer}
              spacing={4}
            >
              <Grid item className={classes.tagsOnPurchaseContainer} xs={12}>
                <Typography>
                  {t(
                    'translation:form.shop.item.advancedOptions.tag.tagsOnAcquisition',
                  )}
                </Typography>
                <Typography variant="caption">
                  {t(
                    'translation:form.shop.item.advancedOptions.tag.tagsOnAcquisitionHelper',
                  )}
                </Typography>
                <TagSelector
                  closeMenuOnSelect
                  inScrollBar
                  isClearable
                  allTagsWithTagGroup={tagList ?? []}
                  onChange={handleChangeTagOnPurchase}
                  onDeleteTag={handleDeleteTagOnPurchase}
                  placeholder={t(
                    'translation:form.shop.item.advancedOptions.tag.selectTags',
                  )}
                  selectedTags={values.tagsOnPurchase}
                  variant={'exclusive'}
                />
                {hasTagsSameGroup && <TagGroupDuplicatedAlert />}
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      )}

      <div className={classes.buttons}>
        {showBarcodeUnicityWarning && (
          <Alert severity="warning">
            {t('shop:shopItemDetail.barcodeUnicityWarning')}
          </Alert>
        )}

        {isLoading ? (
          <CircularProgress />
        ) : (
          <React.Fragment>
            <Button className={classes.button} onClick={handleCancel}>
              {t('common:cancel')}
            </Button>
            <Button
              className={classes.button}
              color="primary"
              type="submit"
              variant="contained"
            >
              {isEditForm
                ? t('translation:common.save')
                : t('translation:common.continue')}
            </Button>
          </React.Fragment>
        )}
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingBottom: theme.spacing(2),
  },
  provisions: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  cover: {
    height: 70,
    width: 70,
  },
  description: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  barcodeContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
  },
  advancedSettingsContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(2),
  },
  advancedSettingsButton: {
    width: '100%',
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-start',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  tagsOnPurchaseContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  header: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  price: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(-2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  marketplaceSettings: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    paddingBottom: 0,
    marginBottom: theme.spacing(1),
    border: '1px solid #E2E2E2',
    backgroundColor: '#F8F8F8',
    borderRadius: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  paddingTop: {
    paddingTop: theme.spacing(2),
  },
  shopItemPreviewMedia: {
    height: 70,
    width: 70,
    borderRadius: theme.spacing(4),
  },
  shopItemPreviewContainer: {
    backgroundColor: '#F2F2F2',
    borderRadius: 35,
    height: 70,
    width: 70,
  },
  shopItemPreviewGrid: { height: '100%', width: '100%' },
  shopItemPreivewIcon: {
    height: 40,
    width: 40,
  },
  supplierSelectorLabel: {
    // class properties to fix default MUI position with label
    top: '-7px',
    left: '14px',
  },
}));

export default React.memo(ShopItemFormProductStep);
