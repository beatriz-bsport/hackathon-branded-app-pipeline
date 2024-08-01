import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers, withState } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import { push as pushAction } from 'connected-react-router';

import Collapse from '@material-ui/core/Collapse';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { withTranslation, WithTranslation } from 'react-i18next';

import VirtualizedPaymentPackTemplateList from '#src/libs/payment-packs/components/VirtualizedPaymentPackTemplateList.component';
import PaymentPackTemplateFormDrawer from '#src/libs/payment-packs/components/PaymentPackTemplateForm/PaymentPackTemplateFormDrawer.component';
import PaymentPackTemplateDeleteDialog from '#src/libs/payment-packs/components/PaymentPackTemplateDeleteDialog.component';
import { PaymentPackTemplateAPI } from '#src/libs/payment-packs/types';
import {
  fetchPaymentPackTemplateList as fetchPaymentPackTemplateListAction,
  fetchPaymentPackTemplateListManagerOnly as fetchPaymentPackTemplateListManagerOnlyAction,
  createOrUpdatePaymentPackTemplate as createOrUpdatePaymentPackTemplateAction,
  deletePaymentPackTemplate as deletePaymentPackTemplateAction,
  resetPaymentPackTemplateData as resetPaymentPackTemplateDataAction,
} from '#src/libs/payment-packs/actions';
import {
  getPaymentPackTemplateListManagerOnly,
  getPaymentPackTemplateListAvailableForSale,
  getPaymentPackTemplateData,
} from '#src/libs/payment-packs/selectors';
import { OptionCallback } from '../../../state/types';
import IsEmptyList from '../../../components/navigation/IsEmptyList.component';
import { RootState } from '../../../reducers';
import { buildUrlParams } from '../../../http';
import BackofficeLinearProgress from '../../../components/navigation/BackofficeLinearProgress.component';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      paddingBottom: '20vh',
    },
    divider: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(1),
    },
    title: {
      marginTop: theme.spacing(3),
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
  });

