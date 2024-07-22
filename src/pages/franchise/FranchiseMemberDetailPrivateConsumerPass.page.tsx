import React from 'react';
import { compose } from 'recompose';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { ConnectedProps, connect } from 'react-redux';
import { replace } from 'connected-react-router';
import { useTranslation } from 'react-i18next';
import { BUYABLE_ITEM_PRIVATE_PASS } from '@bsport/common/lib/master-data/buyable-items';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowForward from '@material-ui/icons/ArrowForward';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import FranchiseMemberPageLayout from '#src/components/franchise/FranchiseMemberPageLayout.component';
import FranchiseMemberSectionLayout from '#src/components/franchise/FranchiseMemberSectionLayout.component';
import FranchiseConsumerPassFilters from '#src/libs/franchise/components/FranchiseConsumerPassFilters.component';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';
import FranchisePrivateConsumerPassRowItem from '#src/libs/private-service/components/franchise-user-profile/FranchisePrivateConsumerPassRowItem.component';
import type { Company } from '#src/libs/company/types';
import type {
  FranchisePassFilters,
  FranchisePrivatePass,
  FranchiseUserPrivatePass,
} from '#src/libs/franchise/types';
import type { RootState } from '#src/reducers';
import {
  getAllowedFranchisees,
  getCompanyGroupList,
  getFranchiseCompanies,
} from '#src/libs/franchise/selectors';
import type { OptionCallback } from '#src/state/types';
import type { Invoice, InvoiceV1Serializer } from '#src/libs/invoice/types';
import { FRANCHISE_PRIVATE_CONSUMER_PASS_PAGE_DEFAULT_SIZE } from '#src/libs/franchise/constants';
import { fetchCompanyGroupList as fetchCompanyGroupListAction } from '#src/libs/franchise/actions';
import { fetchByInvoiceItem as fetchInvoiceByInvoiceItemAction } from '#src/libs/invoice/actions';
import { getPrivateConsumerPass } from '#src/libs/private-service/selectors/private-consumer-pass';
import {
  fetchPrivateConsumerPassList as fetchPrivateConsumerPassListAction,
  fetchPrivateConsumerPass as fetchPrivateConsumerPassAction,
} from '#src/libs/private-service/actions';
import InvoiceListItem from '#src/libs/invoice/InvoiceListItem.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';
import { useObjectSearch } from '#src/libs/fuzzy-search/hooks/useObjectSearch';
import { openNewWindowToImpersonate } from '#src/utils/windows';

type ParamsProps = {
  userId: number;
  selectedPrivateConsumerPassId?: number;
};

type Props = ParamsProps & ConnectedProps<typeof connector>;

type FranchiseUserPrivatePassOption = {
  label: string;
  onClick: () => void;
  privateConsumerPass: FranchiseUserPrivatePass;
  privatePass: FranchisePrivatePass;
  selected: boolean;
};

const Option: React.FC<OptionPropsWithData<FranchiseUserPrivatePassOption>> = (
  props,
) => <FranchisePrivateConsumerPassRowItem {...props.data} />;

