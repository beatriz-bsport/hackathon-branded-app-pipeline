import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { push as pushAction } from 'connected-react-router';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';

import { withTranslation, WithTranslation } from 'react-i18next';
import LinearProgress from '../../../components/navigation/BackofficeLinearProgress.component';
import { buildUrlParams } from '../../../http';

import { RootState } from '../../../reducers';

import PaymentPackTemplateListItem from '../../../libs/payment-packs/components/PaymentPackTemplateListItem.component';
import IsEmptyList from '../../../components/navigation/IsEmptyList.component';
import PaymentPackTemplateFormDialog from '../../../libs/payment-packs/components/PaymentPackTemplateFormDialog.component';
import PaymentPackTemplateDeleteDialog from '../../../libs/payment-packs/components/PaymentPackTemplateDeleteDialog.component';
import { PaymentPackTemplateAPI } from '../../../libs/payment-packs/types';
import { OptionCallback } from '../../../state/types';
import {
  fetchPaymentPackTemplateList as fetchPaymentPackTemplateListAction,
  createOrUpdatePaymentPackTemplate as createOrUpdatePaymentPackTemplateAction,
  deletePaymentPackTemplate as deletePaymentPackTemplateAction,
} from '../../../libs/payment-packs/actions';
import {
  getPaymentPackTemplateListManagerOnly,
  getPaymentPackTemplateListAvailable,
  getPaymentPackTemplateData,
} from '../../../libs/payment-packs/selectors';

const styles = (theme: Theme) =>
  createStyles({
    container: {},
    divider: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(1),
    },
    title: {
      marginTop: theme.spacing(3),
    },
  });

type OwnProps = {
  closeCreateDialog: () => void;
  onCreateOpen: () => void;
  loading: boolean;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation;

export class FranchisePaymentPackTemplatePage extends Component<Props> {
  componentDidMount() {
    this.props.fetchPaymentPackTemplateList();
  }

  render() {
    const { t, classes } = this.props;
    return (
      <div>
        {this.props.loading && <LinearProgress />}
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
        {!!this.props.paymentPackTemplateListAvailable.length && (
          <>
            <Typography variant="h4">
              {t('paymentPackTemplate.section.titleAvailable')}
            </Typography>
            <Divider className={classes.divider} />
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
          </>
        )}
        {!!this.props.paymentPackTemplateListManagerOnly.length && (
          <>
            <Typography className={classes.title} variant="h4">
              {t('paymentPackTemplate.section.titleManagerOnly')}
            </Typography>
            <Divider className={classes.divider} />
            <Paper>
              {this.props.paymentPackTemplateListManagerOnly.map((ppt) => (
                <PaymentPackTemplateListItem
                  paymentPackTemplate={ppt}
                  diviver
                  key={ppt.id}
                  onEdit={this.props.openEditDialog}
                  onClick={this.props.goToTemplateDetail}
                  onDelete={this.props.openDeleteDialog}
                />
              ))}
            </Paper>
          </>
        )}
        {!!this.props.createModalOpen && (
          <PaymentPackTemplateFormDialog
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
          <PaymentPackTemplateFormDialog
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
    paymentPackTemplateListManagerOnly: getPaymentPackTemplateListManagerOnly(
      state,
    ),
    paymentPackTemplateListAvailable: getPaymentPackTemplateListAvailable(
      state,
    ),
    paymentPackTemplateData: getPaymentPackTemplateData(state),
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
      openEditDialog: (_, { paymentPackTemplateData }) => (id) => ({
        paymentPackTemplateForEdit: paymentPackTemplateData[id],
      }),
      closeEditDialog: () => () => ({ paymentPackTemplateForEdit: null }),
      openDeleteDialog: () => (id) => ({ templateToDelete: id }),
      closeDeleteDialog: () => () => ({ templateToDelete: null }),
    },
  ),
  withHandlers({
    deletePaymentPackTemplate: ({
      deletePaymentPackTemplate,
      templateToDelete,
      closeDeleteDialog,
      fetchPaymentPackTemplateList,
    }) => () =>
      deletePaymentPackTemplate(templateToDelete, {
        onSuccess: () => {
          fetchPaymentPackTemplateList();
          closeDeleteDialog();
        },
      }),
    createOrUpdatePaymentPackTemplate: ({
      createOrUpdatePaymentPackTemplate,
      closeCreateDialog,
      closeEditDialog,
      goToTemplateDetail,
    }) => (data: any, options: OptionCallback<PaymentPackTemplateAPI>) =>
      createOrUpdatePaymentPackTemplate(data, {
        onError: options && options.onError,
        onSuccess: (template: PaymentPackTemplateAPI) => {
          if (!template.payment_pack_template_instances.length) {
            goToTemplateDetail(template.id, { openTemplateInstanceForm: true });
          }
          closeCreateDialog();
          closeEditDialog();
          if (options && options.onSuccess) {
            options.onSuccess(template);
          }
        },
      }),
  }),
)(FranchisePaymentPackTemplatePage);
