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
import type { RootState } from '../../reducers';
import {
  getConsumerPack,
  withPaymentPack,
} from '#src/libs/consumer-payment-pack/selectors';
import {
  fetchFranchiseUserPasses as fetchFranchiseUserPassesAction,
  fetchCompanyGroupList as fetchCompanyGroupListAction,
} from '#src/libs/franchise/actions';
import {
  getAllowedFranchisees,
  getCompanyGroupList,
  getFranchiseCompanies,
  getFranchiseUserPassesList,
} from '#src/libs/franchise/selectors';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#src/libs/payment-packs/actions';
import { getInvoice } from '#src/libs/invoice/selectors';
import type {
  FranchiseUserPass,
  FranchiseUserPassesQueryParams,
  FranchisePassFilters,
  CompanyGroup,
  FranchiseUserPassWithPaymentPack,
} from '#src/libs/franchise/types';
import type {
  OptionCallback,
  PaginatedResponse,
  ThunkAction,
} from '#src/state/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import FranchiseConsumerPassFilters from '#src/libs/franchise/components/FranchiseConsumerPassFilters.component';
import type { Invoice, InvoiceV1Serializer } from '#src/libs/invoice/types';
import {
  fetchSpecificInvoice,
  fetchByInvoiceItem as fetchInvoiceByInvoiceItemAction,
} from '#src/libs/invoice/actions';
import type { Company } from '#src/libs/company/types';
import type { ConsumerPaymentPack } from '#src/libs/consumer-payment-pack/types';
import {
  retrieveConsumerPackBulk as retrieveConsumerPackBulkAction,
  fetchConsumerPack as fetchConsumerPackAction,
} from '#src/libs/consumer-payment-pack/actions';
// @ts-expect-error
import { navigateAsCompanyAdmin as navigateAsCompanyAdminAction } from '../../actions/auth.actions';
import type { WithHandlerType } from '#src/utils/types';

type ParamsProps = {
  userId: number;
  selectedConsumerPaymentPackId?: number;
};

