// @ts-nocheck
import React, { useMemo, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

// import {
//   BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
//   BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
//   BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
// } from '@bsport/common/lib/master-data/subscription-payment-methods';
import {
  PAYOUT_STATUS_CANCELED,
  PAYOUT_STATUS_FAILED,
  PAYOUT_STATUS_PENDING,
  PAYOUT_STATUS_SUCCESS,
  PAYOUT_STATUS_TRANSIT,
} from '@bsport/common/lib/master-data/payout-status';

import { CouponKind } from '@bsport/common/lib/master-data/coupon';

import PLANNED_INVOICE_STATUS from '@bsport/common/lib/master-data/planned-invoice-status';

import {
  BOOKING_SOURCE_APP,
  BOOKING_SOURCE_WEB,
  BOOKING_SOURCE_SAAS,
  BOOKING_SOURCE_OTHER,
  BOOKING_SOURCE_MIGRATION,
} from '@bsport/common/lib/master-data/booking_source';
import {
  DISPUTE_STATUS_WON,
  DISPUTE_STATUS_LOST,
  DISPUTE_STATUS_PENDING,
} from '@bsport/common/lib/master-data/dispute-status';

import PAYMENT_METHODS, {
  CREDIT_ACCOUNT,
} from '@bsport/common/lib/master-data/payment-methods';

import {
  BILLING_PLAN_STATUS_NOT_STARTED,
  BILLING_PLAN_STATUS_STARTED,
  BILLING_PLAN_STATUS_STOPPED,
  BILLING_PLAN_STATUS_PAUSED,
  BILLING_PLAN_STATUS_ENDED,
} from '@bsport/common/lib/master-data/subscription-status';

import { Field, FieldAttributes, useFormikContext } from 'formik';
import {
  BOOKING_STATUS_OK,
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_CONSUMER,
  BOOKING_STATUS_CANCELLED_BY_OFFER,
} from '@bsport/common/lib/master-data/booking_status_code';
import get from 'lodash/get';

import { CircularProgress, makeStyles, Typography } from '@material-ui/core';

import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_ENGINE_BSPORT,
} from '@bsport/common/lib/master-data/payment-group';
import {
  AllComparator,
  DynamicFilterDataType,
  DatatypeFilterConfigItem,
  DatatypeFilterConfigItemTypeById,
} from '#libs/datatype-filtering/types';
import { PriceField, PercentField, TextField } from '#components/forms';
import DateRangeSelector from '#components/date/DateRangeSelector.component';
import DatePickerSelector from '#components/date/DatePickerSelector.component';

import {
  DATATYPE_FILTERABLE_BY_FLOAT_RANGE,
  DATATYPE_FILTERABLE_BY_ID_IN,
  DATE_SUBDATA_TYPE,
  FILTER_IN_OPERAND,
  HOUR_SUBDATA_TYPE,
} from '#libs/datatype-filtering/constants';

import {
  MaterialUiSingleSelectorField,
  MaterialUiMultiSelectorField,
} from '#libs/custom-form/components/GenericFormik.input';
import NestedAlertError from './NestedAlertError.component';
import MaterialUISelectorConsumers from '#components/Selector/MaterialUISelectorConsumers.container';
import MaterialUISelectorPayout from '#components/Selector/MaterialUISelectorPayout.container';
import { handleGetDynamicDataForFiltersReturn } from '../dynamic-data-hoc';
import ReportChipsRenderer from '#libs/reporting/components/ReportChips/ReportChipsRenderer.component';

type ItemProps = {
  children: string;
  data: { label: string; value: number; columnName: string };
  isSelected: boolean;
  isDisabled: boolean;
};

type ChipProps = {
  data: { label: string; value: number; columnName: string };
  onDelete: () => void;
};

type Props = {
  comparator: AllComparator;
  prefix: string;
  filterItem: DatatypeFilterConfigItem;
  isPreview?: boolean;
  getDataByType: (
    datatype: DynamicFilterDataType,
  ) => handleGetDynamicDataForFiltersReturn;
  inScrollBar?: boolean;
  reportCategory?: string;
  withoutConfirmButton?: boolean;
  closeMenuOnSelect?: boolean;
  openMenuOnClear?: boolean;
  openMenuOnFocus?: boolean;
};
const PAYMENT_METHODS_WITHOUT_CREDIT_ACCOUNT = PAYMENT_METHODS.filter(
  (paymentMethod) => paymentMethod.id !== CREDIT_ACCOUNT.id,
);