type OwnProps = {
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  loading: boolean;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation;

type State = { showManagerOnly: boolean; showAvailable: boolean };

export class FranchisePaymentPackTemplateListPage extends Component<
  Props,
  State
> {
  state: State = { showManagerOnly: false, showAvailable: true };

  componentDidMount() {
    // @ts-expect-error
    this.props.fetchPaymentPackTemplateAvailable();
  }

  componentWillUnmount() {
    this.props.resetPaymentPackTemplateData();
  }

  onShowManagerOnly = () => {
    if (!this.state.showManagerOnly) {
      this.props.fetchPaymentPackTemplateListManagerOnly();
    }
    this.setState((prevState: State) => ({
      showManagerOnly: !prevState.showManagerOnly,
    }));
  };

  onShowAvailable = () => {
    this.setState((prevState: State) => ({
      showAvailable: !prevState.showAvailable,
    }));
  };

  render() {
    const { t, classes } = this.props;
    return (
      <div>
        {this.props.loading && <BackofficeLinearProgress />}
        {!this.props.loading && (
          <IsEmptyList
            button={t('paymentPackTemplate.actions.create')}
            hideEmptyText={
              this.props.loading ||
              !!this.props.paymentPackTemplateListAvailable.length ||
              !!this.props.paymentPackTemplateListManagerOnly.length
            }
            onCreate={this.props.openCreateDialog}
            onCreateLabel={t('paymentPackTemplate.actions.create')}
            text={t('paymentPackTemplate.isEmptyExplain')}
          />
        )}
        <div className={classes.container}>
          {!!this.props.paymentPackTemplateListAvailable.length && (
            <>
              <div className={classes.row}>
                <Typography variant="h4">
                  {`${t('paymentPackTemplate.section.titleAvailable')} (${
                    this.props.paymentPackTemplateListAvailable?.length || 0
                  })`}
                </Typography>
                <IconButton onClick={this.onShowAvailable}>
                  {this.state.showAvailable ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </div>
              <Divider className={classes.divider} />
              <Collapse in={this.state.showAvailable}>
                <Paper>
                  <VirtualizedPaymentPackTemplateList
                    // @ts-expect-error
                    divider
                    onClick={this.props.goToTemplateDetail}
                    // @ts-expect-error
                    onDelete={this.props.openDeleteDialog}
                    // @ts-expect-error
                    onEdit={this.props.openEditDialog}
                    paymentPackTemplateList={
                      this.props.paymentPackTemplateListAvailable
                    }
                  />
                </Paper>
              </Collapse>
            </>
          )}
          <div className={classes.row}>
            <Typography className={classes.title} variant="h4">
              {t('paymentPackTemplate.section.titleManagerOnly')}
            </Typography>
            <IconButton onClick={this.onShowManagerOnly}>
              {this.state.showManagerOnly ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </IconButton>
          </div>
          {/*  @ts-expect-error */}
          {this.props.paymentPackManagerOnlyLoading ? (
            <div className={classes.divider}>
              <LinearProgress />
            </div>
          ) : (
            <Divider className={classes.divider} />
          )}
          {this.state.showManagerOnly && (
            <Collapse in={this.state.showManagerOnly}>
              <Paper>
                <VirtualizedPaymentPackTemplateList
                  onClick={this.props.goToTemplateDetail}
                  // @ts-expect-error
                  onDelete={this.props.openDeleteDialog}
                  // @ts-expect-error
                  onEdit={this.props.openEditDialog}
                  paymentPackTemplateList={
                    this.props.paymentPackTemplateListManagerOnly
                  }
                />
              </Paper>
            </Collapse>
          )}
        </div>
        {/* @ts-expect-error */}
        {!!this.props.createModalOpen && (
          <PaymentPackTemplateFormDrawer
            // @ts-expect-error
            onClose={this.props.closeCreateDialog}
            onSubmit={this.props.createOrUpdatePaymentPackTemplate}
            // @ts-expect-error
            open={this.props.createModalOpen}
          />
        )}
        <PaymentPackTemplateDeleteDialog
          // @ts-expect-error
          onClose={this.props.closeDeleteDialog}
          // @ts-expect-error
          onSubmit={this.props.deletePaymentPackTemplate}
          // @ts-expect-error
          open={!!this.props.templateToDelete}
        />
        {/* @ts-expect-error */}
        {!!this.props.paymentPackTemplateForEdit && (
          <PaymentPackTemplateFormDrawer
            // @ts-expect-error
            initial={this.props.paymentPackTemplateForEdit}
            // @ts-expect-error
            onClose={this.props.closeEditDialog}
            onSubmit={this.props.createOrUpdatePaymentPackTemplate}
            // @ts-expect-error
            open={this.props.paymentPackTemplateForEdit}
          />
        )}
      </div>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    paymentPackTemplateListManagerOnly:
      getPaymentPackTemplateListManagerOnly(state),
    paymentPackTemplateListAvailable:
      getPaymentPackTemplateListAvailableForSale(state),
    paymentPackTemplateData: getPaymentPackTemplateData(state),
    loading: state.paymentPack.paymentPackTemplate.loading,
  }),
  {
    fetchPaymentPackTemplateList: fetchPaymentPackTemplateListAction,
    fetchPaymentPackTemplateListManagerOnly:
      fetchPaymentPackTemplateListManagerOnlyAction,
    goToTemplateDetail: (id: number, params: any = {}) =>
      pushAction(`/f/payment-pack-template/${id}/${buildUrlParams(params)}`),
    createOrUpdatePaymentPackTemplate: createOrUpdatePaymentPackTemplateAction,
    deletePaymentPackTemplate: deletePaymentPackTemplateAction,
    resetPaymentPackTemplateData: resetPaymentPackTemplateDataAction,
  },
);

export default compose(
  withStyles(styles),
  withTranslation(['paymentPack']),
  connector,
  withState(
    'paymentPackManagerOnlyLoading',
    'setPaymentPackManagerOnlyLoading',
    false,
  ),
  withStateHandlers(
    {
      createModalOpen: false,
      paymentPackTemplateForEdit: null,
      templateToDelete: null,
    },
    {
      openCreateDialog: () => () => ({ createModalOpen: true }),
      closeCreateDialog: () => () => ({ createModalOpen: false }),
      openEditDialog:
        // @ts-expect-error


          (_, { paymentPackTemplateData }) =>
          (id) => ({
            paymentPackTemplateForEdit: paymentPackTemplateData[id],
          }),
      closeEditDialog: () => () => ({ paymentPackTemplateForEdit: null }),
      openDeleteDialog: () => (id) => ({ templateToDelete: id }),
      closeDeleteDialog: () => () => ({ templateToDelete: null }),
    },
  ),
  withHandlers({
    fetchPaymentPackTemplateListManagerOnly:
      ({
        fetchPaymentPackTemplateListManagerOnly,
        setPaymentPackManagerOnlyLoading,
      }) =>
      () => {
        setPaymentPackManagerOnlyLoading(true);
        fetchPaymentPackTemplateListManagerOnly({
          onSuccess: () => setPaymentPackManagerOnlyLoading(false),
          onError: () => setPaymentPackManagerOnlyLoading(false),
        });
      },
    fetchPaymentPackTemplateAvailable:
      ({ fetchPaymentPackTemplateList }) =>
      () => {
        fetchPaymentPackTemplateList({
          available_for_sale: true,
        });
      },
    deletePaymentPackTemplate:
      ({
        deletePaymentPackTemplate,
        templateToDelete,
        closeDeleteDialog,
        fetchPaymentPackTemplateList,
      }) =>
      () =>
        deletePaymentPackTemplate(templateToDelete, {
          onSuccess: () => {
            fetchPaymentPackTemplateList();
            closeDeleteDialog();
          },
        }),
    createOrUpdatePaymentPackTemplate:
      ({
        createOrUpdatePaymentPackTemplate,
        createModalOpen,
        closeCreateDialog,
        closeEditDialog,
        goToTemplateDetail,
      }) =>
      (data: any, options: OptionCallback<PaymentPackTemplateAPI>) =>
        createOrUpdatePaymentPackTemplate(data, {
          onError: options && options.onError,
          onSuccess: (template: PaymentPackTemplateAPI) => {
            if (createModalOpen) {
              goToTemplateDetail(template.id, {
                openTemplateInstanceForm: true,
              });
            } else {
              goToTemplateDetail(template.id);
            }
            closeCreateDialog();
            closeEditDialog();
            if (options && options.onSuccess) {
              options.onSuccess(template);
            }
          },
        }),
  }),
)(FranchisePaymentPackTemplateListPage);
