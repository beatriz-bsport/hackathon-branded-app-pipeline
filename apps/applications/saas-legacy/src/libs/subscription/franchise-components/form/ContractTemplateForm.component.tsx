import React, { useCallback, useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import clsx from 'clsx';

import WarningIcon from '@material-ui/icons/Warning';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import InfoIcon from '@material-ui/icons/Info';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import Collapse from '@material-ui/core/Collapse';
import EuroIcon from '@material-ui/icons/Euro';
import DollarIcon from '@material-ui/icons/AttachMoney';
import InvoiceIcon from '@material-ui/icons/Receipt';
import KeyIcon from '@material-ui/icons/VpnKey';
import TuneIcon from '@material-ui/icons/Tune';
import Alert from '@material-ui/lab/Alert';
import Tooltip from '@material-ui/core/Tooltip';

import { useFormikContext, ErrorMessage } from 'formik';
import {
  TextField,
  SwitchField,
  RadioGroupField,
  PriceField,
  IntervalRecurrenceSelectField,
  IntegerField,
  SelectField,
  // @ts-expect-error
} from '#src/components/forms';
import PopOver from '#src/components/Popover';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import { useObjectSearch } from '#src/libs/fuzzy-search/hooks/useObjectSearch';
import { getCurrencyDisplay } from '#src/libs/theme/selectors';

import {
  CONTRACT_MAX_NB_INTERVAL_ALLOWED,
  PRIMARY_BLUE_CONTRACT_DETAIL,
  SHARED_PASSES_SELECTOR_ICON_TOOLTIP_SHADOW,
} from '#src/libs/subscription/constants';
import type { ContractTemplateFormValues } from '#src/libs/subscription/types';
import type {
  PrivatePassTemplate,
  PrivatePassTemplateAPI,
} from '#src/libs/private-service/types';
import type {
  PaymentPackTemplate,
  PaymentPackTemplateAPI,
} from '#src/libs/payment-packs/types';
import {
  PassType,
  SubscriptionInvoicingType,
} from '#src/libs/subscription/enums';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';
import PaymentPackListItem from '#src/libs/payment-packs/components/PaymentPackListItem.component';
import PrivatePassListItem from '#src/libs/private-service/components/pass/PrivatePassListItem.component';

type ContractTemplateFormProps = {
  handleClose: () => void;
  getPrivatePassTemplateList: () => PrivatePassTemplate[];
  getPaymentPackTemplateList: () => PaymentPackTemplate[];
  // Props when editing an existing contract template
  contractTemplateId?: number;
  contractTemplateMonthBillingDay?: number;
  fetchPaymentPackTemplateBulk: (params: { id__in: number[] }) => void;
  fetchPrivatePassTemplateBulk: (params: { id__in: number[] }) => void;
};

const PaymentPackTemplateSearchOption: React.FC<
  OptionPropsWithData<{ onClick: () => void; item: PaymentPackTemplate }>
> = (props) => (
  //@ts-expect-error
  <PaymentPackListItem onClick={props.data.onClick} pack={props.data.item} />
);

const PrivatePassTemplateSearchOption: React.FC<
  OptionPropsWithData<{ onClick: () => void; item: PrivatePassTemplate }>
> = (props) => (
  //@ts-expect-error
  <PrivatePassListItem onClick={props.data.onClick} pass={props.data.item} />
);
const ContractTemplateForm: React.FC<ContractTemplateFormProps> = ({
  contractTemplateId,
  contractTemplateMonthBillingDay,
  handleClose,
  getPrivatePassTemplateList,
  getPaymentPackTemplateList,
  fetchPaymentPackTemplateBulk,
  fetchPrivatePassTemplateBulk,
}) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();
  const tooltipClasses = useTooltipStyles();
  const { values, setFieldValue, handleSubmit } =
    useFormikContext<ContractTemplateFormValues>();

  const onSubmitHandler = useCallback(() => handleSubmit(), [handleSubmit]);
  const { getResultsById } = useObjectSearch();
  const paymentPackTemplateList = getPaymentPackTemplateList();
  const privatePassTemplateList = getPrivatePassTemplateList();

  const monthBillingDayOptions = [...Array(31).keys()].map((day) => ({
    label: `${day + 1}`,
    value: day + 1,
  }));

  const nbIntervalHelperText = useMemo(() => {
    let nbIntervalHelperTextReturnValue = '';
    if (values.numberOfIntervals > CONTRACT_MAX_NB_INTERVAL_ALLOWED)
      nbIntervalHelperTextReturnValue = t('contract.form.nb_interval.error');
    else if (
      values.invoicingType === SubscriptionInvoicingType.FIXED_DAY &&
      (values.numberOfIntervals > 12 || values.numberOfIntervals < 2)
    )
      nbIntervalHelperTextReturnValue = t(
        'contract.form.nb_interval.restrictionForFixedBillingDay',
      );
    return nbIntervalHelperTextReturnValue;
  }, [values.numberOfIntervals, values.invoicingType, t]);

  const subscriptionInvoicingTypeRadioFieldOptions = useMemo(
    () => [
      {
        label: t('contract.form.invoicing.same_day_as_subscription.label'),
        value: SubscriptionInvoicingType.SAME_DAY_AS_SUBSCRIPTION,
      },
      {
        label: t('contract.form.invoicing.fixed_day.label'),
        value: SubscriptionInvoicingType.FIXED_DAY,
      },
    ],
    [t],
  );

  const passTypeRadioFieldOptions = useMemo(
    () => [
      {
        label: t('contract.form.object_type.paymentPack'),
        value: PassType.PASSES,
      },
      {
        label: t('contract.form.object_type.privatePass'),
        value: PassType.APPOINTMENT_PASSES,
      },
    ],
    [t],
  );

  const currencyDisplay = useMemo(() => getCurrencyDisplay(), []);

  useEffect(() => {
    setFieldValue(
      values.productType === PassType.APPOINTMENT_PASSES
        ? 'paymentPackTemplate'
        : 'privatePassTemplate',
      null,
    );
  }, [setFieldValue, values.productType]);

  useEffect(() => {
    if (values.invoicingType === SubscriptionInvoicingType.FIXED_DAY) {
      setFieldValue('recurrenceBasis', 1);
      setFieldValue('interval', 'month');
      if (!values.monthBillingDay) {
        setFieldValue('monthBillingDay', 1);
      }
    } else {
      setFieldValue('monthBillingDay', null);
    }
  }, [setFieldValue, values.invoicingType, values.monthBillingDay]);

  // Payment Pack Template
  const handleOnPaymentPackTemplateChange = React.useCallback(
    (id: number) => {
      fetchPaymentPackTemplateBulk?.({ id__in: [id] });
      if (values.productType === PassType.PASSES) {
        setFieldValue('paymentPackTemplate', id);
      }
    },
    [setFieldValue, fetchPaymentPackTemplateBulk, values.productType],
  );
  const formatPaymentPackTemplateSearchOptions = React.useCallback(
    (searchResults: PaymentPackTemplateAPI[]) => {
      return searchResults.map((result) => ({
        label: result.name,
        value: result.id,
        item: getResultsById('payment_pack_template')[result.id],
        onClick: () => handleOnPaymentPackTemplateChange(result.id),
      }));
    },
    [handleOnPaymentPackTemplateChange, getResultsById],
  );

  const formatPaymentPackTemplateSelectedOption = React.useMemo(() => {
    const selectedTemplate = (paymentPackTemplateList || []).find(
      (paymentPackTemplate) =>
        paymentPackTemplate?.id === values.paymentPackTemplate,
    );
    if (!selectedTemplate) return null;
    return {
      label: selectedTemplate.name,
      value: selectedTemplate.id,
      item: selectedTemplate,
    };
  }, [paymentPackTemplateList, values.paymentPackTemplate]);

  // Private Pass Template
  const handleOnPrivatePassTemplateChange = React.useCallback(
    (id: number) => {
      fetchPrivatePassTemplateBulk?.({ id__in: [id] });
      if (values.productType === PassType.APPOINTMENT_PASSES) {
        setFieldValue('privatePassTemplate', id);
      }
    },
    [setFieldValue, fetchPrivatePassTemplateBulk, values.productType],
  );
  const formatPrivatePassTemplateSearchOptions = React.useCallback(
    (searchResults: PrivatePassTemplateAPI[]) => {
      return searchResults.map((result) => ({
        label: result.name,
        value: result.id,
        item: getResultsById('private_pass_template')[result.id],
        onClick: () => handleOnPrivatePassTemplateChange(result.id),
      }));
    },
    [handleOnPrivatePassTemplateChange, getResultsById],
  );
  const formatPrivatePassTemplateSelectedOption = React.useMemo(() => {
    const selectedTemplate = (privatePassTemplateList || []).find(
      (privatePassTemplate) =>
        privatePassTemplate?.id === values.privatePassTemplate,
    );
    if (!selectedTemplate) return null;
    return {
      label: selectedTemplate.name,
      value: selectedTemplate.id,
      item: selectedTemplate,
    };
  }, [privatePassTemplateList, values.privatePassTemplate]);

  return (
    <div>
      <div className={classes.sectionContainer}>
        {values?.editable === false ? (
          <div className={classes.sectionTitle}>
            <WarningIcon color="error" />
            <Typography color="error" variant="body1">
              {t('contract.form.notEditable')}
            </Typography>
          </div>
        ) : null}
        <div className={classes.sectionTitle}>
          <InfoIcon className={classes.icon} />
          <Typography variant="h6">
            {t('contract.form.general_info.title')}
          </Typography>
        </div>
        <TextField
          fullWidth
          required
          className={classes.textField}
          label={t('contract.form.name.label')}
          name="name"
        />
        <TextField
          fullWidth
          multiline
          required
          className={classes.textField}
          label={t('contract.form.description.label')}
          minRows="6"
          name="description"
          variant="outlined"
        />
      </div>

      <Divider />

      <div className={classes.sectionContainer}>
        <div className={classes.sectionTitle}>
          <CreditCardIcon className={classes.icon} />
          <Typography variant="h6">
            {t('contract.form.object_type.label')}
          </Typography>
        </div>

        <div>
          <RadioGroupField
            choices={passTypeRadioFieldOptions}
            disabled={values?.editable === false}
            name="productType"
          />
          <div>
            <div>
              <Collapse in={values.productType === PassType.PASSES}>
                <div className={classes.sharedPassesSelector}>
                  <div className={classes.fullWidth}>
                    <ObjectSearchComponent
                      closeMenuOnSelect
                      additionalParams={{
                        disabled: false,
                        id__not_in:
                          values.productType === PassType.PASSES
                            ? [values.paymentPackTemplate]
                            : [],
                      }}
                      components={{
                        Option: PaymentPackTemplateSearchOption,
                      }}
                      initialValues={[values.paymentPackTemplate]}
                      isDisabled={values?.editable === false}
                      optionsFormatter={formatPaymentPackTemplateSearchOptions}
                      searchedObjectType="payment_pack_template"
                      value={formatPaymentPackTemplateSelectedOption}
                      variant="underlined"
                    />
                  </div>
                  <Tooltip
                    classes={tooltipClasses}
                    placement="bottom-end"
                    title={
                      <Typography variant="body1">
                        {t('contractTemplate.form.sharedPassesSelectorTooltip')}
                      </Typography>
                    }
                  >
                    <InfoOutlinedIcon
                      className={classes.sharedPassesSelectorIcon}
                    />
                  </Tooltip>
                </div>
              </Collapse>
              <Collapse in={values.productType === PassType.APPOINTMENT_PASSES}>
                <div className={classes.sharedPassesSelector}>
                  <div className={classes.fullWidth}>
                    <ObjectSearchComponent
                      closeMenuOnSelect
                      additionalParams={{
                        disabled: false,
                        id__not_in:
                          values.productType === PassType.APPOINTMENT_PASSES
                            ? [values.privatePassTemplate]
                            : [],
                      }}
                      components={{
                        Option: PrivatePassTemplateSearchOption,
                      }}
                      initialValues={[values.privatePassTemplate]}
                      isDisabled={values?.editable === false}
                      optionsFormatter={formatPrivatePassTemplateSearchOptions}
                      searchedObjectType="private_pass_template"
                      value={formatPrivatePassTemplateSelectedOption}
                      variant="underlined"
                    />
                  </div>
                  <Tooltip
                    classes={tooltipClasses}
                    placement="bottom-end"
                    title={
                      <Typography variant="body1">
                        {t(
                          'contractTemplate.form.sharedAppointmentPassesSelectorTooltip',
                        )}
                      </Typography>
                    }
                  >
                    <InfoOutlinedIcon
                      className={classes.sharedPassesSelectorIcon}
                    />
                  </Tooltip>
                </div>
              </Collapse>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div className={classes.sectionContainer}>
        <div className={classes.sectionTitle}>
          {currencyDisplay === '€' ? (
            <EuroIcon className={classes.icon} />
          ) : (
            <DollarIcon className={classes.icon} />
          )}
          <Typography variant="h6">{t('contract.form.price.title')}</Typography>
        </div>
        <div>
          <PriceField
            fullWidth
            required
            label={t('contract.form.recurrent_price.label')}
            name="recurrentPrice"
          />
          <ErrorMessage name="recurrentPrice">
            {(message) => <Alert severity="error">{t(message)}</Alert>}
          </ErrorMessage>
        </div>
        <div>
          <PriceField
            fullWidth
            required
            helperText={t('contract.form.flat_fee.helperText')}
            label={t('contract.form.flat_fee.label')}
            name="flatFee"
          />
          <ErrorMessage name="flatFee">
            {(message) => <Alert severity="error">{t(message)}</Alert>}
          </ErrorMessage>
        </div>
      </div>

      <Divider />

      <div className={classes.sectionContainer}>
        <div className={classes.sectionTitle}>
          <InvoiceIcon className={classes.icon} />
          <Typography variant="h6">
            {t('contract.form.invoicing.title')}
          </Typography>
        </div>
        <PopOver
          hide={!values?.id}
          title={t('contract.form.invoicing.invoicing_type_readonly')}
        >
          <RadioGroupField
            choices={subscriptionInvoicingTypeRadioFieldOptions}
            disabled={!!values?.id}
            name="invoicingType"
          />
        </PopOver>
        <Alert severity="info">
          {values.invoicingType ===
          SubscriptionInvoicingType.SAME_DAY_AS_SUBSCRIPTION
            ? t('contract.form.invoicing.same_day_as_subscription.explain')
            : t('contract.form.invoicing.fixed_day.explain')}
        </Alert>
        <Collapse
          in={
            values.invoicingType ===
            SubscriptionInvoicingType.SAME_DAY_AS_SUBSCRIPTION
          }
        >
          <div className={classes.billingRow}>
            <Typography variant="body1">
              {t('contract.form.recurrence_basis.label')}
            </Typography>
            <IntegerField
              required
              className={classes.intervalIntegerField}
              name="recurrenceBasis"
            />
            <IntervalRecurrenceSelectField
              displayPeriod
              required
              className={classes.intervalSelectorField}
              name="interval"
              variant="outlined"
            />
          </div>
        </Collapse>
        <TextField
          fullWidth
          required
          helperText={nbIntervalHelperText}
          label={t('contract.form.nb_interval.label', {
            interval: t(`contract.interval.${values.interval}`, {
              count: values.recurrenceBasis,
            }),
          })}
          name="numberOfIntervals"
        />
        <div>
          <Collapse
            in={
              values.invoicingType ===
              SubscriptionInvoicingType.SAME_DAY_AS_SUBSCRIPTION
            }
          >
            <Alert severity="info" variant="outlined">
              {t(
                `contract.form.invoicing.same_day_as_subscription.recurrence_explain.${values.interval}`,
                {
                  count: values.recurrenceBasis,
                  recurrence_basis: values.recurrenceBasis,
                  nb_interval: values.numberOfIntervals,
                  time_unit: t(`contract.interval.${values.interval}`, {
                    count: values.numberOfIntervals * values.recurrentPrice,
                  }),
                  total_subscription_duration:
                    values.numberOfIntervals * values.recurrenceBasis,
                  invoice: t('contract.form.invoicing.invoice', {
                    count: values.numberOfIntervals * 1,
                  }),
                },
              )}
            </Alert>
          </Collapse>
          <Collapse
            in={values.invoicingType === SubscriptionInvoicingType.FIXED_DAY}
          >
            <div className={classes.billingRow}>
              <Typography variant="body1">
                {t('contract.form.month_billing_day.label1')}
              </Typography>
              <SelectField
                choices={monthBillingDayOptions}
                className={classes.monthBillingDaySelect}
                id="select-month-billing-day"
                name="monthBillingDay"
                variant="outlined"
              />
              <Typography variant="body1">
                {t('contract.form.month_billing_day.label2')}
              </Typography>
            </div>
            {contractTemplateId &&
              contractTemplateMonthBillingDay !== values.monthBillingDay && (
                <Alert className={classes.marginTopClass} severity="info">
                  {t(
                    `contract.form.invoicing.fixed_day.modification_not_apply_to_past`,
                    {
                      month_billing_day: values.monthBillingDay,
                    },
                  )}
                </Alert>
              )}
            {values.monthBillingDay >= 29 && (
              <Alert className={classes.marginTopClass} severity="warning">
                {t(`contract.form.invoicing.fixed_day.end_of_month_explain`, {
                  month_billing_day: values.monthBillingDay,
                })}
              </Alert>
            )}
            <Alert
              className={classes.marginTopClass}
              severity="info"
              variant="outlined"
            >
              {t(`contract.form.invoicing.fixed_day.recurrence_explain.month`, {
                nb_interval: values.numberOfIntervals,
                invoice: t('contract.form.invoicing.invoice', {
                  count: values.numberOfIntervals * 1,
                }),
                month_billing_day: values.monthBillingDay,
              })}
            </Alert>
          </Collapse>
          <div className={classes.marginTopClass}>
            <SwitchField
              disabled={values?.editable === false}
              label={t('contract.form.autoRenewal.label')}
              name="autoRenewal"
            />
          </div>
        </div>
      </div>

      <Divider />

      <div
        className={clsx(
          classes.sectionContainer,
          classes.sectionsTermsAndSettings,
        )}
      >
        <div className={classes.sectionTitle}>
          <KeyIcon className={classes.icon} />
          <Typography variant="h6">
            {t('contract.form.contract.label')}
          </Typography>
        </div>
        <TextField
          fullWidth
          multiline
          required
          label={t('contract.form.contract.label')}
          minRows="6"
          name="contract"
          placeholder={t('contract.form.contract.placeholder')}
          variant="outlined"
        />
      </div>

      <Divider />

      <div
        className={clsx(
          classes.sectionContainer,
          classes.sectionsTermsAndSettings,
        )}
      >
        <div className={classes.sectionTitle}>
          <TuneIcon className={classes.icon} />
          <Typography variant="h6">
            {t('contract.form.settings.title')}
          </Typography>
        </div>
        <div className={classes.settingSwitchesContainer}>
          <SwitchField
            label={t('contract.form.managerOnly.label')}
            name="managerOnly"
          />
          <SwitchField
            label={t('contract.form.unusableByStaff.label')}
            name="unusableByStaff"
          />
        </div>
      </div>

      <Divider />

      <DialogActions className={classes.dialogActions}>
        <Button onClick={handleClose}>{t('cancel')}</Button>
        <Button color="primary" onClick={onSubmitHandler} variant="contained">
          {t('save')}
        </Button>
      </DialogActions>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    rowGap: theme.spacing(2),
  },
  sectionsTermsAndSettings: {
    rowGap: theme.spacing(3),
  },
  sectionTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  settingSwitchesContainer: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: theme.spacing(1),
  },
  icon: {
    color: theme.palette.action.active,
  },
  textField: {
    marginTop: theme.spacing(2),
  },
  billingRow: {
    display: 'flex',
    alignItems: 'center',
    columnGap: theme.spacing(2),
  },
  intervalIntegerField: {
    height: theme.spacing(-2),
    width: theme.spacing(5),
  },
  intervalSelectorField: {
    height: theme.spacing(5),
  },
  monthBillingDaySelect: {
    height: theme.spacing(5),
  },
  marginTopClass: {
    marginTop: theme.spacing(2),
  },
  sharedPassesSelector: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    columnGap: theme.spacing(1),
  },
  sharedPassesSelectorIcon: {
    color: PRIMARY_BLUE_CONTRACT_DETAIL,
  },
  dialogActions: {
    padding: theme.spacing(4),
    columnGap: theme.spacing(2),
  },
  fullWidth: {
    width: '100%',
  },
}));

const useTooltipStyles = makeStyles((theme) => ({
  tooltip: {
    color: theme.palette.text.primary,
    boxShadow: SHARED_PASSES_SELECTOR_ICON_TOOLTIP_SHADOW,
    borderRadius: theme.spacing(1),
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
}));

export default React.memo(ContractTemplateForm);