const DatatypeFilterConfigValueManager: React.FC<Props> = ({
  prefix,
  filterItem,
  comparator,
  isPreview,
  getDataByType,
  inScrollBar,
  reportCategory,
  withoutConfirmButton,
  closeMenuOnSelect,
  openMenuOnClear,
  openMenuOnFocus,
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();
  const booleanOptions = useMemo(
    () => [
      {
        label: t('yes'),
        value: true,
        columnName: filterItem.identifier,
      },
      {
        label: t('no'),
        value: false,
        columnName: filterItem.identifier,
      },
    ],
    [t, filterItem.identifier],
  );

  const itemRenderer = useCallback(
    (itemProps: ItemProps) => (
      <ReportChipsRenderer
        itemProps={itemProps}
        reportCategory={reportCategory}
      />
    ),
    [reportCategory],
  );

  const chipsRenderer = useCallback(
    (chipProps: ChipProps) => (
      <ReportChipsRenderer
        chipProps={chipProps}
        reportCategory={reportCategory}
      />
    ),
    [reportCategory],
  );

  if (filterItem.datatype === 'boolean') {
    return (
      <MaterialUiSingleSelectorField
        chipsRenderer={!!chipsRenderer && chipsRenderer}
        inScrollBar={inScrollBar}
        isDisabled={isPreview}
        itemRenderer={!!itemRenderer && itemRenderer}
        name={`${prefix}.value`}
        options={booleanOptions}
      />
    );
  }

  if (DATATYPE_FILTERABLE_BY_FLOAT_RANGE.includes(filterItem.datatype)) {
    if (comparator === FILTER_IN_OPERAND) {
      return (
        <div>
          <NestedAlertError name={`${prefix}.value`}>
            {(error_msg: string) => (
              <Typography color="error" variant="caption">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </NestedAlertError>
          <div className={classes.rowValue}>
            <DatatypeFilterConfigValueFloat
              datatype={filterItem.datatype}
              isPreview={isPreview}
              name={`${prefix}.value[0]`}
            />
            <DatatypeFilterConfigValueFloat
              datatype={filterItem.datatype}
              isPreview={isPreview}
              name={`${prefix}.value[1]`}
            />
          </div>
        </div>
      );
    }

    return (
      <DatatypeFilterConfigValueFloat
        datatype={filterItem.datatype}
        isPreview={isPreview}
        name={`${prefix}.value`}
      />
    );
  }

  if (DATATYPE_FILTERABLE_BY_ID_IN.includes(filterItem.datatype)) {
    return (
      <DatatypeFilterConfigValueList
        key={`${prefix}.value`}
        chipsRenderer={!!chipsRenderer && chipsRenderer}
        closeMenuOnSelect={closeMenuOnSelect}
        columnName={filterItem.identifier}
        datatype={filterItem.datatype}
        getDataByType={getDataByType}
        inScrollBar={inScrollBar}
        isPreview={isPreview}
        itemRenderer={!!itemRenderer && itemRenderer}
        name={`${prefix}.value`}
        openMenuOnClear={openMenuOnClear}
        openMenuOnFocus={openMenuOnFocus}
        withoutConfirmButton={withoutConfirmButton}
      />
    );
  }

  if (
    filterItem.datatype === 'date' ||
    filterItem.sub_datatype === DATE_SUBDATA_TYPE
  ) {
    if (comparator === FILTER_IN_OPERAND) {
      return <DateRangeSelectorFormik isPreview={isPreview} name={prefix} />;
    }
    return <DatePickerSelectorFormik isPreview={isPreview} name={prefix} />;
  }

  if (
    filterItem.datatype === 'time' ||
    filterItem.sub_datatype === HOUR_SUBDATA_TYPE
  ) {
    if (comparator === FILTER_IN_OPERAND) {
      return (
        <div>
          <NestedAlertError name={`${prefix}.value`}>
            {(error_msg: string) => (
              <Typography color="error" variant="caption">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </NestedAlertError>
          <div className={classes.rowValue}>
            <TimeInputFormik
              isPreview={isPreview}
              name={`${prefix}.value[0]`}
            />
            <TimeInputFormik
              isPreview={isPreview}
              name={`${prefix}.value[1]`}
            />
          </div>
        </div>
      );
    }
    return <TimeInputFormik isPreview={isPreview} name={`${prefix}.value`} />;
  }

  return null;
};

const TimeInputFormik: React.FC<{
  name: string;
  isPreview?: boolean;
}> = ({ name, isPreview }) => {
  return (
    <Field name={name}>
      {({
        field: { value },
        form: { setFieldValue },
      }: FieldAttributes<any>) => (
        <TextField
          disabled={isPreview}
          id="time_picker"
          onChange={(ev) => {
            setFieldValue(
              name,
              moment()
                .hours(ev.target.value.split(':')[0])
                .minutes(ev.target.value.split(':')[1])
                .unix(),
            );
          }}
          type="time"
          value={moment.unix(value).format('HH:mm')}
        />
      )}
    </Field>
  );
};

const DateRangeSelectorFormik: React.FC<{
  name: string;
  isPreview?: boolean;
}> = ({ name, isPreview }) => {
  return (
    <Field name={name}>
      {({
        field: { value },
        form: { setFieldValue },
      }: FieldAttributes<any>) => (
        <DateRangeSelector
          date_end={value?.value?.[1]}
          date_start={value?.value?.[0]}
          isDisabled={isPreview}
          onSubmit={(values) => {
            setFieldValue(`${name}.value[0]`, values.dateStart.unix());
            setFieldValue(`${name}.value[1]`, values.dateEnd.unix());
            setFieldValue(`${name}.time_period`, values.timePeriod);
          }}
          timePeriod={value.time_period}
        />
      )}
    </Field>
  );
};

const DatePickerSelectorFormik: React.FC<{
  name: string;
  isPreview?: boolean;
}> = ({ name, isPreview }) => {
  return (
    <Field name={name}>
      {({
        field: { value },
        form: { setFieldValue },
      }: FieldAttributes<any>) => (
        <DatePickerSelector
          date={value?.value}
          isDisabled={isPreview}
          onSubmit={(values) => {
            setFieldValue(`${name}.value`, values.date.unix());
            setFieldValue(`${name}.time_period`, values.timePeriod);
          }}
          timePeriod={value.time_period}
        />
      )}
    </Field>
  );
};

const DatatypeFilterConfigValueFloat: React.FC<{
  name: string;
  datatype: 'price' | 'number' | 'percent' | 'cts' | 'int';
  isPreview?: boolean;
}> = ({ name, datatype, isPreview }) => {
  if (datatype === 'price') {
    return (
      <PriceField
        castAsNumber
        disabled={isPreview}
        min={-Infinity}
        name={name}
      />
    );
  }

  if (datatype === 'percent') {
    return <PercentField castAsNumber disabled={isPreview} name={name} />;
  }

  return (
    <TextField
      castAsNumber
      datatype="number"
      disabled={isPreview}
      InputProps={{
        inputProps: { min: 0, step: 1 },
      }}
      min={-Infinity}
      name={name}
    />
  );
};

const DatatypeFilterConfigValueList: React.FC<{
  name: string;
  datatype: DatatypeFilterConfigItemTypeById;
  isPreview?: boolean;
  getDataByType: (
    datatype: DynamicFilterDataType,
  ) => handleGetDynamicDataForFiltersReturn;
  inScrollBar: boolean;
  columnName: string;
  itemRenderer: (itemProps: ItemProps) => React.ReactNode;
  chipsRenderer: (itemProps: ItemProps) => React.ReactNode;
  withoutConfirmButton?: boolean;
  closeMenuOnSelect?: boolean;
  openMenuOnClear?: boolean;
  openMenuOnFocus?: boolean;
}> = ({
  name,
  datatype,
  isPreview,
  getDataByType,
  inScrollBar,
  columnName,
  itemRenderer,
  withoutConfirmButton,
  chipsRenderer,
  closeMenuOnSelect,
  openMenuOnClear,
  openMenuOnFocus,
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();
  const { errors, touched } = useFormikContext();
  const error = get(errors, name);
  const isTouched = get(touched, name);

  const getOptions = useCallback(() => {
    switch (datatype) {
      case 'activity':
      case 'billing_establishment':
      case 'billing_group':
      case 'coach':
      case 'company':
      case 'contract':
      case 'coupon':
      case 'establishment':
      case 'giftcard':
      case 'payment_pack':
      case 'payment_pack_category':
      case 'private_pass':
      case 'private_pass_category':
      case 'private_service':
      case 'private_slot':
      case 'subshop':
      case 'video':
      case 'staff':
        return getDataByType(datatype, [], columnName);

      case 'payout_status':
        return [
          PAYOUT_STATUS_CANCELED,
          PAYOUT_STATUS_PENDING,
          PAYOUT_STATUS_TRANSIT,
          PAYOUT_STATUS_SUCCESS,
          PAYOUT_STATUS_FAILED,
        ].map((value) => ({
          label: t(`payment:payout.status.${value}`),
          value,
          columnName,
        }));
      case 'invoice_status':
        return PLANNED_INVOICE_STATUS.map((status) => ({
          label: t(`invoice:status.${status.id}`),
          value: status.id,
          columnName,
        }));
      case 'billing_plan_status':
        return [
          BILLING_PLAN_STATUS_NOT_STARTED,
          BILLING_PLAN_STATUS_STARTED,
          BILLING_PLAN_STATUS_STOPPED,
          BILLING_PLAN_STATUS_PAUSED,
          BILLING_PLAN_STATUS_ENDED,
        ].map((value) => ({
          label: t(`subscription:billing_plan_status.${value}`),
          value,
          columnName,
        }));
      case 'dispute_status':
        return [
          {
            value: DISPUTE_STATUS_PENDING,
            label: t(`payment:disputeStatus.${DISPUTE_STATUS_PENDING}`),
            columnName,
          },
          {
            value: DISPUTE_STATUS_LOST,
            label: t(`payment:disputeStatus.${DISPUTE_STATUS_LOST}`),
            columnName,
          },
          {
            value: DISPUTE_STATUS_WON,
            label: t(`payment:disputeStatus.${DISPUTE_STATUS_WON}`),
            columnName,
          },
        ];
      case 'booking_status_code':
        return [
          {
            value: BOOKING_STATUS_OK.id,
            label: t('booking:filters.notCancelled'),
            columnName,
          },
          {
            value: BOOKING_STATUS_CANCELLED_BY_MANAGER.id,
            label: t('booking:filters.managerCanceled'),
            columnName,
          },
          {
            value: BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
            label: t('booking:filters.consumerCanceled'),
            columnName,
          },
          {
            value: BOOKING_STATUS_CANCELLED_BY_OFFER.id,
            label: t('booking:filters.canceled'),
            columnName,
          },
        ];
      case 'source_device':
        return [
          {
            value: BOOKING_SOURCE_APP.id,
            label: t(
              `reporting:presetValuesByDatatype.source_device.${BOOKING_SOURCE_APP.id.toString()}`,
            ),
            columnName,
          },
          {
            value: BOOKING_SOURCE_SAAS.id,
            label: t(
              `reporting:presetValuesByDatatype.source_device.${BOOKING_SOURCE_SAAS.id.toString()}`,
            ),
            columnName,
          },
          {
            value: BOOKING_SOURCE_WEB.id,
            label: t(
              `reporting:presetValuesByDatatype.source_device.${BOOKING_SOURCE_WEB.id.toString()}`,
            ),
            columnName,
          },
          {
            value: BOOKING_SOURCE_OTHER.id,
            label: t(
              `reporting:presetValuesByDatatype.source_device.${BOOKING_SOURCE_OTHER.id.toString()}`,
            ),
            columnName,
          },
          {
            value: BOOKING_SOURCE_MIGRATION.id,
            label: t(
              `reporting:presetValuesByDatatype.source_device.${BOOKING_SOURCE_MIGRATION.id.toString()}`,
            ),
            columnName,
          },
        ];
      case 'payment_engine':
        return [
          {
            value: PAYMENT_ENGINE_BSPORT,
            label: t(`invoice:paymentEngine.label.${PAYMENT_ENGINE_BSPORT}`),
            columnName,
          },
          {
            value: PAYMENT_ENGINE_STRIPE,
            label: t(`invoice:paymentEngine.label.${PAYMENT_ENGINE_STRIPE}`),
            columnName,
          },
        ];

      case 'coupon_type_excluding_referrals':
        return [
          {
            value: CouponKind.COUPON_VIA_CODE,
            label: t(`coupon:couponType.${CouponKind.COUPON_VIA_CODE}`),
          },
          {
            value: CouponKind.COUPON_VIA_UNIQUE_CODE_PER_USAGE,
            label: t(
              `coupon:couponType.${CouponKind.COUPON_VIA_UNIQUE_CODE_PER_USAGE}`,
            ),
          },
        ];

      case 'payment_method':
        return [...PAYMENT_METHODS_WITHOUT_CREDIT_ACCOUNT].map(({ id }) => ({
          value: id ?? 0,
          label: t(`payment:method.${id}`),
          columnName,
        }));
      case 'payment_method_with_credit_account':
        return [...PAYMENT_METHODS].map(({ id }) => {
          return {
            value: id ?? 0,
            label: t(`payment:method.${id}`),
            columnName,
          };
        });
      case 'dow':
        return Array(7)
          .fill(0)
          .map((_, i) => ({
            label: moment()
              .isoWeekday(i + 1)
              .format('dddd'),
            value: i + 1,
            columnName,
          }));
      default:
        return [];
    }
  }, [getDataByType, t, columnName, datatype]);

  if (['email', 'user'].includes(datatype)) {
    return (
      <Field name={name}>
        {({
          field: { value },
          form: { setFieldValue, setFieldTouched },
          meta,
        }: FieldAttributes<any>) => {
          return (
            <MaterialUISelectorConsumers
              isMenuListVirtualized
              isMulti
              defaultNumberShown={1}
              error={!!(meta.touched && meta.error)}
              inScrollBar={inScrollBar}
              isDisabled={isPreview}
              kind={datatype}
              onChange={(optionList) => {
                const valueList = optionList.map((option) => option.value);
                setFieldTouched(name, true, false);
                setFieldValue(name, valueList);
              }}
              value={value}
            />
          );
        }}
      </Field>
    );
  }

  if (datatype === 'payout') {
    return (
      <Field name={name}>
        {({
          field: { value },
          form: { setFieldValue, setFieldTouched },
          meta,
        }: FieldAttributes<any>) => {
          return (
            <MaterialUISelectorPayout
              isMenuListVirtualized
              isMulti
              defaultNumberShown={1}
              error={!!(meta.touched && meta.error)}
              inScrollBar={inScrollBar}
              isDisabled={isPreview}
              onChange={(optionList) => {
                const valueList = optionList.map((option) => option.value);
                setFieldTouched(name, true, false);
                setFieldValue(name, valueList);
              }}
              value={value}
            />
          );
        }}
      </Field>
    );
  }

  if (
    [
      'activity',
      'payment_pack',
      'payment_pack_category',
      'coach',
      'establishment',
      'billing_group',
      'private_pass',
      'private_service',
      'private_slot',
      'billing_establishment',
      'coupon',
      'giftcard',
      'video',
      'contract',
      'private_pass_category',
      'company',
      'staff',
    ].includes(datatype) &&
    getOptions() === null
  ) {
    return <CircularProgress />;
  }

  return (
    <MaterialUiMultiSelectorField
      isMenuListVirtualized
      chipsRenderer={!!chipsRenderer && chipsRenderer}
      className={classes.flexOne}
      closeMenuOnSelect={closeMenuOnSelect}
      defaultNumberShown={1}
      forceError={false && error && isTouched}
      inScrollBar={inScrollBar}
      isDisabled={isPreview}
      itemRenderer={!!itemRenderer && itemRenderer}
      name={name}
      openMenuOnClear={openMenuOnClear}
      openMenuOnFocus={openMenuOnFocus}
      options={[...getOptions()]}
      placeholder={t('filter.form.placeholderList')}
      withoutConfirmButton={withoutConfirmButton}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  rowValue: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    width: '100%',
    gap: theme.spacing(1) / 2,
  },
  flexOne: {
    flex: '1 1 120px',
  },
}));

export default memo(DatatypeFilterConfigValueManager);
