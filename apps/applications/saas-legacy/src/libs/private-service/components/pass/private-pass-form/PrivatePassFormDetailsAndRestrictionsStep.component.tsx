import React, { useState } from 'react';
import {
  Typography,
  ButtonBase,
  Button,
  makeStyles,
  type Theme,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import PaymentIcon from '@material-ui/icons/Payment';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import DateRangeIcon from '@material-ui/icons/DateRange';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import InputLabel from '@material-ui/core/InputLabel';
import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
} from '@bsport/common/lib/master-data/payment-pack.js';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import { useFormikContext, type FormikProps, FieldArray } from 'formik';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import { DateTime } from 'luxon';
import { CB } from '@bsport/common/lib/master-data/payment-methods.js';
import { PrivatePassFormValues as FormikValues } from './PrivatePassForm.component';
import TagSelector from '#src/libs/tag/components/TagSelector.selector';
import TagGroupDuplicatedAlert from '#src/libs/tag/components/TagGroupDuplicatedAlert.component';
// @ts-expect-error
import PaymentMethodSelectorField from '../../../../payment/components/PaymentMethodSelectorField.component';
import {
  DateField,
  PriceField,
  TextField,
  SwitchField,
  IntegerField,
  PercentField,
  RadioGroupField,
  // @ts-expect-error
} from '#src/components/forms';
import { getValidityInfo, filterPrivateService } from '../../../utils';
// @ts-expect-error
import PrivatePassCategorySelector from '#src/libs/payment-packs/components/category/PaymentPackCategorySelector.component';
import { PrivateServiceListItem } from '../../service/PrivateServiceListItem.component';
import { PrivateServiceSelector } from '../../service/PrivateServiceSelector.component';
import { PrivateSlotSelectionDialog } from '../../slot/PrivateSlotSelectionDialog.component';
import UniversalPassFormPaymentPackCompatibility from '../../../../universal-pass/components/UniversalPassFormPaymentPackCompatibility.component';
import ToolTip from '#src/components/Tooltip.component';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import BookkeepingAccountSelector from '#src/libs/payment/components/BookkeepingAccountSelector';
import { getCurrencyDisplay } from '#src/libs/theme/selectors';
import type {
  CompatiblePrivateService,
  PrivatePassCategory,
  PrivatePassWithCompatibility,
  PrivateServiceWithSlots,
  PrivateSlot,
  ServiceCompatibilityPass,
} from '#src/libs/private-service/types';
import type { BookkeepingAccount } from '#src/libs/payment/types';
import {
  getDecimalCreditHelperText,
  provincialTaxHelperText,
} from '#src/libs/theme/utils';
import { ALMOST_100 } from '#src/constants';
import type { SCT } from '#src/libs/category/types';
import type { Tag, TagGroup } from '#src/libs/tag/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { Establishment } from '#src/libs/establishment/types';
import { useHasTagsSameGroup } from '#src/libs/tag/components/hooks';
import { FeatureList } from '#src/libs/company/types';
import { hasAnyUpsell } from '#src/libs/platform-billing/utils';
import {
  UPSELL_IDENTIFIER_ACCESS_MONITORING,
  UPSELL_IDENTIFIER_KISI_INTEGRATION,
} from '#src/libs/platform-billing/upsell-identifiers';
// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc.js';
import PrivatePassFormAccessControl from './PrivatePassFormAccessControl.component';

type PrivatePassFormDetailsAndRestrictionsStepProps = {
  initial?: PrivatePassWithCompatibility<PaymentPack>;
  privatePassCategories: Array<PrivatePassCategory>;
  compatibleServicePass: Array<ServiceCompatibilityPass>;
  bookkeepingAccounts: BookkeepingAccount[];
  bookkeepingAccountById: Record<number, BookkeepingAccount>;
  provincialTax: number;
  privateServices: Array<PrivateServiceWithSlots>;

  categoryList: Array<SCT>;
  establishmentList: Array<Establishment>;
  metaActivityList: Array<MetaActivity>;
  tagList: Array<Tag<TagGroup>>;
};

