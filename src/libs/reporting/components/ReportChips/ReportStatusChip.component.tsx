import React from 'react';
import { Theme, createTheme } from '@material-ui/core';
import { PaletteColor } from '@material-ui/core/styles/createPalette';
import { ReportChipDisplay } from '#libs/reporting/components/ReportChips/ReportChipDisplay.component';

// typing to confirm
type Props = {
  datatype: string;
  value: any;
  translation: string;
};

// still have to adjust and confirm the number/text matches

const createMatches = (type: string, theme: Theme) => {
  const green = theme.palette.success;
  const blue = theme.palette.info;
  const yellow = theme.palette.warning;
  const red = theme.palette.error;
  switch (type) {
    case 'last_payment_subscription':
      return {
        0: { color: green, icon: 'CheckCircle' }, // Réussi
        1: { color: red, icon: 'Cancel' }, // Echec
        2: { color: yellow, icon: 'HourglassFull' }, // En attente
        3: { color: yellow, icon: 'Cancel' }, // Annulée
        4: { color: blue, icon: 'Cached' }, // En cours
      };
    case 'subscription':
      return {
        0: { color: yellow, icon: 'HourglassFull' }, // Pas encore commencé
        'En cours': { color: green, icon: 'CheckCircle' },
        Stoppé: { color: red, icon: 'Stop' },
        'En pause': { color: blue, icon: 'Pause' },
        Terminé: { color: red, icon: 'Cancel' },
      };
    case 'booking':
      return {
        0: { color: green, icon: 'CheckCircle' }, // Ok
        1: { color: red, icon: 'Store' }, // Annulé (manager)
        2: { color: red, icon: 'People' }, // Annulé (client)
        3: { color: red, icon: 'Cancel' }, // Séance annulée
      };
    case 'payment':
      return {
        Annulé: { color: yellow, icon: 'Cancel' },
        'En attente': { color: yellow, icon: 'HourglassFull' },
        1: { color: blue, icon: 'Cached' }, // En cours de traitement
        2: { color: green, icon: 'CheckCircle' }, // 2 Réussi
        Echoué: { color: red, icon: 'Cancel' },
      };
    case 'dispute':
      return {
        1: { color: blue, icon: 'Cached' },
        2: { color: green, icon: 'CheckCircle' },
        3: { color: red, icon: 'Cancel' },
      };
    case 'last_payment':
      return {
        Ok: { color: green, icon: 'CheckCircle' },
        Failed: { color: red, icon: 'Cancel' },
        Cancelled: { color: yellow, icon: 'Cancel' },
        Pending: { color: yellow, icon: 'HourglassFull' },
        Processing: { color: blue, icon: 'Cached' },
        Paid: { color: green, icon: 'CheckCircle' },
        Unpaid: { color: red, icon: 'Cancel' },
      };
    case 'video':
      return {
        Draft: { color: blue, icon: 'Edit' },
        Online: { color: green, icon: 'CloudUpload' },
      };
    default:
      return null;
  }
};

const LAST_PAYMENT_STATUS_SUBSCRIPTION = ['last_invoice_status'];
const SUBSCRIPTION_STATUS = ['plan_status'];
const BOOKING_STATUS = ['booking_status_code'];
const PAYMENT_STATUS = ['payout_status'];
const DISPUTE_STATUS = ['dispute_status'];
const LAST_PAYMENT_STATUS_INVOICES = ['payment_status'];
const VIDEO_STATUS = ['video_status'];

export const ReportStatusChip = (props: Props) => {
  const { datatype, value, translation } = props;
  const theme = createTheme({
    palette: {
      warning: {
        main: '#FF9800',
        dark: '#C77700',
      },
    },
  });
  let match: { [key: string | number]: { color: PaletteColor; icon: string } };
  if (
    LAST_PAYMENT_STATUS_SUBSCRIPTION.includes(datatype) &&
    createMatches('last_payment_subscription', theme)
  ) {
    match = createMatches('last_payment_subscription', theme);
  }
  if (
    SUBSCRIPTION_STATUS.includes(datatype) &&
    createMatches('subscription', theme)
  ) {
    match = createMatches('subscription', theme);
  }
  if (BOOKING_STATUS.includes(datatype) && createMatches('value', theme)) {
    match = createMatches('value', theme);
  }
  if (PAYMENT_STATUS.includes(datatype) && createMatches('payment', theme)) {
    match = createMatches('payment', theme);
  }
  if (DISPUTE_STATUS.includes(datatype) && createMatches('dispute', theme)) {
    match = createMatches('dispute', theme);
  }
  if (
    LAST_PAYMENT_STATUS_INVOICES.includes(datatype) &&
    createMatches('last_payment', theme)
  ) {
    match = createMatches('last_payment', theme);
  }
  if (VIDEO_STATUS.includes(datatype) && createMatches('video', theme)) {
    match = createMatches('video', theme);
  }
  let textColor = null;
  let icon = null;
  let iconColor = null;
  if (match) {
    textColor = match[value].color.dark;
    icon = match[value].icon;
    iconColor = match[value].color.main;
  }

  return (
    <ReportChipDisplay
      mainColor={textColor}
      value={translation}
      icon={icon}
      iconColor={iconColor}
    />
  );
};

export default React.memo(ReportStatusChip);
