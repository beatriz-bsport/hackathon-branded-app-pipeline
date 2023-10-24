import React, { ChangeEvent, useCallback } from 'react';
import { type Theme, makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { INVOICE_TYPE_MIGRATION } from '@bsport/common/lib/master-data/invoice-type';
import DeleteIcon from '@material-ui/icons/Delete';
import { ListItem } from '@material-ui/core';
import Tooltip from '#components/Tooltip.component';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
// @ts-expect-error
import InvoiceItem from './InvoiceItem.component';
// @ts-expect-error
import PaymentItem from './PaymentItem.component';
import CouponCodeForm from '#libs/coupon/components/CouponCodeForm.component';
import EstablishmentSelector from '#libs/establishment/components/EstablishmentSelector.component';
import { getReceiptUrl as getReceiptUrlAPI } from '../api';
import type { Establishment } from '#libs/establishment/types';
import type { OptionCallback } from '../../../state/types';
import type { Invoice } from '../types';
import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

type Props = {
  paymentItemList: PaymentItem[];
  removeInvoiceItem: (id: number) => void;
  removePaymentItem: (id: number) => void;
  amountInvoiceItem: number;
  amountPaymentItem: number;
  returnPayment: (uuid: string) => void;
  finalizeInvoice: () => void;
  updatePaymentMethod: (uuid: string, paymentMethodId: number) => void;
  isReturningPayment: boolean;
  goToSubscription: (id: number) => void;
  invoice?: Invoice;
  invoiceItemLoading: boolean;
  invoiceItemList: InvoiceItem[];
  editCustomFooter: (footer: string, options?: OptionCallback) => void;
  couponList?: {
    coupon_code: string;
    coupon_voucher: number;
    compatible_items: number[];
  }[];
  deleteCoupon?: (couponIndex: number) => void;
  applyCoupon?: (couponCode: String, options: OptionCallback) => void;
  disableCoupon: boolean;
  couponLoading: boolean;
  withEstablishment: boolean;
  establishmentLoading: boolean;
  establishments: Establishment[];
  setBillingEstablishment: (establishmentId: number | null) => void;
  billing_establishment_id: number;
  enableMultiLocalization: boolean;
  requiredEstablishmentIsMissing?: boolean;
};

export const InvoiceContent: React.FC<Props> = ({
  paymentItemList,
  removeInvoiceItem,
  removePaymentItem,
  amountInvoiceItem,
  amountPaymentItem,
  returnPayment,
  finalizeInvoice,
  updatePaymentMethod,
  isReturningPayment,
  goToSubscription,
  invoice,
  invoiceItemLoading,
  invoiceItemList,
  editCustomFooter,
  couponList,
  deleteCoupon,
  applyCoupon,
  disableCoupon,
  couponLoading,
  withEstablishment,
  establishmentLoading,
  establishments,
  setBillingEstablishment,
  billing_establishment_id,
  enableMultiLocalization,
  requiredEstablishmentIsMissing,
}) => {
  const classes = useStyles({
    amountPaymentItem,
    amountInvoiceItem,
  });

  const { t } = useTranslation('invoice');

  const [editFooterOpen, setEditFooterOpen] = React.useState(false);

  const [customFooterValue, setCustomFooterValue] = React.useState(
    invoice ? invoice.custom_footer : '',
  );

  const [loading, setLoading] = React.useState(false);

  const is_reverse = invoice?.source_invoice;

  const handleRemoveInvoiceItem = useCallback(
    (ii: InvoiceItem) => () => removeInvoiceItem(ii.id),
    [removeInvoiceItem],
  );

  const handleRemovePaymentItem = useCallback(
    (p: PaymentItem) => () => removePaymentItem(p.id),
    [removePaymentItem],
  );

  const handleOpenEditFooter = useCallback(() => setEditFooterOpen(true), []);

  const handleCloseEditFooter = useCallback(() => setEditFooterOpen(false), []);

  const handleEditCustomFooter = useCallback(
    () =>
      editCustomFooter(customFooterValue, {
        onSuccess: handleCloseEditFooter,
      }),
    [customFooterValue, editCustomFooter, handleCloseEditFooter],
  );

  const handleDeleteCoupon = useCallback(
    (index: number) => () => deleteCoupon(index),
    [deleteCoupon],
  );

  const handleDownloadInvoice = useCallback(() => {
    if (!invoice.is_draft) {
      if (invoice.stripe_invoice_pdf) {
        window.open(invoice.stripe_invoice_pdf);
      } else {
        finalizeInvoice();
      }
    }
  }, [finalizeInvoice, invoice?.is_draft, invoice?.stripe_invoice_pdf]);

  const handleGoToSubscription = useCallback(() => {
    !!invoice.billing_plan && goToSubscription(invoice.billing_plan);
  }, [goToSubscription, invoice?.billing_plan]);

  const handleGetReceiptUrlAPI = useCallback(
    () => getReceiptUrlAPI(invoice.uuid).then((r) => window.open(r.data)),
    [invoice?.uuid],
  );

  const handleSelectBillingEstablishment = useCallback(
    async (item: { value: number; label: string }) => {
      setBillingEstablishment(item ? item.value : null);
      setLoading(true);
      // loading is used to force re-render of the menuPortal to update
      // selected items
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
      setLoading(false);
    },
    [setBillingEstablishment],
  );

  const handleChangeCustomFooterValue = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setCustomFooterValue(event?.target?.value),
    [setCustomFooterValue],
  );

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <div className={classes.section}>
          <Typography className={classes.sectionTitle} variant="h6">
            {t(
              is_reverse
                ? 'section.invoiceItemList.titleReverse'
                : 'section.invoiceItemList.title',
            )}
          </Typography>
          {invoiceItemLoading ? (
            <LinearProgress className={classes.divider} />
          ) : (
            <Divider className={classes.divider} />
          )}
          {invoiceItemList.map((ii: InvoiceItem) => (
            <InvoiceItem
              key={`${ii.buyable_item_identifier}:${ii.id}:${ii.voucher}`}
              invoiceItem={ii}
              onDelete={handleRemoveInvoiceItem(ii)}
            />
          ))}
          {!invoiceItemLoading && !invoiceItemList.length && (
            <div className={classes.isEmptyContainer}>
              <Typography variant="caption">
                {t('section.invoiceItemList.isEmpty')}
              </Typography>
            </div>
          )}
          <div className={classes.sumUp}>
            <div className={classes.sumUpInnerPayment}>
              <Typography component="p" variant="h6">
                {t('section.invoiceItemList.total')}
              </Typography>
              <Typography variant="h5">
                {getCurrencyDisplayWithPrice(
                  // @ts-expect-error
                  parseFloat(amountInvoiceItem).toFixed(2),
                )}
              </Typography>
            </div>
          </div>
        </div>
        {!!invoice && !invoice.is_v2 && (
          <div className={classes.section}>
            <div className={classes.sectionTitle}>
              <Typography variant="h6">
                {t('section.paymentList.title')}
              </Typography>
            </div>
            <Divider className={classes.divider} />
            {!!paymentItemList &&
              paymentItemList.map((p: PaymentItem) => (
                <PaymentItem
                  key={p.uuid}
                  handleChangeMethod={updatePaymentMethod}
                  isReturningPayment={isReturningPayment}
                  onDelete={handleRemovePaymentItem(p)}
                  paymentItem={p}
                  returnPayment={returnPayment}
                />
              ))}
            {!paymentItemList ||
              (!paymentItemList.length && (
                <div className={classes.isEmptyContainer}>
                  <Typography variant="caption">
                    {t('section.paymentList.isEmpty')}
                  </Typography>
                </div>
              ))}
            <div className={classes.sumUp}>
              <div className={classes.sumUpInnerInvoiceItem}>
                <Typography component="p" variant="h6">
                  {t('section.paymentList.total')}
                </Typography>
                <Typography
                  color={amountPaymentItem < amountInvoiceItem ? 'error' : null}
                  variant="h5"
                >
                  {getCurrencyDisplayWithPrice(amountPaymentItem || 0)}
                </Typography>
              </div>
            </div>
          </div>
        )}
        {!!invoice && invoice.is_v2 && !editFooterOpen ? (
          <div className={classes.footerSectionColumn}>
            {!!invoice.custom_footer && (
              <Typography
                className={classes.customFooterContainer}
                color="textSecondary"
                variant="caption"
              >
                {invoice.custom_footer}
              </Typography>
            )}
            <div>
              <Button onClick={handleOpenEditFooter}>
                {t('actions.addFooter')}
              </Button>
            </div>
          </div>
        ) : (
          <div />
        )}
        {editFooterOpen && (
          <div className={classes.footerSectionRow}>
            <TextField
              fullWidth
              onChange={handleChangeCustomFooterValue}
              value={customFooterValue}
              variant="outlined"
            />
            <IconButton onClick={handleCloseEditFooter}>
              <CancelIcon />
            </IconButton>
            <IconButton onClick={handleEditCustomFooter}>
              <SaveIcon />
            </IconButton>
          </div>
        )}
        <div>
          {couponList && (
            <div className={classes.couponButton}>
              <CouponCodeForm
                disabled={disableCoupon || couponLoading}
                onSubmit={applyCoupon}
              />
            </div>
          )}
          {couponLoading && <LinearProgress className={classes.divider} />}
          <List>
            {!!couponList &&
              couponList.length !== 0 &&
              couponList.map((coupon, index) => (
                <>
                  <ListItem key={`coupon:${coupon.coupon_code}`}>
                    <ListItemText
                      primary={`${
                        coupon.coupon_code
                      } - ${getCurrencyDisplayWithPrice(
                        coupon.coupon_voucher || 0,
                      )}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-label="delete"
                        onClick={handleDeleteCoupon(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </>
              ))}
          </List>
        </div>

        {enableMultiLocalization && withEstablishment && (
          <>
            <Typography className={classes.sectionTitle} variant="h6">
              {t('section.invoiceItemList.billing_establishment')}
            </Typography>
            {establishmentLoading || invoiceItemLoading ? (
              <LinearProgress className={classes.divider} />
            ) : (
              <Divider className={classes.divider} />
            )}
            <div className={classes.sectionEstablishmentBilling}>
              <EstablishmentSelector
                closeMenuOnSelect
                isOptionDisabled
                isRequired
                noMulti
                establishments={establishments}
                isLoading={establishmentLoading || loading}
                requiredValueIsMissing={requiredEstablishmentIsMissing}
                selectedEstablishments={[billing_establishment_id]}
                selectOption={handleSelectBillingEstablishment}
              />
            </div>
          </>
        )}
      </Paper>
      {!!finalizeInvoice &&
        !!invoice &&
        invoice.invoice_type !== INVOICE_TYPE_MIGRATION && (
          <div className={classes.buttonRow}>
            <ObjectLevelPermissionProviderComponent requiredPermission="export.allowed_actions.invoice">
              {(hasPermission) =>
                hasPermission && (
                  <Tooltip
                    aria-label="pdf-not-available"
                    title={
                      invoice.is_draft
                        ? `${t('actions.explainPdfDraft')}`
                        : undefined
                    }
                  >
                    <Button
                      color={invoice.is_draft ? undefined : 'primary'}
                      onClick={handleDownloadInvoice}
                      variant="contained"
                    >
                      <AttachFileIcon className={classes.iconLeft} />
                      {t('actions.download')}
                    </Button>
                  </Tooltip>
                )
              }
            </ObjectLevelPermissionProviderComponent>
            {!!invoice.payments?.length && (
              <Button
                color="secondary"
                onClick={handleGetReceiptUrlAPI}
                variant="contained"
              >
                <AttachFileIcon className={classes.iconLeft} />
                {t('actions.downloadReceipt')}
              </Button>
            )}
            {!!invoice.plannedinvoice && (
              <Button
                color="primary"
                onClick={handleGoToSubscription}
                variant="outlined"
              >
                {t('actions.goToSubscription')}
                <ArrowForwardIcon />
              </Button>
            )}
          </div>
        )}
    </div>
  );
};

const useStyles = makeStyles<
  Theme,
  Pick<Props, 'amountPaymentItem' | 'amountInvoiceItem'>
>((theme) => ({
  paperContainer: {
    minHeight: '20vh',
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  section: { marginBottom: theme.spacing(2) },
  divider: { marginBottom: theme.spacing(2) },
  sectionTitle: {
    paddingLeft: theme.spacing(3),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  isEmptyContainer: { marginLeft: theme.spacing(3) },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  buttonRow: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  sumUp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  sumUpInnerPayment: {
    borderRight: '2px solid black',
    borderBottom: '2px solid black',
    borderRadius: theme.spacing(0.5),
    '&>*': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sumUpInnerInvoiceItem: {
    borderRight: ({ amountPaymentItem, amountInvoiceItem }) =>
      `2px solid ${amountPaymentItem !== amountInvoiceItem ? 'red' : 'black'}`,
    borderBottom: ({ amountPaymentItem, amountInvoiceItem }) =>
      `2px solid ${amountPaymentItem !== amountInvoiceItem ? 'red' : 'black'}`,
    borderRadius: theme.spacing(0.5),
    '&>*': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  explainMigration: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: '#DEDEDE',
    borderRadius: 8,
    border: '1px solid gray',
  },
  footerSectionRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: theme.spacing(2),
    marginBottom: 0,
  },
  customFooterContainer: {
    padding: theme.spacing(2),
    border: '1px solid #DEDEDE',
    borderRadius: 8,
  },
  footerSectionColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    margin: theme.spacing(2),
    marginBottom: 0,
  },
  couponButton: {
    marginLeft: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionEstablishmentBilling: {
    padding: theme.spacing(2),
  },
}));

export default React.memo(InvoiceContent);
