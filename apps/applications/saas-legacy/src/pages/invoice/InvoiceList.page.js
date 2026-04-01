// @flow

import React, { Component } from 'react';

import clsx from 'clsx';
import { push as routerPush } from 'connected-react-router';
import { connect } from 'react-redux';
import { withTranslation, TFunction } from 'react-i18next';
import { compose, withHandlers } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { getQuickbooksApp } from '#src/libs/quickbooks/selectors';
import { retrieveQuickbooksApp as retrieveQuickbooksAppAction } from '#src/libs/quickbooks/actions';
import type { QuickbooksApp } from '#src/libs/quickbooks/types';
import Tooltip from '../../components/Tooltip.component';
import {
  getInvoiceList,
  withInvoiceItem,
  withPayment,
} from '../../libs/invoice/selectors';
import {
  finalizeInvoice as finalizeInvoiceAction,
  fetchInvoiceList,
  fetchInvoiceItemList,
  fetchPaymentList,
  sendInvoiceToQuickbooks,
  fetchSpecificInvoice,
  generateInvoiceXml as generateInvoiceXmlAction,
  exportXmlBulk as exportXmlBulkAction,
  downloadInvoiceBulkExport as downloadInvoiceBulkExportAction,
} from '#src/libs/invoice/actions';

import type { Invoice } from '../../libs/invoice/types';
import withTitle from '../../hocs/with-title.hoc';

import InvoiceTable from '../../libs/invoice/components/InvoiceTable.component';
import themeSelectors from '../../libs/theme/selectors';
import {
  getInvoiceXmlBulkLoading,
  getDownloadInvoiceBulkExportLoading,
} from '#src/libs/invoice/selectors';
import type { Theme as CompanyTheme } from '#src/libs/theme/types';
import type {
  OptionCallback,
  OptionBackgroundCallback,
} from '#src/state/types';
import { openNewBackOfficeWindow } from '#src/utils/windows';
import InvoiceBulkExportSection from '#src/libs/invoice/components/InvoiceBulkExportSection.component';
import InvoiceBulkExportModal from '#src/libs/invoice/components/InvoiceBulkExportModal.component';
import {
  INVOICE_BULK_EXPORT_STATUS_COMPLETED,
  INVOICE_BULK_EXPORT_STATUS_COMPLETED_NO_INVOICE,
} from '#src/libs/invoice/constants';

