import React, { useEffect, useState, useCallback } from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push as pushAction } from 'connected-react-router';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowForward from '@material-ui/icons/ArrowForward';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import type { RootState } from '#src/reducers';
import type { SharedConsumerGiftcard } from '#src/libs/franchise/types';
import type {
  WithSender,
  WithReceiver,
  WithGiftcard,
} from '#src/libs/giftcard/types';

import { fetchMemberBulkById as fetchMemberBulkByIdAction } from '#src/libs/member/actions';
import { fetchSpecificInvoice as fetchSpecificInvoiceAction } from '#src/libs/invoice/actions';
import {
  fetchReceivedSharedConsumerGiftcards as fetchReceivedSharedConsumerGiftcardsAction,
  fetchSentSharedConsumerGiftcards as fetchSentSharedConsumerGiftcardsAction,
  fetchFranchise as fetchFranchiseAction,
} from '#src/libs/franchise/actions';
// @ts-expect-error
import { navigateAsCompanyAdmin as navigateAsCompanyAdminAction } from '#src/actions/auth.actions';
import { fetchGiftcardBulk as fetchGiftcardBulkAction } from '#src/libs/giftcard/actions';

import {
  withGiftcard,
  withSender,
  withReceiver,
} from '#src/libs/giftcard/selectors';
import {
  getReceivedSharedConsumerGiftcardList,
  getSentSharedConsumerGiftcardList,
  getReceivedSharedConsumerGiftcardsAllIds,
  getAllDistinctGiftcardIds,
  getAllDistinctMemberIds,
  getSharedConsumerGiftcardById,
  getFranchiseCompanyById,
  getAllowedFranchisees,
} from '#src/libs/franchise/selectors';

import { getInvoiceData } from '#src/libs/invoice/selectors';

import ConsumerGiftcardListItem from '#src/libs/giftcard/components/ConsumerGiftcardListItem.component';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';
import ConsumerGiftcardDetail from '#src/libs/giftcard/components/ConsumerGiftcardDetail.component';

type Params = {
  userId: number;
  selectedConsumerGiftcardId?: number | null;
};

type Props = Params & ConnectedProps<typeof connector>;

const PAGE_SIZE = 15;

