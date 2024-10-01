import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { push as pushAction } from 'connected-react-router';
import Divider from '@material-ui/core/Divider';

import { WithStyles, makeStyles } from '@material-ui/core';

import { useTranslation, WithTranslation } from 'react-i18next';

import PaymentPackTemplateFormDrawer from '#src/libs/payment-packs/components/PaymentPackTemplateForm/PaymentPackTemplateFormDrawer.component';
import PaymentPackTemplateDeleteDialog from '#src/libs/payment-packs/components/PaymentPackTemplateDeleteDialog.component';
import {
  PaymentPackTemplateAPI,
  PaymentPackTemplate,
} from '#src/libs/payment-packs/types';
import {
  fetchPaymentPackTemplatePaginatedListAvailableForSale as fetchPaymentPackTemplatePaginatedListAvailableForSaleAction,
  fetchPaymentPackTemplatePaginatedListManagerOnly as fetchPaymentPackTemplatePaginatedListManagerOnlyAction,
  createOrUpdatePaymentPackTemplate as createOrUpdatePaymentPackTemplateAction,
  deletePaymentPackTemplate as deletePaymentPackTemplateAction,
} from '#src/libs/payment-packs/actions';

import {
  getPaymentPackTemplatePaginatedManagerOnly,
  getPaymentPackTemplatePaginatedAvailableForSale,
} from '#src/libs/payment-packs/selectors';

import { OptionCallback } from '#src/state/types';
import IsEmptyList from '#src/components/navigation/IsEmptyList.component';
import { RootState } from '#src/reducers';
import { buildUrlParams } from '#src/http';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';
import PaymentPackTemplateListItem from '#src/libs/payment-packs/components/PaymentPackTemplateListItem.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';

import PaymentPackTemplateSearchItem from '#src/libs/payment-packs/components/Search/PaymentPackTemplateSearchItem.component';

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
  searchComponent: {
    paddingBottom: theme.spacing(2),
  },
}));

type Props = ConnectedProps<typeof connector> & WithStyles & WithTranslation;

type deletePaymentPackTemplateState = {
  paymentPackTemplateId: number;
} & {
  isManagerOnly: boolean;
};