type Props = {
  classes: Object,
  companyTheme: CompanyTheme,
  count: number,
  fetchInvoiceItemList: (params: any) => void,
  fetchInvoiceList: (params: any, options: OptionCallback) => void,
  fetchPaymentList: (params: any) => void,
  finalizeInvoice: (uuid: string) => void,
  generateInvoiceXml: (uuid: string, options: OptionCallback) => void,
  exportXmlBulk: (
    options?: OptionBackgroundCallback<string> & {
      backgroundDialog?: {
        message: string,
        title: string,
      },
    },
  ) => void,
  invoiceList: Array<Invoice>,
  loading: boolean,
  nestedDataLoading: boolean,
  page: number,
  push: (path: string) => void,
  quickbooksApp: QuickbooksApp,
  quickbooksAppLoading: boolean,
  isGenerateXmlBulkLoading: boolean,
  isDownloadInvoiceBulkExportLoading: boolean,
  quickbooksLoading: boolean,
  retrieveQuickbooksApp: (companyId: number, options?: OptionCallback) => void,
  sendInvoiceToQuickbooks: (uuid: string) => void,
  downloadInvoiceBulkExport: (
    params: { month: number, year: number },
    options?: OptionCallback,
  ) => void,
  t: TFunction,
};
type State = {
  isBulkExportModalOpen: boolean,
  proposeRefreshQBA: boolean,
};
export class InvoiceList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isBulkExportModalOpen: false,
      proposeRefreshQBA: false,
    };
  }

  pushToInvoiceDetail = (uuid: string) => {
    this.props.push(`/invoice/${uuid}`);
  };

  fetchInvoiceDataNested = (uuid: string) => {
    this.props.fetchPaymentList({ invoice__uuid: uuid, page_size: 100 });
    this.props.fetchInvoiceItemList({ invoice__uuid: uuid, page_size: 100 });
  };

  onChangePage = (page: number) => {
    this.props.fetchInvoiceList({ page_size: 50, page });
  };

  componentDidMount() {
    this.onChangePage(1);
    this.props.retrieveQuickbooksApp(this.props.companyTheme.company);
  }

  onRedirectToQuickBooksSettings = () => {
    const url = '/settings/quickbooks';
    openNewBackOfficeWindow(url);
    this.setState({ proposeRefreshQBA: true });
  };

  refreshQuickbooksApp = () => {
    this.props.retrieveQuickbooksApp(this.props.companyTheme.company, {
      onSuccess: () => this.setState({ proposeRefreshQBA: false }),
      onError: () => this.setState({ proposeRefreshQBA: false }),
    });
  };

  handleDownloadXmlBulk = () => {
    const backgroundDialog = {
      message: this.props.t('invoice:actions.downloadXmlBulkState.ready'),
      title: this.props.t('invoice:actions.downloadXmlBulkState.title'),
    };

    this.props.exportXmlBulk({ backgroundDialog });
  };

  handleOpenBulkExportModal = () =>
    this.setState({ isBulkExportModalOpen: true });

  handleCloseBulkExportModal = () =>
    this.setState({ isBulkExportModalOpen: false });

  handleConfirmBulkExport = (params) => {
    this.props.downloadInvoiceBulkExport(params, {
      onSuccess: (payload) => {
        if (
          payload?.export_status === INVOICE_BULK_EXPORT_STATUS_COMPLETED ||
          payload?.export_status ===
            INVOICE_BULK_EXPORT_STATUS_COMPLETED_NO_INVOICE
        ) {
          this.handleCloseBulkExportModal();
        }
      },
    });
  };

  render() {
    const { t } = this.props;
    if (!this.props.invoiceList) {
      return <LinearProgress />;
    }
    const quickbooksIntegrated =
      this.props.companyTheme.is_quickbook_integration_allowed &&
      this.props.companyTheme.is_quickbook_integration_enabled;

    const quickbooksUnCompletedSetup =
      quickbooksIntegrated &&
      this.props.quickbooksApp &&
      this.props.quickbooksApp.multi_currency_support &&
      !this.props.quickbooksApp.metadata?.tax_code?.value;

    return (
      <div className={this.props.classes.container}>
        {quickbooksUnCompletedSetup && (
          <div className={this.props.classes.paddingBottom}>
            <Alert
              action={
                this.state.proposeRefreshQBA ? (
                  <Tooltip title={t('settings:quickbooks.tax.refresh')}>
                    <IconButton
                      disabled={this.props.quickbooksAppLoading}
                      onClick={this.refreshQuickbooksApp}
                    >
                      <RefreshIcon
                        className={clsx({
                          [this.props.classes.rotateIcon]:
                            this.props.quickbooksAppLoading,
                        })}
                        color={
                          this.props.quickbooksAppLoading
                            ? 'disabled'
                            : 'primary'
                        }
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip
                    title={t('settings:quickbooks.tax.goToSettingsPage')}
                  >
                    <IconButton onClick={this.onRedirectToQuickBooksSettings}>
                      <OpenInNewIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                )
              }
              className={this.props.classes.alert}
              severity="warning"
              variant="outlined"
            >
              {t('settings:quickbooks.tax.alertUnconfigured')}
            </Alert>
          </div>
        )}
        <div className={this.props.classes.exportActions}>
          {this.props.companyTheme.invoice_exporter_id && (
            <InvoiceBulkExportSection
              handleDownloadXmlBulk={this.handleDownloadXmlBulk}
              isGenerateXmlBulkLoading={this.props.isGenerateXmlBulkLoading}
              t={t}
            />
          )}
          <Button
            color="primary"
            onClick={this.handleOpenBulkExportModal}
            variant="outlined"
          >
            {t('invoice:actions.bulkExport.modalTitle')}
          </Button>
        </div>
        <InvoiceBulkExportModal
          loading={this.props.isDownloadInvoiceBulkExportLoading}
          onClose={this.handleCloseBulkExportModal}
          onConfirm={this.handleConfirmBulkExport}
          open={this.state.isBulkExportModalOpen}
          timezone={this.props.companyTheme?.timezone_name}
        />
        <InvoiceTable
          showType
          containerComponent={Paper}
          count={this.props.count}
          finalizeInvoice={this.props.finalizeInvoice}
          generateInvoiceXml={
            this.props.companyTheme?.invoice_exporter_id &&
            this.props.generateInvoiceXml
          }
          invoiceList={this.props.invoiceList}
          loading={this.props.loading}
          nestedDataLoading={this.props.nestedDataLoading}
          onChangePage={this.onChangePage}
          onClickInvoice={this.pushToInvoiceDetail}
          onInvoiceExpand={this.fetchInvoiceDataNested}
          page={this.props.page}
          quickbooksIntegrated={quickbooksIntegrated}
          quickbooksLoading={this.props.quickbooksLoading}
          sendInvoiceToQuickbooks={(uuid: string) =>
            this.props.sendInvoiceToQuickbooks(uuid)
          }
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    maxWidth: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: theme.spacing(2),
  },
  alert: {
    alignItems: 'center',
  },
  paddingBottom: {
    paddingBottom: theme.spacing(2),
  },
  exportActions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  '@keyframes RotationEffect': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '50%': {
      transform: 'rotate(180)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
  rotateIcon: {
    animation: '$RotationEffect 0.75s infinite',
  },
});

