import React from 'react';
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
import {
  INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER,
  INVOICE_TYPE_REVERSE,
  INVOICE_TYPE_MIGRATION,
} from '@bsport/common/lib/master-data/invoice-type';

import EstablishmentSelector from '#libs/establishment/components/EstablishmentSelector.component';
import type { Invoice, WithAuthor } from '../types';
import type {
  Establishment,
  WithEstablishment,
} from '#libs/establishment/types';
import { getStaffName } from '#libs/booking/utils';
import { OptionCallback } from '../../../state/types';
import { Member } from '#libs/member/types';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';

type Props = {
  invoice?: WithAuthor<WithEstablishment<Invoice<Member>>>;
  onClickInvoice: (uuid: string) => void;
  establishments: Array<Establishment>;
  editBillingEstablishment: (
    estabishmentID: number,
    options?: OptionCallback,
  ) => void;
  enableMultiLocalization: boolean;
  memberDefaultBillingEstablishment?: Establishment;
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
      <InfoOutlinedIcon fontSize="large" className={classes.leftIcon} />
      <Typography color="textSecondary">
        {t(`invoiceInfo.${invoice_type}`)}
      </Typography>
    </div>
  );
};

export const InvoiceHeader = (props: Props) => {
  const { invoice, memberDefaultBillingEstablishment } = props;
  const { t } = useTranslation(['invoice']);
  const classes = useStyles();
  const [editEstablishment, setEditEstablishment] = React.useState(false);
  const { locationInSelector, locationName } = React.useMemo(() => {
    let selectedEstablishment;
    if (invoice && invoice.establishment)
      selectedEstablishment = invoice.establishment;
    else if (memberDefaultBillingEstablishment)
      selectedEstablishment = memberDefaultBillingEstablishment;
    else selectedEstablishment = undefined;
    const _locationInSelector = selectedEstablishment?.id
      ? [selectedEstablishment.id]
      : [];
    const _locationName =
      selectedEstablishment?.location?.address ||
      t('invoice.header.noEstablishment');
    return {
      locationInSelector: _locationInSelector,
      locationName: _locationName,
    };
  }, [invoice, memberDefaultBillingEstablishment, t]);
  if (!invoice) {
    return null;
  }
  let invoiceHeaderType = 'title';
  if (invoice.invoice_type === INVOICE_TYPE_REVERSE) {
    invoiceHeaderType = 'titleRevert';
  } else if (invoice.invoice_type === INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER) {
    invoiceHeaderType = 'titleReceipt';
  } else if (invoice.reverse_invoices && !!invoice.reverse_invoices.length) {
    invoiceHeaderType = 'titleReverted';
  }
  return (
    <div className={classes.header}>
      <Typography variant="h4">
        {t(`invoice.${invoiceHeaderType}`, {
          uuid: invoice.invoice_legal_identifier || invoice.uuid.slice(0, 8),
        })}
      </Typography>
      <div className={classes.additionalInfo}>
        <div className={classes.row}>
          <TodayIcon fontSize="small" className={classes.leftIcon} />
          <Typography color="textSecondary">
            {formatAsDatetimeAdapted(invoice.date, 'LLL')}
          </Typography>
        </div>
        <div className={classes.row}>
          <PersonIcon fontSize="small" className={classes.leftIcon} />
          <Typography color="textSecondary">
            {(invoice && invoice.member && invoice.member.name) || ''}
          </Typography>
        </div>
        <div className={classes.row}>
          <ReceiptIcon fontSize="small" className={classes.leftIcon} />
          <Typography color="textSecondary">
            {invoice?.author
              ? getStaffName(invoice.author)
              : t('invoice.header.clientAuthor')}
          </Typography>
        </div>
        <div className={classes.row}>
          <DevicesIcon fontSize="small" className={classes.leftIcon} />
          <Typography color="textSecondary">
            {t(`invoice.header.source.${invoice.source}`)}
          </Typography>
        </div>
        {props.enableMultiLocalization ? (
          <>
            {editEstablishment ? (
              <div className={classes.row}>
                <div className={classes.selectorRow}>
                  <EstablishmentSelector
                    establishments={props.establishments}
                    noMulti
                    closeMenuOnSelect
                    nullCurrentValue
                    selectOption={async (item: {
                      value: number;
                      label: string;
                    }) => {
                      props.editBillingEstablishment(item?.value);
                      setEditEstablishment(false);
                    }}
                    disabled={!editEstablishment}
                    isClearable
                    selectedEstablishments={locationInSelector}
                    isOptionDisabled
                  />
                </div>
                <IconButton
                  onClick={() => setEditEstablishment(!editEstablishment)}
                  className={classes.iconButton}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            ) : (
              <div className={classes.row}>
                <LocationIcon fontSize="small" className={classes.leftIcon} />
                <Typography color="textSecondary">{locationName}</Typography>
                <IconButton
                  onClick={() => setEditEstablishment(!editEstablishment)}
                  className={classes.iconButton}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </div>
            )}
          </>
        ) : null}

        {!!invoice.source_invoice && (
          <ButtonBase
            onClick={() => props.onClickInvoice(invoice.source_invoice)}
            className={classes.row}
          >
            <DoubleArrowIcon fontSize="small" className={classes.leftIcon} />
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
              onClick={() => props.onClickInvoice(invUUID)}
              className={classes.row}
            >
              <DoubleArrowIcon fontSize="small" className={classes.leftIcon} />
              <Typography color="error">
                {`${t('invoice.header.reverseInvoice')} ${invUUID.slice(0, 8)}`}
              </Typography>
            </ButtonBase>
          ))}
      </div>
      <InvoiceTypeInfo
        t={t}
        classes={classes}
        invoice_type={invoice.invoice_type}
      />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    marginBottom: theme.spacing(2),
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

export default InvoiceHeader;
