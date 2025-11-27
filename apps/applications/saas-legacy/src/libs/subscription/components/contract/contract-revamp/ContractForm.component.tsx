import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import FormSection from '#src/components/forms/FormSection';
import PopOver from '#src/components/Popover';
import { SHOULD_DISPLAY_AUTO_RENEWAL_WARNING_MESSAGE } from '#src/libs/subscription/constants';
import { useHasTagsSameGroup } from '#src/libs/tag/components/hooks';
import TagGroupDuplicatedAlert from '#src/libs/tag/components/TagGroupDuplicatedAlert.component';
import TagSelector from '#src/libs/tag/components/TagSelector.selector';
import { Tag, TagGroup } from '#src/libs/tag/types';
import { getCurrencyDisplay } from '#src/libs/theme/selectors';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import DollarIcon from '@material-ui/icons/AttachMoney';
import EuroIcon from '@material-ui/icons/Euro';
import InfoIcon from '@material-ui/icons/Info';
import PaymentIcon from '@material-ui/icons/Payment';
import InvoiceIcon from '@material-ui/icons/Receipt';
import SettingsIcon from '@material-ui/icons/Settings';
import TuneIcon from '@material-ui/icons/Tune';
import KeyIcon from '@material-ui/icons/VpnKey';
import WarningIcon from '@material-ui/icons/Warning';
import Alert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import { useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
// @ts-expect-error
import PaymentComboSelectorField from '../../payment-combo/components/PaymentComboSelectorField.component';
// @ts-expect-error
import PrivatePassSelectorField from '../../private-service/components/pass/PrivatePassSelectorField.component';
// @ts-expect-error
import PaymentPackSelectorField from '../../payment-packs/components/PaymentPackSelectorField.component';
import {
  TextField,
  PriceField,
  SwitchField,
  RadioGroupField,
  IntervalRecurrenceSelectField,
  IntegerField,
  SelectField,
  // @ts-expect-error
} from '../../../components/forms';
import { FormValues, InvoicingType, ObjectType } from './types';
import { useStyles } from './style';
import { useShowNbIntervalAfterAutoRenewalInput } from './hooks/useShowNbIntervalAfterAutoRenewalInput';
import { SubscriptionContractFormDrawerProps } from '../../SubscriptionContractForm.component';

const { trackFormAdd } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.Subscription,
);

const monthBillingDayChoice = [...Array(32).keys()]
  .filter((day) => !!day)
  .map((day) => ({
    label: day.toString(),
    value: day,
  }));

