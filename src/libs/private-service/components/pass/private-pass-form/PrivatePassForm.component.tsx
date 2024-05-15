import React, { MouseEvent } from 'react';
import { DateTime } from 'luxon';
import { Theme, ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import { compose, withState } from 'recompose';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import PaymentIcon from '@material-ui/icons/Payment';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import InfoIcon from '@material-ui/icons/Info';
import DateRangeIcon from '@material-ui/icons/DateRange';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { CB } from '@bsport/common/lib/master-data/payment-methods';

import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
} from '@bsport/common/lib/master-data/payment-pack';

import * as Yup from 'yup';
import {
  Form,
  withFormik,
  FieldArray,
  FormikProps,
  useFormikContext,
} from 'formik';
import WarningIcon from '@material-ui/icons/Warning';
import InputLabel from '@material-ui/core/InputLabel';
import { Tag, TagGroup } from '#libs/tag/types';
import TagSelector from '#libs/tag/components/TagSelector.selector';
import TagGroupDuplicatedAlert from '#libs/tag/components/TagGroupDuplicatedAlert.component';
import {
  DateField,
  PriceField,
  TextField,
  SwitchField,
  IntegerField,
  PercentField,
  RadioGroupField,
  // @ts-expect-error
} from '#components/forms';
import { OptionCallback } from '../../../../../state/types';
// @ts-expect-error
import PaymentMethodSelectorField from '../../../../payment/components/PaymentMethodSelectorField.component';

import {
  PrivatePassCategory,
  PrivateServiceWithSlots,
  ServiceCompatibilityPass,
  PrivateSlot,
  PrivateService,
  PrivatePassWithCompatibility,
  CompatiblePrivateService,
} from '../../../types';
import { getValidityInfo, filterPrivateService } from '../../../utils';
// @ts-expect-error
import PrivatePassCategorySelector from '#libs/payment-packs/components/category/PaymentPackCategorySelector.component';
import { PrivateServiceListItem } from '../../service/PrivateServiceListItem.component';
import { PrivateServiceSelector } from '../../service/PrivateServiceSelector.component';
import { PrivateSlotSelectionDialog } from '../../slot/PrivateSlotSelectionDialog.component';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { provincialTaxHelperText } from '#libs/theme/utils';
import type { PaymentPack } from '#libs/payment-packs/types';
import UniversalPassFormPaymentPackCompatibility from '../../../../universal-pass/components/UniversalPassFormPaymentPackCompatibility.component';
import { SCT } from '#libs/category/types';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { getCurrencyDisplay } from '#libs/theme/selectors';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { ALMOST_100 } from '../../../../../constants';
import { useHasTagsSameGroup } from '#libs/tag/components/hooks';
import BookkeepingAccountSelector from '#libs/payment/components/BookkeepingAccountSelector';
import type { BookkeepingAccount } from '#libs/payment/types';
import ToolTip from '#components/Tooltip.component';
import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

export interface FormikValues {
  name: string | null;
  category: number | null;
  tax: number;
  credits: number;
  price: number;
  manager_only: boolean;
  new_member_only: boolean;
  full_vod_access: boolean;
  duration_days: number;
  duration_months: number;
  duration_years: number;
  available_payment_method_identifiers: Array<number>;
  start_date_method: string;
  expiration_days_before_first_use: number;
  compatibility: Array<CompatiblePrivateService>;
  is_universal_pass: boolean;
  linked_payment_pack?: PaymentPack;
  linked_payment_pack_categories: Array<number>;
  linked_payment_pack_establishments: Array<number>;
  linked_payment_pack_metaActivities: Array<number>;
  unusable_by_staff: boolean;
  applies_for_payroll: boolean;
  on_behalf_of_teacher: boolean;
  expiration_date?: string;
  description?: string | null;
  tags_on_consumer_item_creation?: Array<number>;
  bookkeepingAccount: BookkeepingAccount;
}
type Props = {
  provincialTax: number;
  isSubmitting: boolean;
  onCancel: (ev: MouseEvent) => void;
  values: any;
  initial?: PrivatePassWithCompatibility<PaymentPack>;
  privatePassCategories: Array<PrivatePassCategory>;
  setFieldValue: (field_identifier: string, value: number | null) => void;

  privateServices: Array<PrivateServiceWithSlots>;
  compatibleServicePass?: Array<ServiceCompatibilityPass>;

  selectedService: PrivateService;
  setSelectedService: (ps: PrivateServiceWithSlots) => void;
  selectedServiceIndex: number;
  setSelectedServiceIndex: (index: number) => void;
  openCompatibleServiceForm: boolean;
  setOpenCompatibleServiceForm: (open: boolean) => void;
  openDeleteCompatibilityDialog: boolean;
  setOpenDeleteCompatibilityDialog: (open: boolean) => void;
  onSubmit: (data: FormikValues, options?: OptionCallback) => void;

  categoryList: Array<SCT>;
  establishmentList: Array<Establishment>;
  metaActivityList: Array<MetaActivity>;
  tagList: Array<Tag<TagGroup>>;

  bookkeepingAccounts: BookkeepingAccount[];
  bookkeepingAccountById: Record<number, BookkeepingAccount>;
} & FormikProps<FormikValues>;

