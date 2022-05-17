import React, { useMemo, useCallback } from 'react';
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
import PAYMENT_METHODS from '@bsport/common/lib/master-data/payment-methods';
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
  AllComparator,
  DynamicFilterDataType,
  ReportFilterConfigItem,
  ReportFilterConfigItemTypeById,
} from '../../types';
import { PriceField, PercentField, TextField } from '#components/forms';
import DateRangeSelector from '#components/date/DateRangeSelector.component';
import DatePickerSelector from '#components/date/DatePickerSelector.component';

import {
  DATATYPE_FILTERABLE_BY_FLOAT_RANGE,
  DATATYPE_FILTERABLE_BY_ID_IN,
  DATE_SUBDATA_TYPE,
  FILTER_IN_OPERAND,
  HOUR_SUBDATA_TYPE,
} from '../../constants';

import {
  MaterialUiSingleSelectorField,
  MaterialUiMultiSelectorField,
} from '#libs/custom-form/components/GenericFormik.input';
import NestedAlertError from './NestedAlertError.component';
import MaterialUISelectorMembers from '#components/Selector/MaterialUISelectorMembers.component';
import MaterialUISelectorPayout from '#components/Selector/MaterialUISelectorPayout.component';

const ReportFilterConfigValueManager: React.FC<{
  comparator: AllComparator;
  prefix: string;
  filterItem: ReportFilterConfigItem;
  isPreview?: boolean;
  getDataByType: (datatype: DynamicFilterDataType) => any[];
}> = ({ prefix, filterItem, comparator, isPreview, getDataByType }) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();

  const booleanOptions = useMemo(
    () => [
      {
        label: t('filter.form.isTrue'),
        value: true,
      },
      {
        label: t('filter.form.isFalse'),
        value: false,
      },
    ],
    [t],
  );

  if (filterItem.datatype === 'boolean') {
    return (
      <MaterialUiSingleSelectorField
        options={booleanOptions}
        name={`${prefix}.value`}
        inScrollBar
        isDisabled={isPreview}
      />
    );
  }

  if (DATATYPE_FILTERABLE_BY_FLOAT_RANGE.includes(filterItem.datatype)) {
    if (comparator === FILTER_IN_OPERAND) {
      return (
        <div>
          <NestedAlertError name={`${prefix}.value`}>
            {(error_msg: string) => (
              <Typography variant="caption" color="error">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </NestedAlertError>
          <div className={classes.rowValue}>
            <ReportFilterConfigValueFloat
              name={`${prefix}.value[0]`}
              datatype={filterItem.datatype}
              isPreview={isPreview}
            />
            <ReportFilterConfigValueFloat
              name={`${prefix}.value[1]`}
              datatype={filterItem.datatype}
              isPreview={isPreview}
            />
          </div>
        </div>
      );
    }

    return (
      <ReportFilterConfigValueFloat
        name={`${prefix}.value`}
        datatype={filterItem.datatype}
        isPreview={isPreview}
      />
    );
  }

  if (DATATYPE_FILTERABLE_BY_ID_IN.includes(filterItem.datatype)) {
    return (
      <ReportFilterConfigValueList
        key={`${prefix}.value`}
        name={`${prefix}.value`}
        datatype={filterItem.datatype}
        getDataByType={getDataByType}
        isPreview={isPreview}
      />
    );
  }

  if (
    filterItem.datatype === 'date' ||
    filterItem.sub_datatype === DATE_SUBDATA_TYPE
  ) {
    if (comparator === FILTER_IN_OPERAND) {
      return <DateRangeSelectorFormik name={prefix} isPreview={isPreview} />;
    }
    return <DatePickerSelectorFormik name={prefix} isPreview={isPreview} />;
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
              <Typography variant="caption" color="error">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </NestedAlertError>
          <div className={classes.rowValue}>
            <TimeInputFormik
              name={`${prefix}.value[0]`}
              isPreview={isPreview}
            />
            <TimeInputFormik
              name={`${prefix}.value[1]`}
              isPreview={isPreview}
            />
          </div>
        </div>
      );
    }
    return <TimeInputFormik name={`${prefix}.value`} isPreview={isPreview} />;
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
          id="time_picker"
          type="time"
          value={moment.unix(value).format('HH:mm')}
          onChange={(ev) => {
            setFieldValue(
              name,
              moment()
                .hours(ev.target.value.split(':')[0])
                .minutes(ev.target.value.split(':')[1])
                .unix(),
            );
          }}
          disabled={isPreview}
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
          date_start={value?.value?.[0]}
          date_end={value?.value?.[1]}
          timePeriod={value.time_period}
          onSubmit={(values) => {
            setFieldValue(`${name}.value[0]`, values.dateStart.unix());
            setFieldValue(`${name}.value[1]`, values.dateEnd.unix());
            setFieldValue(`${name}.time_period`, values.timePeriod);
          }}
          isDisabled={isPreview}
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
          timePeriod={value.time_period}
          onSubmit={(values) => {
            setFieldValue(`${name}.value`, values.date.unix());
            setFieldValue(`${name}.time_period`, values.timePeriod);
          }}
          isDisabled={isPreview}
        />
      )}
    </Field>
  );
};

