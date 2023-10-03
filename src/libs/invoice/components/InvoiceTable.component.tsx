// @ts-nocheck
// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import Collapse from '@material-ui/core/Collapse';
import WarningIcon from '@material-ui/icons/Warning';
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Divider from '@material-ui/core/Divider';
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AttachmentIcon from '@material-ui/icons/Attachment';
import PaymentIcon from '@material-ui/icons/Payment';
import SaveIcon from '@material-ui/icons/Save';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Chip from '@material-ui/core/Chip';
import ToolTip from '@material-ui/core/Tooltip';
import moment from 'moment-timezone';
import {
  INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER,
  INVOICE_TYPE_MIGRATION,
  INVOICE_TYPE_REVERSE,
} from '@bsport/common/lib/master-data/invoice-type';
import SendIcon from '@material-ui/icons/Send';
import Avatar from '@material-ui/core/Avatar';
import { DISPUTE as PAYMENT_METHOD_DISPUTE } from '@bsport/common/lib/master-data/payment-methods';
import uniqBy from 'lodash/uniqBy';
import RedButton from '../../../components/button/RedButton.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { getPaymentLink } from '../../consumer-space/utils';
import {
  QUICKBOOKS_INVOICE_STATUS_CANNOT_BE_SENT,
  QUICKBOOKS_INVOICE_STATUS_ALREADY_SENT,
  QUICKBOOKS_INVOICE_STATUS_CAN_BE_SENT,
} from '../../quickbooks/utils';
import type { ConsumerGiftcard, Giftcard } from '#libs/giftcard/types';
import UseConsumerGiftcardForm from '#libs/payment/components/UseConsumerGiftcardForm.component';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import type { OptionCallback } from '../../../state/types';
import type { Invoice } from '#libs/invoice/types';
import type { Member } from '#libs/member/types';
import { getReceiptUrl as getReceiptUrlAPI } from '../api';

type Props = {
  compactMode?: boolean;
  hideMemberName: boolean;
  setOpen: (uuid?: string) => void;
  open: boolean;
  onInvoiceExpand: (uuid: string) => void;
  invoice: Invoice<Member> & { memberArchived?: boolean };
  onClickInvoice: (uuid: string) => void;
  nestedDataLoading: boolean;
  onBill: (uuid: string) => void;
  finalizeInvoice: (uuid: string, callback: OptionCallback<Invoice>) => void;
  showOpenInvoiceNested: boolean;
  asConsumer: boolean;
  showType?: boolean;
  companyId?: number;
  snackbarSuccess: (msg: string) => void;
  quickbooksIntegrated: boolean;
  sendInvoiceToQuickbooks: (uuid: string) => void;
  quickbooksLoading: boolean;
  consumerGiftcardList: Array<ConsumerGiftcard<Giftcard, Member, Member>>;
  hidePaymentLink?: boolean;
  applyGiftcardOnInvoice: (
    invoiceUuid: string,
    consumergiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) => void;
  getInvoicePaymentGroupIsProcessing?: (invoiceUuid: string) => boolean;
};

const quickbooksLogo = require('./QB_logo.png');

