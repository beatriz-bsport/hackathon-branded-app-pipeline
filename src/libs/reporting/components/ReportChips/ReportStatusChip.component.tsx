import React from 'react';
import { Theme, createTheme } from '@material-ui/core';
import { PaletteColor } from '@material-ui/core/styles/createPalette';
import {
  PAYOUT_STATUS_PENDING,
  PAYOUT_STATUS_CANCELED,
  PAYOUT_STATUS_FAILED,
  PAYOUT_STATUS_SUCCESS,
  PAYOUT_STATUS_TRANSIT,
} from '@bsport/common/lib/master-data/payout-status';
import {
  DISPUTE_STATUS_PENDING,
  DISPUTE_STATUS_WON,
  DISPUTE_STATUS_LOST,
} from '@bsport/common/lib/master-data/dispute-status';
import {
  BOOKING_STATUS_OK,
  BOOKING_STATUS_CANCELLED_BY_CONSUMER,
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_OFFER,
} from '@bsport/common/lib/master-data/booking_status_code';
import {
  SUCCEEDED as LAST_INVOICE_SUCCEEDED,
  FAILED as LAST_INVOICE_FAILED,
  PENDING as LAST_INVOICE_PENDING,
  CANCELED as LAST_INVOICE_CANCELLED,
  PROCESSING as LAST_INVOICE_PROCESSING,
} from '@bsport/common/lib/master-data/planned-invoice-status';
import {
  BILLING_PLAN_STATUS_NOT_STARTED,
  BILLING_PLAN_STATUS_STARTED,
  BILLING_PLAN_STATUS_STOPPED,
  BILLING_PLAN_STATUS_PAUSED,
  BILLING_PLAN_STATUS_ENDED,
} from '@bsport/common/lib/master-data/subscription-status';

import CustomChip from '#components/chip/CustomChip.component';

type Props = {
  datatype: string;
  value: string | number;
  translation: string;
  extra_data?: { [key: string]: number | string };
  row_extra_data?: { [key: string]: number | string };
  chipClass?: string;
};

type MatchType = {
  [key: string | number]: { color: PaletteColor; icon: string };
} | null;

type Matches = { [key: string]: MatchType };

const createMatches = (theme: Theme): Matches => {
  const green = theme.palette.success;
  const blue = theme.palette.info;
  const yellow = theme.palette.warning;
  const orange = theme.palette.primary;
  const red = theme.palette.error;
  const matches = {
    last_invoice_status: {
      [LAST_INVOICE_SUCCEEDED.id]: { color: green, icon: 'CheckCircle' },
      [LAST_INVOICE_FAILED.id]: { color: red, icon: 'Cancel' },
      [LAST_INVOICE_PENDING.id]: { color: yellow, icon: 'HourglassFull' },
      [LAST_INVOICE_CANCELLED.id]: { color: yellow, icon: 'Cancel' },
      [LAST_INVOICE_PROCESSING.id]: { color: blue, icon: 'Cached' },
    },
    plan_status: {
      [BILLING_PLAN_STATUS_NOT_STARTED]: {
        color: yellow,
        icon: 'HourglassFull',
      },
      [BILLING_PLAN_STATUS_STARTED]: { color: green, icon: 'CheckCircle' },
      [BILLING_PLAN_STATUS_STOPPED]: { color: red, icon: 'Stop' },
      [BILLING_PLAN_STATUS_PAUSED]: { color: blue, icon: 'Pause' },
      [BILLING_PLAN_STATUS_ENDED]: { color: red, icon: 'Cancel' },
    },
    booking_status_code: {
      [BOOKING_STATUS_OK.id]: { color: green, icon: 'CheckCircle' },
      [BOOKING_STATUS_CANCELLED_BY_MANAGER.id]: { color: red, icon: 'Store' },
      [BOOKING_STATUS_CANCELLED_BY_CONSUMER.id]: { color: red, icon: 'People' },
      [BOOKING_STATUS_CANCELLED_BY_OFFER.id]: { color: red, icon: 'Cancel' },
    },
    payout_status: {
      [PAYOUT_STATUS_PENDING]: { color: yellow, icon: 'HourglassFull' },
      [PAYOUT_STATUS_TRANSIT]: { color: blue, icon: 'Cached' },
      [PAYOUT_STATUS_SUCCESS]: { color: green, icon: 'CheckCircle' },
      [PAYOUT_STATUS_FAILED]: { color: red, icon: 'Cancel' },
      [PAYOUT_STATUS_CANCELED]: { color: yellow, icon: 'Cancel' },
    },
    dispute_status: {
      [DISPUTE_STATUS_PENDING]: { color: blue, icon: 'Cached' },
      [DISPUTE_STATUS_WON]: { color: green, icon: 'CheckCircle' },
      [DISPUTE_STATUS_LOST]: { color: red, icon: 'Cancel' },
    },
    payment_status: {
      Ok: { color: green, icon: 'CheckCircle' },
      Failed: { color: red, icon: 'Cancel' },
      Cancelled: { color: yellow, icon: 'Cancel' },
      Pending: { color: yellow, icon: 'HourglassFull' },
      Processing: { color: blue, icon: 'Cached' },
      Paid: { color: green, icon: 'CheckCircle' },
      Unpaid: { color: red, icon: 'Cancel' },
      Dispute: { color: orange, icon: 'Warning' },
    },
    video_status: {
      Draft: { color: blue, icon: 'Edit' },
      Online: { color: green, icon: 'CloudUpload' },
    },
  };
  return matches;
};

export const ReportStatusChip = (props: Props) => {
  const {
    datatype,
    value,
    translation,
    extra_data,
    row_extra_data,
    chipClass,
  } = props;
  const theme = createTheme({
    palette: {
      primary: { main: '#FF5C00', dark: '#C94800' }, // orange
      warning: {
        main: '#FF9800',
        dark: '#C77700',
      },
    },
  });
  const allMatches = createMatches(theme);

  const matches = allMatches[datatype];

  let textColor = null;
  let icon = null;
  let iconColor = null;

  let non_casted_value = null;
  if (extra_data) {
    non_casted_value = extra_data?.non_casted_value;
  }
  if (
    row_extra_data &&
    datatype === 'payout_status' &&
    row_extra_data?.payout_status
  ) {
    non_casted_value = row_extra_data.payout_status;
  }
  const match = matches[non_casted_value] ?? matches[value];
  if (match) {
    textColor = match.color.dark;
    icon = match.icon;
    iconColor = match.color.main;
  }

  return (
    <CustomChip
      chipClass={chipClass}
      displayedValue={translation}
      icon={icon}
      iconColor={iconColor}
      mainColor={textColor}
    />
  );
};

export default React.memo(ReportStatusChip);
