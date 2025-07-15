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
  fetchUniversalPaymentPackTemplatePaginatedListAvailableForSale as fetchUniversalPaymentPackTemplatePaginatedListAvailableForSaleAction,
  fetchUniversalPaymentPackTemplatePaginatedListManagerOnly as fetchUniversalPaymentPackTemplatePaginatedListManagerOnlyAction,
  createOrUpdateUniversalPaymentPackTemplate as createOrUpdateUniversalPaymentPackTemplateAction,
  deleteUniversalPaymentPackTemplate as deleteUniversalPaymentPackTemplateAction,
  fetchUniversalPaymentPackTemplatePaginatedListArchived as fetchUniversalPaymentPackTemplatePaginatedListArchivedAction,
  restoreUniversalPaymentPackTemplate as restoreUniversalPaymentPackTemplateAction,
} from '#src/libs/payment-packs/actions';
import {
  FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE,
  ACTIVE_TEMPLATE_SEARCH_PARAMS,
} from '#src/libs/payment-packs/constants';
import {
  getUniverslPaymentPackTemplatePaginatedManagerOnly,
  getUniversalPaymentPackTemplatePaginatedAvailableForSale,
  getUniversalPaymentPackTemplatePaginatedArchived,
} from '#src/libs/payment-packs/selectors';
import type { OptionCallback } from '#src/state/types';
import IsEmptyList from '#src/components/navigation/IsEmptyList.component';
import { RootState } from '#src/reducers';
import { buildUrlParams } from '#src/http';
import PaginatedListBaseReworked from '#src/components/PaginatedListBaseReworked.component';
import PaymentPackTemplateListItem from '#src/libs/payment-packs/components/PaymentPackTemplateListItem.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import PaymentPackTemplateSearchItem from '#src/libs/payment-packs/components/Search/PaymentPackTemplateSearchItem.component';
import { WithObjectSearch } from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';
import { useObjectSearch } from '#src/libs/fuzzy-search/hooks/useObjectSearch';
import { getPaginatedPageToRefreshOnRemoval } from '#src/libs/payment-packs/utils';

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
    paddingTop: theme.spacing(4),
  },
}));

type Props = ConnectedProps<typeof connector> &
  WithObjectSearch &
  WithStyles &
  WithTranslation;

type deleteUniversalPaymentPackTemplateState = {
  paymentPackTemplateId: number;
} & {
  isManagerOnly: boolean;
};

type RestorePaymentPackTemplateState = {
  paymentPackTemplateId: number;
};

const FranchiseUniversalPaymentPackTemplateListPageReworked: React.FC<
  Props
