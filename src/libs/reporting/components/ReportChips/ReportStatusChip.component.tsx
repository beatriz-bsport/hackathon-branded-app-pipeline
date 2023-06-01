import React, { useCallback } from 'react';
import { Theme, createTheme } from '@material-ui/core';
import { PaletteColor } from '@material-ui/core/styles/createPalette';
import { ReportStatusChipTypes } from '#libs/reporting/constants';
import { ReportChipDisplay } from '#libs/reporting/components/ReportChips/ReportChipDisplay.component';

// typing to confirm
type Props = {
  datatype: string;
  value: string | number;
  translation: string;
};

// still have to adjust and confirm the number/text matches

type MatchType = {
  [key: string | number]: { color: PaletteColor; icon: string };
} | null;

const createMatches = (type: string, theme: Theme): MatchType => {
  const green = theme.palette.success;
  const blue = theme.palette.info;
  const yellow = theme.palette.warning;
  const red = theme.palette.error;
  const lastPaymentStatusSubscriptionMatch = {
    0: { color: green, icon: 'CheckCircle' }, // 0 Réussi
    1: { color: red, icon: 'Cancel' }, // 1 Echec
    2: { color: yellow, icon: 'HourglassFull' }, // 2 En attente
    3: { color: yellow, icon: 'Cancel' }, // 3 Annulée
    4: { color: blue, icon: 'Cached' }, // 4 En cours
  };
  const subscriptionMatch = {
    0: { color: yellow, icon: 'HourglassFull' }, // 0 Pas encore commencé
    'En cours': { color: green, icon: 'CheckCircle' },
    Stoppé: { color: red, icon: 'Stop' },
    'En pause': { color: blue, icon: 'Pause' },
    Terminé: { color: red, icon: 'Cancel' },
  };
  const bookingMatch = {
    0: { color: green, icon: 'CheckCircle' }, // Ok
    1: { color: red, icon: 'Store' }, // Annulé (manager)
    2: { color: red, icon: 'People' }, // Annulé (client)
    3: { color: red, icon: 'Cancel' }, // Séance annulée
  };
  const paymentMatch = {
    Annulé: { color: yellow, icon: 'Cancel' },
    'En attente': { color: yellow, icon: 'HourglassFull' },
    1: { color: blue, icon: 'Cached' }, // En cours de traitement
    2: { color: green, icon: 'CheckCircle' }, // 2 Réussi
    Echoué: { color: red, icon: 'Cancel' },
  };
  const disputeMatch = {
    1: { color: blue, icon: 'Cached' },
    2: { color: green, icon: 'CheckCircle' },
    3: { color: red, icon: 'Cancel' },
  };
  const lastPaymentStatusMatch = {
    Ok: { color: green, icon: 'CheckCircle' },
    Failed: { color: red, icon: 'Cancel' },
    Cancelled: { color: yellow, icon: 'Cancel' },
    Pending: { color: yellow, icon: 'HourglassFull' },
    Processing: { color: blue, icon: 'Cached' },
    Paid: { color: green, icon: 'CheckCircle' },
    Unpaid: { color: red, icon: 'Cancel' },
  };
  const videoMatch = {
    Draft: { color: blue, icon: 'Edit' },
    Online: { color: green, icon: 'CloudUpload' },
  };
  switch (type) {
    case ReportStatusChipTypes.LAST_PAYMENT_STATUS_SUBSCRIPTION:
      return lastPaymentStatusSubscriptionMatch;
    case ReportStatusChipTypes.SUBSCRIPTION:
      return subscriptionMatch;
    case ReportStatusChipTypes.BOOKING:
      return bookingMatch;
    case ReportStatusChipTypes.PAYMENT:
      return paymentMatch;
    case ReportStatusChipTypes.DISPUTE:
      return disputeMatch;
    case ReportStatusChipTypes.LAST_PAYMENT_STATUS:
      return lastPaymentStatusMatch;
    case ReportStatusChipTypes.VIDEO:
      return videoMatch;
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

  const getMatch = useCallback(() => {
    let match = null;
    if (
      LAST_PAYMENT_STATUS_SUBSCRIPTION.includes(datatype) &&
      createMatches(
        ReportStatusChipTypes.LAST_PAYMENT_STATUS_SUBSCRIPTION,
        theme,
      )
    ) {
      match = createMatches(
        ReportStatusChipTypes.LAST_PAYMENT_STATUS_SUBSCRIPTION,
        theme,
      );
    } else if (
      SUBSCRIPTION_STATUS.includes(datatype) &&
      createMatches(ReportStatusChipTypes.SUBSCRIPTION, theme)
    ) {
      match = createMatches(ReportStatusChipTypes.SUBSCRIPTION, theme);
    } else if (
      BOOKING_STATUS.includes(datatype) &&
      createMatches(ReportStatusChipTypes.BOOKING, theme)
    ) {
      match = createMatches(ReportStatusChipTypes.BOOKING, theme);
    } else if (
      PAYMENT_STATUS.includes(datatype) &&
      createMatches(ReportStatusChipTypes.PAYMENT, theme)
    ) {
      match = createMatches(ReportStatusChipTypes.PAYMENT, theme);
    } else if (
      DISPUTE_STATUS.includes(datatype) &&
      createMatches(ReportStatusChipTypes.DISPUTE, theme)
    ) {
      match = createMatches(ReportStatusChipTypes.DISPUTE, theme);
    } else if (
      LAST_PAYMENT_STATUS_INVOICES.includes(datatype) &&
      createMatches(ReportStatusChipTypes.LAST_PAYMENT_STATUS, theme)
    ) {
      match = createMatches(ReportStatusChipTypes.LAST_PAYMENT_STATUS, theme);
    } else if (
      VIDEO_STATUS.includes(datatype) &&
      createMatches(ReportStatusChipTypes.VIDEO, theme)
    ) {
      match = createMatches(ReportStatusChipTypes.VIDEO, theme);
    }
    return match;
  }, [datatype, theme]);

  const match = getMatch();
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
      displayedValue={translation}
      icon={icon}
      iconColor={iconColor}
    />
  );
};

export default React.memo(ReportStatusChip);