const FranchiseMemberDetailGiftcard: React.FC<Props> = ({
  userId,
  selectedConsumerGiftcardId,
  sentState,
  receivedState,
  allDistinctGiftcardIds,
  allDistinctMemberIds,
  selectedConsumerGiftcard,
  companiesById,
  navigateAsCompanyAdmin,
  invoiceData,
  allowedCompanyIds,
  push,
  fetchFranchise,
  fetchSentSharedConsumerGiftcards,
  fetchReceivedSharedConsumerGiftcards,
  fetchGiftcardBulk,
  fetchMemberBulkById,
  fetchSpecificInvoice,
}) => {
  const { t } = useTranslation(['giftcard', 'franchise']);
  const classes = useStyles();

  const [isRedirectLoading, setIsRedirectLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedConsumerGiftcard?.invoice_id) {
      fetchSpecificInvoice(selectedConsumerGiftcard?.invoice_id);
    }
  }, [selectedConsumerGiftcard?.invoice_id, fetchSpecificInvoice]);

  useEffect(() => {
    if (userId) fetchFranchise();
  }, [userId, fetchFranchise]);

  useEffect(() => {
    fetchGiftcardBulk(allDistinctGiftcardIds.asMutable());
  }, [fetchGiftcardBulk, allDistinctGiftcardIds]);

  useEffect(() => {
    fetchMemberBulkById(allDistinctMemberIds.asMutable());
  }, [fetchMemberBulkById, allDistinctMemberIds]);

  const showSharedConsumerGiftcard = useCallback(
    (newSelectedConsumerGiftcardId: number, memberUserId: number) => {
      push(
        `/f/members/${memberUserId}/member/giftcard/${newSelectedConsumerGiftcardId}/`,
      );
    },
    [push],
  );

  const goToMemberGiftcardList = useCallback(() => {
    setIsRedirectLoading(true);
    const companyId = selectedConsumerGiftcard?.giftcard?.company;
    const memberId = receivedState.sharedConsumerGiftcardAllIds.includes(
      selectedConsumerGiftcardId,
    )
      ? selectedConsumerGiftcard?.dst_member
      : selectedConsumerGiftcard?.src_member;
    navigateAsCompanyAdmin(companyId, `/member/${memberId}/giftcard`, {
      onSuccess: () => {
        setIsRedirectLoading(false);
      },
      onError: () => {
        setIsRedirectLoading(false);
      },
    });
  }, [
    navigateAsCompanyAdmin,
    selectedConsumerGiftcard,
    receivedState,
    selectedConsumerGiftcardId,
  ]);

  const goToGiftcardHandler = useCallback(
    (giftcardId: number) => {
      const companyId = selectedConsumerGiftcard?.giftcard?.company;
      navigateAsCompanyAdmin(companyId, `/giftcard/${giftcardId}`);
    },
    [navigateAsCompanyAdmin, selectedConsumerGiftcard],
  );

  const goToInvoiceHandler = useCallback(
    (uuid: string) => {
      const companyId = selectedConsumerGiftcard?.giftcard?.company;
      navigateAsCompanyAdmin(companyId, `/invoice/${uuid}`);
    },
    [navigateAsCompanyAdmin, selectedConsumerGiftcard],
  );

  const fetchReceivedSharedConsumerGiftcardsOnPageRequest = useCallback(
    (page?: number, page_size?: number) => {
      fetchReceivedSharedConsumerGiftcards(userId, {
        page,
        page_size,
        current_item_id: selectedConsumerGiftcardId,
      });
    },
    [fetchReceivedSharedConsumerGiftcards, userId, selectedConsumerGiftcardId],
  );

  const fetchSentSharedConsumerGiftcardsOnPageRequest = useCallback(
    (page?: number, page_size?: number) => {
      fetchSentSharedConsumerGiftcards(userId, {
        page,
        page_size,
        current_item_id: selectedConsumerGiftcardId,
      });
    },
    [fetchSentSharedConsumerGiftcards, userId, selectedConsumerGiftcardId],
  );

  useEffect(() => {
    fetchReceivedSharedConsumerGiftcardsOnPageRequest();
    fetchSentSharedConsumerGiftcardsOnPageRequest();
  }, [
    userId,
    fetchReceivedSharedConsumerGiftcardsOnPageRequest,
    fetchSentSharedConsumerGiftcardsOnPageRequest,
  ]);

  const isAllowed = React.useCallback(
    (companyId: number) =>
      !allowedCompanyIds.length || allowedCompanyIds.includes(companyId),
    [allowedCompanyIds],
  );

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={6} sm={12}>
          <Typography variant="h5">
            {t('giftcard:consumerGiftcard.list.myPurchases')}
          </Typography>
          <Paper className={classes.listConsumerGiftcard}>
            <PaginatedListBase
              itemPerPage={PAGE_SIZE}
              items={sentState.sharedConsumerGiftcardList}
              listProps={{
                disablePadding: 'true',
                dense: 'true',
              }}
              loading={sentState.sharedConsumerGiftcardLoading}
              nbItems={sentState.sharedConsumerGiftcardCount}
              onPageRequested={fetchSentSharedConsumerGiftcardsOnPageRequest}
              page={sentState.sharedConsumerGiftcardPage}
              renderCustomPageFirst={!!selectedConsumerGiftcardId}
              renderEmpty={() => (
                <div className={classes.emptyContainer}>
                  <Typography color="textSecondary" variant="caption">
                    {t('giftcard:consumerGiftcard.isEmpty')}
                  </Typography>
                  <Divider />
                </div>
              )}
              renderItem={(
                sharedConsumerGiftcard: WithGiftcard<
                  WithSender<WithReceiver<SharedConsumerGiftcard>>
                >,
              ) => (
                <ConsumerGiftcardListItem
                  key={sharedConsumerGiftcard.id}
                  divider
                  showReceiver
                  consumerGiftcard={sharedConsumerGiftcard}
                  giftcard={sharedConsumerGiftcard.giftcard}
                  memberReceiver={sharedConsumerGiftcard.dst_member}
                  memberSender={sharedConsumerGiftcard.src_member}
                  onClickReceiver={
                    sharedConsumerGiftcard.dst_member &&
                    showSharedConsumerGiftcard
                  }
                  onClickSender={showSharedConsumerGiftcard}
                  selected={
                    sharedConsumerGiftcard.id === selectedConsumerGiftcardId
                  }
                  sourceFranchiseCompany={
                    companiesById[sharedConsumerGiftcard?.giftcard?.company]
                  }
                />
              )}
            />
          </Paper>
          <Typography variant="h5">
            {t('giftcard:consumerGiftcard.list.myGifted')}
          </Typography>
          <Paper className={classes.listConsumerGiftcard}>
            <PaginatedListBase
              itemPerPage={PAGE_SIZE}
              items={receivedState.sharedConsumerGiftcardList}
              listProps={{
                disablePadding: 'true',
                dense: 'true',
              }}
              loading={receivedState.sharedConsumerGiftcardLoading}
              nbItems={receivedState.sharedConsumerGiftcardCount}
              onPageRequested={
                fetchReceivedSharedConsumerGiftcardsOnPageRequest
              }
              page={receivedState.sharedConsumerGiftcardPage}
              renderCustomPageFirst={!!selectedConsumerGiftcardId}
              renderEmpty={() => (
                <div className={classes.emptyContainer}>
                  <Typography color="textSecondary" variant="caption">
                    {t('giftcard:consumerGiftcard.isEmpty')}
                  </Typography>
                  <Divider />
                </div>
              )}
              renderItem={(
                sharedConsumerGiftcard: WithGiftcard<
                  WithSender<WithReceiver<SharedConsumerGiftcard>>
                >,
              ) => (
                <ConsumerGiftcardListItem
                  key={sharedConsumerGiftcard.id}
                  divider
                  showAsRecipient
                  showSender
                  consumerGiftcard={sharedConsumerGiftcard}
                  giftcard={sharedConsumerGiftcard.giftcard}
                  memberReceiver={sharedConsumerGiftcard.dst_member}
                  memberSender={sharedConsumerGiftcard.src_member}
                  onClickReceiver={showSharedConsumerGiftcard}
                  onClickSender={showSharedConsumerGiftcard}
                  selected={
                    sharedConsumerGiftcard.id === selectedConsumerGiftcardId
                  }
                  sourceFranchiseCompany={
                    companiesById[sharedConsumerGiftcard?.giftcard?.company]
                  }
                />
              )}
            />
          </Paper>
        </Grid>
        <Grid item md={6} sm={12}>
          {selectedConsumerGiftcardId && (
            <>
              <Button
                className={classes.button}
                color="primary"
                disabled={
                  isRedirectLoading ||
                  !isAllowed(selectedConsumerGiftcard?.giftcard?.company)
                }
                onClick={goToMemberGiftcardList}
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
                {t('franchise:companies.manageOnStudio', {
                  studio_name:
                    companiesById[selectedConsumerGiftcard?.giftcard?.company]
                      ?.name,
                })}
              </Button>
              <ConsumerGiftcardDetail
                consumerGiftcard={selectedConsumerGiftcard}
                consumerGiftCardLoading={isRedirectLoading}
                disabled={
                  !isAllowed(selectedConsumerGiftcard?.giftcard?.company)
                }
                goToGiftcard={goToGiftcardHandler}
                invoice={invoiceData[selectedConsumerGiftcard?.invoice_id]}
                onInvoiceClick={goToInvoiceHandler}
              />
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  emptyContainer: {
    padding: theme.spacing(2),
  },
  listConsumerGiftcard: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
}));