const InvoiceRow: React.FC<Props> = React.memo((props) => {
  const { invoice } = props;
  const { t } = useTranslation(['invoice', 'payment']);
  const amount_remaining = parseFloat(
    parseInt(invoice.amount_due_cts, 10) / 100 -
      parseInt(invoice.amount_paid_cts, 10) / 100,
  );
  let amount_remaining_color;
  if (amount_remaining < 0) {
    amount_remaining_color = 'error';
  }

  const [processing, setProcessing] = React.useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] =
    React.useState<boolean>(false);
  const classes = useStyles();
  let invoiceType = 'regular';
  if (invoice.reverse_invoices && invoice.reverse_invoices.length) {
    invoiceType = 'reversed';
  } else if (invoice.invoice_type === INVOICE_TYPE_MIGRATION) {
    invoiceType = 'migration';
  } else if (invoice.invoice_type === INVOICE_TYPE_REVERSE) {
    invoiceType = 'return';
  } else if (invoice.invoice_type === INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER) {
    invoiceType = 'credit_payment';
    if (amount_remaining < 0) {
      amount_remaining_color = 'primary';
    }
  }

  const isPaymentGroupBeingProcessed =
    (props.getInvoicePaymentGroupIsProcessing &&
      props.getInvoicePaymentGroupIsProcessing(invoice.uuid)) ??
    false;

  const renderQuickbooksRow = () => {
    if (
      invoice.quickbooks_status === QUICKBOOKS_INVOICE_STATUS_CANNOT_BE_SENT
    ) {
      return null;
    }
    if (invoice.quickbooks_status === QUICKBOOKS_INVOICE_STATUS_ALREADY_SENT) {
      return (
        <Chip
          avatar={
            <Avatar noname alt="QB LOGO" src={quickbooksLogo} variant="small" />
          }
          label={t('quickbooks.invoice.onQuickbooks')}
          size="small"
          style={{ color: '#53B700' }}
          variant="outlined"
        />
      );
    }
    if (
      invoice.quickbooks_status === QUICKBOOKS_INVOICE_STATUS_CAN_BE_SENT &&
      props.sendInvoiceToQuickbooks
    ) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ToolTip title={t('quickbooks.invoice.sendToQuickbooks')}>
            <IconButton
              aria-label="send-to-quickbooks"
              disabled={props.quickbooksLoading}
              onClick={(ev) => {
                ev.stopPropagation();
                props.sendInvoiceToQuickbooks(invoice.uuid);
              }}
              size="small"
              style={{ fill: '#53B700' }}
            >
              <SendIcon style={{ fill: '#53B700' }} />
            </IconButton>
          </ToolTip>
        </div>
      );
    }
    return null;
  };
  const relatedconsumerGiftcardList =
    props.consumerGiftcardList?.filter(
      (cgc) => cgc?.dst_member?.id === (invoice?.member?.id || invoice.member),
    ) || [];
  return (
    <React.Fragment>
      <TableRow
        hover={!!props.onClickInvoice}
        onClick={
          props.onClickInvoice
            ? (ev) => {
                ev.stopPropagation();
                props.onClickInvoice(invoice.uuid);
              }
            : null
        }
      >
        {!props.compactMode && (
          <TableCell>
            <IconButton
              aria-label="expand row"
              onClick={(ev) => {
                ev.stopPropagation();
                if (props.open) {
                  props.setOpen(null);
                } else {
                  props.setOpen(invoice.uuid);
                  props.onInvoiceExpand(invoice.uuid);
                }
              }}
              size="small"
            >
              {props.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {!props.hideMemberName && (
          <TableCell component="th" scope="row">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography>
                {invoice.is_member_pos
                  ? t('invoice:anonymousMember')
                  : invoice.memberName}
              </Typography>
              {invoice.memberArchived && (
                <Typography color="secondary" variant="caption">
                  {`${' '}(${t('member:archived')})`}
                </Typography>
              )}
            </div>
          </TableCell>
        )}
        <TableCell>
          {invoice.invoice_type === INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER
            ? ' - '
            : getCurrencyDisplayWithPrice(
                parseFloat(
                  invoice.is_v2
                    ? parseInt(invoice.amount_due_cts, 10) / 100
                    : invoice.price_due,
                ).toFixed(2),
              )}
        </TableCell>
        <TableCell>
          <Typography color={amount_remaining_color}>
            {getCurrencyDisplayWithPrice(amount_remaining.toFixed(2))}
          </Typography>
        </TableCell>
        {!props.compactMode && (
          <TableCell>{invoice.uuid.slice(0, 8)}</TableCell>
        )}
        {!!props.showType && (
          <TableCell>{t(`invoiceType.${invoiceType}`)}</TableCell>
        )}
        <TableCell>{moment(invoice.date).format('L')}</TableCell>
        <ObjectLevelPermissionProvider requiredPermission="export.allowed_actions.invoice">
          {(hasPermission) =>
            !!props.finalizeInvoice &&
            invoice.invoice_type !== INVOICE_TYPE_MIGRATION &&
            hasPermission && (
              <TableCell>
                {processing ? (
                  <CircularProgress />
                ) : (
                  <>
                    <Menu
                      keepMounted
                      anchorEl={downloadMenuOpen}
                      id="simple-menu"
                      onClick={(e) => e.stopPropagation()}
                      onClose={() => setDownloadMenuOpen(null)}
                      open={Boolean(downloadMenuOpen)}
                    >
                      <MenuItem
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setProcessing(true);
                          props.finalizeInvoice(invoice.uuid, {
                            onError: () => setProcessing(false),
                            onSuccess: (inv: Invoice) => {
                              setDownloadMenuOpen(null);
                              window.open(inv.stripe_invoice_pdf, '_blank');
                              setProcessing(false);
                            },
                          });
                        }}
                      >
                        {t('actions.download')}
                      </MenuItem>
                      <MenuItem
                        disabled={!invoice.is_v2 || !invoice.payments.length}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setProcessing(true);
                          getReceiptUrlAPI(invoice.uuid)
                            .then((r) => {
                              setDownloadMenuOpen(null);
                              window.open(r.data, '_blank');
                              setProcessing(false);
                            })
                            .catch((err) => {
                              console.error(err);
                              setProcessing(false);
                            });
                        }}
                      >
                        {t('actions.downloadReceipt')}
                      </MenuItem>
                    </Menu>
                    <IconButton
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setDownloadMenuOpen(ev.currentTarget);
                      }}
                    >
                      {!invoice.is_v2 && !invoice.is_finalized ? (
                        <SaveIcon />
                      ) : (
                        <AttachmentIcon />
                      )}
                    </IconButton>
                  </>
                )}
              </TableCell>
            )
          }
        </ObjectLevelPermissionProvider>
        {props.quickbooksIntegrated && (
          <TableCell>
            {processing && !invoice.can_be_sent_to_quickbooks ? (
              <CircularProgress />
            ) : (
              <div style={{ maxWidth: '100px' }}>{renderQuickbooksRow()}</div>
            )}
          </TableCell>
        )}
      </TableRow>
      {!!props.onBill && (
        <TableRow>
          {!props.asConsumer && !props.hidePaymentLink && (
            <TableCell>
              <CopyToClipboard
                text={getPaymentLink(props.companyId, invoice.uuid)}
              >
                <RedButton
                  disabled={isPaymentGroupBeingProcessed}
                  onClick={() => props.snackbarSuccess('link.copied')}
                  variant="outlined"
                >
                  <FileCopyIcon className={classes.leftIcon} />
                  {t('paymentPanel.actions.paymentLink')}
                </RedButton>
              </CopyToClipboard>
            </TableCell>
          )}
          <TableCell>
            <RedButton
              disabled={isPaymentGroupBeingProcessed}
              onClick={() => props.onBill(invoice)}
              variant="outlined"
            >
              <PaymentIcon className={classes.leftIcon} />
              {t(
                props.asConsumer
                  ? 'paymentPanel.actions.pay'
                  : 'paymentPanel.actions.bill',
              )}
            </RedButton>
          </TableCell>
          {relatedconsumerGiftcardList &&
            relatedconsumerGiftcardList.length !== 0 &&
            props.applyGiftcardOnInvoice && (
              <TableCell>
                <UseConsumerGiftcardForm
                  outlinedIconVariant
                  applyGiftcardOnInvoice={props.applyGiftcardOnInvoice}
                  consumerGiftcardList={relatedconsumerGiftcardList}
                  invoice={invoice}
                />
              </TableCell>
            )}
          <TableCell>
            {!!props.showOpenInvoiceNested &&
              (props.asConsumer ? (
                <Button
                  disabled={isPaymentGroupBeingProcessed}
                  onClick={() => props.onClickInvoice(invoice.uuid, invoice)}
                  variant="outlined"
                >
                  <ArrowForwardIcon className={classes.leftIcon} />
                  {t('paymentPanel.actions.showInvoice')}
                </Button>
              ) : (
                <Link
                  style={{ textDecoration: 'none' }}
                  to={`/invoice/${invoice.uuid}`}
                >
                  <Button
                    disabled={isPaymentGroupBeingProcessed}
                    variant="outlined"
                  >
                    <ArrowForwardIcon className={classes.leftIcon} />
                    {t('paymentPanel.actions.showInvoice')}
                  </Button>
                </Link>
              ))}
          </TableCell>
          <TableCell />
        </TableRow>
      )}
      <TableRow>
        <TableCell
          colSpan={6}
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            backgroundColor: '#FCFCFC',
          }}
        >
          <Collapse
            unmountOnExit
            in={props.open}
            style={{ marginBottom: 16 }}
            timeout="auto"
          >
            <div>
              <Divider style={{ marginLeft: -8, marginRight: -8 }} />
              <Box margin={1}>
                <Typography component="div" variant="h6">
                  {t('table.nested.invoiceItem.title')}
                </Typography>
                <Table aria-label="purchases" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {t('table.nested.invoiceItem.header.product')}
                      </TableCell>
                      <TableCell>
                        {t('table.nested.invoiceItem.header.price')}
                      </TableCell>
                      <TableCell>
                        {t('table.nested.invoiceItem.header.voucher')}
                      </TableCell>
                      <TableCell>
                        {t('table.nested.invoiceItem.header.priceExcTax')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody style={{ backgroundColor: '#f8F8F8' }}>
                    {
                      // eslint-disable-next-line
                      invoice.invoice_items
                        .filter((ii) => !!ii)
                        .map((invoiceItem) => {
                          return (
                            <TableRow key={invoiceItem.id}>
                              <TableCell component="th" scope="row">
                                {invoiceItem.name}
                              </TableCell>
                              <TableCell>
                                {getCurrencyDisplayWithPrice(
                                  parseFloat(invoiceItem.total_price).toFixed(
                                    2,
                                  ),
                                )}
                              </TableCell>
                              <TableCell>
                                {getCurrencyDisplayWithPrice(
                                  parseFloat(invoiceItem.voucher).toFixed(2),
                                )}
                              </TableCell>
                              <TableCell>
                                {getCurrencyDisplayWithPrice(
                                  parseFloat(
                                    invoiceItem.total_price_notax,
                                  ).toFixed(2),
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                    }
                    {!!invoice.invoice_items.length === 0 && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {t('table.nested.invoiceItem.isEmpty')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {!!props.nestedDataLoading && <LinearProgress />}
              </Box>
              <Box margin={1}>
                <Typography
                  component="div"
                  style={{ marginTop: 20 }}
                  variant="h6"
                >
                  {t('table.nested.payment.title')}
                </Typography>
                <Table aria-label="purchases" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {t('table.nested.payment.header.paymentMethod')}
                      </TableCell>
                      <TableCell>
                        {t('table.nested.payment.header.price')}
                      </TableCell>
                      <TableCell>
                        {t('table.nested.payment.header.date')}
                      </TableCell>
                      <TableCell>
                        {t('table.nested.payment.header.paymentReceived')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody style={{ backgroundColor: '#f8F8F8' }}>
                    {invoice.payments.length === 0 && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {t('table.nested.payment.isEmpty')}
                        </TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </TableRow>
                    )}
                    {
                      // eslint-disable-next-line
                      invoice.payments
                        .filter((p) => !!p)
                        .map(
                          (payment) =>
                            !!payment && (
                              <TableRow key={payment.id}>
                                <TableCell component="th" scope="row">
                                  {t(
                                    `payment:paymentMethod.${payment.payment_method}`,
                                  )}
                                </TableCell>
                                <TableCell>
                                  {getCurrencyDisplayWithPrice(
                                    parseFloat(payment.price).toFixed(2),
                                  )}
                                </TableCell>
                                <TableCell>
                                  {moment(payment.date).format('L')}
                                </TableCell>
                                <TableCell>
                                  {payment.payment_received === null && (
                                    <HourglassEmptyIcon size="small" />
                                  )}
                                  {!payment.payment_received &&
                                    payment.payment_received !== null && (
                                      <ErrorIcon color="error" size="small" />
                                    )}
                                  {payment.payment_received &&
                                    !payment.payment_method ===
                                      PAYMENT_METHOD_DISPUTE.id && (
                                      <CheckIcon color="primary" size="small" />
                                    )}
                                  {payment.payment_received &&
                                    payment.payment_method ===
                                      PAYMENT_METHOD_DISPUTE.id && (
                                      <WarningIcon color="error" size="small" />
                                    )}
                                </TableCell>
                              </TableRow>
                            ),
                        )
                    }
                  </TableBody>
                </Table>
                {!!props.nestedDataLoading && <LinearProgress />}
              </Box>
              {!!props.onClickInvoice && (
                <Box margin={1}>
                  <Button
                    color="primary"
                    onClick={() => {
                      props.onClickInvoice(invoice.uuid, invoice);
                    }}
                    style={{ marginTop: 16 }}
                    variant="outlined"
                  >
                    {t('table.actions.goToInvoice')}
                  </Button>
                </Box>
              )}
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
});

export const InvoiceTable = (props: {
  hidePagination?: boolean;
  compactMode?: boolean;
  invoiceList: Array<Invoice>;
  loading: boolean;
  hideMemberName: boolean;
  count: number;
  page: number;
  onChangePage: (page: number) => void;
  onInvoiceExpand: (uuid: string) => void;
  containerComponent: any;
  nestedDataLoading?: boolean;
  onClickInvoice: (uuid: string, invoice: Invoice) => void;
  onBill?: (uuid: string) => void;
  finalizeInvoice: (uuid: string, options: OptionCallback<Invoice>) => void;
  showOpenInvoiceNested?: boolean;
  asConsumer?: boolean;
  showType?: boolean;
  companyId?: number;
  snackbarSuccess?: (msg: string) => void;
  quickbooksIntegrated?: boolean;
  sendInvoiceToQuickbooks?: (uuid: string) => void;
  quickbooksLoading?: boolean;
  consumerGiftcardList?: Array<ConsumerGiftcard<Giftcard>>;
  applyGiftcardOnInvoice?: (
    invoiceUuid: string,
    consumergiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) => void;
  getInvoicePaymentGroupIsProcessing?: (invoiceUuid: string) => boolean;
}) => {
  const { t } = useTranslation(['invoice']);

  const [open, setOpen] = React.useState<string | null>(null);
  return (
    <TableContainer component={props.containerComponent}>
      <Table aria-label="collapsible table">
        <ObjectLevelPermissionProvider
          requiredPermission={[
            'export.allowed_actions.invoice',
            'billing.allowed_actions.readPaymentLink',
          ]}
        >
          {([
            hasExportInvoicePermission,
            hasPaymentLinkPermission,
          ]: boolean[]) => (
            <>
              <TableHead>
                <TableRow>
                  {!props.compactMode && <TableCell />}
                  {!props.hideMemberName && (
                    <TableCell>{t('table.header.member')}</TableCell>
                  )}
                  <TableCell>{t('table.header.amount')}</TableCell>
                  <TableCell>{t('table.header.missing')}</TableCell>
                  {!props.compactMode && (
                    <TableCell>{t('table.header.id')}</TableCell>
                  )}
                  {!!props.showType && (
                    <TableCell>{t('table.header.invoiceType')}</TableCell>
                  )}
                  <TableCell>{t('table.header.date')}</TableCell>
                  {!!props.finalizeInvoice && hasExportInvoicePermission && (
                    <TableCell>{t('table.header.pdf')}</TableCell>
                  )}
                  {props.quickbooksIntegrated && (
                    <TableCell>{t('table.header.quickbooks')}</TableCell>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {!props.loading &&
                  uniqBy(props.invoiceList, 'uuid').map(
                    (invoice: Invoice & { memberArchived?: boolean }) => (
                      <InvoiceRow
                        key={invoice.uuid}
                        applyGiftcardOnInvoice={props.applyGiftcardOnInvoice}
                        asConsumer={!!props.asConsumer}
                        compactMode={props.compactMode}
                        companyId={props.companyId}
                        consumerGiftcardList={props.consumerGiftcardList}
                        finalizeInvoice={props.finalizeInvoice}
                        hideMemberName={props.hideMemberName}
                        hidePaymentLink={!hasPaymentLinkPermission}
                        invoice={invoice}
                        nestedDataLoading={props.nestedDataLoading}
                        onBill={props.onBill}
                        onClickInvoice={props.onClickInvoice}
                        onInvoiceExpand={props.onInvoiceExpand}
                        open={invoice.uuid === open}
                        quickbooksIntegrated={props.quickbooksIntegrated}
                        quickbooksLoading={props.quickbooksLoading}
                        sendInvoiceToQuickbooks={props.sendInvoiceToQuickbooks}
                        setOpen={setOpen}
                        showOpenInvoiceNested={!!props.showOpenInvoiceNested}
                        showType={props.showType}
                        snackbarSuccess={props.snackbarSuccess}
                      />
                    ),
                  )}
              </TableBody>
            </>
          )}
        </ObjectLevelPermissionProvider>
      </Table>
      {props.loading && <LinearProgress />}
      {!props.hidePagination && (
        <TablePagination
          component="div"
          count={props.count || 0}
          onChangePage={(ev, page) => {
            props.onChangePage(page + 1);
          }}
          page={(props.page || 1) - 1}
          rowsPerPage={50}
          rowsPerPageOptions={[50]}
        />
      )}
    </TableContainer>
  );
};

const useStyles = makeStyles((theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default React.memo(InvoiceTable);
