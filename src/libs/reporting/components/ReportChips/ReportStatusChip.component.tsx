import React from 'react';
import { Theme, createTheme } from '@material-ui/core';
import { PaletteColor } from '@material-ui/core/styles/createPalette';
import { CustomChip } from '#components/chip/CustomChip.component';

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

type Matches = { [key: string]: MatchType };

const createMatches = (theme: Theme): Matches => {
  const green = theme.palette.success;
  const blue = theme.palette.info;
  const yellow = theme.palette.warning;
  const red = theme.palette.error;
  const matches = {
    last_invoice_status: {
      0: { color: green, icon: 'CheckCircle' }, // 0 Réussi
      1: { color: red, icon: 'Cancel' }, // 1 Echec
      2: { color: yellow, icon: 'HourglassFull' }, // 2 En attente
      3: { color: yellow, icon: 'Cancel' }, // 3 Annulée
      4: { color: blue, icon: 'Cached' }, // 4 En cours
    },
    plan_status: {
      0: { color: yellow, icon: 'HourglassFull' }, // 0 Pas encore commencé
      'En cours': { color: green, icon: 'CheckCircle' },
      Stoppé: { color: red, icon: 'Stop' },
      'En pause': { color: blue, icon: 'Pause' },
      Terminé: { color: red, icon: 'Cancel' },
    },
    booking_status_code: {
      0: { color: green, icon: 'CheckCircle' }, // Ok
      1: { color: red, icon: 'Store' }, // Annulé (manager)
      2: { color: red, icon: 'People' }, // Annulé (client)
      3: { color: red, icon: 'Cancel' }, // Séance annulée
    },
    payout_status: {
      Annulé: { color: yellow, icon: 'Cancel' },
      'En attente': { color: yellow, icon: 'HourglassFull' },
      1: { color: blue, icon: 'Cached' }, // En cours de traitement
      2: { color: green, icon: 'CheckCircle' }, // 2 Réussi
      Echoué: { color: red, icon: 'Cancel' },
    },
    dispute_status: {
      1: { color: blue, icon: 'Cached' },
      2: { color: green, icon: 'CheckCircle' },
      3: { color: red, icon: 'Cancel' },
    },
    payment_status: {
      Ok: { color: green, icon: 'CheckCircle' },
      Failed: { color: red, icon: 'Cancel' },
      Cancelled: { color: yellow, icon: 'Cancel' },
      Pending: { color: yellow, icon: 'HourglassFull' },
      Processing: { color: blue, icon: 'Cached' },
      Paid: { color: green, icon: 'CheckCircle' },
      Unpaid: { color: red, icon: 'Cancel' },
      Dispute: { color: yellow, icon: 'Error' }, // discovered in installments, to discuss with product
    },
    video_status: {
      Draft: { color: blue, icon: 'Edit' },
      Online: { color: green, icon: 'CloudUpload' },
    },
  };
  return matches;
};

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
  const matches = createMatches(theme);

  const match = matches[datatype];

  let textColor = null;
  let icon = null;
  let iconColor = null;
  if (match && match[value]) {
    textColor = match[value].color.dark;
    icon = match[value].icon;
    iconColor = match[value].color.main;
  }

  return (
    <CustomChip
      mainColor={textColor}
      displayedValue={translation}
      icon={icon}
      iconColor={iconColor}
    />
  );
};

export default React.memo(ReportStatusChip);
