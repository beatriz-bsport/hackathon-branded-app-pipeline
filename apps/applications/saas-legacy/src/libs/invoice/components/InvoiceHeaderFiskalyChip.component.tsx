import React from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { useSelector } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { InvoiceSignEsSignatureStatus } from '#src/libs/invoice/constants';
import type {
  InvoiceV1Serializer,
  WithAuthor,
  FiskalySignEsInvoiceDetails,
} from '#src/libs/invoice/types';
import type { Member } from '#src/libs/member/types';
import type {
  WithEstablishment,
  WithEstablishmentBillingGroup,
} from '#src/libs/establishment/types';
import type { RootState } from '#src/reducers';

type Props = {
  invoice?:
    | WithAuthor<WithEstablishment<InvoiceV1Serializer<Member>>>
    | WithAuthor<WithEstablishmentBillingGroup<InvoiceV1Serializer<Member>>>;
};

// is_signed_on_fiskaly is for German companies (FISKALY DE)
// fiskaly_sign_es_signature_status is for Spanish companies (FISKALY ES).
// They will never be used together.
export const InvoiceHeaderFiskalyChip: React.FC<Props> = ({ invoice }) => {
  const { t } = useTranslation(['invoice', 'b2c_invoice']);
  const classes = useStyles();
  const fiskalySignEsInvoiceDetails = useSelector<
    RootState,
    FiskalySignEsInvoiceDetails | null
  >(
    (state) =>
      (state.invoice.fiskalySignEsInvoice
        ?.result as FiskalySignEsInvoiceDetails | null) || null,
  );
  const status = invoice?.fiskaly_sign_es_signature_status;
  const noChipStatuses = [
    InvoiceSignEsSignatureStatus.NOT_SENDABLE,
    InvoiceSignEsSignatureStatus.TO_BE_SENT_MANUALLY,
  ];

  const getSignEsStatusChip = () => {
    if (!status || noChipStatuses.includes(status)) {
      return null;
    }

    // Use validation_errors from fiskalySignEsInvoiceDetails if available
    const validationErrors = fiskalySignEsInvoiceDetails?.validation_errors;
    let reasonText = t('signEsStatus.unknownError', {
      ns: 'b2c_invoice',
      defaultValue: 'unknown error',
    });

    if (validationErrors && validationErrors.length > 0) {
      reasonText = validationErrors
        .map((error) => {
          // Try to get translation for the error code, fallback to description
          const translationKey = `signEsStatus.validationErrors.${error.code}`;
          const translated = t(translationKey, { ns: 'b2c_invoice' });
          // If translation key doesn't exist, i18next returns the key, so use description
          return translated !== translationKey ? translated : error.description;
        })
        .join(', ');
    }

    const configs: {
      [key: string]: {
        label: string;
        tooltip: string;
        customStyle?: string;
      };
    } = {
      [InvoiceSignEsSignatureStatus.REGISTERED]: {
        label: t('signEsStatus.registered', {
          ns: 'b2c_invoice',
        }),
        tooltip: t('signEsStatus.registeredTooltip', {
          ns: 'b2c_invoice',
        }),
        customStyle: classes.registeredChip,
      },
      [InvoiceSignEsSignatureStatus.REJECTED]: {
        label: t('signEsStatus.rejected', {
          ns: 'b2c_invoice',
        }),
        tooltip: t('signEsStatus.rejectedTooltip', {
          ns: 'b2c_invoice',
          reason: reasonText,
        }),
        customStyle: classes.rejectedChip,
      },
      [InvoiceSignEsSignatureStatus.PENDING]: {
        label: t('signEsStatus.pending', {
          ns: 'b2c_invoice',
        }),
        tooltip: t('signEsStatus.pendingTooltip', {
          ns: 'b2c_invoice',
        }),
        customStyle: classes.pendingChip,
      },
    };

    const config = configs[status as keyof typeof configs];
    if (!config) return null;

    return (
      <Tooltip title={config.tooltip}>
        <Chip
          className={config.customStyle}
          icon={<InfoIcon className={config.customStyle} />}
          label={config.label}
        />
      </Tooltip>
    );
  };

  if (!invoice) {
    return null;
  }

  const signEsChip = getSignEsStatusChip();

  // is_signed_on_fiskaly is for Sign-DE (German companies), not Sign-ES
  if (!invoice.is_signed_on_fiskaly && !signEsChip) {
    return null;
  }

  return (
    <div className={classes.chipContainer}>
      {/* for Sign-DE */}
      {invoice.is_signed_on_fiskaly && (
        <Chip color="primary" label={t('sentToFiskaly')} />
      )}
      {/* for Sign-ES */}
      {signEsChip}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  chipContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  registeredChip: {
    backgroundColor: '#e9f5f2',
    color: '#226556',
    padding: theme.spacing(0.5),
  },
  rejectedChip: {
    backgroundColor: '#fff0ef',
    color: '#e31b0c',
    padding: theme.spacing(0.5),
  },
  pendingChip: {
    backgroundColor: '#fff7eb',
    color: '#db7900',
    padding: theme.spacing(0.5),
  },
}));