const mapStateToProps = (
  state: RootState,
  {
    selectedConsumerGiftcardId,
  }: {
    selectedConsumerGiftcardId: number;
  },
) => ({
  sentState: {
    sharedConsumerGiftcardCount:
      state.franchise.userProfile.sharedConsumerGiftcards.asSender.count,
    sharedConsumerGiftcardLoading:
      state.franchise.userProfile.sharedConsumerGiftcards.asSender.loading,
    sharedConsumerGiftcardPage:
      state.franchise.userProfile.sharedConsumerGiftcards.asSender.page,
    sharedConsumerGiftcardList: withGiftcard(
      withSender(withReceiver(getSentSharedConsumerGiftcardList)),
    )(state),
  },
  receivedState: {
    sharedConsumerGiftcardCount:
      state.franchise.userProfile.sharedConsumerGiftcards.asReceiver.count,
    sharedConsumerGiftcardLoading:
      state.franchise.userProfile.sharedConsumerGiftcards.asReceiver.loading,
    sharedConsumerGiftcardPage:
      state.franchise.userProfile.sharedConsumerGiftcards.asReceiver.page,
    sharedConsumerGiftcardList: withGiftcard(
      withSender(withReceiver(getReceivedSharedConsumerGiftcardList)),
    )(state),
    sharedConsumerGiftcardAllIds:
      getReceivedSharedConsumerGiftcardsAllIds(state),
  },
  allDistinctGiftcardIds: getAllDistinctGiftcardIds(state),
  allDistinctMemberIds: getAllDistinctMemberIds(state),
  selectedConsumerGiftcard: selectedConsumerGiftcardId
    ? withGiftcard(getSharedConsumerGiftcardById)(
        state,
        // @ts-expect-error
        selectedConsumerGiftcardId,
      )
    : null,
  companiesById: getFranchiseCompanyById(state),
  invoiceData: getInvoiceData(state),
  allowedCompanyIds: getAllowedFranchisees(state),
});
const mapDispatchToProps = {
  fetchFranchise: fetchFranchiseAction,
  fetchGiftcardBulk: fetchGiftcardBulkAction,
  fetchMemberBulkById: fetchMemberBulkByIdAction,
  fetchReceivedSharedConsumerGiftcards:
    fetchReceivedSharedConsumerGiftcardsAction,
  fetchSentSharedConsumerGiftcards: fetchSentSharedConsumerGiftcardsAction,
  fetchSpecificInvoice: fetchSpecificInvoiceAction,
  push: pushAction,
  navigateAsCompanyAdmin: navigateAsCompanyAdminAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<any, Params>(
  routerParamsToProps({
    userId: 'userId:number',
    selectedConsumerGiftcardId: 'selectedConsumerGiftcardId:number',
  }),
  connector,
)(FranchiseMemberDetailGiftcard);