const getExcludedSlots = (
  ps: PrivateServiceWithSlots,
  cps: Array<CompatiblePrivateService>,
): number[] => {
  const ps_cps: CompatiblePrivateService = cps.find(
    (cps_elt) => cps_elt.private_service === ps.id,
  );
  return ps_cps.excluded_slot_ids;
};

const getIncludedSlots = (
  ps: PrivateServiceWithSlots,
  cps: Array<CompatiblePrivateService>,
): PrivateSlot[] => {
  const excluded_slots = getExcludedSlots(ps, cps);
  return excluded_slots?.length
    ? ps.slots.filter((slot) => !excluded_slots.includes(slot.id))
    : ps.slots;
};

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.PrivatePass,
);
export const PrivatePassForm = (props: Props) => {
  React.useEffect(() => {
    trackFormAdd(props.initial?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();
  const { isSubmitting, privateServices, setFieldValue } = props;
  const [disabledUniversalPassFields, setDisableUniversalPassFields] =
    React.useState<boolean>(false);
  const [openAdvancedOptions, setOpenAdvancedOptions] = React.useState(false);
  const { values, setValues }: FormikProps<FormikValues> = useFormikContext();

  const is_universal_pass_value = React.useMemo(
    () => values.is_universal_pass,
    [values],
  );

  const hasTagsSameGroup = useHasTagsSameGroup({
    selectedTagsIds: values?.tags_on_consumer_item_creation,
    tagsWithGroup: props.tagList,
  });

  const setBookkeepingAccount = React.useCallback(
    (bookkeepingAccountId: number) => {
      setFieldValue('bookkeeping_account', bookkeepingAccountId);
      const tax = props.bookkeepingAccountById[bookkeepingAccountId]?.vat_rate;
      if (tax) {
        setFieldValue('tax', tax);
      } else {
        setFieldValue('tax', props.initialValues?.tax || 0);
      }
    },
    [setFieldValue, props.bookkeepingAccountById, props.initialValues?.tax],
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

  React.useEffect(() => {
    if (is_universal_pass_value) {
      setValues({
        ...values,
        available_payment_method_identifiers: [CB.id],
      });
      setDisableUniversalPassFields(true);
    } else {
      setDisableUniversalPassFields(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is_universal_pass_value, setValues, setDisableUniversalPassFields]);
  const setServiceAndIndex = (ps: PrivateServiceWithSlots, index: number) => {
    props.setSelectedService(ps);
    props.setSelectedServiceIndex(index);
  };

  const updateSlotData = (
    data: {
      excluded_slot_ids: number[];
    },
    replace: { (index: number, value: any): void },
  ) => {
    replace(props.selectedServiceIndex, {
      private_service: props.selectedService.id,
      excluded_slot_ids: data.excluded_slot_ids,
    });
    setServiceAndIndex(null, null);
  };
  const provincialTaxText = React.useMemo(
    () => provincialTaxHelperText(props.values.tax, props.provincialTax, t),
    [props.values.tax, props.provincialTax, t],
  );

  const isCreatingPass = !props.initial?.id;

  return (
    <Form className={classes.container} data-testid="private-pass-form">
      {!!props.initial?.template_instance && (
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
          disabled={!!props.initial?.template_instance}
          helperText={t('privatePass.form.name.helperText')}
          id="private-pass-name-field"
          label={`${t('privatePass.form.name.label')}*`}
          name="name"
        />
        <TextField
          fullWidth
          multiline
          disabled={!!props.initial?.template_instance}
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
            nullCurrentValue={!!props.values.category}
            onChange={(item: { value: number; label: string }) =>
              setFieldValue('category', item ? item.value : null)
            }
            packPackCategoryList={props.privatePassCategories}
            value={props.values.category}
          />
        </div>
        <div className={classes.fieldBlock}>
          <TextField
            fullWidth
            disabled={props.initial && props.initial.editable === false}
            helperText={t('privatePass.form.credits.helperText')}
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
            disabled={!!props.initial?.template_instance}
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
            // @ts-ignore
            selectedBookkeepingAccountId={values.bookkeeping_account}
            setFieldValue={setBookkeepingAccount}
          />
        </div>
        <div className={classes.fieldBlock}>
          <PercentField
            fullWidth
            required
            className={classes.taxField}
            disabled={
              !!props.initial?.template_instance ||
              !!props.values.bookkeeping_account
            }
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
            disabled={!!props.initial?.template_instance}
            label={t('privatePass.form.managerOnly.label')}
            name="manager_only"
          />
          <SwitchField
            disabled={props.values.manager_only}
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
            disabled={!!props.initial?.template_instance}
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
              disabled={!!props.initial?.template_instance}
              label={t('privatePass.form.expiration_date.label')}
              name="expiration_date_active"
            />
            <ToolTip title={t('privatePass.form.expiration_date.tooltip')}>
              <InfoIcon color="disabled" />
            </ToolTip>
          </div>
          {/* @ts-ignore */}
          <Collapse in={values.expiration_date_active}>
            <InputLabel className={classes.inputLabelExpirationDate}>
              {t('privatePass.form.expiration_date.helperText')}
            </InputLabel>
            <DateField
              allowNullValue
              disabled={!!props.initial?.template_instance}
              format="L"
              minDate={DateTime.now()}
              name="expiration_date"
            />
          </Collapse>
        </div>
      </div>

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
            className={
              props.values.manager_only ? classes.paymentMethodSelector : ''
            }
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
              disabled={
                props.values.manager_only || disabledUniversalPassFields
              }
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
          {getValidityInfo(props.values, t, true, true)}
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
          <Collapse
            in={props.values.start_date_method !== `${START_ON_PURCHASE}`}
          >
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
                                    props.values.compatibility,
                                    false,
                                  ),
                                )
                                .filter((ps) => ps.available)}
                            />
                          </div>
                        )}
                        <List>
                          {!!props.values.compatibility?.length &&
                            privateServices
                              .filter((ps: PrivateServiceWithSlots) =>
                                filterPrivateService(
                                  ps,
                                  props.values.compatibility,
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
                                    props.values.compatibility,
                                  )}
                                  included_slots={getIncludedSlots(
                                    ps,
                                    props.values.compatibility,
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
                                      props.values.compatibility?.map(
                                        (p_s: { private_service: any }) =>
                                          p_s.private_service,
                                      );
                                    if (
                                      props.initial &&
                                      psArray.includes(ps.id)
                                    ) {
                                      props.setSelectedServiceIndex(
                                        psListForIndex.indexOf(ps.id),
                                      );
                                      props.setOpenDeleteCompatibilityDialog(
                                        true,
                                      );
                                    } else {
                                      remove(psListForIndex.indexOf(ps.id));
                                    }
                                  }}
                                  onEdit={() => {
                                    if (props.compatibleServicePass) {
                                      const psListForIndex: number[] =
                                        props.values.compatibility?.map(
                                          (p_s: { private_service: any }) =>
                                            p_s.private_service,
                                        );
                                      setServiceAndIndex(
                                        ps,
                                        psListForIndex.indexOf(ps.id),
                                      );
                                    }
                                  }}
                                  privateService={ps}
                                />
                              ))}

                          {!props.values.compatibility.length && (
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
                    compatibility={props.values.compatibility}
                    compatibleServicePass={props.compatibleServicePass}
                    onCancel={() => setServiceAndIndex(null, null)}
                    onSubmit={(data: { excluded_slot_ids: number[] }) =>
                      updateSlotData(data, replace)
                    }
                    privateServices={props.privateServices}
                    selectedService={props.selectedService}
                  />
                  <Dialog open={!!props.openDeleteCompatibilityDialog}>
                    <DialogTitle>
                      {t('privateServiceCompatibility.delete.title')}
                    </DialogTitle>
                    <DialogContent>
                      {t('privateServiceCompatibility.delete.explain')}
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => {
                          props.setSelectedServiceIndex(null);
                          props.setOpenDeleteCompatibilityDialog(false);
                        }}
                      >
                        {t('privateServiceCompatibility.delete.cancel')}
                      </Button>
                      <Button
                        onClick={() => {
                          remove(props.selectedServiceIndex);
                          props.setSelectedServiceIndex(null);
                          props.setOpenDeleteCompatibilityDialog(false);
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

      <div
        className={`${classes.buttonContainer} ${classes.flexRowCenter}`}
        id="private-pass-form-actions-buttons"
      >
        <Button
          onClick={(e: MouseEvent) => {
            props.onCancel(e);
            trackFormCancel(props.initial?.id);
          }}
        >
          {t('privatePass.form.actions.cancel')}
        </Button>
        <Button
          color="primary"
          disabled={isSubmitting}
          onClick={() => {
            trackFormSubmitIntent(props.initial?.id);
            props.handleSubmit();
          }}
          variant="contained"
        >
          {t('privatePass.form.actions.submit')}
        </Button>
      </div>
    </Form>
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

export const PrivatePassSchema = Yup.object().shape({
  name: Yup.string().required(),
  tax: Yup.number().required().min(0).max(ALMOST_100),
  category: Yup.number().nullable(true),
  price: Yup.number().required(),
  manager_only: Yup.boolean().required(),
  new_member_only: Yup.boolean().required(),
  full_vod_access: Yup.boolean().required(),
  duration_days: Yup.number().required().integer().min(0),
  duration_months: Yup.number().required().integer().min(0),
  duration_years: Yup.number().required().integer().min(0),
  start_date_method: Yup.number().required().integer().min(0).max(2),
  expiration_days_before_first_use: Yup.number(),
  available_payment_method_identifiers: Yup.array().of(Yup.number().integer()),
  compatibility: Yup.array().of(
    Yup.object().shape({
      private_service: Yup.number(),
      excluded_slot_ids: Yup.array().of(Yup.number()),
    }),
  ),

  linked_payment_pack_categories: Yup.array().of(Yup.number()).nullable(true),
  linked_payment_pack_establishments: Yup.array()
    .of(Yup.number())
    .nullable(true),
  linked_payment_pack_metaActivities: Yup.array()
    .of(Yup.number())
    .nullable(true),
  unusable_by_staff: Yup.boolean().required(),
  applies_for_payroll: Yup.boolean().required(),
  on_behalf_of_teacher: Yup.boolean().required(),
  expiration_date: Yup.date().nullable(),
  description: Yup.string().nullable(),
  tags_on_consumer_item_creation: Yup.array().of(Yup.number().integer()),
});

export const PrivatePassFormikHOC = withFormik<Props, FormikValues>({
  // @ts-ignore
  mapPropsToValues: ({ initial }) => {
    if (initial && initial.id)
      return {
        ...initial,
        start_date_method: `${initial.start_date_method}`,
        new_member_only: initial.new_member_only,
        is_universal_pass: !!initial.linked_payment_pack,
        linked_payment_pack_categories:
          initial.linked_payment_pack?.categories || [],
        linked_payment_pack_establishments:
          initial.linked_payment_pack?.establishments || [],
        linked_payment_pack_metaActivities:
          initial.linked_payment_pack?.metaActivities || [],
        unusable_by_staff: !initial.is_usable_by_staff,
        // @ts-ignore
        applies_for_payroll: initial.applies_for_payroll,
        // @ts-ignore
        on_behalf_of_teachr: initial.on_behalf_of_teacher,
        // @ts-ignore
        expiration_date_active: !!initial?.expiration_date,
        credits: initial?.credits,
        tags_on_consumer_item_creation:
          initial.tags_on_consumer_item_creation || [],
      };

    return {
      name: null,
      category: null,
      tax: 0,
      credits: 1,
      price: 0,
      manager_only: false,
      new_member_only: false,
      full_vod_access: true,
      duration_days: 0,
      duration_months: 0,
      duration_years: 1,
      available_payment_method_identifiers: [CB.id],
      start_date_method: `${START_ON_PURCHASE}`,
      expiration_days_before_first_use: 365,
      compatibility: [],
      is_universal_pass: false,
      linked_payment_pack_categories: [],
      linked_payment_pack_establishments: [],
      linked_payment_pack_metaActivities: [],
      unusable_by_staff: false,
      applies_for_payroll: true,
      on_behalf_of_teacher: false,
      expiration_date: null,
      expiration_date_active: false,
      description: null,
      tags_on_consumer_item_creation: [],
    };
  },
  enableReinitialize: true,
  validationSchema: PrivatePassSchema,
  handleSubmit: (values, { props: { onSubmit, initial }, setSubmitting }) => {
    const { linked_payment_pack, credits, ...otherValues } = values;

    const newValues = {
      ...otherValues,
      available_payment_method_identifiers:
        values.available_payment_method_identifiers.length === 0
          ? [CB.id]
          : values.available_payment_method_identifiers,
      ...(linked_payment_pack && linked_payment_pack?.id
        ? {
            linked_payment_pack: linked_payment_pack.id,
          }
        : {}),
      is_usable_by_staff: !values.unusable_by_staff,
      expiration_date:
        // @ts-ignore
        values.expiration_date_active && values.expiration_date
          ? DateTime.fromISO(values.expiration_date).toISODate()
          : null,
      credits,
    };
    // @ts-ignore
    onSubmit(newValues, {
      onSuccess: () => {
        trackFormSuccess(initial?.id);
        setSubmitting(false);
      },
      onError: () => setSubmitting(false),
    });
  },
});

export default compose<any, Props>(
  PrivatePassFormikHOC,
  withState(
    'openCompatibleServiceForm',
    'setOpenCreateCompatibleServiceForm',
    false,
  ),
  withState(
    'openDeleteCompatibilityDialog',
    'setOpenDeleteCompatibilityDialog',
    false,
  ),
  withState('selectedService', 'setSelectedService', null),
  withState('selectedServiceIndex', 'setSelectedServiceIndex', null),
)(PrivatePassForm);
