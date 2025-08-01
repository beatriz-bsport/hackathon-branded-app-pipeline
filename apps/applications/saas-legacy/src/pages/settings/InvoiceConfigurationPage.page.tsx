import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import { connect } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';

import type { OptionCallback } from '#src/state/types';
import type { MaterialStyleType, WithHandlerType } from '#src/utils/types';
import type { EstablishmentBillingGroup as EstablishmentBillingGroupType } from '#src/libs/establishment/types';
import type { InvoiceConfigurationSerializer } from '#src/libs/invoice/types';
import { RootState } from '#src/reducers/index';

import InfoTypography from '#src/components/typo/InfoTypography.components';
import BookkeepingAccountSection from '#src/libs/invoice/components/BookkeepingAccountSection.component';
import BackofficeLinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
// @ts-expect-error
import InvoiceConfigurationForm from '../../libs/invoice/components/InvoiceConfigurationForm.component';
import EstablishmentBillingGroupTable from '#src/libs/establishment/components/EstablishmentBillingGroupTable.component';
import EstablishmentBillingGroupFormDialog from '#src/libs/establishment/components/EstablishmentBillingGroupFormDialog.component';

import {
  deleteBookkeepingAccount as deleteBookkeepingAccountAction,
  fetchBookkeepingAccountList as fetchBookkeepingAccountListAction,
  updateBookkeepingAccount as updateBookkeepingAccountAction,
  createBookkeepingAccount as createBookkeepingAccountAction,
  fetchLinkedProductNames as fetchLinkedProductNamesAction,
} from '#src/libs/payment/actions';
import {
  fetchStripeReaders,
  createStripeReader,
  deleteStripeReader,
  editStripeReader,
} from '#src/libs/terminal/actions';
import {
  fetchInvoiceConfiguration,
  patchInvoiceConfiguration as patchInvoiceConfigurationAction,
} from '#src/libs/invoice/actions';
import {
  snackbarSuccess as snackbarSuccessAction,
  snackbarError as snackbarErrorAction,
} from '#src/libs/snackbar/actions';
import {
  fetchEstablishments,
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
  upsertEstablishmentBillingGroup as upsertEstablishmentBillingGroupAction,
  deleteEstablishmentBillingGroup as deleteEstablishmentBillingGroupAction,
} from '#src/libs/establishment/actions';
import { updateCompanyTheme } from '#src/libs/theme/actions';

import { getStripeReaders } from '#src/libs/terminal/selectors';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountLoading,
  getLinkedProductNames,
} from '#src/libs/payment/selectors';
import themeSelectors from '#src/libs/theme/selectors';
import {
  getEnabledEstablishmentBillingGroups,
  withEstablishment,
  getAvailableEstablishmentList,
} from '#src/libs/establishment/selectors';

import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#src/libs/payment/constants';
import withTitle from '#src/hocs/with-title.hoc';

