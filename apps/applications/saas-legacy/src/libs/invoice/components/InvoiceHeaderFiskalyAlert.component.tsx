import React from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { InvoiceSignEsSignatureStatus } from '#src/libs/invoice/constants';
import type {
  FiskalySignEsError,
  FiskalySignEsInvoiceDetails,
  InvoiceV1Serializer,
  ManuallySendInvoiceToSignEsCallback,
  WithAuthor,
} from '#src/libs/invoice/types';
import type { Member } from '#src/libs/member/types';
import type {
  WithEstablishment,
  WithEstablishmentBillingGroup,
} from '#src/libs/establishment/types';
import { snackbarError } from '#src/actions/snackbar.actions';

type Props = {
  invoice?:
    | WithAuthor<WithEstablishment<InvoiceV1Serializer<Member>>>
    | WithAuthor<WithEstablishmentBillingGroup<InvoiceV1Serializer<Member>>>;
  fiskalySignEsInvoiceDetails?: FiskalySignEsInvoiceDetails | null;
  manuallySendInvoiceToSignEs?: ManuallySendInvoiceToSignEsCallback;
  onManuallySendSuccess?: () => void;
};

/**
 * Displays an alert for Sign-ES invoice status issues.
 *
 * Props:
 * - invoice: The invoice object containing Sign-ES status
 * - fiskalySignEsInvoiceDetails: Detailed error information from Fiskaly API
 * - manuallySendInvoiceToSignEs: Callback to retry sending invoice to Sign-ES
 * - onManuallySendSuccess: Callback executed after successful manual send
 *
 * Logic (checked in priority order):
 * 1. TO_BE_SENT_MANUALLY: Invoice finalized before VERI*FACTU onboarding
 * 2. Error 81004: Unexpected Fiskaly error
 * 3. Error 75619: Reverse invoice - original invoice not sent to Verifactu
 * 4. Regular NOT_SENDABLE: Missing member information (country, zip, city, etc.)
 */
