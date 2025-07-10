import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { push as pushAction } from 'connected-react-router';
import Divider from '@material-ui/core/Divider';

import { Collapse, WithStyles, makeStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';

import { useTranslation, WithTranslation } from 'react-i18next';

import { WithObjectSearch } from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';
import { useObjectSearch } from '#src/libs/fuzzy-search/hooks/useObjectSearch';

import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import PaymentPackTemplateFormDrawer from '#src/libs/payment-packs/components/PaymentPackTemplateForm/PaymentPackTemplateFormDrawer.component';
import PaymentPackTemplateDeleteDialog from '#src/libs/payment-packs/components/PaymentPackTemplateDeleteDialog.component';
import PaymentPackTemplateRestoreDialog from '#src/libs/payment-packs/components/PaymentPackTemplateRestoreDialog.component';
import type {
  PaymentPackTemplateAPI,
  PaymentPackTemplate,
  PaymentPackTemplatePaginatedBaseState,
} from '#src/libs/payment-packs/types';
import {
  fetchPaymentPackTemplatePaginatedListAvailableForSale as fetchPaymentPackTemplatePaginatedListAvailableForSaleAction,
  fetchPaymentPackTemplatePaginatedListManagerOnly as fetchPaymentPackTemplatePaginatedListManagerOnlyAction,
  fetchPaymentPackTemplatePaginatedListArchived as fetchPaymentPackTemplatePaginatedListArchivedAction,
  createOrUpdatePaymentPackTemplate as createOrUpdatePaymentPackTemplateAction,
  deletePaymentPackTemplate as deletePaymentPackTemplateAction,
  restorePaymentPackTemplate as restorePaymentPackTemplateAction,
} from '#src/libs/payment-packs/actions';

import {
  getPaymentPackTemplatePaginatedManagerOnly,
  getPaymentPackTemplatePaginatedAvailableForSale,
  getPaymentPackTemplatePaginatedArchived,
} from '#src/libs/payment-packs/selectors';

import { OptionCallback } from '#src/state/types';
import IsEmptyList from '#src/components/navigation/IsEmptyList.component';
import { RootState } from '#src/reducers';
import { buildUrlParams } from '#src/http';
import PaginatedListBaseReworked from '#src/components/PaginatedListBaseReworked.component';

import PaymentPackTemplateListItem from '#src/libs/payment-packs/components/PaymentPackTemplateListItem.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';

import PaymentPackTemplateSearchItem from '#src/libs/payment-packs/components/Search/PaymentPackTemplateSearchItem.component';
import { getPaginatedPageToRefreshOnRemoval } from '#src/libs/payment-packs/utils';
import {
  ACTIVE_TEMPLATE_SEARCH_PARAMS,
  FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE,
} from '#src/libs/payment-packs/constants';

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
  buttonTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: theme.spacing(1),
  },
}));

type Props = ConnectedProps<typeof connector> &
  WithObjectSearch &
  WithStyles &
  WithTranslation;

type deletePaymentPackTemplateState = {
  paymentPackTemplateId: number;
} & {
  isManagerOnly: boolean;
};

type RestorePaymentPackTemplateState = {
  paymentPackTemplateId: number;
};

