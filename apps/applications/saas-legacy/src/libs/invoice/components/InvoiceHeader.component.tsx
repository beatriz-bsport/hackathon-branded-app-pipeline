import React, { useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import TodayIcon from '@material-ui/icons/Today';
import DevicesIcon from '@material-ui/icons/Devices';
import PersonIcon from '@material-ui/icons/Person';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ButtonBase from '@material-ui/core/ButtonBase';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import LocationIcon from '@material-ui/icons/LocationOn';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import {
  INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER,
  INVOICE_TYPE_MIGRATION,
  INVOICE_TYPE_REVERSE,
} from '@bsport/common/lib/master-data/invoice-type.js';
import { CircularProgress } from '@material-ui/core';

import EstablishmentBillingGroupSelector from '#src/libs/establishment/components/EstablishmentBillingGroupSelector';
import type {
  Establishment,
  EstablishmentBillingGroup,
  WithEstablishment,
  WithEstablishmentBillingGroup,
} from '#src/libs/establishment/types';
import { getStaffName } from '#src/libs/booking/utils';
import { Member } from '#src/libs/member/types';
import {
  InvoiceV1Serializer,
  PaymentRefundStatus,
  type WithAuthor,
} from '#src/libs/invoice/types';
import { formatAsDatetimeAdapted } from '#src/utils/datetime';

type Props = {
  editEstablishmentBillingGroupIsLoading: boolean;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  enableEditEstablishmentBillingGroup: boolean;
  invoice?:
    | WithAuthor<WithEstablishment<InvoiceV1Serializer<Member>>>
    | WithAuthor<WithEstablishmentBillingGroup<InvoiceV1Serializer<Member>>>;
  editEstablishmentBillingGroup: (establishmentBillingGroupId: number) => void;
  onClickInvoice: (uuid: string) => void;
};

const InvoiceTypeInfo = ({
  invoice_type,
  classes,
  t,
}: {
  invoice_type: number;
  classes: any;
  t: TFunction;
}) => {
  if (
    ![INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER, INVOICE_TYPE_MIGRATION].includes(
      invoice_type,
    )
  ) {
    return null;
  }
  return (
    <div className={classes.infoContainer}>
      <InfoOutlinedIcon className={classes.leftIcon} fontSize="large" />
      <Typography color="textSecondary">
        {t(`invoiceInfo.${invoice_type}`)}
      </Typography>
    </div>
  );
};

export const InvoiceHeader = (props: Props) => {
  const {
    editEstablishmentBillingGroupIsLoading,
    establishmentBillingGroups,
    invoice,
    editEstablishmentBillingGroup,
  } = props;

  const { t } = useTranslation(['invoice']);
  const classes = useStyles();

  const [
    showEstablishmentBillingGroupSelector,
    setShowEstablishmentBillingGroupSelector,
  ] = React.useState(false);

  // As default behavior, we first look for a billing group.
  // If no billing group, the invoice may contain an establishment address.
  // If not, we just take the default one.
  const locationName = React.useMemo(() => {
    const billingGroup =
      invoice?.establishment_billing_group as EstablishmentBillingGroup;

    const establishment = invoice?.establishment as Establishment;

    return (
      billingGroup?.name ||
      establishment?.location?.address ||
      t('invoice.header.noBillingGroup')
    );
  }, [invoice, t]);

  const onEditEstablishmentBillingGroup = useCallback(
    (establishmentBillingGroup: EstablishmentBillingGroup) => {
      editEstablishmentBillingGroup(establishmentBillingGroup.id);
      setShowEstablishmentBillingGroupSelector(false);
    },
    [editEstablishmentBillingGroup, setShowEstablishmentBillingGroupSelector],
  );

  const handleShowEstablishmentBillingGroupSelector = useCallback(
    () =>
      setShowEstablishmentBillingGroupSelector(
        (previousValue) => !previousValue,
      ),
    [setShowEstablishmentBillingGroupSelector],
  );

  const getReverseInvoiceHeader = React.useCallback(
    (invUUID) => {
      if (
        !invoice ||
        !invoice.reverse_invoices ||
        !invoice.reverse_invoices.length
      ) {
        return null;
      }
      if (
        invoice.reverse_invoices_payment_status == PaymentRefundStatus.PENDING
      ) {
        return `${t('invoice.header.reverseInvoicePending')} ${invUUID.slice(
          0,
          8,
        )}`;
      }
      // For now, if the refund is not pending, we consider it as done.
      return `${t('invoice.header.reverseInvoice')} ${invUUID.slice(0, 8)}`;
    },
    [invoice, t],
  );
  if (!invoice) {
    return null;
  }
  let invoiceHeaderType = 'title';
  if (
    invoice.invoice_type === INVOICE_TYPE_REVERSE &&
    invoice.has_pending_payment
  ) {
    invoiceHeaderType = 'titleRevertPending';
  } else if (invoice.invoice_type == INVOICE_TYPE_REVERSE) {
    invoiceHeaderType = 'titleRevert';
  } else if (invoice.invoice_type === INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER) {
    invoiceHeaderType = 'titleReceipt';
  } else if (invoice.reverse_invoices && !!invoice.reverse_invoices.length) {
    invoiceHeaderType = 'titleReverted';
  }

  return (
    <div className={classes.header}>
      <div className={classes.titleContainer}>
        <Typography variant="h4">
          {t(`invoice.${invoiceHeaderType}`, {
            uuid: invoice.invoice_legal_identifier || invoice.uuid.slice(0, 8),
          })}
        </Typography>
        {invoice.is_signed_on_fiskaly && (
          <Chip color="primary" label={t('sentToFiskaly')} />
        )}
      </div>
      <div className={classes.additionalInfo}>
        <div className={classes.row}>
          <TodayIcon className={classes.leftIcon} fontSize="small" />
          <Typography color="textSecondary">
            {formatAsDatetimeAdapted(invoice.date, 'DDD t')}
          </Typography>
        </div>
        <div className={classes.row}>
          <PersonIcon className={classes.leftIcon} fontSize="small" />
          <Typography color="textSecondary">
            {(invoice?.member &&
              (invoice.is_member_pos
                ? t('anonymousMember')
                : invoice.member.name)) ||
              ''}
          </Typography>
        </div>
        <div className={classes.row}>
          <ReceiptIcon className={classes.leftIcon} fontSize="small" />
          <Typography color="textSecondary">
            {invoice?.author
              ? getStaffName(invoice.author)
              : t('invoice.header.clientAuthor')}
          </Typography>
        </div>
        <div className={classes.row}>
          <DevicesIcon className={classes.leftIcon} fontSize="small" />
          <Typography color="textSecondary">
            {t(`invoice.header.source.${invoice.source}`)}
          </Typography>
        </div>
        {props.enableEditEstablishmentBillingGroup ? (
          <>
            {showEstablishmentBillingGroupSelector ? (
              <div className={classes.row}>
                <div className={classes.selectorRow}>
                  <EstablishmentBillingGroupSelector
                    closeMenuOnSelect
                    isClearable
                    establishmentBillingGroups={establishmentBillingGroups}
                    isDisabled={!showEstablishmentBillingGroupSelector}
                    selectedEstablishmentBillingGroup={null}
                    selectOption={onEditEstablishmentBillingGroup}
                  />
                </div>
                <IconButton
                  className={classes.iconButton}
                  onClick={handleShowEstablishmentBillingGroupSelector}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            ) : (
              <div className={classes.row}>
                <LocationIcon className={classes.leftIcon} fontSize="small" />
                {editEstablishmentBillingGroupIsLoading ? (
                  <CircularProgress color="secondary" size="1rem" />
                ) : (
                  <Typography color="textSecondary">{locationName}</Typography>
                )}
                {!editEstablishmentBillingGroupIsLoading && (
                  <IconButton
                    className={classes.iconButton}
                    onClick={handleShowEstablishmentBillingGroupSelector}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            )}
          </>
        ) : null}

        {!!invoice.source_invoice && (
          <ButtonBase
            className={classes.row}
            onClick={() => props.onClickInvoice(invoice.source_invoice)}
          >
            <DoubleArrowIcon className={classes.leftIcon} fontSize="small" />
            <Typography color="textSecondary">
              {`${t(
                'invoice.header.sourceInvoice',
              )} ${invoice.source_invoice.slice(0, 8)}`}
            </Typography>
          </ButtonBase>
        )}
        {!!invoice.reverse_invoices &&
          !!invoice.reverse_invoices.length &&
          invoice.reverse_invoices.map((invUUID: string) => (
            <ButtonBase
              className={classes.row}
              onClick={() => props.onClickInvoice(invUUID)}
            >
              <DoubleArrowIcon className={classes.leftIcon} fontSize="small" />
              <Typography color="error">
                {getReverseInvoiceHeader(invUUID)}
              </Typography>
            </ButtonBase>
          ))}
      </div>
      <InvoiceTypeInfo
        classes={classes}
        invoice_type={invoice.invoice_type}
        t={t}
      />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    marginBottom: theme.spacing(2),
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  additionalInfo: {
    borderLeft: '2px solid black',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(2),
    '&>*': {
      marginBottom: theme.spacing(0.5),
    },
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorRow: {
    maxWidth: '50%',
    flex: 1,
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  iconButton: {
    paddingTop: 0,
    paddingBottom: 0,
    padding: 0,
    marginLeft: theme.spacing(1),
  },
  infoContainer: {
    backgroundColor: '#f8f8f8',
    border: '1px solid #dedede',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
}));

export default React.memo(InvoiceHeader);
