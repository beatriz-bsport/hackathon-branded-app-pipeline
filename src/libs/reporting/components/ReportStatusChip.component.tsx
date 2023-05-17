// @ts-nocheck
import React from 'react';
import { ReportChipDisplay } from '#libs/reporting/components/ReportChipDisplay.component';

// TODO PROPER TYPING
type Props = {
  datatype: any;
  value: any;
  translation: string;
};

// WIP still have to confirm the correspondances with the ids
// + add extra_data to the props ect

const LAST_PAYMENT_STATUS_SUBSCRIPTION = ['last_invoice_status'];
const last_payment_subscription = {
  Annulé: { color: 'yellow', icon: 'cross' }, // 3
  Réussi: { color: 'green', icon: 'check' }, // 0
  Echec: { color: 'red', icon: 'cross' }, // 1 ?
  'En attente': { color: 'yellow', icon: 'hourglass' }, // 2
  'En cours': { color: 'blue', icon: 'arrows' }, // 4
};

const SUBSCRIPTION_STATUS = ['plan_status'];
const subscription = {
  // ?
  'Pas encore commencé': { color: 'yellow', icon: 'hourglass' }, // 0
  'En cours': { color: 'green', icon: 'check' },
  Stoppé: { color: 'red', icon: 'stop' },
  'En pause': { color: 'blue', icon: 'pause' },
  Terminé: { color: 'red', icon: 'cross' },
};

const BOOKING_STATUS = ['booking_status_code'];
const booking = {
  Ok: { color: 'green', icon: 'check' }, // 0 => affiché en 'Ok' ? OUI > je peux le réafficher en vrai
  'Annulé (manager)': { color: 'red', icon: 'market' }, // 1
  'Annulé (client)': { color: 'red', icon: 'people' }, // 2
  'Séance annulée': { color: 'red', icon: 'cross' }, // 3 ?
};

const PAYMENT_STATUS = ['payout_status'];
const payment = {
  // ??
  Annulé: { color: 'yellow', icon: 'cross' },
  'En attente': { color: 'yellow', icon: 'hourglass' },
  'En cours de traitement': { color: 'blue', icon: 'arrows' }, // 1
  Réussi: { color: 'green', icon: 'check' }, // 2
  Echoué: { color: 'red', icon: 'cross' },
};

const DISPUTE_STATUS = ['dispute_status'];
const dispute = {
  1: { color: 'blue', icon: 'arrows' },
  2: { color: 'green', icon: 'check' },
  3: { color: 'red', icon: 'cross' },
};

const LAST_PAYMENT_STATUS_INVOICES = ['payment_status'];
const last_payment = {
  Ok: { color: 'green', icon: 'check' },
  Failed: { color: 'red', icon: 'cross' },
  Cancelled: { color: 'yellow', icon: 'cross' },
  Pending: { color: 'yellow', icon: 'hourglass' },
  Processing: { color: 'blue', icon: 'arrows' },
  Paid: { color: 'green', icon: 'check' },
  Unpaid: { color: 'red', icon: 'cross' },
};

const VIDEO_STATUS = ['video_status'];
const video = {
  // ok
  Draft: { color: 'blue', icon: 'pen' },
  Online: { color: 'green', icon: 'cloud' },
};

export const ReportStatusChip = (props: Props) => {
  const { datatype, value, translation } = props;
  let color = 'grey';
  let icon = null;
  if (
    LAST_PAYMENT_STATUS_SUBSCRIPTION.includes(datatype) &&
    last_payment_subscription[value]
  ) {
    color = last_payment_subscription[value].color;
    icon = last_payment_subscription[value].icon;
  }
  if (SUBSCRIPTION_STATUS.includes(datatype) && subscription[value]) {
    color = subscription[value].color;
    icon = subscription[value].icon;
  }
  if (BOOKING_STATUS.includes(datatype) && booking[value]) {
    color = booking[value].color;
    icon = booking[value].icon;
  }
  if (PAYMENT_STATUS.includes(datatype) && payment[value]) {
    color = payment[value].color;
    icon = payment[value].icon;
  }
  if (DISPUTE_STATUS.includes(datatype) && dispute[value]) {
    color = dispute[value].color;
    icon = dispute[value].icon;
  }
  if (LAST_PAYMENT_STATUS_INVOICES.includes(datatype) && last_payment[value]) {
    color = last_payment[value].color;
    icon = last_payment[value].icon;
  }
  if (VIDEO_STATUS.includes(datatype) && video[value]) {
    color = video[value].color;
    icon = video[value].icon;
  }

  return <ReportChipDisplay color={color} value={translation} icon={icon} />;
};

export default ReportStatusChip;