export type ConnectorProps = {
  userPacks: FranchiseUserPassWithPaymentPack[];
  userPackCurrentPage: number;
  userPackLoading: boolean;
  userPackCount: number;
  selectedConsumerPass?: ConsumerPaymentPack<PaymentPack>;
  consumerPackInvoice: Invoice;
  companies: Company[];
  companyGroups: CompanyGroup[];
  invoiceLoading: boolean;
  consumerPackLoading: boolean;
  allowedFranchiseeIds: number[];
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
  fetchFranchiseUserPasses: (
    params: FranchiseUserPassesQueryParams,
    options?: OptionCallback<PaginatedResponse<FranchiseUserPass>>,
  ) => Promise<void>;
  fetchPaymentPackBulk: (
    ids: Array<number>,
    options?: OptionCallback<PaymentPack[]>,
  ) => ThunkAction;
  replaceRouter: (url: string) => void;
  retrieveConsumerPackBulk: (
    consumerPaymentPacks: number[],
    opt: OptionCallback<ConsumerPaymentPack[]>,
  ) => Promise<void>;
  fetchConsumerPack: (
    id: number,
    options: OptionCallback<ConsumerPaymentPack>,
  ) => Promise<void>;
  navigateAsCompanyAdmin: (
    companyId: number,
    url?: string,
    options?: OptionCallback,
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

const FranchiseMemberDetailPass: React.FC<Props> = ({
  userId,
  userPacks,
  userPackLoading,
  userPackCount,
  userPackCurrentPage,
  selectedConsumerPaymentPackId,
  selectedConsumerPass,
  consumerPackInvoice,
  companies,
  companyGroups,
  invoiceLoading,
  consumerPackLoading,
  allowedFranchiseeIds,
  replaceRouter,
  fetchCompanyGroupList,
  fetchInvoice,
  fetchInvoiceByInvoiceItem,
  onSelectConsumerPass,
  fetchFranchiseUserPasses,
  fetchPaymentPackBulk,
  fetchConsumerPack,
  navigateAsCompanyAdmin,
}) => {
  const { t } = useTranslation(['franchise', 'paymentPack']);
  const classes = useStyles();

  React.useEffect(() => {
    fetchCompanyGroupList();
  }, [fetchCompanyGroupList]);

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
  const [isRedirectLoading, setIsRedirectLoading] =
    React.useState<boolean>(false);

  const fetchConsumerPackList = React.useCallback(
    (page: number) => {
      replaceRouter(`/f/members/${userId}/member/pass/`);
      fetchFranchiseUserPasses(
        { user_id: userId, page, filters },
        {
          onSuccess: (
            consumerPaymentPackList: PaginatedResponse<FranchiseUserPass>,
          ) => {
            fetchPaymentPackBulk(
              consumerPaymentPackList.results.map(
                (consumerPaymentPack) => consumerPaymentPack.payment_pack,
              ),
            );
          },
        },
      );
    },
    [
      fetchFranchiseUserPasses,
      fetchPaymentPackBulk,
      filters,
      replaceRouter,
      userId,
    ],
  );

  const goToPassInCompany = React.useCallback(() => {
    setIsRedirectLoading(true);
    selectedConsumerPass?.payment_pack?.company &&
      selectedConsumerPass?.member_id &&
      selectedConsumerPaymentPackId &&
      navigateAsCompanyAdmin(
        selectedConsumerPass.payment_pack.company,
        `/member/${selectedConsumerPass.member_id}/pass/${selectedConsumerPaymentPackId}`,
        {
          onSuccess: () => {
            setIsRedirectLoading(false);
          },
          onError: () => {
            setIsRedirectLoading(false);
          },
        },
      );
  }, [
    selectedConsumerPaymentPackId,
    navigateAsCompanyAdmin,
    selectedConsumerPass?.member_id,
    selectedConsumerPass?.payment_pack?.company,
  ]);

  const goToInvoice = React.useCallback(() => {
    selectedConsumerPass?.payment_pack.company &&
      consumerPackInvoice?.uuid &&
      navigateAsCompanyAdmin(
        selectedConsumerPass.payment_pack.company,
        `/invoice/${consumerPackInvoice.uuid}/`,
      );
  }, [
    consumerPackInvoice?.uuid,
    navigateAsCompanyAdmin,
    selectedConsumerPass?.payment_pack.company,
  ]);

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

  return (
    <FranchiseMemberPageLayout
      leftChildren={
        <FranchiseMemberSectionLayout>
          <Paper>
            <FranchiseConsumerPassFilters
              companies={companies}
              companyGroups={companyGroups}
              emptyLabel={t('paymentPack:filters.all')}
              filters={!userPackLoading && filters}
              setFilters={setFilters}
            />
            <Divider />
            <PaginatedListBase
              additionalFilters={filters}
              itemPerPage={FRANCHISE_CONSUMER_PAYMENT_PACK_PAGE_DEFAULT_SIZE}
              items={userPacks}
              listProps={{ disablePadding: true }}
              loading={userPackLoading}
              nbItems={userPackCount}
              onPageRequested={fetchConsumerPackList}
              page={userPackCurrentPage}
              renderItem={(
                consumerPaymentPack: FranchiseUserPassWithPaymentPack,
              ) => (
                <FranchiseConsumerPackRowItem
                  key={consumerPaymentPack.id}
                  consumerPack={consumerPaymentPack}
                  onClick={onFranchiseConsumerPackRowItemClick(
                    consumerPaymentPack.id,
                  )}
                  paymentPack={consumerPaymentPack.payment_pack}
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
            (userPackLoading || consumerPackLoading || invoiceLoading) && (
              <div className={classes.loadingContainer}>
                <CircularProgress />
              </div>
            )}
          {selectedConsumerPass?.payment_pack && consumerPackInvoice && (
            <div>
              <Button
                className={classes.button}
                color="primary"
                disabled={
                  isRedirectLoading ||
                  !isAllowed(selectedConsumerPass.payment_pack.company)
                }
                onClick={goToPassInCompany}
                startIcon={<ArrowForward />}
                variant="contained"
              >
                {isRedirectLoading && (
                  <CircularProgress
                    color="inherit"
                    size={24}
                    style={{ marginRight: 8 }}
                  />
                )}
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
    userPacks: withPaymentPack(getFranchiseUserPassesList)(state),
    userPackCurrentPage: state.franchise.userProfile.passes.page,
    userPackCount: state.franchise.userProfile.passes.count,
    userPackLoading: state.franchise.userProfile.passes.loading,
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
  }),
  {
    fetchCompanyGroupList: fetchCompanyGroupListAction,
    fetchFranchiseUserPasses: fetchFranchiseUserPassesAction,
    fetchPaymentPackBulk: fetchPaymentPackBulkAction,
    replaceRouter: replace,
    retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
    fetchConsumerPack: fetchConsumerPackAction,
    fetchInvoice: fetchSpecificInvoice,
    fetchInvoiceByInvoiceItem: fetchInvoiceByInvoiceItemAction,
    navigateAsCompanyAdmin: navigateAsCompanyAdminAction,
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