> = ({
  universalPaymentPackTemplateListPaginatedAvailableForSale,
  univerlPaymentPackTemplateListPaginatedManagerOnly,
  universalPaymentPackTemplateListPaginatedArchived,
  fetchUniversalPaymentPackTemplatePaginatedListAvailableForSale,
  fetchUniversalPaymentPackTemplatePaginatedListManagerOnly,
  fetchUniversalPaymentPackTemplatePaginatedListArchived,
  deleteUniversalPaymentPackTemplate,
  restoreUniversalPaymentPackTemplate,
  goToTemplateDetail,
  createOrUpdateUniversalPaymentPackTemplate,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('paymentPack');
  const { refreshOptions } = useObjectSearch();

  const toggleIsArchiveSectionOpen = React.useCallback(() => {
    setIsArchiveSectionOpen((prevState) => !prevState);
  }, []);

  const [isArchiveSectionOpen, setIsArchiveSectionOpen] =
    React.useState<boolean>(false);

  const [paymentPackTemplateForEdit, setPaymentPackTemplateForEdit] =
    React.useState<PaymentPackTemplate | null>(null);

  const [openCreationDrawer, setOpenCreationDialog] = React.useState(false);

  const [paymentPackTemplateToDelete, setPaymentPackTemplateToDelete] =
    React.useState<deleteUniversalPaymentPackTemplateState | null>(null);

  const [
    universalPaymentPackTemplateToRestore,
    setUniversalPaymentPackTemplateToRestore,
  ] = React.useState<RestorePaymentPackTemplateState | null>(null);
  // CDM
  React.useEffect(() => {
    // Fetching the first page for available for purchase, manager only passes and archived passes.
    fetchUniversalPaymentPackTemplatePaginatedListAvailableForSale({ page: 1 });
    fetchUniversalPaymentPackTemplatePaginatedListManagerOnly({ page: 1 });
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

  const getPaginatedPageToRefreshOnListRemoval = React.useCallback(
    (paginatedList: PaymentPackTemplatePaginatedBaseState) =>
      getPaginatedPageToRefreshOnRemoval(paginatedList),
    [],
  );

  const refreshUniversalPaymentPackTemplateListArchived = React.useCallback(
    (page: number) => {
      if (isArchiveSectionOpen) {
        fetchUniversalPaymentPackTemplatePaginatedListArchived({ page });
      }
    },
    [
      isArchiveSectionOpen,
      fetchUniversalPaymentPackTemplatePaginatedListArchived,
    ],
  );

  const handleSetPaymentPackTemplateForEdit = React.useCallback(
    (id: number) => {
      const paymentPackTemplate =
        universalPaymentPackTemplateListPaginatedAvailableForSale.byId[id] ||
        univerlPaymentPackTemplateListPaginatedManagerOnly.byId[id];
      paymentPackTemplate &&
        //@ts-expect-error : This is an mandatory spreading since specific package dealing badly with immutable could break
        // on underlying components
        setPaymentPackTemplateForEdit({ ...paymentPackTemplate });
    },
    [
      universalPaymentPackTemplateListPaginatedAvailableForSale,
      univerlPaymentPackTemplateListPaginatedManagerOnly,
      setPaymentPackTemplateForEdit,
    ],
  );

  const handleResetEditionState = React.useCallback(() => {
    setPaymentPackTemplateForEdit(null);
  }, []);

  const handleSubmitPaymentPackTemplateForm = React.useCallback(
    (data: any, options: OptionCallback<PaymentPackTemplateAPI>) => {
      createOrUpdateUniversalPaymentPackTemplate(data, {
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
      createOrUpdateUniversalPaymentPackTemplate,
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

  const handleDeleteUniversalPaymentPackTemplate = React.useCallback(() => {
    !!paymentPackTemplateToDelete?.paymentPackTemplateId &&
      deleteUniversalPaymentPackTemplate(
        paymentPackTemplateToDelete?.paymentPackTemplateId,
        {
          onSuccess: () => {
            setPaymentPackTemplateToDelete(null);
            paymentPackTemplateToDelete.isManagerOnly &&
              fetchUniversalPaymentPackTemplatePaginatedListManagerOnly({
                page: getPaginatedPageToRefreshOnListRemoval(
                  univerlPaymentPackTemplateListPaginatedManagerOnly,
                ),
              });

            !paymentPackTemplateToDelete.isManagerOnly &&
              fetchUniversalPaymentPackTemplatePaginatedListAvailableForSale({
                page: getPaginatedPageToRefreshOnListRemoval(
                  universalPaymentPackTemplateListPaginatedAvailableForSale,
                ),
              });

            refreshOptions(
              'universal_payment_pack_template',
              ACTIVE_TEMPLATE_SEARCH_PARAMS,
            );
            refreshUniversalPaymentPackTemplateListArchived(
              universalPaymentPackTemplateListPaginatedArchived.page,
            );
          },
        },
      );
  }, [
    paymentPackTemplateToDelete,
    deleteUniversalPaymentPackTemplate,
    fetchUniversalPaymentPackTemplatePaginatedListManagerOnly,
    getPaginatedPageToRefreshOnListRemoval,
    univerlPaymentPackTemplateListPaginatedManagerOnly,
    fetchUniversalPaymentPackTemplatePaginatedListAvailableForSale,
    universalPaymentPackTemplateListPaginatedAvailableForSale,
    refreshOptions,
    refreshUniversalPaymentPackTemplateListArchived,
    universalPaymentPackTemplateListPaginatedArchived.page,
  ]);

  const handleSetUniversalPaymentPackTemplateForRestore = React.useCallback(
    (paymentPackTemplateId: number) => {
      setUniversalPaymentPackTemplateToRestore({ paymentPackTemplateId });
    },
    [],
  );

  const handleRestoreUniversalPaymentPackTemplate = React.useCallback(() => {
    if (!!universalPaymentPackTemplateToRestore?.paymentPackTemplateId) {
      restoreUniversalPaymentPackTemplate(
        universalPaymentPackTemplateToRestore?.paymentPackTemplateId,
        {
          onSuccess: () => {
            setUniversalPaymentPackTemplateToRestore(null);
            refreshOptions(
              'universal_payment_pack_template',
              ACTIVE_TEMPLATE_SEARCH_PARAMS,
            );
            fetchUniversalPaymentPackTemplatePaginatedListManagerOnly({
              page: univerlPaymentPackTemplateListPaginatedManagerOnly.page,
            });

            fetchUniversalPaymentPackTemplatePaginatedListAvailableForSale({
              page: universalPaymentPackTemplateListPaginatedAvailableForSale.page,
            });
            refreshUniversalPaymentPackTemplateListArchived(
              getPaginatedPageToRefreshOnListRemoval(
                universalPaymentPackTemplateListPaginatedArchived,
              ),
            );
          },
        },
      );
    }
  }, [
    restoreUniversalPaymentPackTemplate,
    refreshUniversalPaymentPackTemplateListArchived,
    fetchUniversalPaymentPackTemplatePaginatedListAvailableForSale,
    fetchUniversalPaymentPackTemplatePaginatedListManagerOnly,
    getPaginatedPageToRefreshOnListRemoval,
    universalPaymentPackTemplateToRestore,
    refreshOptions,
    univerlPaymentPackTemplateListPaginatedManagerOnly.page,
    universalPaymentPackTemplateListPaginatedArchived,
    universalPaymentPackTemplateListPaginatedAvailableForSale.page,
  ]);

  const handleResetDeltionState = React.useCallback(() => {
    setPaymentPackTemplateToDelete(null);
  }, []);

  const handleResetRestoreState = React.useCallback(() => {
    setUniversalPaymentPackTemplateToRestore(null);
  }, []);

  const handleGoToPaymentPackTemplateDetailPage = React.useCallback(
    (id: number, urlParams: { openTemplateInstanceForm: boolean } | {} = {}) =>
      goToTemplateDetail(id, urlParams),
    [goToTemplateDetail],
  );

  const noExistingPasses =
    !universalPaymentPackTemplateListPaginatedAvailableForSale.loading &&
    !univerlPaymentPackTemplateListPaginatedManagerOnly.loading &&
    !universalPaymentPackTemplateListPaginatedAvailableForSale.count &&
    !univerlPaymentPackTemplateListPaginatedManagerOnly.count;

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
        searchedObjectType="universal_payment_pack_template"
        variant="default"
      />
      <IsEmptyList
        button={t('paymentPackTemplate.actions.createUniversalPass')}
        hideEmptyText={!noExistingPasses}
        onCreate={handleOpenCreationDialog}
        onCreateLabel={t('paymentPackTemplate.actions.createUniversalPass')}
        text={t('paymentPackTemplate.isEmptyExplain')}
      />

      <div className={classes.container}>
        <Typography variant="h4">
          {`${t('paymentPackTemplate.section.titleAvailable')} (${
            universalPaymentPackTemplateListPaginatedAvailableForSale.count || 0
          })`}
        </Typography>
        <Divider className={classes.divider} />
        <PaginatedListBaseReworked
          itemPerPage={50}
          items={
            universalPaymentPackTemplateListPaginatedAvailableForSale.passes
          }
          loading={
            universalPaymentPackTemplateListPaginatedAvailableForSale.loading
          }
          nbItems={
            universalPaymentPackTemplateListPaginatedAvailableForSale.count
          }
          onPageRequested={
            fetchUniversalPaymentPackTemplatePaginatedListAvailableForSale
          }
          page={universalPaymentPackTemplateListPaginatedAvailableForSale.page}
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
            univerlPaymentPackTemplateListPaginatedManagerOnly.count || 0
          })`}
        </Typography>
        <Divider className={classes.divider} />
        <PaginatedListBaseReworked
          itemPerPage={50}
          items={univerlPaymentPackTemplateListPaginatedManagerOnly.passes}
          loading={univerlPaymentPackTemplateListPaginatedManagerOnly.loading}
          nbItems={univerlPaymentPackTemplateListPaginatedManagerOnly.count}
          onPageRequested={
            fetchUniversalPaymentPackTemplatePaginatedListManagerOnly
          }
          page={univerlPaymentPackTemplateListPaginatedManagerOnly.page}
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
          {universalPaymentPackTemplateListPaginatedArchived.loading && (
            <LinearProgress />
          )}
          <Collapse unmountOnExit in={isArchiveSectionOpen}>
            <PaginatedListBaseReworked
              itemPerPage={FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE}
              items={universalPaymentPackTemplateListPaginatedArchived.passes}
              loading={
                universalPaymentPackTemplateListPaginatedArchived.loading
              }
              nbItems={universalPaymentPackTemplateListPaginatedArchived.count}
              onPageRequested={
                fetchUniversalPaymentPackTemplatePaginatedListArchived
              }
              page={universalPaymentPackTemplateListPaginatedArchived.page}
              renderItem={(paymentPackTemplate: PaymentPackTemplate) => (
                <PaymentPackTemplateListItem
                  key={paymentPackTemplate.id}
                  onRestore={(id: number) =>
                    handleSetUniversalPaymentPackTemplateForRestore(id)
                  }
                  paymentPackTemplate={paymentPackTemplate}
                />
              )}
            />
          </Collapse>
        </div>
      </div>

      <PaymentPackTemplateDeleteDialog
        isUniversal
        onClose={handleResetDeltionState}
        onSubmit={handleDeleteUniversalPaymentPackTemplate}
        open={!!paymentPackTemplateToDelete}
      />

      <PaymentPackTemplateRestoreDialog
        isUniversal
        onClose={handleResetRestoreState}
        onSubmit={handleRestoreUniversalPaymentPackTemplate}
        open={!!universalPaymentPackTemplateToRestore}
      />

      {/* 
      open props and conditionnally rendering the component are both required 
      for formik state re-initialisation  
      */}
      {!!paymentPackTemplateForEdit && (
        <PaymentPackTemplateFormDrawer
          isUniversal
          initial={paymentPackTemplateForEdit}
          onClose={handleResetEditionState}
          onSubmit={handleSubmitPaymentPackTemplateForm}
          open={!!paymentPackTemplateForEdit}
        />
      )}

      {openCreationDrawer && (
        <PaymentPackTemplateFormDrawer
          isUniversal
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
    univerlPaymentPackTemplateListPaginatedManagerOnly:
      getUniverslPaymentPackTemplatePaginatedManagerOnly(state),
    universalPaymentPackTemplateListPaginatedAvailableForSale:
      getUniversalPaymentPackTemplatePaginatedAvailableForSale(state),
    universalPaymentPackTemplateListPaginatedArchived:
      getUniversalPaymentPackTemplatePaginatedArchived(state),
  }),
  {
    fetchUniversalPaymentPackTemplatePaginatedListAvailableForSale:
      fetchUniversalPaymentPackTemplatePaginatedListAvailableForSaleAction,
    fetchUniversalPaymentPackTemplatePaginatedListManagerOnly:
      fetchUniversalPaymentPackTemplatePaginatedListManagerOnlyAction,
    fetchUniversalPaymentPackTemplatePaginatedListArchived:
      fetchUniversalPaymentPackTemplatePaginatedListArchivedAction,
    goToTemplateDetail: (
      id: number,
      urlParams: { openTemplateInstanceForm: boolean } | {} = {},
    ) =>
      pushAction(
        `/f/universal-pass-template/${id}/${buildUrlParams(urlParams)}`,
      ),
    createOrUpdateUniversalPaymentPackTemplate:
      createOrUpdateUniversalPaymentPackTemplateAction,
    deleteUniversalPaymentPackTemplate:
      deleteUniversalPaymentPackTemplateAction,
    restoreUniversalPaymentPackTemplate:
      restoreUniversalPaymentPackTemplateAction,
  },
);

export default connector(FranchiseUniversalPaymentPackTemplateListPageReworked);