const FranchisePaymentPackTemplateListPageReworked: React.FC<Props> = ({
  paymentPackTemplateListPaginatedAvailableForSale,
  paymentPackTemplateListPaginatedManagerOnly,
  fetchPaymentPackTemplatePaginatedListAvailableForSale,
  fetchPaymentPackTemplatePaginatedListManagerOnly,
  deletePaymentPackTemplate,
  goToTemplateDetail,
  createOrUpdatePaymentPackTemplate,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('paymentPack');

  const [paymentPackTemplateForEdit, setPaymentPackTemplateForEdit] =
    React.useState<PaymentPackTemplate | null>(null);

  const [openCreationDrawer, setOpenCreationDialog] = React.useState(false);

  const [paymentPackTemplateToDelete, setPaymentPackTemplateToDelete] =
    React.useState<deletePaymentPackTemplateState | null>(null);
  // CDM
  React.useEffect(() => {
    // Fetching the first page for both available for purchase and manager only passes.
    fetchPaymentPackTemplatePaginatedListAvailableForSale({ page: 1 });
    fetchPaymentPackTemplatePaginatedListManagerOnly({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenCreationDialog = React.useCallback(
    () => setOpenCreationDialog(true),
    [],
  );
  const handleCloseCreationDialog = React.useCallback(
    () => setOpenCreationDialog(false),
    [],
  );
  const handleSetPaymentPackTemplateForEdit = React.useCallback(
    (id: number) => {
      const paymentPackTemplate =
        paymentPackTemplateListPaginatedAvailableForSale.byId[id] ||
        paymentPackTemplateListPaginatedManagerOnly.byId[id];
      paymentPackTemplate &&
        //@ts-expect-error : This is an mandatory spreading since specific package dealing badly with immutable could break
        // on underlying components
        setPaymentPackTemplateForEdit({ ...paymentPackTemplate });
    },
    [
      paymentPackTemplateListPaginatedAvailableForSale,
      paymentPackTemplateListPaginatedManagerOnly,
      setPaymentPackTemplateForEdit,
    ],
  );

  const handleResetEditionState = React.useCallback(() => {
    setPaymentPackTemplateForEdit(null);
  }, []);

  const handleSubmitPaymentPackTemplateForm = React.useCallback(
    (data: any, options: OptionCallback<PaymentPackTemplateAPI>) => {
      createOrUpdatePaymentPackTemplate(data, {
        onError: options?.onError,
        onSuccess: (template: PaymentPackTemplateAPI) => {
          if (openCreationDrawer) {
            goToTemplateDetail(template.id, {
              openTemplateInstanceForm: true,
            });
          } else {
            goToTemplateDetail(template.id);
          }
          handleOpenCreationDialog();
          handleResetEditionState();
          if (options && options.onSuccess) {
            options.onSuccess(template);
          }
        },
      });
    },
    [
      openCreationDrawer,
      createOrUpdatePaymentPackTemplate,
      goToTemplateDetail,
      handleOpenCreationDialog,
      handleResetEditionState,
    ],
  );

  const handleSetPaymentPackTemplateForDelete = React.useCallback(
    (paymentPackTemplateId: number, isManagerOnly: boolean) => {
      setPaymentPackTemplateToDelete({ paymentPackTemplateId, isManagerOnly });
    },
    [],
  );

  const handleDeletePaymentPackTemplate = React.useCallback(() => {
    !!paymentPackTemplateToDelete?.paymentPackTemplateId &&
      deletePaymentPackTemplate(
        paymentPackTemplateToDelete?.paymentPackTemplateId,
        {
          onSuccess: () => {
            setPaymentPackTemplateToDelete(null);
            paymentPackTemplateToDelete.isManagerOnly &&
              fetchPaymentPackTemplatePaginatedListManagerOnly({ page: 1 });

            !paymentPackTemplateToDelete.isManagerOnly &&
              fetchPaymentPackTemplatePaginatedListAvailableForSale({
                page: 1,
              });
          },
        },
      );
  }, [
    paymentPackTemplateToDelete,
    deletePaymentPackTemplate,
    fetchPaymentPackTemplatePaginatedListManagerOnly,
    fetchPaymentPackTemplatePaginatedListAvailableForSale,
  ]);

  const handleResetDeltionState = React.useCallback(() => {
    setPaymentPackTemplateToDelete(null);
  }, []);

  const handleGoToPaymentPackTemplateDetailPage = React.useCallback(
    (id: number, urlParams: { openTemplateInstanceForm: boolean } | {} = {}) =>
      goToTemplateDetail(id, urlParams),
    [goToTemplateDetail],
  );

  const noExistingPasses =
    !paymentPackTemplateListPaginatedAvailableForSale.loading &&
    !paymentPackTemplateListPaginatedManagerOnly.loading &&
    !paymentPackTemplateListPaginatedAvailableForSale.count &&
    !paymentPackTemplateListPaginatedManagerOnly.count;

  const formatSearchOptions = React.useCallback(
    (searchResults: PaymentPackTemplateAPI[]) => {
      return searchResults.map((result) => ({
        label: result.name,
        value: result.id,
        paymentPackTemplate: result,
        onClick: handleGoToPaymentPackTemplateDetailPage,
      }));
    },
    [handleGoToPaymentPackTemplateDetailPage],
  );
  return (
    <>
      <ObjectSearchComponent
        additionalParams={{ disabled: false }}
        className={classes.searchComponent}
        components={{
          Option: PaymentPackTemplateSearchItem,
        }}
        optionsFormatter={formatSearchOptions}
        placeholder={t('search')}
        searchedObjectType="payment_pack_template"
        variant="default"
      />
      <IsEmptyList
        button={t('paymentPackTemplate.actions.create')}
        hideEmptyText={!noExistingPasses}
        onCreate={handleOpenCreationDialog}
        onCreateLabel={t('paymentPackTemplate.actions.create')}
        text={t('paymentPackTemplate.isEmptyExplain')}
      />

      <div className={classes.container}>
        <Typography variant="h4">
          {`${t('paymentPackTemplate.section.titleAvailable')} (${
            paymentPackTemplateListPaginatedAvailableForSale.count || 0
          })`}
        </Typography>
        <Divider className={classes.divider} />
        <Paper>
          <PaginatedListBase
            itemPerPage={
              paymentPackTemplateListPaginatedAvailableForSale.page_size
            }
            items={paymentPackTemplateListPaginatedAvailableForSale.passes}
            listProps={{ disablePadding: true }}
            loading={paymentPackTemplateListPaginatedAvailableForSale.loading}
            nbItems={paymentPackTemplateListPaginatedAvailableForSale.count}
            onPageRequested={
              fetchPaymentPackTemplatePaginatedListAvailableForSale
            }
            page={paymentPackTemplateListPaginatedAvailableForSale.page}
            renderItem={(paymentPackTemplate: PaymentPackTemplate) => (
              <PaymentPackTemplateListItem
                key={paymentPackTemplate.id}
                onClick={handleGoToPaymentPackTemplateDetailPage}
                onDelete={(id: number) =>
                  handleSetPaymentPackTemplateForDelete(id, false)
                }
                onEdit={handleSetPaymentPackTemplateForEdit}
                paymentPackTemplate={paymentPackTemplate}
              />
            )}
          />
        </Paper>
        <Typography className={classes.title} variant="h4">
          {`${t('paymentPackTemplate.section.titleManagerOnly')} (${
            paymentPackTemplateListPaginatedManagerOnly.count || 0
          })`}
        </Typography>
        <Divider className={classes.divider} />
        <Paper>
          <PaginatedListBase
            itemPerPage={paymentPackTemplateListPaginatedManagerOnly.page_size}
            items={paymentPackTemplateListPaginatedManagerOnly.passes}
            listProps={{ disablePadding: true }}
            loading={paymentPackTemplateListPaginatedManagerOnly.loading}
            nbItems={paymentPackTemplateListPaginatedManagerOnly.count}
            onPageRequested={fetchPaymentPackTemplatePaginatedListManagerOnly}
            page={paymentPackTemplateListPaginatedManagerOnly.page}
            renderItem={(paymentPackTemplate: PaymentPackTemplate) => (
              <PaymentPackTemplateListItem
                key={paymentPackTemplate.id}
                onClick={handleGoToPaymentPackTemplateDetailPage}
                onDelete={(id: number) =>
                  handleSetPaymentPackTemplateForDelete(id, true)
                }
                onEdit={handleSetPaymentPackTemplateForEdit}
                paymentPackTemplate={paymentPackTemplate}
              />
            )}
          />
        </Paper>
      </div>

      <PaymentPackTemplateDeleteDialog
        onClose={handleResetDeltionState}
        onSubmit={handleDeletePaymentPackTemplate}
        open={!!paymentPackTemplateToDelete}
      />

      {/* 
      open props and conditionnally rendering the component are both required 
      for formik state re-initialisation  
      */}
      {!!paymentPackTemplateForEdit && (
        <PaymentPackTemplateFormDrawer
          initial={paymentPackTemplateForEdit}
          onClose={handleResetEditionState}
          onSubmit={handleSubmitPaymentPackTemplateForm}
          open={!!paymentPackTemplateForEdit}
        />
      )}

      {openCreationDrawer && (
        <PaymentPackTemplateFormDrawer
          onClose={handleCloseCreationDialog}
          onSubmit={handleSubmitPaymentPackTemplateForm}
          open={openCreationDrawer}
        />
      )}
    </>
  );
};

const connector = connect(
  (state: RootState) => ({
    paymentPackTemplateListPaginatedManagerOnly:
      getPaymentPackTemplatePaginatedManagerOnly(state),
    paymentPackTemplateListPaginatedAvailableForSale:
      getPaymentPackTemplatePaginatedAvailableForSale(state),
  }),
  {
    fetchPaymentPackTemplatePaginatedListAvailableForSale:
      fetchPaymentPackTemplatePaginatedListAvailableForSaleAction,
    fetchPaymentPackTemplatePaginatedListManagerOnly:
      fetchPaymentPackTemplatePaginatedListManagerOnlyAction,
    goToTemplateDetail: (
      id: number,
      urlParams: { openTemplateInstanceForm: boolean } | {} = {},
    ) =>
      pushAction(`/f/payment-pack-template/${id}/${buildUrlParams(urlParams)}`),
    createOrUpdatePaymentPackTemplate: createOrUpdatePaymentPackTemplateAction,
    deletePaymentPackTemplate: deletePaymentPackTemplateAction,
  },
);

export default connector(FranchisePaymentPackTemplateListPageReworked);