export function SubscriptionContractFields(
  props: SubscriptionContractFormDrawerProps,
) {
  const { t } = useTranslation(['subscription', 'common']);
  const classes = useStyles();
  React.useEffect(() => {
    trackFormAdd(props.initial?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { values, setFieldValue, initialValues, errors } =
    useFormikContext<FormValues>();
  React.useEffect(() => {
    if (values.invoicing_type === InvoicingType.fixedDay) {
      setFieldValue('recurrence_basis', 1);
      setFieldValue('interval', 'month');
      if (!values.month_billing_day) {
        setFieldValue('month_billing_day', 1);
      }
    } else {
      setFieldValue('month_billing_day', null);
    }
  }, [
    values.invoicing_type,
    values.nb_interval,
    values.month_billing_day,
    setFieldValue,
  ]);

  const onChangeTagsOnAcquisition = React.useCallback(
    (options: Array<{ label: string; value: number; tag: Tag<TagGroup> }>) => {
      return setFieldValue(
        'tags_on_first_billing',
        options.map((item) => item.value),
      );
    },
    [setFieldValue],
  );

  const {
    showNbIntervalAfterAutoRenewalInput,
    setShowNbIntervalAfterAutoRenewalInput,
  } = useShowNbIntervalAfterAutoRenewalInput(
    initialValues,
    values,
    setFieldValue,
  );

  const isFromContractTemplate = React.useMemo(
    () => !!props.initial?.contract_template,
    [props.initial?.contract_template],
  );

  const isContractNotEditable =
    isFromContractTemplate ||
    (props.initial && props.initial?.editable === false);

  const updateShowNbIntervalAfterAutoRenewalInput = () =>
    setShowNbIntervalAfterAutoRenewalInput((prevState) => !prevState);

  const onDeleteTagsOnAcquisition = React.useCallback(
    (itemId: number) =>
      setFieldValue(
        'tags_on_first_billing',
        values?.tags_on_first_billing?.filter((tagId) => tagId !== itemId),
      ),
    [setFieldValue, values?.tags_on_first_billing],
  );

  const allSubscriptionTagIds = React.useMemo(() => {
    const selectedPaymentPackTags = props.paymentPackList
      .filter((paymentPack) => paymentPack.id === values.payment_pack)
      .map((paymentPack) => paymentPack?.tags_on_consumer_item_creation)
      .flat();

    const selectedPaymentComboTags = props.paymentComboList
      .filter((paymentCombo) => values.payment_combo === paymentCombo.id)
      .map((paymentCombo) => paymentCombo?.tags_on_consumer_item_creation)
      .flat();

    const selectedPrivatePassTags = props.privatePassList
      .filter((privatePass) => values.private_pass === privatePass.id)
      .map((privatePass) => privatePass?.tags_on_consumer_item_creation)
      .flat();

    const allPackTags = [].concat(
      selectedPaymentPackTags,
      selectedPaymentComboTags,
      selectedPrivatePassTags,
      values?.tags_on_first_billing,
    );

    return [...new Set(allPackTags)];
  }, [
    props.paymentPackList,
    props.paymentComboList,
    props.privatePassList,
    values.payment_pack,
    values.private_pass,
    values.payment_combo,
    values.tags_on_first_billing,
  ]);

  const hasItemsWithTagsSameGroup = useHasTagsSameGroup({
    selectedTagsIds: allSubscriptionTagIds,
    tagsWithGroup: props.tagList,
  });
  return (
    <div>
      {isContractNotEditable && (
        <FormSection>
          <div className={classes.row}>
            <WarningIcon color="error" />
            <Typography color="error" variant="body1">
              {isFromContractTemplate
                ? t('contractTemplate.backofficeEditWarning')
                : t('contract.form.notEditable')}
            </Typography>
          </div>
        </FormSection>
      )}
      <FormSection
        sectionIcon={InfoIcon}
        sectionTitle={t('contract.form.general_info.title')}
      >
        <TextField
          fullWidth
          required
          className={classes.field}
          disabled={isFromContractTemplate}
          label={t('contract.form.name.label')}
          name="name"
        />
        <TextField
          fullWidth
          multiline
          required
          className={classes.field}
          disabled={isFromContractTemplate}
          label={t('contract.form.description.label')}
          name="description"
          placeholder={t('contract.form.description.placeholder')}
          rows={5}
          variant="outlined"
        />
      </FormSection>

      <FormSection
        sectionIcon={PaymentIcon}
        sectionTitle={t('contract.form.object_type.label')}
      >
        <RadioGroupField
          choices={[
            {
              label: t('contract.form.object_type.privatePass'),
              value: ObjectType.privatePass,
            },
            {
              label: t('contract.form.object_type.paymentPack'),
              value: ObjectType.paymentPack,
            },
            {
              label: t('contract.form.object_type.paymentCombo'),
              value: ObjectType.paymentCombo,
            },
          ]}
          disabled={isContractNotEditable}
          name="object_type"
        />
        <div>
          <Collapse in={props.values.object_type === ObjectType.paymentPack}>
            <PaymentPackSelectorField
              fullWidth
              choices={props.paymentPackList}
              classes={classes}
              disabled={isContractNotEditable}
              name="payment_pack"
            />
          </Collapse>
          <Collapse in={props.values.object_type === ObjectType.privatePass}>
            <PrivatePassSelectorField
              fullWidth
              choices={props.privatePassList}
              classes={classes}
              disabled={isContractNotEditable}
              name="private_pass"
            />
          </Collapse>
          <Collapse in={props.values.object_type === ObjectType.paymentCombo}>
            <PaymentComboSelectorField
              fullWidth
              choices={props.paymentComboList}
              classes={classes}
              disabled={isContractNotEditable}
              name="payment_combo"
            />
          </Collapse>
        </div>
      </FormSection>

      <FormSection
        sectionIcon={getCurrencyDisplay() === '€' ? EuroIcon : DollarIcon}
        sectionTitle={t('contract.form.price.title')}
      >
        <PriceField
          fullWidth
          required
          className={classes.fieldMargin2}
          disabled={isFromContractTemplate}
          label={t('contract.form.recurrent_price.label')}
          name="recurrent_price"
        />
        {props.initial?.id &&
          // the backend returns a string for recurrent_price as it is handled as a decimal
          parseFloat(props.values.recurrent_price as string) !==
            parseFloat(props.initial.recurrent_price as string) && (
            <Alert className={classes.fieldMargin2} severity="info">
              {t('contract.form.recurrent_price.infoBox')}
            </Alert>
          )}
        <PriceField
          fullWidth
          required
          className={classes.field}
          disabled={isFromContractTemplate}
          helperText={t('contract.form.flat_fee.helperText')}
          label={t('contract.form.flat_fee.label')}
          name="flat_fee"
        />
      </FormSection>

      <FormSection
        sectionIcon={InvoiceIcon}
        sectionTitle={t('contract.form.invoicing.title')}
      >
        <PopOver
          hide={!props.initial?.id}
          title={t('contract.form.invoicing.invoicing_type_readonly')}
        >
          <RadioGroupField
            choices={[
              {
                label: t(
                  'contract.form.invoicing.same_day_as_subscription.label',
                ),
                value: InvoicingType.sameDayAsSubscription,
                helperTextInformationIcon: t(
                  'contract.form.invoicing.same_day_as_subscription.explain',
                ),
              },
              {
                label: t('contract.form.invoicing.fixed_day.label'),
                value: InvoicingType.fixedDay,
                helperTextInformationIcon: t(
                  'contract.form.invoicing.fixed_day.explain',
                ),
              },
            ]}
            disabled={!!props.initial?.id}
            divContainerClass={classes.RadioGroupFieldContainer}
            name="invoicing_type"
          />
        </PopOver>
        <Collapse
          in={values.invoicing_type === InvoicingType.sameDayAsSubscription}
        >
          <div className={classes.row}>
            <Typography variant="body2">
              {t('contract.form.recurrence_basis.label')}
            </Typography>
            <IntegerField
              required
              className={classes.intervalIntegerField}
              disabled={isFromContractTemplate}
              name="recurrence_basis"
            />
            <IntervalRecurrenceSelectField
              displayPeriod
              required
              className={classes.intervalSelectorField}
              disabled={isFromContractTemplate}
              name="interval"
              variant="outlined"
            />
          </div>
        </Collapse>
        <TextField
          fullWidth
          required
          className={classes.field}
          disabled={isFromContractTemplate}
          helperText={t(errors.nb_interval)}
          label={t('contract.form.nb_interval.label', {
            interval: t(`contract.interval.${props.values.interval}`, {
              count: props.values.recurrence_basis,
            }),
          })}
          name="nb_interval"
        />

        <Collapse
          in={values.invoicing_type === InvoicingType.sameDayAsSubscription}
        >
          <Alert severity="info" variant="outlined">
            {t(
              `contract.form.invoicing.same_day_as_subscription.recurrence_explain.${props.values.interval}`,
              {
                // *1 to force count to update when values.recurrence_basis changes
                count: props.values.recurrence_basis * 1,
                recurrence_basis: props.values.recurrence_basis,
                nb_interval: props.values.nb_interval,
                time_unit: t(`contract.interval.${props.values.interval}`, {
                  count:
                    props.values.nb_interval * props.values.recurrence_basis,
                }),
                total_subscription_duration:
                  props.values.nb_interval * props.values.recurrence_basis,
                invoice: t('contract.form.invoicing.invoice', {
                  count: props.values.nb_interval * 1,
                }),
              },
            )}
          </Alert>
        </Collapse>

        <Collapse in={values.invoicing_type === InvoicingType.fixedDay}>
          <div className={clsx(classes.row, classes.field)}>
            <Typography variant="body2">
              {t('contract.form.month_billing_day.label1')}
            </Typography>
            <SelectField
              select
              choices={monthBillingDayChoice}
              className={classes.monthBillingDaySelect}
              disabled={isFromContractTemplate}
              id="select-month-billing-day"
              name="month_billing_day"
              variant="outlined"
            />
            <Typography variant="body2">
              {t('contract.form.month_billing_day.label2')}
            </Typography>
          </div>
          {props.initial?.id &&
            props.initial?.month_billing_day !== values.month_billing_day && (
              <Alert
                className={clsx(classes.alert, classes.field)}
                severity="info"
              >
                {t(
                  `contract.form.invoicing.fixed_day.modification_not_apply_to_past`,
                  {
                    month_billing_day: props.values.month_billing_day,
                  },
                )}
              </Alert>
            )}
          {props.values.month_billing_day >= 29 && (
            <Alert
              className={clsx(classes.alert, classes.field)}
              severity="warning"
            >
              {t(`contract.form.invoicing.fixed_day.end_of_month_explain`, {
                month_billing_day: props.values.month_billing_day,
              })}
            </Alert>
          )}
          <Alert className={classes.alert} severity="info" variant="outlined">
            {t(
              `contract.form.invoicing.fixed_day.recurrence_explain.${props.values.interval}`,
              {
                count: 1,
                nb_interval: props.values.nb_interval,
                invoice: t('contract.form.invoicing.invoice', {
                  count: props.values.nb_interval * 1,
                }),
                month_billing_day: props.values.month_billing_day,
              },
            )}
          </Alert>
        </Collapse>
        <SwitchField
          disabled={isContractNotEditable}
          label={t('contract.form.autoRenewal.label')}
          name="auto_renewal"
        />
        {values.auto_renewal && SHOULD_DISPLAY_AUTO_RENEWAL_WARNING_MESSAGE && (
          // Only available for German market
          <Alert
            className={classes.alert}
            severity="warning"
            variant="outlined"
          >
            {t('contract.form.autoRenewal.germanMarketWarning')}
          </Alert>
        )}
        {values.auto_renewal && (
          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={showNbIntervalAfterAutoRenewalInput}
                  onChange={updateShowNbIntervalAfterAutoRenewalInput}
                />
              }
              disabled={props.initial && props.initial?.editable === false}
              label={t('contract.form.nbIntervalAfterAutoRenewal.firstLabel')}
            />
          </div>
        )}
        {showNbIntervalAfterAutoRenewalInput && (
          <>
            <TextField
              fullWidth
              disabled={props.initial && props.initial?.editable === false}
              helperText={t(errors.nb_interval_after_auto_renewal)}
              label={t('contract.form.nbIntervalAfterAutoRenewal.secondLabel')}
              name="nb_interval_after_auto_renewal"
            />
            <Alert className={classes.alert} severity="info" variant="outlined">
              {t(
                `contract.nbIntervalAfterAutoRenewal.details.${values.interval}`,
                {
                  durationAfterAutoRenewal:
                    values.nb_interval_after_auto_renewal *
                    values.recurrence_basis,
                },
              )}
            </Alert>
          </>
        )}
      </FormSection>

      <FormSection
        sectionIcon={KeyIcon}
        sectionTitle={t('contract.form.contract.label')}
      >
        <TextField
          fullWidth
          multiline
          required
          className={classes.field}
          disabled={isFromContractTemplate}
          label={t('contract.form.contract.label')}
          name="contract"
          placeholder={t('contract.form.contract.placeholder')}
          rows={5}
          variant="outlined"
        />
      </FormSection>

      <FormSection
        sectionIcon={TuneIcon}
        sectionTitle={t('contract.form.settings.title')}
      >
        <SwitchField
          disabled={isFromContractTemplate}
          label={t('contract.form.managerOnly.label')}
          name="manager_only"
        />
        <SwitchField
          disabled={isFromContractTemplate}
          label={t('contract.form.unusableByStaff.label')}
          name="unusable_by_staff"
        />

        <SwitchField
          helperText={t('contract.form.highlightedAsRecommended.helperText')}
          label={t('contract.form.highlightedAsRecommended.label')}
          name="highlighted_as_recommended"
        />

        {!!props?.displayStopSubscriptionFromMemberSide && (
          <SwitchField
            disabled={isFromContractTemplate}
            label={t('contract.form.commitmentPeriod.label')}
            name="has_mandatory_commitment_period"
          />
        )}
        {!!props?.displayStopSubscriptionFromMemberSide &&
          !!values?.has_mandatory_commitment_period && (
            <>
              <Typography className={classes.helperText}>
                {t('contract.form.commitmentPeriod.helperText')}
              </Typography>
              <div className={classes.row}>
                <Typography variant="body2">
                  {t('contract.form.commitmentPeriod.label')}
                </Typography>
                <IntegerField
                  required
                  className={classes.intervalIntegerField}
                  disabled={isFromContractTemplate}
                  name="commitment_period_value"
                />
                <IntervalRecurrenceSelectField
                  displayPeriod
                  required
                  className={classes.intervalSelectorField}
                  disabled={isFromContractTemplate}
                  name="commitment_period_unit"
                  variant="outlined"
                />
              </div>
              {!!values?.commitment_period_unit &&
                !!values?.commitment_period_value && (
                  <Alert
                    className={classes.alert}
                    severity="info"
                    variant="outlined"
                  >
                    {t(
                      `contract.form.commitmentPeriod.explain.${values.commitment_period_unit}`,
                      {
                        count: values.commitment_period_value,
                        commitment_period_value: values.commitment_period_value,
                      },
                    )}
                  </Alert>
                )}
            </>
          )}
      </FormSection>

      <FormSection
        isCollapse
        sectionIcon={SettingsIcon}
        sectionTitle={t('contract.form.advancedOptions.title')}
      >
        <Typography className={classes.title}>
          {t('contract.form.advancedOptions.tag.tagsOnAcquisition')}
        </Typography>
        <Typography className={classes.helperText} variant="caption">
          {t('contract.form.advancedOptions.tag.tagsOnAcquisitionHelper')}
        </Typography>
        <TagSelector
          closeMenuOnSelect
          inScrollBar
          isClearable
          allTagsWithTagGroup={props.tagList || []}
          onChange={onChangeTagsOnAcquisition}
          onDeleteTag={onDeleteTagsOnAcquisition}
          placeholder={t('contract.form.advancedOptions.tag.selectTags')}
          selectedTags={values.tags_on_first_billing}
          variant={'exclusive'}
        />
        {hasItemsWithTagsSameGroup && (
          <TagGroupDuplicatedAlert
            tagGroupDuplicatedText={t(
              'contract.form.advancedOptions.tag.tagGroupDuplicated',
            )}
          />
        )}
      </FormSection>
    </div>
  );
}

export default SubscriptionContractFields;
