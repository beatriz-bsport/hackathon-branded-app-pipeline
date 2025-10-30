import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import uniq from 'lodash/uniq';
import { withTranslation, WithTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { push } from 'connected-react-router';
import { GiftcardFormDrawer } from '#src/libs/giftcard/components/GiftcardFormDrawer';
import GiftcardDeleteDialog from '#src/libs/giftcard/components/GiftcardDeleteDialog.component';
import BottomActionsButton from '#src/components/button/BottomActionsButton.component';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import type {
  Giftcard,
  ConsumerGiftcard,
  GiftcardDataAPI,
  WithSender,
  WithReceiver,
} from '#src/libs/giftcard/types';

import GiftcardCardDetail from '#src/libs/giftcard/components/GiftcardCardDetail.component';
import ConsumerGiftcardListItem from '#src/libs/giftcard/components/ConsumerGiftcardListItem.component';

import { fetchMemberBulkById as fetchMemberBulkByIdAction } from '#src/libs/member/actions';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';
import { snackbarSuccess } from '#src/libs/snackbar/actions';
import {
  withSender,
  withReceiver,
  getConsumerGiftcardList,
  getGiftcard,
} from '#src/libs/giftcard/selectors';

import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import { fetchTags } from '#src/libs/tag/actions';
import { Tag, TagGroup } from '#src/libs/tag/types';
import { fetchBookkeepingAccountList as fetchBookkeepingAccountListAction } from '#src/libs/payment/actions';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountById,
} from '#src/libs/payment/selectors';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#src/libs/payment/constants';
import { RootState } from '../../reducers';
import BackofficeLinearProgressComponent from '../../components/navigation/BackofficeLinearProgress.component';
import { OptionCallback } from '../../state/types';
import {
  retrieveGiftcard,
  fetchConsumerGiftcardList as fetchConsumerGiftcardListAction,
  createOrUpdateGiftcard as createOrUpdateGiftcardAction,
  deleteGiftcard as deleteGiftcardActions,
} from '../../libs/giftcard/actions';
import withTitle from '../../hocs/with-title.hoc';
import { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';
import ConsumerPrintableGiftcardDetails from '#src/libs/giftcard/components/ConsumerPrintableGiftcardDetails.components';

const styles = (theme: Theme) =>
  createStyles({
    container: {},
    emptyContainer: {
      padding: theme.spacing(2),
    },
    fullWidth: {},
  });

type OwnProps = {
  id: number;
  giftcard: Giftcard | null;
  consumerGiftcardLoading: boolean;
  consumerGiftcardList: Array<ConsumerGiftcard>;
  consumerGiftcardCount: number;
  fetchConsumerGiftcardList: (params: any) => void;
  allTagsWithTagGroup?: Array<Tag<TagGroup>>;
};

type StateToProps = {
  editIsOpen: boolean;
  deleteIsOpen: boolean;
};

type StateHandlerToProps = {
  setEditIsOpen: (value: boolean) => void;
  setDeleteIsOpen: (value: boolean) => void;
};

type WithHandlersType = {
  deleteGiftcard: (options?: OptionCallback) => void;
  updateGiftcard: (
    data: GiftcardDataAPI,
    options?: OptionCallback<Giftcard>,
  ) => void;
  fetchConsumerGiftcardList: (page: number, page_size: number) => void;
  fetchAvailableBookkeepingAccounts: () => void;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  StateToProps &
  StateHandlerToProps &
  WithHandlersType &
  WithStyles &
  WithTranslation;

type State = {
  consumerPrintableGiftcardSelected: ConsumerGiftcard | null;
};

const PAGE_SIZE = 15;

export class GiftcardDetailPage extends Component<Props, State> {
  state: State = {
    consumerPrintableGiftcardSelected: null,
  };

  componentDidMount() {
    this.props.retrieveGiftcard(this.props.id);
    this.props.fetchTags();
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      this.props.fetchAvailableBookkeepingAccounts();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.id !== prevProps.id) {
      this.props.retrieveGiftcard(this.props.id);
    }
  }

  render() {
    const { classes, t } = this.props;
    if (!this.props.giftcard) {
      return <BackofficeLinearProgressComponent />;
    }
    return (
      <Grid container spacing={2}>
        <Grid item md={6} sm={12}>
          <GiftcardCardDetail
            giftcard={this.props.giftcard}
            snackbarSuccess={this.props.snackbarSuccess}
          />
        </Grid>
        <Grid item md={6} sm={12} style={{ width: '100%' }}>
          <Paper className={classes.fullWidth}>
            <PaginatedListBase
              itemPerPage={PAGE_SIZE}
              items={this.props.consumerGiftcardList}
              listProps={{
                disablePadding: 'true',
                dense: 'true',
              }}
              loading={this.props.consumerGiftcardLoading}
              nbItems={this.props.consumerGiftcardCount}
              onPageRequested={(page: number, pageSize: number) =>
                this.props.fetchConsumerGiftcardList(page, pageSize)
              }
              page={this.props.consumerGiftcardPage}
              renderEmpty={() => (
                <div className={classes.emptyContainer}>
                  <Typography color="textSecondary" variant="caption">
                    {t('consumerGiftcard.isEmpty')}
                  </Typography>
                  <Divider />
                </div>
              )}
              renderItem={(cgc: WithSender<WithReceiver<ConsumerGiftcard>>) => (
                <ConsumerGiftcardListItem
                  key={cgc.id}
                  divider
                  showReceiver
                  showSender
                  consumerGiftcard={cgc}
                  giftcard={this.props.giftcard}
                  memberReceiver={cgc.dst_member}
                  memberSender={cgc.src_member}
                  onClickReceiver={
                    cgc.dst_member && this.props.goToMemberGiftcard
                  }
                  onClickSeeDetails={
                    cgc.kind === ConsumerGiftcardKind.PRINTABLE
                      ? () =>
                          this.setState({
                            consumerPrintableGiftcardSelected: cgc,
                          })
                      : null
                  }
                  onClickSender={this.props.goToMemberGiftcard}
                />
              )}
            />
          </Paper>
        </Grid>
        <BottomActionsButton
          onDelete={
            !this.props.giftcard?.is_shared_giftcard
              ? () => this.props.setDeleteIsOpen(true)
              : null
          }
          onEdit={
            this.props.giftcard ? () => this.props.setEditIsOpen(true) : null
          }
        />
        <GiftcardFormDrawer
          bookkeepingAccountById={this.props.bookkeepingAccountById}
          bookkeepingAccounts={this.props.bookkeepingAccounts}
          initial={this.props.giftcard}
          onClose={() => this.props.setEditIsOpen(false)}
          onSubmit={this.props.updateGiftcard}
          open={!!this.props.editIsOpen}
          tagList={this.props.allTagsWithTagGroup}
        />
        {!!this.props.deleteIsOpen && (
          <GiftcardDeleteDialog
            open
            onClose={() => this.props.setDeleteIsOpen(false)}
            onSubmit={this.props.deleteGiftcard}
          />
        )}
        {!!this.state.consumerPrintableGiftcardSelected && (
          <ConsumerPrintableGiftcardDetails
            consumerGiftcard={this.state.consumerPrintableGiftcardSelected}
            isOpen={!!this.state.consumerPrintableGiftcardSelected}
            onClose={() =>
              this.setState({ consumerPrintableGiftcardSelected: null })
            }
          />
        )}
      </Grid>
    );
  }
}

const connector = connect(
  (state: RootState, { id }: { id: number }) => ({
    consumerGiftcardCount: state.giftcard.consumerGiftcard.count,
    consumerGiftcardLoading: state.giftcard.consumerGiftcard.loading,
    consumerGiftcardPage: state.giftcard.consumerGiftcard.page,
    consumerGiftcardList: withSender(withReceiver(getConsumerGiftcardList))(
      state,
    ),
    giftcard: getGiftcard(state, id),
    allTagsWithTagGroup: getAllTagsWithTagGroup(state),
    bookkeepingAccounts: getBookkeepingAccountList(state),
    bookkeepingAccountById: getBookkeepingAccountById(state),
  }),
  {
    retrieveGiftcard,
    createOrUpdateGiftcard: createOrUpdateGiftcardAction,
    fetchMemberBulkById: fetchMemberBulkByIdAction,
    snackbarSuccess,
    deleteGiftcard: deleteGiftcardActions,
    goToGiftcardList: () => push('/giftcard'),
    goToMemberGiftcard: (consumerGiftcardId: number, memberId: number) =>
      push(`/member/${memberId}/giftcard/${consumerGiftcardId}`),
    fetchConsumerGiftcardList: fetchConsumerGiftcardListAction,
    fetchTags,
    fetchBookkeepingAccountList: fetchBookkeepingAccountListAction,
  },
);

export default compose(
  withStyles(styles),
  withTranslation(['giftcard']),
  routerParamsToProps({ id: 'id:number' }),
  connector,
  withState('editIsOpen', 'setEditIsOpen', false),
  withState('deleteIsOpen', 'setDeleteIsOpen', false),
  withHandlers({
    deleteGiftcard:
      ({ deleteGiftcard, goToGiftcardList, id }) =>
      (options?: OptionCallback<Giftcard>) => {
        deleteGiftcard(id, {
          onSuccess: (g: Giftcard) => {
            goToGiftcardList();
            if (options?.onSuccess) {
              options.onSuccess(g);
            }
          },
        });
      },
    updateGiftcard:
      ({ setEditIsOpen, createOrUpdateGiftcard, id }) =>
      (data: Giftcard, options?: OptionCallback<Giftcard>) => {
        createOrUpdateGiftcard(id, data, {
          onSuccess: () => {
            setEditIsOpen(false);
            options?.onSuccess();
          },
          onError: options?.onError,
        });
      },
    fetchConsumerGiftcardList:
      ({ fetchConsumerGiftcardList, id, fetchMemberBulkById }) =>
      (page: number, page_size: number) => {
        fetchConsumerGiftcardList(
          { page, page_size, giftcard: id },
          {
            onSuccess: (consumerGiftcardList: Array<ConsumerGiftcard>) => {
              fetchMemberBulkById(
                uniq([
                  ...consumerGiftcardList.map((cg) => cg.src_member),
                  ...consumerGiftcardList.map((cg) => cg.dst_member),
                ]),
              );
            },
          },
        );
      },
    fetchAvailableBookkeepingAccounts:
      ({ fetchBookkeepingAccountList }) =>
      () =>
        fetchBookkeepingAccountList({
          is_active: true,
        }),
  }),
  withTitle(({ giftcard }) => (giftcard ? giftcard.name : '')),
)(GiftcardDetailPage);
