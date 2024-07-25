import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

import { buildUrlParams } from '#src/http';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import BackofficeLinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import IsEmptyList from '#src/components/navigation/IsEmptyList.component';
import PaymentPackTemplateDeleteDialog from '#src/libs/payment-packs/components/PaymentPackTemplateDeleteDialog.component';
import PaymentPackTemplateFormDrawer from '#src/libs/payment-packs/components/PaymentPackTemplateForm/PaymentPackTemplateFormDrawer.component';
import VirtualizedPaymentPackTemplateList from '#src/libs/payment-packs/components/VirtualizedPaymentPackTemplateList.component';

import type {
  PaymentPackTemplate,
  PaymentPackTemplateAPI,
} from '#src/libs/payment-packs/types';
import type { OptionCallback } from '#src/state/types';
import type { RootState } from '#src/reducers';

import { push as pushAction } from 'connected-react-router';
import {
  createOrUpdatePaymentPackTemplate as createOrUpdatePaymentPackTemplateAction,
  deletePaymentPackTemplate as deletePaymentPackTemplateAction,
  fetchUniversalPassTemplateList as fetchUniversalPassTemplateListAction,
  fetchUniversalPassTemplateListManagerOnly as fetchUniversalPassTemplateListManagerOnlyAction,
  resetPaymentPackTemplateData as resetPaymentPackTemplateDataAction,
} from '#src/libs/payment-packs/actions';

import {
  getUniversalPaymentPackTemplateData,
  getUniversalPaymentPackTemplateListAvailableForSale,
  getUniversalPaymentPackTemplateListManagerOnly,
} from '#src/libs/payment-packs/selectors';

type Props = ConnectedProps<typeof connector>;