const ReportFilterConfigValueFloat: React.FC<{
  name: string;
  datatype: 'price' | 'number' | 'percent' | 'cts' | 'int';
  isPreview?: boolean;
}> = ({ name, datatype, isPreview }) => {
  if (datatype === 'price') {
    return (
      <PriceField
        name={name}
        castAsNumber
        min={-Infinity}
        disabled={isPreview}
      />
    );
  }

  if (datatype === 'percent') {
    return <PercentField name={name} castAsNumber disabled={isPreview} />;
  }

  return (
    <TextField
      InputProps={{
        inputProps: { min: 0, step: 1 },
      }}
      name={name}
      datatype="number"
      castAsNumber
      min={-Infinity}
      disabled={isPreview}
    />
  );
};

const ReportFilterConfigValueList: React.FC<{
  name: string;
  datatype: ReportFilterConfigItemTypeById;
  isPreview?: boolean;
  getDataByType: (datatype: DynamicFilterDataType) => any[];
}> = ({ name, datatype, isPreview, getDataByType }) => {
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
      case 'private_pass':
      case 'private_service':
      case 'private_slot':
      case 'subshop':
      case 'video':
        return getDataByType(datatype);

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
        }));
      case 'booking_status_code':
        return [
          {
            value: BOOKING_STATUS_OK.id,
            label: t('booking:filters.notCancelled'),
          },
          {
            value: BOOKING_STATUS_CANCELLED_BY_MANAGER.id,
            label: t('booking:filters.managerCanceled'),
          },
          {
            value: BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
            label: t('booking:filters.consumerCanceled'),
          },
          {
            value: BOOKING_STATUS_CANCELLED_BY_OFFER.id,
            label: t('booking:filters.canceled'),
          },
        ];
      case 'payment_method':
        return [...PAYMENT_METHODS].map(({ id }) => ({
          value: id ?? 0,
          label: t(`payment:method.${id}`),
        }));
      // return [
      //   {
      //     value: BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
      //     label: t(
      //       `subscription:parameters.payment_method.${BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB}`,
      //     ),
      //   },
      //   {
      //     value: BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
      //     label: t(
      //       `subscription:parameters.payment_method.${BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA}`,
      //     ),
      //   },
      //   {
      //     value: BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
      //     label: t(
      //       `subscription:parameters.payment_method.${BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT}`,
      //     ),
      //   },
      // ];
      case 'dow':
        return Array(7)
          .fill(0)
          .map((_, i) => ({
            label: moment()
              .isoWeekday(i + 1)
              .format('dddd'),
            value: i + 1,
          }));
      default:
        return [];
    }
  }, [getDataByType, t, datatype]);

  if (['email', 'user'].includes(datatype)) {
    return (
      <Field name={name}>
        {({
          field: { value },
          form: { setFieldValue, setFieldTouched },
          meta,
        }: FieldAttributes<any>) => {
          return (
            <MaterialUISelectorMembers
              isMulti
              onChange={(optionList) => {
                const valueList = optionList.map((option) => option.value);
                setFieldTouched(name, true, false);
                setFieldValue(name, valueList);
              }}
              isMenuListVirtualized
              inScrollBar
              value={value}
              error={!!(meta.touched && meta.error)}
              defaultNumberShown={1}
              isDisabled={isPreview}
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
              isMulti
              onChange={(optionList) => {
                const valueList = optionList.map((option) => option.value);
                setFieldTouched(name, true, false);
                setFieldValue(name, valueList);
              }}
              isMenuListVirtualized
              inScrollBar
              value={value}
              error={!!(meta.touched && meta.error)}
              defaultNumberShown={1}
              isDisabled={isPreview}
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
      'company',
    ].includes(datatype) &&
    getOptions()?.length === 0
  ) {
    return <CircularProgress />;
  }

  return (
    <MaterialUiMultiSelectorField
      name={name}
      options={[...getOptions()]}
      placeholder={t('filter.form.placeholderList')}
      isMenuListVirtualized
      defaultNumberShown={1}
      className={classes.flexOne}
      inScrollBar
      forceError={error && isTouched}
      isDisabled={isPreview}
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

export default ReportFilterConfigValueManager;
