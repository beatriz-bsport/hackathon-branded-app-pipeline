import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { push as pushAction } from 'connected-react-router';

import Collapse from '@material-ui/core/Collapse';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { withTranslation, WithTranslation } from 'react-i18next';
import LinearProgress from '../../../components/navigation/BackofficeLinearProgress.component';
import { buildUrlParams } from '../../../http';

import { RootState } from '../../../reducers';

import PaymentPackTemplateListItem from '#libs/payment-packs/components/PaymentPackTemplateListItem.component';
import IsEmptyList from '../../../components/navigation/IsEmptyList.component';
import PaymentPackTemplateFormDrawer from '#libs/payment-packs/components/PaymentPackTemplateForm/PaymentPackTemplateFormDrawer.component';
import PaymentPackTemplateDeleteDialog from '#libs/payment-packs/components/PaymentPackTemplateDeleteDialog.component';
import { PaymentPackTemplateAPI } from '#libs/payment-packs/types';
import { OptionCallback } from '../../../state/types';
import {
  fetchPaymentPackTemplateList as fetchPaymentPackTemplateListAction,
  createOrUpdatePaymentPackTemplate as createOrUpdatePaymentPackTemplateAction,
  deletePaymentPackTemplate as deletePaymentPackTemplateAction,
} from '#libs/payment-packs/actions';
import {
  getPaymentPackTemplateListManagerOnly,
  getPaymentPackTemplateListAvailable,
  getPaymentPackTemplateData,
} from '#libs/payment-packs/selectors';

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
  onCreateOpen: () => void;
  loading: boolean;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation;

type State = { showDisabled: boolean; showAvailable: boolean };

export class FranchisePaymentPackTemplateListPage extends Component<
  Props,
  State
> {
  state: State = { showDisabled: false, showAvailable: true };

  componentDidMount() {
    this.props.fetchPaymentPackTemplateList();
  }

  onShowDisabled = () => {
    this.setState((prevState: State) => ({
      showDisabled: !prevState.showDisabled,
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
        {this.props.loading && <LinearProgress />}
        {!this.props.loading && (
          <IsEmptyList
            text={t('paymentPackTemplate.isEmptyExplain')}
            button={t('paymentPackTemplate.actions.create')}
            onCreate={this.props.openCreateDialog}
            onCreateLabel={t('paymentPackTemplate.actions.create')}
            hideEmptyText={
              this.props.loading ||
              !!this.props.paymentPackTemplateListAvailable.length ||
              !!this.props.paymentPackTemplateListManagerOnly.length
            }
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
                  {this.props.paymentPackTemplateListAvailable.map((ppt) => (
                    <PaymentPackTemplateListItem
                      paymentPackTemplate={ppt}
                      divider
                      key={ppt.id}
                      onClick={this.props.goToTemplateDetail}
                      onEdit={this.props.openEditDialog}
                      onDelete={this.props.openDeleteDialog}
                    />
                  ))}
                </Paper>
              </Collapse>
            </>
          )}
          {!!this.props.paymentPackTemplateListManagerOnly.length && (
            <>
              <div className={classes.row}>
                <Typography className={classes.title} variant="h4">
                  {`${t('paymentPackTemplate.section.titleManagerOnly')} (${
                    this.props.paymentPackTemplateListManagerOnly?.length || 0
                  })`}
                </Typography>
                <IconButton onClick={this.onShowDisabled}>
                  {this.state.showDisabled ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </div>
              <Divider className={classes.divider} />
              {this.state.showDisabled && (
                <Collapse in={this.state.showDisabled}>
                  <Paper>
                    {this.props.paymentPackTemplateListManagerOnly.map(
                      (ppt) => (
                        <PaymentPackTemplateListItem
                          paymentPackTemplate={ppt}
                          key={ppt.id}
                          onEdit={this.props.openEditDialog}
                          onClick={this.props.goToTemplateDetail}
                          onDelete={this.props.openDeleteDialog}
                        />
                      ),
                    )}
                  </Paper>
                </Collapse>
              )}
            </>
          )}
        </div>
        {!!this.props.createModalOpen && (
          <PaymentPackTemplateFormDrawer
            onSubmit={this.props.createOrUpdatePaymentPackTemplate}
            onClose={this.props.closeCreateDialog}
            open={this.props.createModalOpen}
          />
        )}
        <PaymentPackTemplateDeleteDialog
          open={!!this.props.templateToDelete}
          onSubmit={this.props.deletePaymentPackTemplate}
          onClose={this.props.closeDeleteDialog}
        />
        {!!this.props.paymentPackTemplateForEdit && (
          <PaymentPackTemplateFormDrawer
            onSubmit={this.props.createOrUpdatePaymentPackTemplate}
            initial={this.props.paymentPackTemplateForEdit}
            onClose={this.props.closeEditDialog}
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
      getPaymentPackTemplateListAvailable(state),
    paymentPackTemplateData: getPaymentPackTemplateData(state),
    loading: state.paymentPack.paymentPackTemplate.loading,
  }),
  {
    fetchPaymentPackTemplateList: fetchPaymentPackTemplateListAction,
    goToTemplateDetail: (id: number, params: any = {}) =>
      pushAction(`/f/payment-pack-template/${id}/${buildUrlParams(params)}`),
    createOrUpdatePaymentPackTemplate: createOrUpdatePaymentPackTemplateAction,
    deletePaymentPackTemplate: deletePaymentPackTemplateAction,
  },
);

export default compose(
  withStyles(styles),
  withTranslation(['paymentPack']),
  connector,
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
        closeCreateDialog,
        closeEditDialog,
        goToTemplateDetail,
      }) =>
      (data: any, options: OptionCallback<PaymentPackTemplateAPI>) =>
        createOrUpdatePaymentPackTemplate(data, {
          onError: options && options.onError,
          onSuccess: (template: PaymentPackTemplateAPI) => {
            if (!template.payment_pack_template_instances.length) {
              goToTemplateDetail(template.id, {
                openTemplateInstanceForm: true,
              });
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