const FranchiseMemberDetailPrivateConsumerPass: React.FC<Props> = ({
  userId,
  selectedPrivateConsumerPassId,
  selectedConsumerPass,
  companies,
  companyGroups,
  invoiceLoading,
  consumerPassLoading,
  allowedFranchiseeIds,
  replaceRouter,
  fetchCompanyGroupList,
  fetchInvoiceByInvoiceItem,
  fetchPrivateConsumerPass,
}) => {
  const { t } = useTranslation(['franchise', 'paymentPack', 'privateService']);
  const classes = useStyles();
  const { getSelectorState } = useObjectSearch();

  const [filters, setFilters] = React.useState<FranchisePassFilters>({
    reverted: false,
    is_valid_today: true,
  });
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [relatedInvoice, setRelatedInvoice] = React.useState<Invoice | null>(
    null,
  );

  const fetchInvoiceByInvoiceItemHandler = React.useCallback(
    (
      buyableId: number,
      objectId: number,
      options?: OptionCallback<InvoiceV1Serializer>,
    ) => {
      fetchInvoiceByInvoiceItem(buyableId, objectId, {
        onSuccess: (invoice: InvoiceV1Serializer) => {
          setRelatedInvoice(invoice);
          options?.onSuccess?.(invoice);
        },
        onError: (error: Error | null) => {
          options?.onError?.(error);
        },
      });
    },
    [fetchInvoiceByInvoiceItem],
  );

  const onSelectConsumerPassHandler = React.useCallback(
    (newSelectedPrivateConsumerPassId: number) => {
      setRelatedInvoice(null);
      replaceRouter(
        `/f/members/${userId}/member/private-consumer-pass/${newSelectedPrivateConsumerPassId}/`,
      );
    },
    [replaceRouter, userId],
  );

  const onPageRequestHandler = React.useCallback(
    (page: number) => {
      setCurrentPage(page);
      replaceRouter(`/f/members/${userId}/member/private-consumer-pass/`);
    },
    [replaceRouter, userId],
  );

  React.useEffect(() => {
    if (filters) onPageRequestHandler(1);
  }, [onPageRequestHandler, filters]);

  const goToPassInCompany = React.useCallback(() => {
    if (
      selectedConsumerPass &&
      selectedPrivateConsumerPassId &&
      selectedConsumerPass.private_pass &&
      selectedConsumerPass.member &&
      selectedConsumerPass.private_pass.company
    ) {
      const companyId = selectedConsumerPass.private_pass.company;
      const memberId = selectedConsumerPass.member;
      openNewWindowToImpersonate(
        companyId,
        `/member/${memberId}/private-consumer-pass/${selectedPrivateConsumerPassId}`,
      );
    }
  }, [selectedPrivateConsumerPassId, selectedConsumerPass]);

  const goToInvoice = React.useCallback(() => {
    if (
      selectedConsumerPass &&
      relatedInvoice &&
      selectedConsumerPass.private_pass &&
      relatedInvoice.uuid &&
      selectedConsumerPass.private_pass.company
    ) {
      const companyId = selectedConsumerPass.private_pass.company;
      const invoiceUuid = relatedInvoice.uuid;
      openNewWindowToImpersonate(companyId, `/invoice/${invoiceUuid}/`);
    }
  }, [selectedConsumerPass, relatedInvoice]);

  const isAllowed = React.useCallback(
    (companyId: number) =>
      !allowedFranchiseeIds.length || allowedFranchiseeIds.includes(companyId),
    [allowedFranchiseeIds],
  );

  const getCompanyName = React.useCallback(
    (companyId: number) => {
      const selectedPassCompany = (companies as Company[]).filter(
        (company: Company) => company.id === companyId,
      )?.[0];
      return selectedPassCompany.name || '';
    },
    [companies],
  );

  const onFranchisePrivateConsumerPassRowItemClick = React.useCallback(
    (privateConsumerPassId: number) => () =>
      onSelectConsumerPassHandler(privateConsumerPassId),

    [onSelectConsumerPassHandler],
  );

  const privatePassesOptionsFormatter = React.useCallback(
    (privateConsumerPasses: FranchiseUserPrivatePass[]) =>
      (privateConsumerPasses ?? []).map((privateConsumerPass) => {
        return {
          label: privateConsumerPass.private_pass?.name,
          onClick: onFranchisePrivateConsumerPassRowItemClick(
            privateConsumerPass.id,
          ),
          privateConsumerPass,
          privatePass: privateConsumerPass.private_pass,
          selected: false,
          key: privateConsumerPass.id,
          value: privateConsumerPass.id,
        };
      }),
    [onFranchisePrivateConsumerPassRowItemClick],
  );

  React.useEffect(() => {
    fetchCompanyGroupList();
  }, [fetchCompanyGroupList]);

  React.useEffect(() => {
    if (selectedPrivateConsumerPassId) {
      fetchPrivateConsumerPass(selectedPrivateConsumerPassId, {
        onSuccess: () => {
          fetchInvoiceByInvoiceItemHandler(
            BUYABLE_ITEM_PRIVATE_PASS,
            selectedPrivateConsumerPassId,
          );
        },
      });
    }
  }, [
    selectedPrivateConsumerPassId,
    fetchInvoiceByInvoiceItemHandler,
    fetchPrivateConsumerPass,
  ]);

  return (
    <FranchiseMemberPageLayout
      leftChildren={
        <FranchiseMemberSectionLayout>
          <ObjectSearchComponent
            additionalParams={{
              page: currentPage,
              page_size: FRANCHISE_PRIVATE_CONSUMER_PASS_PAGE_DEFAULT_SIZE,
              ...filters,
            }}
            components={{
              Option,
            }}
            menuIsOpen={false}
            objectId={userId}
            optionsFormatter={privatePassesOptionsFormatter}
            placeholder={t('privateService:searshAppointmentPass')}
            searchedObjectType="franchise_user_private_pass"
            variant="underlined"
          />
          <Paper>
            <FranchiseConsumerPassFilters
              companies={companies as Company[]}
              companyGroups={companyGroups}
              emptyLabel={t('privateService:filters.empty')}
              filters={
                !getSelectorState('franchise_user_private_pass').loading &&
                filters
              }
              setFilters={setFilters}
            />
            <Divider />
            <PaginatedListBase
              additionalFilters={filters}
              itemPerPage={FRANCHISE_PRIVATE_CONSUMER_PASS_PAGE_DEFAULT_SIZE}
              items={
                getSelectorState('franchise_user_private_pass').results
                  .currentResults
              }
              listProps={{ disablePadding: true }}
              loading={getSelectorState('franchise_user_private_pass').loading}
              nbItems={
                getSelectorState('franchise_user_private_pass').results.count
              }
              onPageRequested={onPageRequestHandler}
              page={currentPage}
              renderItem={(privateConsumerPass: FranchiseUserPrivatePass) => (
                <FranchisePrivateConsumerPassRowItem
                  key={privateConsumerPass.id}
                  onClick={onFranchisePrivateConsumerPassRowItemClick(
                    privateConsumerPass.id,
                  )}
                  privateConsumerPass={privateConsumerPass}
                  privatePass={privateConsumerPass.private_pass}
                  selected={
                    selectedConsumerPass &&
                    selectedConsumerPass.id === privateConsumerPass.id
                  }
                />
              )}
            />
          </Paper>
        </FranchiseMemberSectionLayout>
      }
      rightChildren={
        <>
          {selectedPrivateConsumerPassId &&
            (getSelectorState('franchise_user_private_pass').loading ||
              consumerPassLoading ||
              invoiceLoading) && (
              <div className={classes.loadingContainer}>
                <CircularProgress />
              </div>
            )}
          {selectedConsumerPass?.private_pass && relatedInvoice && (
            <div>
              <Button
                className={classes.button}
                color="primary"
                disabled={!isAllowed(selectedConsumerPass.private_pass.company)}
                onClick={goToPassInCompany}
                startIcon={<ArrowForward />}
                variant="contained"
              >
                {t('franchise:userProfile.goToMemberProfile', {
                  purchasing_studio: getCompanyName(
                    selectedConsumerPass.private_pass.company,
                  ),
                })}
              </Button>
              <FranchiseMemberSectionLayout
                title={t('paymentPack:details.invoiceTitle')}
              >
                <Paper>
                  <InvoiceListItem
                    disabled={
                      !isAllowed(selectedConsumerPass.private_pass.company)
                    }
                    invoice={relatedInvoice}
                    onClick={goToInvoice}
                  />
                </Paper>
              </FranchiseMemberSectionLayout>
            </div>
          )}
        </>
      }
    />
  );
};