const FranchisePaymentPackTemplateListPage: React.FC<Props> = ({
  createOrUpdatePaymentPackTemplate,
  deletePaymentPackTemplate,
  fetchUniversalPassTemplateList,
  fetchUniversalPassTemplateListManagerOnly,
  loading,
  paymentPackTemplateData,
  paymentPackTemplateListAvailable,
  paymentPackTemplateListManagerOnly,
  pushRouter,
  resetPaymentPackTemplateData,
}) => {
  const { t } = useTranslation('paymentPack');
  const classes = useStyles();

  const [showAvailable, setShowAvailable] = React.useState(true);
  const [showManagerOnly, setShowManagerOnly] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [templateToEdit, setTemplateToEdit] =
    React.useState<PaymentPackTemplate | null>(null);
  const [templateIdToDelete, setTemplateIdToDelete] = React.useState<
    number | null
  >(null);
  const [isManagerOnlyLoading, setIsManagerOnlyLoading] = React.useState(false);

  const handleFetchTemplateAvailable = React.useCallback(() => {
    fetchUniversalPassTemplateList();
  }, [fetchUniversalPassTemplateList]);

  React.useEffect(
    () => handleFetchTemplateAvailable(),
    [handleFetchTemplateAvailable],
  );

  React.useEffect(() => {
    resetPaymentPackTemplateData();
  }, [resetPaymentPackTemplateData]);

  const closeCreateDialog = React.useCallback(
    () => setIsCreateModalOpen(false),
    [],
  );

  const openCreateDialog = React.useCallback(
    () => setIsCreateModalOpen(true),
    [],
  );

  const closeEditDialog = React.useCallback(() => setTemplateToEdit(null), []);

  const openEditDialog = React.useCallback(
    //@ts-expect-error
    (id: number) => setTemplateToEdit(paymentPackTemplateData[id]),
    [paymentPackTemplateData],
  );

  const closeDeleteDialog = React.useCallback(
    () => setTemplateIdToDelete(null),
    [],
  );

  const openDeleteDialog = React.useCallback(
    (id: number) => setTemplateIdToDelete(id),
    [],
  );

  const goToTemplateDetail = React.useCallback(
    (id: number, params: { openTemplateInstanceForm?: boolean } = {}) =>
      pushRouter(`/f/universal-pass-template/${id}/${buildUrlParams(params)}`),
    [pushRouter],
  );

  const handleFetchTemplateListManagerOnly = React.useCallback(() => {
    setIsManagerOnlyLoading(true);
    fetchUniversalPassTemplateListManagerOnly({
      onSuccess: () => setIsManagerOnlyLoading(false),
      onError: () => setIsManagerOnlyLoading(false),
    });
  }, [fetchUniversalPassTemplateListManagerOnly]);

  const handleDeleteTemplate = React.useCallback(
    () =>
      deletePaymentPackTemplate(templateIdToDelete, {
        onSuccess: () => {
          handleFetchTemplateAvailable();
          closeDeleteDialog();
        },
      }),
    [
      closeDeleteDialog,
      deletePaymentPackTemplate,
      handleFetchTemplateAvailable,
      templateIdToDelete,
    ],
  );

  const handleCreateOrUpdateTemplate = React.useCallback(
    (
      data: PaymentPackTemplateAPI,
      options: OptionCallback<PaymentPackTemplateAPI>,
    ) =>
      createOrUpdatePaymentPackTemplate(
        { ...data, is_universal_template: true },
        {
          onError: options && options.onError,
          onSuccess: (template: PaymentPackTemplateAPI) => {
            if (isCreateModalOpen) {
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
        },
      ),
    [
      closeCreateDialog,
      closeEditDialog,
      createOrUpdatePaymentPackTemplate,
      goToTemplateDetail,
      isCreateModalOpen,
    ],
  );

  const onShowManagerOnly = React.useCallback(() => {
    if (!showManagerOnly) {
      handleFetchTemplateListManagerOnly();
    }
    setShowManagerOnly(!showManagerOnly);
  }, [handleFetchTemplateListManagerOnly, showManagerOnly]);

  const onShowAvailable = React.useCallback(() => {
    setShowAvailable(!showAvailable);
  }, [showAvailable]);

  return (
    <div>
      {loading && <BackofficeLinearProgress />}
      {!loading && (
        <IsEmptyList
          button={t('paymentPackTemplate.actions.createUniversalPass')}
          hideEmptyText={
            loading ||
            !!paymentPackTemplateListAvailable.length ||
            !!paymentPackTemplateListManagerOnly.length
          }
          onCreate={openCreateDialog}
          onCreateLabel={t('paymentPackTemplate.actions.createUniversalPass')}
          text={t('paymentPackTemplate.isEmptyExplain')}
        />
      )}
      <div className={classes.container}>
        {!!paymentPackTemplateListAvailable.length && (
          <>
            <div className={classes.row}>
              <Typography variant="h4">
                {`${t('paymentPackTemplate.section.titleAvailable')} (${
                  paymentPackTemplateListAvailable?.length || 0
                })`}
              </Typography>
              <IconButton onClick={onShowAvailable}>
                {showAvailable ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </div>
            <Divider className={classes.divider} />
            <Collapse in={showAvailable}>
              <Paper>
                <VirtualizedPaymentPackTemplateList
                  divider
                  onClick={goToTemplateDetail}
                  onDelete={openDeleteDialog}
                  onEdit={openEditDialog}
                  //@ts-expect-error
                  paymentPackTemplateList={paymentPackTemplateListAvailable}
                />
              </Paper>
            </Collapse>
          </>
        )}
        <div className={classes.row}>
          <Typography className={classes.title} variant="h4">
            {t('paymentPackTemplate.section.titleManagerOnly')}
          </Typography>
          <IconButton onClick={onShowManagerOnly}>
            {showManagerOnly ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
        {isManagerOnlyLoading ? (
          <div className={classes.divider}>
            <LinearProgress />
          </div>
        ) : (
          <Divider className={classes.divider} />
        )}
        {showManagerOnly && (
          <Collapse in={showManagerOnly}>
            <Paper>
              <VirtualizedPaymentPackTemplateList
                onClick={goToTemplateDetail}
                onDelete={openDeleteDialog}
                onEdit={openEditDialog}
                //@ts-expect-error
                paymentPackTemplateList={paymentPackTemplateListManagerOnly}
              />
            </Paper>
          </Collapse>
        )}
      </div>
      {!!isCreateModalOpen && (
        <PaymentPackTemplateFormDrawer
          // @ts-expect-error
          isUniversal={true}
          onClose={closeCreateDialog}
          onSubmit={handleCreateOrUpdateTemplate}
          open={isCreateModalOpen}
        />
      )}
      <PaymentPackTemplateDeleteDialog
        onClose={closeDeleteDialog}
        onSubmit={handleDeleteTemplate}
        open={!!templateIdToDelete}
      />
      {!!templateToEdit && (
        <PaymentPackTemplateFormDrawer
          // @ts-expect-error
          initial={templateToEdit}
          isUniversal={true}
          onClose={closeEditDialog}
          onSubmit={handleCreateOrUpdateTemplate}
          open={!!templateToEdit}
        />
      )}
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    paymentPackTemplateListManagerOnly:
      getUniversalPaymentPackTemplateListManagerOnly(state),
    paymentPackTemplateListAvailable:
      getUniversalPaymentPackTemplateListAvailableForSale(state),
    paymentPackTemplateData: getUniversalPaymentPackTemplateData(state),
    loading: state.paymentPack.universalPaymentPackTemplate.loading,
  }),
  {
    fetchUniversalPassTemplateList: fetchUniversalPassTemplateListAction,
    fetchUniversalPassTemplateListManagerOnly:
      fetchUniversalPassTemplateListManagerOnlyAction,
    pushRouter: pushAction,
    createOrUpdatePaymentPackTemplate: createOrUpdatePaymentPackTemplateAction,
    deletePaymentPackTemplate: deletePaymentPackTemplateAction,
    resetPaymentPackTemplateData: resetPaymentPackTemplateDataAction,
  },
);

const useStyles = makeStyles((theme) => ({
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
}));

export default compose(
  connector,
  React.memo,
)(FranchisePaymentPackTemplateListPage);
