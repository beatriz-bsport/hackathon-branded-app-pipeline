import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { replace } from 'connected-react-router';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { BUYABLE_ITEM_PRIVATE_PASS } from '@bsport/common/lib/master-data/buyable-items';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ArrowForward from '@material-ui/icons/ArrowForward';
import CircularProgress from '@material-ui/core/CircularProgress';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import FranchiseMemberPageLayout from '#src/components/franchise/FranchiseMemberPageLayout.component';
import FranchiseMemberSectionLayout from '#src/components/franchise/FranchiseMemberSectionLayout.component';
import FranchiseConsumerPackRowItem from '#src/libs/consumer-payment-pack/components/FranchiseConsumerPackRowItem.component';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';
import InvoiceListItem from '#src/libs/invoice/InvoiceListItem.component';
import { FRANCHISE_CONSUMER_PAYMENT_PACK_PAGE_DEFAULT_SIZE } from '#src/libs/franchise/constants';
import type { RootState } from '#src/reducers';
import {
  getConsumerPack,
  withPaymentPack,
} from '#src/libs/consumer-payment-pack/selectors';
import { fetchCompanyGroupList as fetchCompanyGroupListAction } from '#src/libs/franchise/actions';
import {
  getAllowedFranchisees,
  getCompanyGroupList,
  getFranchiseCompanies,
} from '#src/libs/franchise/selectors';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#src/libs/payment-packs/actions';
import { getInvoice } from '#src/libs/invoice/selectors';
import type {
  FranchiseUserPass,
  FranchisePassFilters,
  CompanyGroup,
} from '#src/libs/franchise/types';
import type { OptionCallback, ThunkAction } from '#src/state/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import FranchiseConsumerPassFilters from '#src/libs/franchise/components/FranchiseConsumerPassFilters.component';
import type { Invoice, InvoiceV1Serializer } from '#src/libs/invoice/types';
import {
  fetchSpecificInvoice,
  fetchByInvoiceItem as fetchInvoiceByInvoiceItemAction,
} from '#src/libs/invoice/actions';
import type { Company } from '#src/libs/company/types';
import type { ConsumerPaymentPack } from '#src/libs/consumer-payment-pack/types';
import { fetchConsumerPack as fetchConsumerPackAction } from '#src/libs/consumer-payment-pack/actions';
import { openNewWindowToImpersonate } from '#src/utils/windows';
import type { WithHandlerType } from '#src/utils/types';
import { useObjectSearch } from '#src/libs/fuzzy-search/hooks/useObjectSearch';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';
import { getPaymentPackById } from '#src/libs/payment-packs/selectors';

type ParamsProps = {
  userId: number;
  selectedConsumerPaymentPackId?: number;
};

export type ConnectorProps = {
  selectedConsumerPass?: ConsumerPaymentPack<PaymentPack>;
  consumerPackInvoice: Invoice;
  companies: Company[];
  companyGroups: CompanyGroup[];
  invoiceLoading: boolean;
  consumerPackLoading: boolean;
  allowedFranchiseeIds: number[];
  paymentPackById: PaymentPack[];
  fetchCompanyGroupList: (
    company?: number,
    options?: OptionCallback<CompanyGroup[]>,
  ) => Promise<void>;
  fetchInvoice: (
    uuid: string,
    options?: OptionCallback<InvoiceV1Serializer>,
  ) => void;
  fetchInvoiceByInvoiceItem: (
    buyable_item_identifier: number,
    object_id: number,
    options?: OptionCallback<InvoiceV1Serializer>,
  ) => Promise<void>;
  fetchPaymentPackBulk: (
    ids: Array<number>,
    options?: OptionCallback<PaymentPack[]>,
  ) => ThunkAction;
  replaceRouter: (url: string) => void;
  fetchConsumerPack: (
    id: number,
    options: OptionCallback<ConsumerPaymentPack>,
  ) => Promise<void>;
};

export type StateProps = {
  relatedInvoice: string | null;
  setRelatedInvoice: (invoiceId: string | null) => void;
};

type ConnectorAndOwnProps = ParamsProps & ConnectorProps;

type ConnectorOwnAndStateProps = ConnectorAndOwnProps & StateProps;

type Props = ConnectorOwnAndStateProps &
  WithHandlerType<typeof mapWithHandlers>;

type FranchiseUserPassOption = {
  label: string;
  onClick: () => void;
  consumerPack: FranchiseUserPass;
  paymentPack: PaymentPack;
  selected: boolean;
};

const Option: React.FC<OptionPropsWithData<FranchiseUserPassOption>> = (
  props,
) => <FranchiseConsumerPackRowItem {...props.data} />;