const FranchisePaymentPackTemplateListPageReworked: React.FC<Props> = ({
  paymentPackTemplateListPaginatedAvailableForSale,
  paymentPackTemplateListPaginatedManagerOnly,
  paymentPackTemplateListPaginatedArchived,
  fetchPaymentPackTemplatePaginatedListAvailableForSale,
  fetchPaymentPackTemplatePaginatedListManagerOnly,
  fetchPaymentPackTemplatePaginatedListArchived,
  deletePaymentPackTemplate,
  restorePaymentPackTemplate,
  goToTemplateDetail,
  createOrUpdatePaymentPackTemplate,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('paymentPack');
  const { refreshOptions } = useObjectSearch();

  const getPaginatedPageToRefreshOnListRemoval = React.useCallback(
    (paginatedList: PaymentPackTemplatePaginatedBaseState) =>
      getPaginatedPageToRefreshOnRemoval(paginatedList),
    [],
  );

  const toggleIsArchiveSectionOpen = React.useCallback(() => {
    setIsArchiveSectionOpen((prevState) => !prevState);
  }, []);

  const [isArchiveSectionOpen, setIsArchiveSectionOpen] =
    React.useState<boolean>(false);

  const [paymentPackTemplateForEdit, setPaymentPackTemplateForEdit] =
    React.useState<PaymentPackTemplate | null>(null);

  const [openCreationDrawer, setOpenCreationDialog] = React.useState(false);

  const [paymentPackTemplateToDelete, setPaymentPackTemplateToDelete] =
    React.useState<deletePaymentPackTemplateState | null>(null);

  const [paymentPackTemplateToRestore, setPaymentPackTemplateToRestore] =
    React.useState<RestorePaymentPackTemplateState | null>(null);
  // CDM TODO : Investigate double initial fetch
  React.useEffect(() => {
    // Fetching the first page for available for purchase, manager only passes and archived passes.
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

  const refreshPaymentPackTemplateListArchived = React.useCallback(
    (page: number) => {
      if (isArchiveSectionOpen) {
        fetchPaymentPackTemplatePaginatedListArchived({ page });
      }
    },
    [isArchiveSectionOpen, fetchPaymentPackTemplatePaginatedListArchived],
  );

  const handleSetPaymentPackTemplateForEdit = React.useCallback(
    (id: number) => {
      const paymentPackTemplate =
        paymentPackTemplateListPaginatedAvailableForSale.byId[id] ||
        paymentPackTemplateListPaginatedManagerOnly.byId[id];
      paymentPackTemplate &&
        // This is an mandatory spreading since specific package dealing badly with immutable could break
        // on underlying components :
        //@ts-expect-error
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
        onSuccess: (template?: PaymentPackTemplateAPI) => {
          if (!template) {
            console.error('No template returned on success');
            return;
          }
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
              fetchPaymentPackTemplatePaginatedListManagerOnly({
                page: getPaginatedPageToRefreshOnListRemoval(
                  paymentPackTemplateListPaginatedManagerOnly,
                ),
              });

            !paymentPackTemplateToDelete.isManagerOnly &&
              fetchPaymentPackTemplatePaginatedListAvailableForSale({
                page: getPaginatedPageToRefreshOnListRemoval(
                  paymentPackTemplateListPaginatedAvailableForSale,
                ),
              });
            refreshOptions(
              'payment_pack_template',
              ACTIVE_TEMPLATE_SEARCH_PARAMS,
            );
            refreshPaymentPackTemplateListArchived(
              paymentPackTemplateListPaginatedArchived.page,
            );
          },
        },
      );
  }, [
    paymentPackTemplateToDelete,
    deletePaymentPackTemplate,
    fetchPaymentPackTemplatePaginatedListManagerOnly,
    getPaginatedPageToRefreshOnListRemoval,
    paymentPackTemplateListPaginatedManagerOnly,
    fetchPaymentPackTemplatePaginatedListAvailableForSale,
    paymentPackTemplateListPaginatedAvailableForSale,
    refreshOptions,
    refreshPaymentPackTemplateListArchived,
    paymentPackTemplateListPaginatedArchived.page,
  ]);

  const handleSetPaymentPackTemplateForRestore = React.useCallback(
    (paymentPackTemplateId: number) => {
      setPaymentPackTemplateToRestore({ paymentPackTemplateId });
    },
    [],
  );

  const handleRestorePaymentPackTemplate = React.useCallback(() => {
    if (!!paymentPackTemplateToRestore?.paymentPackTemplateId) {
      restorePaymentPackTemplate(
        paymentPackTemplateToRestore?.paymentPackTemplateId,
        {
          onSuccess: () => {
            setPaymentPackTemplateToRestore(null);
            refreshOptions(
              'payment_pack_template',
              ACTIVE_TEMPLATE_SEARCH_PARAMS,
            );
            fetchPaymentPackTemplatePaginatedListManagerOnly({
              page: paymentPackTemplateListPaginatedManagerOnly.page,
            });

            fetchPaymentPackTemplatePaginatedListAvailableForSale({
              page: paymentPackTemplateListPaginatedAvailableForSale.page,
            });
            refreshPaymentPackTemplateListArchived(
              getPaginatedPageToRefreshOnListRemoval(
                paymentPackTemplateListPaginatedArchived,
              ),
            );
          },
        },
      );
    }
  }, [
    paymentPackTemplateToRestore,
    restorePaymentPackTemplate,
    refreshOptions,
    fetchPaymentPackTemplatePaginatedListManagerOnly,
    paymentPackTemplateListPaginatedManagerOnly.page,
    fetchPaymentPackTemplatePaginatedListAvailableForSale,
    paymentPackTemplateListPaginatedAvailableForSale.page,
    refreshPaymentPackTemplateListArchived,
    getPaginatedPageToRefreshOnListRemoval,
    paymentPackTemplateListPaginatedArchived,
  ]);

  const handleResetDeltionState = React.useCallback(() => {
    setPaymentPackTemplateToDelete(null);
  }, []);

  const handleResetRestoreState = React.useCallback(() => {
    setPaymentPackTemplateToRestore(null);
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
        additionalParams={ACTIVE_TEMPLATE_SEARCH_PARAMS}
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
        <PaginatedListBaseReworked
          itemPerPage={
            paymentPackTemplateListPaginatedAvailableForSale.page_size
          }
          items={paymentPackTemplateListPaginatedAvailableForSale.passes}
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

        <Typography className={classes.title} variant="h4">
          {`${t('paymentPackTemplate.section.titleManagerOnly')} (${
            paymentPackTemplateListPaginatedManagerOnly.count || 0
          })`}
        </Typography>
        <Divider className={classes.divider} />
        <PaginatedListBaseReworked
          itemPerPage={paymentPackTemplateListPaginatedManagerOnly.page_size}
          items={paymentPackTemplateListPaginatedManagerOnly.passes}
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

        <div className={classes.container}>
          <div className={classes.buttonTitle}>
            <Typography className={classes.title} variant="h4">
              {t('paymentPackTemplate.section.titleArchived')}
            </Typography>

            <IconButton onClick={toggleIsArchiveSectionOpen}>
              {isArchiveSectionOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </div>
          <Divider className={classes.divider} />
          {paymentPackTemplateListPaginatedArchived.loading && (
            <LinearProgress />
          )}
          <Collapse unmountOnExit in={isArchiveSectionOpen}>
            <PaginatedListBaseReworked
              itemPerPage={FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE}
              items={paymentPackTemplateListPaginatedArchived.passes}
              loading={paymentPackTemplateListPaginatedArchived.loading}
              nbItems={paymentPackTemplateListPaginatedArchived.count}
              onPageRequested={fetchPaymentPackTemplatePaginatedListArchived}
              page={paymentPackTemplateListPaginatedArchived.page}
              renderItem={(paymentPackTemplate: PaymentPackTemplate) => (
                <PaymentPackTemplateListItem
                  key={paymentPackTemplate.id}
                  onRestore={(id: number) =>
                    handleSetPaymentPackTemplateForRestore(id)
                  }
                  paymentPackTemplate={paymentPackTemplate}
                />
              )}
            />
          </Collapse>
        </div>
      </div>

      <PaymentPackTemplateDeleteDialog
        onClose={handleResetDeltionState}
        onSubmit={handleDeletePaymentPackTemplate}
        open={!!paymentPackTemplateToDelete}
      />

      <PaymentPackTemplateRestoreDialog
        onClose={handleResetRestoreState}
        onSubmit={handleRestorePaymentPackTemplate}
        open={!!paymentPackTemplateToRestore}
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
    paymentPackTemplateListPaginatedArchived:
      getPaymentPackTemplatePaginatedArchived(state),
  }),
  {
    fetchPaymentPackTemplatePaginatedListAvailableForSale:
      fetchPaymentPackTemplatePaginatedListAvailableForSaleAction,
    fetchPaymentPackTemplatePaginatedListManagerOnly:
      fetchPaymentPackTemplatePaginatedListManagerOnlyAction,
    fetchPaymentPackTemplatePaginatedListArchived:
      fetchPaymentPackTemplatePaginatedListArchivedAction,
    goToTemplateDetail: (
      id: number,
      urlParams: { openTemplateInstanceForm: boolean } | {} = {},
    ) =>
      pushAction(`/f/payment-pack-template/${id}/${buildUrlParams(urlParams)}`),
    createOrUpdatePaymentPackTemplate: createOrUpdatePaymentPackTemplateAction,
    deletePaymentPackTemplate: deletePaymentPackTemplateAction,
    restorePaymentPackTemplate: restorePaymentPackTemplateAction,
  },
);

export default connector(FranchisePaymentPackTemplateListPageReworked);