export const getExcludedSlots = (
  ps: PrivateServiceWithSlots,
  cps: Array<CompatiblePrivateService>,
): number[] => {
  const ps_cps: CompatiblePrivateService = cps.find(
    (cps_elt) => cps_elt.private_service === ps.id,
  );
  return ps_cps.excluded_slot_ids;
};

export const getIncludedSlots = (
  ps: PrivateServiceWithSlots,
  cps: Array<CompatiblePrivateService>,
): PrivateSlot[] => {
  const excluded_slots = getExcludedSlots(ps, cps);
  return excluded_slots?.length
    ? ps.slots.filter((slot) => !excluded_slots.includes(slot.id))
    : ps.slots;
};

const PrivatePassFormDetailsAndRestrictionsStep = (
  props: PrivatePassFormDetailsAndRestrictionsStepProps,
) => {
  const classes = useStyles();
  const { t } = useTranslation('privateService');
  const {
    values,
    initialValues,
    setValues,
    setFieldValue,
  }: FormikProps<FormikValues> = useFormikContext();
  const { privateServices } = props;
  const [disabledUniversalPassFields, setDisableUniversalPassFields] =
    React.useState<boolean>(false);
  const [openAdvancedOptions, setOpenAdvancedOptions] = React.useState(false);
  const [openDeleteCompatibilityDialog, setOpenDeleteCompatibilityDialog] =
    useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);

  React.useEffect(() => {
    if (values.is_universal_pass) {
      setValues({
        ...values,
        available_payment_method_identifiers: [CB.id],
      });
      setDisableUniversalPassFields(true);
    } else {
      setDisableUniversalPassFields(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.is_universal_pass, setValues, setDisableUniversalPassFields]);

  const setBookkeepingAccount = React.useCallback(
    (bookkeepingAccountId: number) => {
      setFieldValue('bookkeeping_account', bookkeepingAccountId);
      const tax = props.bookkeepingAccountById[bookkeepingAccountId]?.vat_rate;
      if (tax) {
        setFieldValue('tax', tax);
      } else {
        setFieldValue('tax', initialValues?.tax || 0);
      }
    },
    [setFieldValue, props.bookkeepingAccountById, initialValues?.tax],
  );

  const provincialTaxText = React.useMemo(
    () => provincialTaxHelperText(values.tax, props.provincialTax, t),
    [values.tax, props.provincialTax, t],
  );

  const creditHelperText = React.useMemo(
    () =>
      getDecimalCreditHelperText(
        values.credits,
        'privatePass.form.credits.decimalCredit.helperText',
        t,
        t('privatePass.form.credits.helperText'),
      ),
    [values.credits, t],
  );

  const isCreatingPass = !props.initial?.id;

  const is_shared_from_franchise = React.useMemo(
    () =>
      !!props.initial?.template_instance ||
      !!props.initial?.linked_payment_pack_template_instance,
    [
      props.initial?.linked_payment_pack_template_instance,
      props.initial?.template_instance,
    ],
  );

  const setServiceAndIndex = (ps: PrivateServiceWithSlots, index: number) => {
    setSelectedService(ps);
    setSelectedServiceIndex(index);
  };

  const updateSlotData = React.useCallback(
    (
      data: {
        excluded_slot_ids: number[];
      },
      replace: { (index: number, value: any): void },
    ) => {
      replace(selectedServiceIndex, {
        private_service: selectedService.id,
        excluded_slot_ids: data.excluded_slot_ids,
      });
      setServiceAndIndex(null, null);
    },
    [selectedService, selectedServiceIndex],
  );

  const onChangeTagsOnAcquisition = React.useCallback(
    (items: Array<{ label: string; value: number; tag: Tag<TagGroup> }>) => {
      return setFieldValue(
        'tags_on_consumer_item_creation',
        items.map((item) => item.value),
      );
    },
    [setFieldValue],
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

  const setCategory = React.useCallback(
    (item: { value: number; label: string }) =>
      setFieldValue('category', item ? item.value : null),
    [setFieldValue],
  );

  const hasTagsSameGroup = useHasTagsSameGroup({
    selectedTagsIds: values?.tags_on_consumer_item_creation,
    tagsWithGroup: props.tagList,
  });

  const onEditSomething = React.useCallback(
    (ps: PrivateServiceWithSlots) => {
      if (props.compatibleServicePass) {
        const psListForIndex: number[] = values.compatibility?.map(
          (p_s: { private_service: any }) => p_s.private_service,
        );
        setServiceAndIndex(ps, psListForIndex.indexOf(ps.id));
      }
    },
    [props.compatibleServicePass, values.compatibility],
  );

  return (
    <>
      {is_shared_from_franchise && (
        <div className={classes.row}>
          <WarningIcon color="error" />
          <Typography color="error" variant="body1">
            {t('privatePass.form.franchise')}
          </Typography>
        </div>
      )}
      <div
        className={classes.categoryBlock}
        id="private-pass-form-general-section"
      >
        {props.initial && props.initial.linked_payment_pack && (
          <div className={classes.infoText}>
            <WarningIcon className={classes.redIcon} />
            <Typography color="error" variant="caption">
              {t('privatePass.form.universalPass.warningIsUniversalPass')}
            </Typography>
          </div>
        )}
        <div className={classes.flexRowCenter}>
          <InfoIcon className={classes.iconLeft} />
          <Typography variant="h6">
            {t('privatePass.form.categoryTitle.info')}
          </Typography>
        </div>

        <TextField
          fullWidth
          disabled={is_shared_from_franchise}
          helperText={t('privatePass.form.name.helperText')}
          id="private-pass-name-field"
          label={`${t('privatePass.form.name.label')}*`}
          name="name"
        />
        <TextField
          fullWidth
          multiline
          disabled={is_shared_from_franchise}
          id="private-pass-description-field"
          label={t('privatePass.form.description.label')}
          minRows={6}
          name="description"
          variant="outlined"
        />
        <div className={classes.fieldBlock}>
          <PrivatePassCategorySelector
            closeMenuOnSelect
            isClearable
            noMulti
            nullCurrentValue={!!values.category}
            onChange={setCategory}
            packPackCategoryList={props.privatePassCategories}
            value={values.category}
          />
        </div>
        <div className={classes.fieldBlock}>
          <TextField
            fullWidth
            disabled={props.initial && props.initial.editable === false}
            helperText={creditHelperText}
            id="private-pass-credit-field"
            label={t('privatePass.form.credits.label')}
            name="credits"
            type="number"
          />
        </div>
        <div className={classes.fieldBlock}>
          <PriceField
            fullWidth
            className={classes.priceField}
            disabled={is_shared_from_franchise}
            helperText={t('privatePass.form.price.helperText')}
            id="private-pass-price-field"
            label={t('privatePass.form.price.label')}
            name="price"
          />
        </div>
        <div className={classes.fieldBlock}>
          <BookkeepingAccountSelector
            bookkeepingAccountById={props.bookkeepingAccountById}
            bookkeepingAccounts={props.bookkeepingAccounts}
            selectedBookkeepingAccountId={values.bookkeeping_account}
            setFieldValue={setBookkeepingAccount}
          />
        </div>
        <div className={classes.fieldBlock}>
          <PercentField
            fullWidth
            required
            className={classes.taxField}
            disabled={is_shared_from_franchise || !!values.bookkeeping_account}
            FormHelperTextProps={{ classes: { root: classes.helperTextError } }}
            helperText={provincialTaxText}
            id="private-pass-tax-field"
            InputProps={{
              inputProps: { min: 0, max: ALMOST_100, step: 0.005 },
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            label={t('privatePass.form.tax.label')}
            max={ALMOST_100}
            name="tax"
            type="number"
          />
        </div>
        <div
          className={classes.fieldBlockFlex}
          id="private-pass-universal-switch-field-container"
        >
          <SwitchField
            disabled={props.initial || !!props.initial?.linked_payment_pack}
            label={t('privatePass.form.universalPass.label')}
            name="is_universal_pass"
          />
          <Typography color="textSecondary" variant="caption">
            {t('privatePass.form.universalPass.helperText')}
          </Typography>
        </div>
        <div
          className={`${classes.fieldBlock} ${classes.flexColumn}`}
          id="private-pass-switch-fields-container"
        >
          <SwitchField
            disabled={is_shared_from_franchise}
            label={t('privatePass.form.managerOnly.label')}
            name="manager_only"
          />
          <SwitchField
            disabled={values.manager_only}
            helperText={t('member:forms.newMemberOnlyHelperText', {
              currency: getCurrencyDisplay(),
            })}
            label={t('privatePass.form.new_member_only.label')}
            name="new_member_only"
          />
          <SwitchField
            label={t('privatePass.form.full_vod_access.label')}
            name="full_vod_access"
          />
          <SwitchField
            disabled={is_shared_from_franchise}
            label={t('privatePass.listItem.unusableByStaff')}
            name="unusable_by_staff"
          />
          <SwitchField
            helperText={t('privatePass.form.appliesForPayroll.helperText')}
            label={t('privatePass.form.appliesForPayroll.label')}
            name="applies_for_payroll"
          />
          <SwitchField
            helperText={t('privatePass.form.onBehalfOfTeacher.helperText')}
            label={t('privatePass.form.onBehalfOfTeacher.label')}
            name="on_behalf_of_teacher"
          />
          <div className={classes.rowExpirationDate}>
            <SwitchField
              disabled={is_shared_from_franchise}
              label={t('privatePass.form.expiration_date.label')}
              name="expiration_date_active"
            />
            <ToolTip title={t('privatePass.form.expiration_date.tooltip')}>
              <InfoIcon color="disabled" />
            </ToolTip>
          </div>
          <Collapse in={values.expiration_date_active}>
            <InputLabel className={classes.inputLabelExpirationDate}>
              {t('privatePass.form.expiration_date.helperText')}
            </InputLabel>
            <DateField
              allowNullValue
              disabled={is_shared_from_franchise}
              format="D"
              minDate={DateTime.now()}
              name="expiration_date"
            />
          </Collapse>
        </div>
      </div>

      <Divider className={classes.divider} />
      <FeatureListProvider featureList={['privatePassAccessControl']}>
        {(featureList: FeatureList) => {
          const hasAccessControlUpsell = hasAnyUpsell(featureList, [
            UPSELL_IDENTIFIER_KISI_INTEGRATION,
            UPSELL_IDENTIFIER_ACCESS_MONITORING,
          ]);

          return (
            hasAccessControlUpsell && (
              <>
                <div className={classes.formContainer}>
                  <PrivatePassFormAccessControl />
                </div>
              </>
            )
          );
        }}
      </FeatureListProvider>
      <Divider className={classes.divider} />

      <div
        className={classes.categoryBlock}
        id="private-pass-form-payment-section"
      >
        <div className={classes.flexRowCenter}>
          <PaymentIcon className={classes.iconLeft} />
          <Typography variant="h6">
            {t('privatePass.form.categoryTitle.paymentMeans')}
          </Typography>
        </div>
        <div className={classes.fieldBlock}>
          <Typography
            className={classes.paymentMeansHelpertext}
            variant="body2"
          >
            {t(
              'privatePass.form.available_payment_method_identifiers.helperText',
            )}
          </Typography>
          <div
            className={values.manager_only ? classes.paymentMethodSelector : ''}
          >
            <div
              className={`${classes.paymentMethodMeansInfo} ${classes.flexRowCenter}`}
            >
              <ReportProblemOutlinedIcon
                className={`${classes.leftIcon} ${classes.yellowIcon}`}
              />
              <Typography variant="caption">
                {t(
                  'privatePass.form.available_payment_method_identifiers.warning',
                )}
              </Typography>
            </div>
            <PaymentMethodSelectorField
              disabled={values.manager_only || disabledUniversalPassFields}
              name="available_payment_method_identifiers"
            />
          </div>
        </div>
      </div>

      <Divider className={classes.divider} />

      <div
        className={classes.categoryBlock}
        id="private-pass-form-validity-section"
      >
        <div className={classes.flexRowCenter}>
          <DateRangeIcon className={classes.iconLeft} />
          <Typography variant="h6">
            {t('privatePass.form.categoryTitle.validity')}
          </Typography>
        </div>
        <div className={`${classes.durationNbBlock} ${classes.flexRowCenter}`}>
          <IntegerField
            fullWidth
            disabled={props.initial && props.initial.editable === false}
            id="private-pass-duration-days"
            InputProps={{ min: 0, max: 30, step: 1 }}
            label={t('privatePass.form.durationDays.label')}
            name="duration_days"
            style={{ alignSelf: 'flex-start' }}
          />
          <AddIcon className={classes.greyIcon} />
          <IntegerField
            fullWidth
            disabled={props.initial && props.initial.editable === false}
            helperText={t('privatePass.form.durationMonths.helperText')}
            id="private-pass-duration-months"
            InputProps={{ min: 0, max: 24, step: 1 }}
            label={t('privatePass.form.durationMonths.label')}
            name="duration_months"
          />
          <AddIcon className={classes.greyIcon} />
          <IntegerField
            fullWidth
            disabled={props.initial && props.initial.editable === false}
            helperText={t('privatePass.form.durationYears.helperText')}
            id="private-pass-duration-years"
            InputProps={{ min: 0, max: 30, step: 1 }}
            label={t('privatePass.form.durationYears.label')}
            name="duration_years"
          />
        </div>
        <Typography variant="caption">
          {
            // @ts-expect-error
            getValidityInfo(values, t, true, true)
          }
        </Typography>
        <div style={{ paddingBottom: 16 }}>
          <Typography className={classes.startDate} variant="body1">
            {t('privatePass.form.startDate')}
          </Typography>
          <RadioGroupField
            choices={[
              {
                label: t('privatePass.form.start_date_method.on_purchase'),
                value: START_ON_PURCHASE,
              },
              {
                label: t('privatePass.form.start_date_method.on_booking'),
                value: START_ON_FIRST_BOOKING,
              },
            ]}
            disabled={
              (props.initial && props.initial.editable === false) ||
              disabledUniversalPassFields
            }
            name="start_date_method"
          />
          <Collapse in={values.start_date_method !== `${START_ON_PURCHASE}`}>
            <TextField
              fullWidth
              className={classes.firstBooking}
              disabled={props.initial && props.initial.editable === false}
              helperText={t(
                'privatePass.form.expirationDaysBeforeFirstUse.helperText',
              )}
              id="private-pass-expiration-field"
              label={t('privatePass.form.expirationDaysBeforeFirstUse.label')}
              name="expiration_days_before_first_use"
              type="number"
            />
          </Collapse>
        </div>
      </div>

      <Divider className={classes.divider} />

      <div
        className={classes.categoryBlock}
        id="private-pass-form-compatibility-section"
      >
        <div className={classes.flexRowCenter}>
          <DoneAllIcon className={classes.iconLeft} />
          <Typography variant="h6">
            {t('privatePass.form.categoryTitle.compatibility')}
          </Typography>
        </div>

        <div className={classes.fieldBlock}>
          <FieldArray {...props} name="compatibility">
            {({ remove, push, replace }) => {
              return (
                <>
                  <ObjectLevelPermissionProviderComponent requiredPermission="product.privatePass.allowed_actions.compatibility">
                    {(canEditCompatibilities: boolean) => (
                      <>
                        {(canEditCompatibilities || isCreatingPass) && (
                          <div className={classes.privateServiceSelector}>
                            <PrivateServiceSelector
                              onChange={(e: any) =>
                                push({
                                  private_service: e,
                                  excluded_slot_ids: [],
                                })
                              }
                              placeholder={t(
                                'privatePass.form.selector.privateService',
                              )}
                              privateServices={privateServices
                                .filter((ps: PrivateServiceWithSlots) =>
                                  filterPrivateService(
                                    ps,
                                    values.compatibility,
                                    false,
                                  ),
                                )
                                .filter((ps) => ps.available)}
                            />
                          </div>
                        )}
                        <List>
                          {!!values.compatibility?.length &&
                            privateServices
                              .filter((ps: PrivateServiceWithSlots) =>
                                filterPrivateService(
                                  ps,
                                  values.compatibility,
                                  true,
                                ),
                              )
                              .filter((ps) => ps.available)
                              .map((ps) => (
                                <PrivateServiceListItem
                                  key={ps.id}
                                  hideSecondary
                                  excluded_slots={getExcludedSlots(
                                    ps,
                                    values.compatibility,
                                  )}
                                  included_slots={getIncludedSlots(
                                    ps,
                                    values.compatibility,
                                  )}
                                  isEditable={
                                    canEditCompatibilities || isCreatingPass
                                  }
                                  onDelete={() => {
                                    const psArray: number[] =
                                      props.initial &&
                                      props.initial.compatibility?.length
                                        ? props.initial.compatibility.map(
                                            (p_s) => p_s.private_service,
                                          )
                                        : [];
                                    const psListForIndex: number[] =
                                      values.compatibility?.map(
                                        (p_s: { private_service: any }) =>
                                          p_s.private_service,
                                      );
                                    if (
                                      props.initial &&
                                      psArray.includes(ps.id)
                                    ) {
                                      setSelectedServiceIndex(
                                        psListForIndex.indexOf(ps.id),
                                      );
                                      setOpenDeleteCompatibilityDialog(true);
                                    } else {
                                      remove(psListForIndex.indexOf(ps.id));
                                    }
                                  }}
                                  onEdit={() => onEditSomething(ps)}
                                  privateService={ps}
                                />
                              ))}

                          {!values.compatibility.length && (
                            <ListItem
                              divider
                              alignItems="center"
                              className={classes.emptyListItem}
                            >
                              <ReportProblemIcon
                                className={classes.reportProblemIcon}
                              />
                              <ListItemText
                                primary={
                                  <div>
                                    <Typography variant="subtitle2">
                                      {t(
                                        'privatePass.compatibleServices.isEmpty',
                                      )}
                                    </Typography>
                                    <Typography variant="body2">
                                      {t(
                                        'privatePass.compatibleServices.unusable',
                                      )}
                                    </Typography>
                                  </div>
                                }
                              />
                            </ListItem>
                          )}
                        </List>
                      </>
                    )}
                  </ObjectLevelPermissionProviderComponent>
                  <PrivateSlotSelectionDialog
                    compatibility={values.compatibility}
                    compatibleServicePass={props.compatibleServicePass}
                    onCancel={() => setServiceAndIndex(null, null)}
                    onSubmit={(data: { excluded_slot_ids: number[] }) =>
                      updateSlotData(data, replace)
                    }
                    privateServices={props.privateServices}
                    selectedService={selectedService}
                  />
                  <Dialog open={!!openDeleteCompatibilityDialog}>
                    <DialogTitle>
                      {t('privateServiceCompatibility.delete.title')}
                    </DialogTitle>
                    <DialogContent>
                      {t('privateServiceCompatibility.delete.explain')}
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => {
                          setSelectedServiceIndex(null);
                          setOpenDeleteCompatibilityDialog(false);
                        }}
                      >
                        {t('privateServiceCompatibility.delete.cancel')}
                      </Button>
                      <Button
                        onClick={() => {
                          remove(selectedServiceIndex);
                          setSelectedServiceIndex(null);
                          setOpenDeleteCompatibilityDialog(false);
                        }}
                      >
                        {t('privateServiceCompatibility.delete.submit')}
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              );
            }}
          </FieldArray>
        </div>
      </div>

      <Divider className={classes.divider} />

      {values.is_universal_pass && (
        <>
          <UniversalPassFormPaymentPackCompatibility
            categoryList={props.categoryList}
            establishmentList={props.establishmentList}
            metaActivityList={props.metaActivityList}
          />
          <Divider className={classes.divider} />
        </>
      )}

      <div
        className={classes.categoryBlock}
        id="private-pass-form-advanced-section"
      >
        <ButtonBase
          className={classes.advancedOptionsHeader}
          onClick={() => setOpenAdvancedOptions(!openAdvancedOptions)}
        >
          <SettingsIcon />
          <Typography variant="h6">
            {t('privatePass.form.advancedOptions.header')}
          </Typography>
          {openAdvancedOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ButtonBase>

        <Collapse in={openAdvancedOptions}>
          <div className={classes.section}>
            <Typography className={classes.title}>
              {t('privatePass.form.advancedOptions.tag.tagsOnAcquisition')}
            </Typography>
            <Typography variant="caption">
              {t(
                'privatePass.form.advancedOptions.tag.tagsOnAcquisitionHelper',
              )}
            </Typography>
            <TagSelector
              closeMenuOnSelect
              inScrollBar
              isClearable
              allTagsWithTagGroup={props.tagList || []}
              onChange={onChangeTagsOnAcquisition}
              onDeleteTag={onDeleteTagsOnAcquisition}
              placeholder={t('privatePass.form.advancedOptions.tag.selectTags')}
              selectedTags={values.tags_on_consumer_item_creation}
            />
            {hasTagsSameGroup && <TagGroupDuplicatedAlert />}
          </div>
        </Collapse>
      </div>

      <Divider className={classes.divider} />
    </>
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  fieldBlock: {
    marginBottom: theme.spacing(2),
  },
  fieldBlockFlex: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItem: 'center',
    flexDirection: 'column',
  },
  buttonContainer: {
    marginTop: -theme.spacing(2),
    justifyContent: 'flex-end',
    padding: theme.spacing(4),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  iconLeft: {
    marginRight: theme.spacing(2),
    color: '#868686',
  },
  priceField: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  taxField: {
    marginLeft: theme.spacing(1),
    alignSelf: 'flex-start',
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
    height: 2,
    color: '#C6C6C6',
  },
  formContainer: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
  },
  categoryBlock: {
    paddingBottom: theme.spacing(2),
  },
  paymentMeansHelpertext: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  yellowIcon: {
    color: '#FFA71D',
  },
  durationNbBlock: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  startDate: {
    color: 'rgba(0, 0, 0, 0.6)',
    marginTop: theme.spacing(3),
  },
  greyIcon: {
    color: '#868686',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexRowCenter: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },

  firstBooking: {
    marginTop: theme.spacing(2),
  },
  reportProblemIcon: {
    color: '#E35D4D',
    fontSize: 32,
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(2),
  },
  emptyListItem: {
    borderLeft: '5px solid',
    borderLeftColor: '#E35D4D',
    boxShadow: '0px 1px 3px 0.3px rgba(0, 0, 0, 0.25)',
  },
  paymentMethodMeansInfo: {
    backgroundColor: 'white',
    position: 'relative',
    zIndex: 5,
    top: theme.spacing(7.5),
    marginLeft: theme.spacing(5),
    marginTop: -theme.spacing(4),
    visibility: 'hidden',
  },
  paymentMethodSelector: {
    marginTop: theme.spacing(1),
    '&:hover': {
      '& $paymentMethodMeansInfo': {
        visibility: 'visible',
      },
    },
  },
  privateServiceSelector: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    maxWidth: 600,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: theme.spacing(4),

    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  helperTextError: {
    color: theme.palette.error.main,
  },
  infoText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  redIcon: {
    color: 'red',
  },
  rowExpirationDate: {
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

export default PrivatePassFormDetailsAndRestrictionsStep;