const useStyles = makeStyles((theme) => ({
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginBottom: theme.spacing(2),
  },
}));

const connector = connect(
  (state: RootState, props: ParamsProps & { relatedInvoice: string }) => ({
    selectedConsumerPass: getPrivateConsumerPass(
      state,
      props.selectedPrivateConsumerPassId,
    ),
    consumerPassLoading: state.privateService.privateConsumerPass.loading,
    companies: getFranchiseCompanies(state),
    companyGroups: getCompanyGroupList(state),
    invoiceLoading: state.invoice.loading,
    allowedFranchiseeIds: getAllowedFranchisees(state),
  }),
  {
    fetchCompanyGroupList: fetchCompanyGroupListAction,
    replaceRouter: replace,
    fetchPrivateConsumerPassList: fetchPrivateConsumerPassListAction,
    fetchPrivateConsumerPass: fetchPrivateConsumerPassAction,
    fetchInvoiceByInvoiceItem: fetchInvoiceByInvoiceItemAction,
  },
);

export default compose<Props, {}>(
  React.memo,
  routerParamsToProps({
    userId: 'userId:number',
    selectedPrivateConsumerPassId: 'selectedPrivateConsumerPassId:number',
  }),
  connector,
)(FranchiseMemberDetailPrivateConsumerPass);
