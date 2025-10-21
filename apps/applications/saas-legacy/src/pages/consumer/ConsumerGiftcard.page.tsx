import React, { useCallback, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import { push } from 'connected-react-router';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';

import { withTranslation, WithTranslation } from 'react-i18next';
import themeSelectors from '#src/libs/theme/selectors';
import ConsumerGiftcardListItem from '#src/libs/giftcard/components/ConsumerGiftcardListItem.component';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';

import PageContentContainer from '#src/libs/consumer-space/components/reworked/@Layout/PageContentContainer';

import WidgetUtils from '#src/libs/widget/WidgetUtils';

import {
  fetchGiftcardBulk as fetchGiftcardBulkAction,
  fetchConsumerGiftcardReceivedList as fetchConsumerGiftcardReceivedListAction,
  fetchConsumerGiftcardSentList as fetchConsumerGiftcardSentListAction,
  retrieveConsumerGiftcard,
  sendEmailInvitation,
} from '#src/libs/giftcard/actions';

import ConsumerGiftcardInvitationModal from '#src/libs/giftcard/components/ConsumerGiftcardInvitationModal.components';
import { ConsumerGiftcard, WithGiftcard } from '#src/libs/giftcard/types';
import { urlToMarketplace } from '#src/libs/marketplace/utils';

import { snackbarSuccess } from '#src/libs/snackbar/actions';
import {
  getConsumerGiftcardReceivedList,
  withGiftcard,
  getConsumerGiftcardSentList,
} from '#src/libs/giftcard/selectors';
import { OptionCallback } from '../../state/types';

import { RootState } from '../../reducers';
import { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';
import ConsumerPrintableGiftcardDetails from '#src/libs/giftcard/components/ConsumerPrintableGiftcardDetails.components';
import { trackMemberProfileViewedEvent } from '#src/events/member-profile/trackers';
import { analyticsClientB2C } from '#src/components/analytics/mixpanel';

const styles = (theme: Theme) =>
  createStyles({
    emptyContainer: {
      padding: theme.spacing(2),
    },
    listConsumerGiftcard: {
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(1),
    },
    iconButton: {
      display: 'flex',
      width: '100%',
      padding: theme.spacing(1),
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    iconLeft: {
      marginRight: theme.spacing(1),
    },
    title: {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
    },
  });

type OwnProps = {};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  HandlersProps &
  WithStyles &
  WithTranslation;

const PAGE_SIZE = 15;

export const ConsumerGiftcardPage = (props: Props) => {
  const { classes, t } = props;
  const [
    consumerPrintableGiftcardSelected,
    setConsumerPrintableGiftcardSelected,
  ] = useState<null | ConsumerGiftcard>(null);
  const [consumerGiftcardToInvite, selectConsumerGiftcardToInvite] =
    React.useState(null);

  const sendInvitations = (data: any, options: OptionCallback) => {
    props.sendEmailInvitation(consumerGiftcardToInvite.id, data, {
      onSuccess: (...args) => {
        props.retrieveConsumerGiftcard(consumerGiftcardToInvite.id);
        selectConsumerGiftcardToInvite(null);
        // @ts-expect-error
        if (options?.onSuccess) options.onSuccess(...args);
      },
      onError: options?.onError,
    });
  };

  const handleSetConsumerPrintableGiftcardSelected = useCallback(
    (consumerGiftCard: ConsumerGiftcard) => () =>
      setConsumerPrintableGiftcardSelected(consumerGiftCard),
    [],
  );

  const handleResetConsumerPrintableGiftcardSelected = useCallback(
    () => setConsumerPrintableGiftcardSelected(null),
    [],
  );

  useEffect(() => {
    analyticsClientB2C.track(
      trackMemberProfileViewedEvent({ page_type: 'giftcard' }),
    );
  }, []);

  return (
    <PageContentContainer contentClassName="bs-consumer-pass-page__root">
      <Grid container spacing={2}>
        {!WidgetUtils.isWidget() && (
          <div className={classes.iconButton}>
            <Button
              color="primary"
              onClick={() =>
                props.goToGiftcard(
                  props.companyTheme.company_name,
                  props.companyTheme.company,
                )
              }
              variant="contained"
            >
              <CardGiftcardIcon className={classes.iconLeft} />
              {t('list.actions.goToGiftcard')}
            </Button>
          </div>
        )}
        <Grid item md={6} sm={12} style={{ width: '100%' }}>
          <Typography className={props.classes.title} variant="h5">
            {t('consumerGiftcard.list.myPurchases')}
          </Typography>
          <Paper className={classes.listConsumerGiftcard}>
            <PaginatedListBase
              itemPerPage={PAGE_SIZE}
              items={props.sentState.consumerGiftcardList}
              listProps={{
                disablePadding: 'true',
                dense: 'true',
              }}
              loading={props.sentState.consumerGiftcardLoading}
              nbItems={props.sentState.consumerGiftcardCount}
              onPageRequested={(page: number, pageSize: number) =>
                props.fetchConsumerGiftcardSentList(null, page, pageSize)
              }
              page={props.sentState.consumerGiftcardPage}
              renderEmpty={() => (
                <div className={classes.emptyContainer}>
                  <Typography color="textSecondary" variant="caption">
                    {t('consumerGiftcard.isEmpty')}
                  </Typography>
                  <Divider />
                </div>
              )}
              renderItem={(cgc: WithGiftcard<ConsumerGiftcard>) => (
                <ConsumerGiftcardListItem
                  key={cgc.id}
                  divider
                  consumerGiftcard={cgc}
                  giftcard={cgc.giftcard}
                  onClickSeeDetails={
                    cgc.kind === ConsumerGiftcardKind.PRINTABLE
                      ? handleSetConsumerPrintableGiftcardSelected(cgc)
                      : null
                  }
                  onClickSendInvitation={
                    cgc.date_activated
                      ? null
                      : () => selectConsumerGiftcardToInvite(cgc)
                  }
                  selected={cgc.id === consumerGiftcardToInvite}
                />
              )}
            />
          </Paper>
        </Grid>
        <Grid item md={6} sm={12} style={{ width: '100%' }}>
          <Typography className={props.classes.title} variant="h5">
            {t('consumerGiftcard.list.myGifted')}
          </Typography>
          <Paper className={classes.listConsumerGiftcard}>
            <PaginatedListBase
              itemPerPage={PAGE_SIZE}
              items={props.receivedState.consumerGiftcardList}
              listProps={{
                disablePadding: 'true',
                dense: 'true',
              }}
              loading={props.receivedState.consumerGiftcardLoading}
              nbItems={props.receivedState.consumerGiftcardCount}
              onPageRequested={(page: number, pageSize: number) =>
                props.fetchConsumerGiftcardReceivedList(null, page, pageSize)
              }
              page={props.receivedState.consumerGiftcardPage}
              renderEmpty={() => (
                <div className={classes.emptyContainer}>
                  <Typography color="textSecondary" variant="caption">
                    {t('consumerGiftcard.isEmpty')}
                  </Typography>
                  <Divider />
                </div>
              )}
              renderItem={(cgc: WithGiftcard<ConsumerGiftcard>) => (
                <ConsumerGiftcardListItem
                  key={cgc.id}
                  divider
                  showAsRecipient
                  consumerGiftcard={cgc}
                  giftcard={cgc.giftcard}
                  onClickSeeDetails={
                    cgc.kind === ConsumerGiftcardKind.PRINTABLE
                      ? handleSetConsumerPrintableGiftcardSelected(cgc)
                      : null
                  }
                />
              )}
            />
          </Paper>
        </Grid>
        {!!consumerGiftcardToInvite && (
          <ConsumerGiftcardInvitationModal
            companyId={consumerGiftcardToInvite.source_company_id}
            consumerGiftcard={consumerGiftcardToInvite}
            onClose={() => selectConsumerGiftcardToInvite(null)}
            // @ts-expect-error
            onSubmit={sendInvitations}
            snackbarSuccess={props.snackbarSuccess}
          />
        )}
      </Grid>

      {!!consumerPrintableGiftcardSelected && (
        <ConsumerPrintableGiftcardDetails
          consumerGiftcard={consumerPrintableGiftcardSelected}
          isOpen={!!consumerPrintableGiftcardSelected}
          onClose={handleResetConsumerPrintableGiftcardSelected}
        />
      )}
    </PageContentContainer>
  );
};

const connector = connect(
  (state: RootState) => ({
    receivedState: {
      consumerGiftcardCount: state.giftcard.consumerGiftcard.asReceiver.count,
      consumerGiftcardLoading:
        state.giftcard.consumerGiftcard.asReceiver.loading,
      consumerGiftcardPage: state.giftcard.consumerGiftcard.asReceiver.page,
      consumerGiftcardList: withGiftcard(getConsumerGiftcardReceivedList)(
        state,
      ),
    },
    sentState: {
      consumerGiftcardCount: state.giftcard.consumerGiftcard.asSender.count,
      consumerGiftcardLoading: state.giftcard.consumerGiftcard.asSender.loading,
      consumerGiftcardPage: state.giftcard.consumerGiftcard.asSender.page,
      consumerGiftcardList: withGiftcard(getConsumerGiftcardSentList)(state),
    },
    companyTheme: themeSelectors.getTheme(state),
  }),
  {
    fetchGiftcardBulk: fetchGiftcardBulkAction,
    snackbarSuccess,
    retrieveConsumerGiftcard,
    sendEmailInvitation,
    fetchConsumerGiftcardReceivedList: fetchConsumerGiftcardReceivedListAction,
    goToGiftcard: (name: string, id: number) =>
      // @ts-expect-error
      push(`${urlToMarketplace(name, id)}/giftcard/`),
    fetchConsumerGiftcardSentList: fetchConsumerGiftcardSentListAction,
  },
);

type HandlersProps = {
  fetchConsumerGiftcardSentList: (
    id: number,
    page: number,
    page_size: number,
  ) => void;
  fetchConsumerGiftcardReceivedList: (
    id: number,
    page: number,
    page_size: number,
  ) => void;
};

export default compose(
  withStyles(styles),
  withTranslation(['giftcard']),
  connector,
  withHandlers({
    fetchConsumerGiftcardSentList:
      ({ fetchConsumerGiftcardSentList, fetchGiftcardBulk, companyTheme }) =>
      (id: number, page: number, page_size: number) => {
        fetchConsumerGiftcardSentList(
          id,
          { page, page_size, company: companyTheme.company },
          {
            onSuccess: (consumerGiftcardList: Array<ConsumerGiftcard>) => {
              fetchGiftcardBulk(consumerGiftcardList.map((cg) => cg.giftcard));
            },
          },
        );
      },
    fetchConsumerGiftcardReceivedList:
      ({
        fetchConsumerGiftcardReceivedList,
        fetchGiftcardBulk,
        companyTheme,
      }) =>
      (id: number, page: number, page_size: number) => {
        fetchConsumerGiftcardReceivedList(
          id,
          { page, page_size, company: companyTheme.company },
          {
            onSuccess: (consumerGiftcardList: Array<ConsumerGiftcard>) => {
              fetchGiftcardBulk(consumerGiftcardList.map((cg) => cg.giftcard));
            },
          },
        );
      },
  }),
  // @ts-expect-error
)(ConsumerGiftcardPage);