type StateHandlerInit = {
  openDialogForm: boolean;
  openConnectReaderDialog: boolean;
  openDeleteReaderDialog: boolean;
  initialBillingGroup: EstablishmentBillingGroupType | null;
  submitting: boolean;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnProps = {};
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type OwnAndConnectedProps = OwnProps & ConnectedProps & StateHandlerType;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
type State = {};
export class InvoiceConfigurationPage extends React.Component<Props, State> {
  componentDidMount() {
    this.props.fetchInvoiceConfiguration();
    if (this.props.theme.enable_multi_localization) {
      this.props.fetchAllEstablishmentBillingGroup({
        params: { company: this.props.theme.company, disabled: false },
      });
    }
    this.props.fetchEstablishments();
    this.props.fetchStripeReaders();
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      this.props.fetchBookkeepingAccountList();
  }

  render() {
    const { configuration, loading, processing, classes, t } = this.props;
    if (loading || !configuration) {
      return <BackofficeLinearProgress />;
    }
    return (
      <>
        <div className={classes.container}>
          <InvoiceConfigurationForm
            configuration={configuration}
            createReaderAndFetch={this.props.createReaderAndFetch}
            deleteReaderAndFetch={this.props.deleteReaderAndFetch}
            editReaderAndFetch={this.props.editReaderAndFetch}
            goToReports={this.props.goToReports}
            patchInvoiceConfiguration={this.props.patchInvoiceConfiguration}
            patchTheme={this.props.patchTheme}
            processing={processing}
            setOpenConnectReaderDialog={this.props.setOpenConnectReaderDialog}
            stripeReaders={this.props.stripeReaders || []}
            submitTheme={this.props.submitTheme}
            theme={this.props.theme}
          />
          {this.props.theme.enable_multi_localization && (
            <>
              <Paper className={classes.paper}>
                <Typography component="h3" variant="h6">
                  {t('billing_group.header')}
                </Typography>
                <div className={classes.textAndIcon}>
                  <InfoTypography
                    content={t('billing_group.helperText')}
                    variant="caption"
                  />
                </div>
                <Button
                  color="primary"
                  onClick={() => {
                    this.props.setInitialBillingGroup(null);
                    this.props.setOpenDialogForm(true);
                  }}
                  variant="outlined"
                >
                  <AddIcon />
                  {t('billing_group.add')}
                </Button>
                {this.props?.establishmentBillingGroup?.length !== 0 && (
                  <EstablishmentBillingGroupTable
                    establishmentBillingGroupList={
                      this.props.establishmentBillingGroup
                    }
                    isMultiLocationWebshopEnabled={
                      !!this.props.theme?.is_multi_location_webshop_enabled
                    }
                    onDeleteEstablishmentBillingGroup={(
                      group: EstablishmentBillingGroupType,
                    ) => this.props.deleteEstablishmentBillingGroup(group)}
                    onEditEstablishmentBillingGroup={(
                      group: EstablishmentBillingGroupType,
                    ) => {
                      this.props.setInitialBillingGroup(group);
                      this.props.setOpenDialogForm(true);
                    }}
                  />
                )}
              </Paper>
              {this.props.openDialogForm && (
                <EstablishmentBillingGroupFormDialog
                  establishmentData={this.props.establishments}
                  initial={this.props.initialBillingGroup}
                  isSubmitting={this.props.submitting}
                  onClose={() => {
                    this.props.setOpenDialogForm(false);
                    this.props.setInitialBillingGroup(null);
                  }}
                  // @ts-expect-error
                  onSubmit={this.props.upsertEstablishmentBillingGroup}
                  open={this.props.openDialogForm}
                />
              )}
            </>
          )}
          <>
            <BookkeepingAccountSection
              bookkeepingAccounts={this.props.bookkeepingAccounts}
              // @ts-expect-error
              createBookkeepingAccount={this.props.createBookkeepingAccount}
              fetchDisplayedBookkeepingAccounts={
                this.props.fetchBookkeepingAccountList
              }
              fetchLinkedProductNames={this.props.fetchLinkedProductNames}
              isBookkeepingAccountsLoading={
                this.props.isBookkeepingAccountsLoading
              }
              linkedProductNames={this.props.linkedProductNames}
              onCreateBookkeepingAccount={this.props.createBookkeepingAccount}
              onDeleteBookkeepingAccount={this.props.deleteBookkeepingAccount}
              onUpdateBookkeepingAccount={this.props.updateBookkeepingAccount}
            />
          </>
        </div>
      </>
    );
  }
}
const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: '20vh',
  },
  paper: {
    padding: theme.spacing(2),
  },
  textAndIcon: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
});
const mapStateToProps = (state: RootState) => ({
  theme: themeSelectors.getTheme(state),
  configuration: state.invoice.configuration.result,
  loading: state.invoice.configuration.loading,
  processing: state.invoice.configuration.updating,
  establishmentBillingGroup: withEstablishment(
    getEnabledEstablishmentBillingGroups,
  )(state),
  establishments: getAvailableEstablishmentList(state),
  stripeReaders: getStripeReaders(state),
  bookkeepingAccounts: getBookkeepingAccountList(state),
  isBookkeepingAccountsLoading: getBookkeepingAccountLoading(state),
  linkedProductNames: getLinkedProductNames(state),
});
const mapDispatchToProps = {
  fetchInvoiceConfiguration,
  patchInvoiceConfigurationAction,
  snackbarSuccess: snackbarSuccessAction,
  snackbarError: snackbarErrorAction,
  fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
  upsertEstablishmentBillingGroupAction,
  fetchEstablishments,
  deleteEstablishmentBillingGroupAction,
  submitTheme: updateCompanyTheme,
  goToReports: () => pushRouter('/reporting'),
  fetchStripeReaders,
  createStripeReader,
  deleteStripeReader,
  editStripeReader,
  deleteBookkeepingAccount: deleteBookkeepingAccountAction,
  updateBookkeepingAccount: updateBookkeepingAccountAction,
  createBookkeepingAccount: createBookkeepingAccountAction,
  fetchLinkedProductNames: fetchLinkedProductNamesAction,
  fetchBookkeepingAccountList: fetchBookkeepingAccountListAction,
};
const mapWithHandlers = {
  patchTheme:
    (props: OwnAndConnectedProps) =>
    (data: FormData, options: OptionCallback) => {
      props.submitTheme(props.theme.company, data, options);
    },
  patchInvoiceConfiguration:
    (props: OwnAndConnectedProps) =>
    (
      data: Partial<InvoiceConfigurationSerializer>,
      options: OptionCallback<InvoiceConfigurationSerializer>,
    ) => {
      props.patchInvoiceConfigurationAction(data, {
        onSuccess: () => {
          props.snackbarSuccess('settings.update.success');
          options?.onSuccess?.();
        },
        onError: () => {
          props.snackbarError('settings.update.error');
          options?.onError?.();
        },
      });
    },
  upsertEstablishmentBillingGroup:
    (props: OwnAndConnectedProps) =>
    (establishmentBillingGroup: EstablishmentBillingGroupType) => {
      props.setSubmitting(true);
      props.upsertEstablishmentBillingGroupAction(establishmentBillingGroup, {
        onSuccess: () => {
          props.setSubmitting(false);
          props.setInitialBillingGroup(null);
          props.setOpenDialogForm(false);
          props.fetchEstablishments();
        },
        onError: () => props.setSubmitting(false),
      });
    },
  deleteEstablishmentBillingGroup:
    (props: OwnAndConnectedProps) =>
    (establishmentBillingGroup: EstablishmentBillingGroupType) => {
      props.setSubmitting(true);
      props.deleteEstablishmentBillingGroupAction(establishmentBillingGroup, {
        onSuccess: () => {
          props.setSubmitting(false);
          props.setInitialBillingGroup(null);
          props.fetchEstablishments();
        },
        onError: () => props.setSubmitting(false),
      });
    },
  createReaderAndFetch:
    (props: OwnAndConnectedProps) => (data: any, options?: OptionCallback) => {
      props.createStripeReader(data, {
        onSuccess: () => {
          props.fetchStripeReaders();
          if (options && options.onSuccess) options.onSuccess();
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      });
    },
  deleteReaderAndFetch:
    (props: OwnAndConnectedProps) =>
    (readerId: string, options?: OptionCallback) => {
      props.deleteStripeReader(readerId, {
        onSuccess: () => {
          props.fetchStripeReaders();
          if (options && options.onSuccess) options.onSuccess();
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      });
    },
  editReaderAndFetch:
    (props: OwnAndConnectedProps) =>
    (readerId: string, label: string, options?: OptionCallback) => {
      props.editStripeReader(readerId, label, {
        onSuccess: () => {
          props.fetchStripeReaders();
          if (options && options.onSuccess) options.onSuccess();
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      });
    },
  fetchBookkeepingAccountList:
    // @ts-expect-error


      ({ fetchBookkeepingAccountList }) =>
      () =>
        fetchBookkeepingAccountList({ is_active: true }),
};
const withStateHandlersInit: StateHandlerInit = {
  openDialogForm: false,
  openConnectReaderDialog: false,
  openDeleteReaderDialog: false,
  initialBillingGroup: null,
  submitting: false,
};
const withStateHandlersSetter = {
  setOpenDialogForm: () => (openDialogForm: boolean) => {
    return { openDialogForm };
  },
  setOpenConnectReaderDialog: () => (openConnectReaderDialog: boolean) => ({
    openConnectReaderDialog,
  }),
  setOpenDeleteReaderDialog: () => (openDeleteReaderDialog: boolean) => ({
    openDeleteReaderDialog,
  }),
  setInitialBillingGroup:
    () => (initialBillingGroup: EstablishmentBillingGroupType | null) => {
      return { initialBillingGroup };
    },
  setSubmitting: () => (submitting: boolean) => {
    return { submitting };
  },
};
export default compose<any, OwnProps>(
  withTranslation('settings'),
  withStyles(styles),
  withTitle(({ t }: { t: TFunction }) => t('tab.invoice')),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
)(InvoiceConfigurationPage);