const FranchiseMemberDetailPass: React.FC<Props> = ({
  userId,
  selectedConsumerPaymentPackId,
  selectedConsumerPass,
  consumerPackInvoice,
  companies,
  companyGroups,
  invoiceLoading,
  consumerPackLoading,
  allowedFranchiseeIds,
  paymentPackById,
  replaceRouter,
  fetchCompanyGroupList,
  fetchInvoice,
  fetchInvoiceByInvoiceItem,
  onSelectConsumerPass,
  fetchPaymentPackBulk,
  fetchConsumerPack,
}) => {
  const { t } = useTranslation(['franchise', 'paymentPack']);
  const classes = useStyles();
  const { getSelectorState } = useObjectSearch();

  const selectorState = getSelectorState('franchise_user_payment_pack');

  React.useEffect(() => {
    fetchCompanyGroupList();
  }, [fetchCompanyGroupList]);

  React.useEffect(() => {
    selectorState?.results?.currentResults &&
      fetchPaymentPackBulk(
        selectorState.results.currentResults
          .map((consumerPaymentPack) => consumerPaymentPack.payment_pack)
          .asMutable(),
      );
  }, [fetchPaymentPackBulk, selectorState]);

  React.useEffect(() => {
    if (selectedConsumerPaymentPackId) {
      fetchConsumerPack(selectedConsumerPaymentPackId, {
        onSuccess: (pass: ConsumerPaymentPack) => {
          if (pass.invoice) {
            fetchInvoice(pass.invoice);
          } else if (
            pass.linked_private_consumer_pass &&
            !pass.is_universal_consumer_pass_source
          ) {
            fetchInvoiceByInvoiceItem(
              BUYABLE_ITEM_PRIVATE_PASS,
              pass.linked_private_consumer_pass,
            );
          }
        },
      });
    }
  }, [
    selectedConsumerPaymentPackId,
    fetchInvoice,
    fetchInvoiceByInvoiceItem,
    fetchConsumerPack,
  ]);

  const [filters, setFilters] = React.useState<FranchisePassFilters>({
    reverted: false,
    is_valid_today: true,
  });
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const onPageRequestHandler = React.useCallback(
    (page: number) => {
      setCurrentPage(page);
      replaceRouter(`/f/members/${userId}/member/pass/`);
    },
    [replaceRouter, userId],
  );

  const goToPassInCompany = React.useCallback(() => {
    if (
      selectedConsumerPass &&
      selectedConsumerPaymentPackId &&
      selectedConsumerPass.payment_pack &&
      selectedConsumerPass.member_id &&
      selectedConsumerPass.payment_pack.company
    ) {
      const companyId = selectedConsumerPass.payment_pack.company;
      const memberId = selectedConsumerPass.member_id;
      openNewWindowToImpersonate(
        companyId,
        `/member/${memberId}/pass/${selectedConsumerPaymentPackId}`,
      );
    }
  }, [selectedConsumerPass, selectedConsumerPaymentPackId]);

  const goToInvoice = React.useCallback(() => {
    if (
      selectedConsumerPass &&
      consumerPackInvoice &&
      selectedConsumerPass.payment_pack &&
      consumerPackInvoice.uuid &&
      selectedConsumerPass.payment_pack.company
    ) {
      const companyId = selectedConsumerPass.payment_pack.company;
      const invoiceUuid = consumerPackInvoice.uuid;
      openNewWindowToImpersonate(companyId, `/invoice/${invoiceUuid}/`);
    }
  }, [selectedConsumerPass, consumerPackInvoice]);

  const isAllowed = React.useCallback(
    (companyId: number) =>
      !allowedFranchiseeIds.length || allowedFranchiseeIds.includes(companyId),
    [allowedFranchiseeIds],
  );

  const getCompanyName = React.useCallback(
    (companyId: number) => {
      const selectedPassCompany = companies.filter(
        (company) => company.id === companyId,
      )?.[0];
      return selectedPassCompany.name || '';
    },
    [companies],
  );

  const onFranchiseConsumerPackRowItemClick = React.useCallback(
    (consumerPaymentPackId: number) => () =>
      onSelectConsumerPass(userId, consumerPaymentPackId),
    [onSelectConsumerPass, userId],
  );

  const passesOptionsFormatter = React.useCallback(
    (consumerPaymentPacks: FranchiseUserPass[]) =>
      (consumerPaymentPacks ?? []).map((consumerPaymentPack) => {
        return {
          label: consumerPaymentPack.payment_pack_name,
          onClick: onFranchiseConsumerPackRowItemClick(consumerPaymentPack.id),
          consumerPaymentPack,
          paymentPack: paymentPackById[consumerPaymentPack.payment_pack],
          selected: false,
          key: consumerPaymentPack.id,
          value: consumerPaymentPack.id,
        };
      }),
    [onFranchiseConsumerPackRowItemClick, paymentPackById],
  );

  return (
    <FranchiseMemberPageLayout
      leftChildren={
        <FranchiseMemberSectionLayout>
          <ObjectSearchComponent
            additionalParams={{
              page: currentPage,
              page_size: FRANCHISE_CONSUMER_PAYMENT_PACK_PAGE_DEFAULT_SIZE,
              ...filters,
            }}
            components={{
              Option,
            }}
            menuIsOpen={false}
            objectId={userId}
            optionsFormatter={passesOptionsFormatter}
            placeholder={t('paymentPack:search')}
            searchedObjectType="franchise_user_payment_pack"
            variant="underlined"
          />
          <Paper>
            <FranchiseConsumerPassFilters
              companies={companies}
              companyGroups={companyGroups}
              emptyLabel={t('paymentPack:filters.all')}
              filters={!selectorState.loading && filters}
              setFilters={setFilters}
            />
            <Divider />
            <PaginatedListBase
              additionalFilters={filters}
              itemPerPage={FRANCHISE_CONSUMER_PAYMENT_PACK_PAGE_DEFAULT_SIZE}
              items={selectorState.results.currentResults}
              listProps={{ disablePadding: true }}
              loading={selectorState.loading}
              nbItems={selectorState.results.count}
              onPageRequested={onPageRequestHandler}
              page={currentPage}
              renderItem={(consumerPaymentPack: FranchiseUserPass) => (
                <FranchiseConsumerPackRowItem
                  key={consumerPaymentPack.id}
                  consumerPack={consumerPaymentPack}
                  onClick={onFranchiseConsumerPackRowItemClick(
                    consumerPaymentPack.id,
                  )}
                  paymentPack={
                    paymentPackById[consumerPaymentPack.payment_pack]
                  }
                  selected={
                    selectedConsumerPass &&
                    selectedConsumerPass.id === consumerPaymentPack.id
                  }
                />
              )}
            />
          </Paper>
        </FranchiseMemberSectionLayout>
      }
      rightChildren={
        <>
          {selectedConsumerPaymentPackId &&
            (selectorState.loading ||
              consumerPackLoading ||
              invoiceLoading) && (
              <div className={classes.loadingContainer}>
                <CircularProgress />
              </div>
            )}
          {selectedConsumerPass?.payment_pack && consumerPackInvoice && (
            <div>
              <Button
                className={classes.button}
                color="primary"
                disabled={!isAllowed(selectedConsumerPass.payment_pack.company)}
                onClick={goToPassInCompany}
                startIcon={<ArrowForward />}
                variant="contained"
              >
                {t('userProfile.goToMemberProfile', {
                  purchasing_studio: getCompanyName(
                    selectedConsumerPass.payment_pack.company,
                  ),
                })}
              </Button>
              <FranchiseMemberSectionLayout
                title={t('paymentPack:details.invoiceTitle')}
              >
                <Paper>
                  <InvoiceListItem
                    disabled={
                      !isAllowed(selectedConsumerPass.payment_pack.company)
                    }
                    invoice={consumerPackInvoice}
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
    // @ts-expect-error
    selectedConsumerPass: withPaymentPack(getConsumerPack)(
      state,
      // @ts-expect-error
      props.selectedConsumerPaymentPackId,
    ),
    consumerPackLoading: state.consumerPaymentPack.loading,
    consumerPackInvoice: getInvoice(state, props.relatedInvoice),
    companies: getFranchiseCompanies(state),
    companyGroups: getCompanyGroupList(state),
    invoiceLoading: state.invoice.loading,
    allowedFranchiseeIds: getAllowedFranchisees(state),
    paymentPackById: getPaymentPackById(state),
  }),
  {
    fetchCompanyGroupList: fetchCompanyGroupListAction,
    fetchPaymentPackBulk: fetchPaymentPackBulkAction,
    replaceRouter: replace,
    fetchConsumerPack: fetchConsumerPackAction,
    fetchInvoice: fetchSpecificInvoice,
    fetchInvoiceByInvoiceItem: fetchInvoiceByInvoiceItemAction,
  },
);

const mapWithHandlers = {
  onSelectConsumerPass:
    ({ replaceRouter, setRelatedInvoice }: ConnectorOwnAndStateProps) =>
    (userId: number, newSelectedConsumerPaymentPackId: number) => {
      setRelatedInvoice(null);
      replaceRouter(
        `/f/members/${userId}/member/pass/${newSelectedConsumerPaymentPackId}/`,
      );
    },
  fetchInvoice:
    ({ fetchInvoice, setRelatedInvoice }: ConnectorOwnAndStateProps) =>
    (uuid: string) => {
      setRelatedInvoice(null);
      fetchInvoice(uuid, {
        onSuccess: (invoice: Invoice) => setRelatedInvoice(invoice.uuid),
      });
    },
  fetchInvoiceByInvoiceItem:
    ({
      fetchInvoiceByInvoiceItem,
      setRelatedInvoice,
    }: ConnectorOwnAndStateProps) =>
    (
      buyableId: number,
      objectId: number,
      options: OptionCallback<InvoiceV1Serializer>,
    ) => {
      fetchInvoiceByInvoiceItem(buyableId, objectId, {
        onSuccess: (invoice: InvoiceV1Serializer) => {
          setRelatedInvoice(invoice.uuid);
          options?.onSuccess?.(invoice);
        },
        onError: (err: Error | null) => {
          options?.onError?.(err);
        },
      });
    },
};

export default compose<Props, {}>(
  React.memo,
  routerParamsToProps({
    userId: 'userId:number',
    selectedConsumerPaymentPackId: 'selectedConsumerPaymentPackId:number',
  }),
  withState('relatedInvoice', 'setRelatedInvoice', null),
  connector,
  withHandlers(mapWithHandlers),
)(FranchiseMemberDetailPass);