export default compose(
  withTranslation(),
  withStyles(styles),
  connect(
    (state) => ({
      invoiceList: withInvoiceItem(withPayment(getInvoiceList))(state),
      count: state.invoice.list.count,
      page: state.invoice.list.page,
      loading: state.invoice.list.loading,
      quickbooksLoading: state.invoice.quickbooks.loading,
      nestedDataLoading:
        state.invoice.invoiceItem.loading || state.invoice.payment.loading,
      companyTheme: themeSelectors.getTheme(state),
      quickbooksApp: getQuickbooksApp(state),
      quickbooksAppLoading: state.quickbooks.loading,
      isGenerateXmlBulkLoading: getInvoiceXmlBulkLoading(state),
      isDownloadInvoiceBulkExportLoading:
        getDownloadInvoiceBulkExportLoading(state),
    }),
    {
      push: routerPush,
      finalizeInvoice: finalizeInvoiceAction,
      fetchInvoiceList,
      fetchInvoiceItemList,
      fetchPaymentList,
      sendInvoiceToQuickbooksAction: sendInvoiceToQuickbooks,
      fetchSpecificInvoiceAction: fetchSpecificInvoice,
      retrieveQuickbooksApp: retrieveQuickbooksAppAction,
      generateInvoiceXml: generateInvoiceXmlAction,
      exportXmlBulk: exportXmlBulkAction,
      downloadInvoiceBulkExport: downloadInvoiceBulkExportAction,
    },
  ),
  withHandlers({
    finalizeInvoice:
      ({ finalizeInvoice }) =>
      (uuid, options) =>
        finalizeInvoice(uuid, {
          onError: (err) => {
            if (options && options.onError) options.onError(err);
          },
          onSuccess: (invoice) => {
            window.open(invoice.stripe_invoice_pdf);
            if (options && options.onSuccess) options.onSuccess();
          },
        }),
  }),
  withHandlers({
    sendInvoiceToQuickbooks:
      ({ sendInvoiceToQuickbooksAction, fetchSpecificInvoiceAction }) =>
      (uuid) => {
        sendInvoiceToQuickbooksAction(uuid, {
          onSuccess: () => fetchSpecificInvoiceAction(uuid),
        });
      },
  }),
  withTitle(({ t }: { t: TFunction }) => t('titles:invoice.invoiceList')),
)(InvoiceList);