export const InvoiceHeaderFiskalyAlert: React.FC<Props> = ({
  invoice,
  fiskalySignEsInvoiceDetails,
  manuallySendInvoiceToSignEs,
  onManuallySendSuccess,
}) => {
  const { t } = useTranslation('b2c_invoice');
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const status = invoice?.fiskaly_sign_es_signature_status;

  if (
    status !== InvoiceSignEsSignatureStatus.NOT_SENDABLE &&
    status !== InvoiceSignEsSignatureStatus.TO_BE_SENT_MANUALLY
  ) {
    return null;
  }

  const handleTryAgain = () => {
    if (manuallySendInvoiceToSignEs && invoice) {
      if (invoice.uuid) {
        manuallySendInvoiceToSignEs(invoice.uuid, {
          onSuccess: () => onManuallySendSuccess?.(),
          onError: () =>
            dispatch(snackbarError(t('signEsStatus.retryFailure'))),
        });
      }
    }
  };

  // Map error codes to translation keys
  const getReasonDescription = (code: string): string => {
    const translationKey = `signEsStatus.notSendableReasons.${code}`;
    const translated = t(translationKey);
    return translated !== translationKey ? translated : code;
  };

  // Format reasons list with proper grammar (comma-separated, "and" before last item)
  const formatReasonsList = (
    reasons: FiskalySignEsError[] | null | undefined,
  ): string => {
    if (!reasons || reasons.length === 0) return '';

    const descriptions = reasons.map((reason) =>
      getReasonDescription(reason.code),
    );

    if (descriptions.length === 1) return descriptions[0];
    if (descriptions.length === 2) {
      return `${descriptions[0]} ${t('signEsStatus.andConjunction', {
        defaultValue: 'and',
      })} ${descriptions[1]}`;
    }
    const lastItem = descriptions[descriptions.length - 1];
    const allButLast = descriptions.slice(0, -1);
    return `${allButLast.join(', ')}, ${t('signEsStatus.andConjunction', {
      defaultValue: 'and',
    })} ${lastItem}`;
  };

  // Case 3: Reverse invoice cannot be sent (75619)
  const getReverseInvoiceCase = () => {
    const originalInvoiceText = t('signEsStatus.originalInvoice');
    const contentText = t('signEsStatus.reverseInvoiceAlertContent', {
      originalInvoiceLink: originalInvoiceText,
    });
    const originalInvoiceIndex = contentText.indexOf(originalInvoiceText);
    const contentParts =
      originalInvoiceIndex >= 0
        ? [
            contentText.slice(0, originalInvoiceIndex),
            contentText.slice(
              originalInvoiceIndex + originalInvoiceText.length,
            ),
          ]
        : [contentText, ''];

    const originalInvoiceLink = invoice?.source_invoice ? (
      <Link
        href={`/invoice/${invoice.source_invoice}/`}
        rel="noopener noreferrer"
        style={{ textDecoration: 'underline' }}
        target="_blank"
        variant="body2"
      >
        {originalInvoiceText}
      </Link>
    ) : (
      originalInvoiceText
    );

    return {
      title: t('signEsStatus.reverseInvoiceAlertTitle'),
      content: (
        <>
          {contentParts[0]}
          {originalInvoiceLink}
          {contentParts[1]}
        </>
      ),
    };
  };

  // Case 4: Regular NOT_SENDABLE case
  const getNotSendableCase = () => {
    const notSendableReasons =
      fiskalySignEsInvoiceDetails?.current_invoice_not_sent_reasons;
    const hasInvalidSpanishNIF = notSendableReasons?.some(
      (reason) => reason.code === '75607',
    );
    const otherReasons = notSendableReasons?.filter(
      (reason) => reason.code !== '75607',
    );
    const reasonsText = formatReasonsList(otherReasons);
    const memberProfileText = t('signEsStatus.memberProfile');
    const invalidSpanishNIFContent = t(
      'signEsStatus.invalidSpanishNIFAlertContent',
    );

    let title: string;
    let contentText: string;

    if (hasInvalidSpanishNIF && otherReasons && otherReasons.length > 0) {
      // 75607 with other errors: insert invalidSpanishNIFAlertContent in the middle
      title = t('signEsStatus.notSendableAlertTitle');
      contentText = t('signEsStatus.notSendableAlertContent', {
        memberProfileText,
        reasons: reasonsText,
        invalidSpanishNIFContent,
      });
    } else if (hasInvalidSpanishNIF) {
      // 75607 is the only error: use invalidSpanishNIFAlertTitle and simplified content
      title = t('signEsStatus.invalidSpanishNIFAlertTitle');
      contentText = t('signEsStatus.notSendableAlertContentOnlyNIF', {
        memberProfileText,
        invalidSpanishNIFContent,
      });
    } else {
      // No 75607 error: regular case
      title = t('signEsStatus.notSendableAlertTitle');
      contentText = t('signEsStatus.notSendableAlertContent', {
        memberProfileText,
        reasons: reasonsText,
        invalidSpanishNIFContent: '',
      });
    }

    const handleMemberProfileClick = () => {
      if (invoice?.member?.id) {
        history.push(`/member/edit/${invoice.member.id}`);
      }
    };

    const memberProfileLink = (
      <Link
        className={classes.memberProfileLink}
        component="button"
        onClick={handleMemberProfileClick}
        style={{ textDecoration: 'underline' }}
        variant="body2"
      >
        {memberProfileText}
      </Link>
    );

    // Split contentText by all occurrences of memberProfileText and interleave memberProfileLink
    const parts: (string | React.ReactElement)[] = [];
    const fragments = contentText.split(memberProfileText);
    fragments.forEach((fragment, idx) => {
      if (fragment) parts.push(fragment);
      if (idx < fragments.length - 1) {
        parts.push(memberProfileLink);
      }
    });

    return {
      title,
      content: <>{parts}</>,
    };
  };

  const getAlertData = () => {
    const notSendableReasons =
      fiskalySignEsInvoiceDetails?.current_invoice_not_sent_reasons;

    // Case 1: TO_BE_SENT_MANUALLY case
    if (status === InvoiceSignEsSignatureStatus.TO_BE_SENT_MANUALLY) {
      return {
        title: '',
        content: t('signEsStatus.toBeSentManuallyAlertContent'),
      };
    }

    // Case 2: Unexpected error from Fiskaly (81004)
    const isUnexpectedError =
      notSendableReasons?.some((reason) => reason.code === '81004') ?? false;
    if (isUnexpectedError) {
      return {
        title: '',
        content: t('signEsStatus.unexpectedFiskalyErrorContent'),
      };
    }

    // Case 3: Reverse invoice cannot be sent (75619)
    const isReverseInvoiceCase =
      notSendableReasons?.some((reason) => reason.code === '75619') ?? false;
    if (isReverseInvoiceCase) {
      return getReverseInvoiceCase();
    }

    // Case 4: Regular NOT_SENDABLE case
    return getNotSendableCase();
  };

  const { title, content } = getAlertData();

  return (
    <Alert
      action={
        <Button color="inherit" onClick={handleTryAgain} size="small">
          {t('signEsStatus.tryAgain')}
        </Button>
      }
      className={classes.alert}
      severity="warning"
      variant="standard"
    >
      {title && (
        <Typography component="div" variant="body2">
          <strong>{title}</strong>
        </Typography>
      )}
      <Typography
        className={title ? classes.alertContent : undefined}
        component="div"
        variant="body2"
      >
        {content}
      </Typography>
    </Alert>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  alert: {
    borderRadius: theme.spacing(0.5),
  },
  alertContent: {
    marginTop: theme.spacing(1),
  },
  memberProfileLink: {
    display: 'inline',
    padding: 0,
    margin: 0,
    border: 'none',
    background: 'none',
    font: 'inherit',
    verticalAlign: 'baseline',
    '&:hover': {
      background: 'none',
    },
  },
}));
