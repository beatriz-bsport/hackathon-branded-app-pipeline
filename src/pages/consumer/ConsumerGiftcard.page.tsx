import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';

import { withTranslation, WithTranslation } from 'react-i18next';
import themeSelectors from '../../libs/theme/selectors';
import ConsumerGiftcardListItem from '../../libs/giftcard/components/ConsumerGiftcardListItem.component';
import PaginatedListBase from '../../components/PaginatedListBase.component';
import { OptionCallback } from '../../state/types';

import {
  fetchGiftcardBulk as fetchGiftcardBulkAction,
  fetchConsumerGiftcardReceivedList as fetchConsumerGiftcardReceivedListAction,
  fetchConsumerGiftcardSentList as fetchConsumerGiftcardSentListAction,
  retrieveConsumerGiftcard,
  sendEmailInvitation,
} from '../../libs/giftcard/actions';

import ConsumerGiftcardInvitationModal from '../../libs/giftcard/components/ConsumerGiftcardInvitationModal.components';
import { ConsumerGiftcard } from '../../libs/giftcard/types';

import { snackbarSuccess } from '../../libs/snackbar/actions';
import {
  getConsumerGiftcardReceivedList,
  withGiftcard,
  getConsumerGiftcardSentList,
} from '../../libs/giftcard/selectors';

import { RootState } from '../../reducers';

const styles = (theme: Theme) =>
  createStyles({
    container: {},
    emptyContainer: {
      padding: theme.spacing(2),
    },
    listConsumerGiftcard: {
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(1),
    },
  });

type OwnProps = {};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation;

const PAGE_SIZE = 15;

export const ConsumerGiftcardPage = (props: Props) => {
  const { classes, t } = props;
  const [
    consumerGiftcardToInvite,
    selectConsumerGiftcardToInvite,
  ] = React.useState(null);

  const sendInvitations = (data: any, options: OptionCallback) => {
    props.sendEmailInvitation(consumerGiftcardToInvite.id, data, {
      onSuccess: (...args) => {
        props.retrieveConsumerGiftcard(consumerGiftcardToInvite.id);
        selectConsumerGiftcardToInvite(null);
        if (options?.onSuccess) options.onSuccess(...args);
      },
      onError: options?.onError,
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item sm={12} md={6} style={{ width: '100%' }}>
        <Typography variant="h5">
          {t('consumerGiftcard.list.myPurchases')}
        </Typography>
        <Paper className={classes.listConsumerGiftcard}>
          <PaginatedListBase
            listProps={{
              disablePadding: 'true',
              dense: 'true',
            }}
            items={props.sentState.consumerGiftcardList}
            nbItems={props.sentState.consumerGiftcardCount}
            loading={props.sentState.consumerGiftcardLoading}
            page={props.sentState.consumerGiftcardPage}
            itemPerPage={PAGE_SIZE}
            onPageRequested={(page: number, pageSize: number) =>
              props.fetchConsumerGiftcardSentList(null, page, pageSize)
            }
            renderEmpty={() => (
              <div className={classes.emptyContainer}>
                <Typography variant="caption" color="textSecondary">
                  {t('consumerGiftcard.isEmpty')}
                </Typography>
                <Divider />
              </div>
            )}
            renderItem={(cgc) => (
              <ConsumerGiftcardListItem
                key={cgc.id}
                onClickSendInvitation={
                  cgc.date_activated
                    ? null
                    : () => selectConsumerGiftcardToInvite(cgc)
                }
                consumerGiftcard={cgc}
                giftcard={cgc.giftcard}
                divider
                selected={cgc.id === props.selectedConsumerGiftcardId}
              />
            )}
          />
        </Paper>
      </Grid>
      <Grid item sm={12} md={6} style={{ width: '100%' }}>
        <Typography variant="h5">
          {t('consumerGiftcard.list.myGifted')}
        </Typography>
        <Paper className={classes.listConsumerGiftcard}>
          <PaginatedListBase
            listProps={{
              disablePadding: 'true',
              dense: 'true',
            }}
            items={props.receivedState.consumerGiftcardList}
            nbItems={props.receivedState.consumerGiftcardCount}
            loading={props.receivedState.consumerGiftcardLoading}
            page={props.receivedState.consumerGiftcardPage}
            itemPerPage={PAGE_SIZE}
            onPageRequested={(page: number, pageSize: number) =>
              props.fetchConsumerGiftcardReceivedList(null, page, pageSize)
            }
            renderEmpty={() => (
              <div className={classes.emptyContainer}>
                <Typography variant="caption" color="textSecondary">
                  {t('consumerGiftcard.isEmpty')}
                </Typography>
                <Divider />
              </div>
            )}
            renderItem={(cgc) => (
              <ConsumerGiftcardListItem
                key={cgc.id}
                consumerGiftcard={cgc}
                giftcard={cgc.giftcard}
                showAsRecipient
                divider
              />
            )}
          />
        </Paper>
      </Grid>
      {!!consumerGiftcardToInvite && (
        <ConsumerGiftcardInvitationModal
          onSubmit={sendInvitations}
          consumerGiftcard={consumerGiftcardToInvite}
          companyId={props.companyTheme.company}
          onClose={() => selectConsumerGiftcardToInvite(null)}
        />
      )}
    </Grid>
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
    fetchConsumerGiftcardSentList: fetchConsumerGiftcardSentListAction,
  },
);

export default compose(
  withStyles(styles),
  withTranslation(['giftcard']),
  connector,
  withHandlers({
    fetchConsumerGiftcardSentList: ({
      fetchConsumerGiftcardSentList,
      fetchGiftcardBulk,
    }) => (id: number, page: number, page_size: number) => {
      fetchConsumerGiftcardSentList(
        id,
        { page, page_size },
        {
          onSuccess: (consumerGiftcardList: Array<ConsumerGiftcard>) => {
            fetchGiftcardBulk(consumerGiftcardList.map((cg) => cg.giftcard));
          },
        },
      );
    },
    fetchConsumerGiftcardReceivedList: ({
      fetchConsumerGiftcardReceivedList,
      fetchGiftcardBulk,
    }) => (id, page: number, page_size: number) => {
      fetchConsumerGiftcardReceivedList(
        id,
        { page, page_size },
        {
          onSuccess: (consumerGiftcardList: Array<ConsumerGiftcard>) => {
            fetchGiftcardBulk(consumerGiftcardList.map((cg) => cg.giftcard));
          },
        },
      );
    },
  }),
)(ConsumerGiftcardPage);
