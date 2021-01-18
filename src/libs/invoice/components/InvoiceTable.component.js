// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import Collapse from '@material-ui/core/Collapse';
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
import moment from 'moment-timezone';
import {
  INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER,
  INVOICE_TYPE_MIGRATION,
  INVOICE_TYPE_REVERSE,
} from '@bsport/common/lib/master-data/invoice-type';
import RedButton from '../../../components/button/RedButton.component';
import { getCurrencyDisplay } from '../../theme/selectors';

type Props = {
  compactMode: ?boolean,
  hideMemberName: string,
  setOpen: (?Invoice) => void,
  open: boolean,
  onInvoiceExpand: (string) => void,
  invoice: Invoice,
  onClickInvoice: (string, ?Invoice) => void,
  nestedDataLoading: boolean,
  onBill: (string) => void,
  finalizeInvoice: (string, OptionCallback) => void,
  showOpenInvoiceNested: boolean,
  asConsumer: boolean,
  showType?: boolean,
};

const InvoiceRow = React.memo((props: Props) => {
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
              size="small"
              onClick={(ev) => {
                ev.stopPropagation();
                if (props.open) {
                  props.setOpen(null);
                } else {
                  props.setOpen(invoice.uuid);
                  props.onInvoiceExpand(invoice.uuid);
                }
              }}
            >
              {props.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {!props.hideMemberName && (
          <TableCell component="th" scope="row">
            {invoice.memberName}
          </TableCell>
        )}
        <TableCell>
          {invoice.invoice_type === INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER
            ? ' - '
            : `${parseFloat(
                invoice.is_v2
                  ? parseInt(invoice.amount_due_cts, 10) / 100
                  : invoice.price_due,
              ).toFixed(2)}${getCurrencyDisplay()}`}
        </TableCell>
        <TableCell>
          <Typography color={amount_remaining_color}>
            {`${amount_remaining.toFixed(2)}${getCurrencyDisplay()}`}
          </Typography>
        </TableCell>
        {!props.compactMode && (
          <TableCell>{invoice.uuid.slice(0, 8)}</TableCell>
        )}
        {!!props.showType && (
          <TableCell>{t(`invoiceType.${invoiceType}`)}</TableCell>
        )}
        <TableCell>{moment(invoice.date).format('L')}</TableCell>
        {!!props.finalizeInvoice && (
          <TableCell>
            {processing ? (
              <CircularProgress />
            ) : (
              <IconButton
                onClick={(ev) => {
                  ev.stopPropagation();
                  setProcessing(true);
                  props.finalizeInvoice(invoice.uuid, {
                    onError: () => setProcessing(false),
                    onSuccess: (inv) => {
                      setProcessing(false);
                      window.location = inv.stripe_invoice_pdf;
                    },
                  });
                }}
              >
                {!invoice.is_v2 && !invoice.is_finalized ? (
                  <SaveIcon />
                ) : (
                  <AttachmentIcon />
                )}
              </IconButton>
            )}
          </TableCell>
        )}
      </TableRow>
      {!!props.onBill && (
        <TableRow>
          <TableCell>
            <RedButton onClick={() => props.onBill(invoice)} variant="outlined">
              <PaymentIcon className={classes.leftIcon} />
              {t(
                props.asConsumer
                  ? 'paymentPanel.actions.pay'
                  : 'paymentPanel.actions.bill',
              )}
            </RedButton>
          </TableCell>
          {!props.hideMemberName && <TableCell />}
          <TableCell>
            {!!props.showOpenInvoiceNested &&
              (props.asConsumer ? (
                <Button
                  variant="outlined"
                  onClick={() => props.onClickInvoice(invoice.uuid, invoice)}
                >
                  <ArrowForwardIcon className={classes.leftIcon} />
                  {t('paymentPanel.actions.showInvoice')}
                </Button>
              ) : (
                <Link
                  to={`/invoice/${invoice.uuid}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="outlined">
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
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            backgroundColor: '#FCFCFC',
          }}
          colSpan={6}
        >
          <Collapse
            in={props.open}
            timeout="auto"
            style={{ marginBottom: 16 }}
            unmountOnExit
          >
            <div>
              <Divider style={{ marginLeft: -8, marginRight: -8 }} />
              <Box margin={1}>
                <Typography variant="h6" component="div">
                  {t('table.nested.invoiceItem.title')}
                </Typography>
                <Table size="small" aria-label="purchases">
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
                                {`${parseFloat(invoiceItem.total_price).toFixed(
                                  2,
                                )} ${getCurrencyDisplay()}`}
                              </TableCell>
                              <TableCell>
                                {`${parseFloat(invoiceItem.voucher).toFixed(
                                  2,
                                )} ${getCurrencyDisplay()}`}
                              </TableCell>
                              <TableCell>
                                {`${parseFloat(
                                  invoiceItem.total_price_notax,
                                ).toFixed(2)} ${getCurrencyDisplay()}`}
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
                  style={{ marginTop: 20 }}
                  variant="h6"
                  component="div"
                >
                  {t('table.nested.payment.title')}
                </Typography>
                <Table size="small" aria-label="purchases">
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
                                  {`${parseFloat(payment.price).toFixed(
                                    2,
                                  )} ${getCurrencyDisplay()}`}
                                </TableCell>
                                <TableCell>
                                  {moment(payment.date).format('L')}
                                </TableCell>
                                <TableCell>
                                  {payment.payment_received === null && (
                                    <HourglassEmptyIcon size="small" />
                                  )}
                                  {payment.payment_received === false && (
                                    <ErrorIcon color="error" size="small" />
                                  )}
                                  {payment.payment_received === true && (
                                    <CheckIcon color="primary" size="small" />
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
                    style={{ marginTop: 16 }}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      props.onClickInvoice(invoice.uuid, invoice);
                    }}
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
  hidePagination: ?boolean,
  compactMode: ?boolean,
  invoiceList: Array<Invoice>,
  loading: boolean,
  hideMemberName: string,
  count: number,
  page: number,
  onChangePage: (number) => void,
  onInvoiceExpand: (string) => void,
  containerComponent: any,
  nestedDataLoading: boolean,
  onClickInvoice: (string, Invoice) => void,
  onBill: (string) => void,
  finalizeInvoice: (string) => void,
  showOpenInvoiceNested: ?boolean,
  asConsumer: ?boolean,
  showType?: boolean,
}) => {
  const { t } = useTranslation(['invoice']);

  const [open, setOpen] = React.useState();
  return (
    <TableContainer component={props.containerComponent}>
      <Table aria-label="collapsible table">
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
            {!!props.finalizeInvoice && (
              <TableCell>{t('table.header.pdf')}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {!props.loading &&
            props.invoiceList.map((invoice) => (
              <InvoiceRow
                showType={props.showType}
                nestedDataLoading={props.nestedDataLoading}
                hideMemberName={props.hideMemberName}
                finalizeInvoice={props.finalizeInvoice}
                asConsumer={!!props.asConsumer}
                showOpenInvoiceNested={!!props.showOpenInvoiceNested}
                onClickInvoice={props.onClickInvoice}
                onInvoiceExpand={props.onInvoiceExpand}
                key={invoice.uuid}
                compactMode={props.compactMode}
                invoice={invoice}
                open={invoice.uuid === open}
                setOpen={setOpen}
                onBill={props.onBill}
              />
            ))}
        </TableBody>
      </Table>
      {props.loading && <LinearProgress />}
      {!props.hidePagination && (
        <TablePagination
          rowsPerPageOptions={[50]}
          component="div"
          count={props.count || 0}
          rowsPerPage={50}
          page={(props.page || 1) - 1}
          onChangePage={(ev, page) => {
            props.onChangePage(page + 1);
          }}
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
