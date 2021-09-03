// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withProps } from 'recompose';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { push } from 'connected-react-router';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import { WidgetUtils } from '../../libs/widget/WidgetUtils';

import PaginatedListBase from '../../components/PaginatedListBase.component';
import PaginatedListStateful from '../../components/PaginatedListStateful.component';

import { getConsumerPacksByMemberWithPaymentPack } from '../../libs/consumer-payment-pack/selectors';

import PrivateConsumerPassBookerListItem from '../../libs/private-service/components/booking-module/PrivateConsumerPassBookerListItem.component';
import { getPrivateConsumerPassList } from '../../libs/private-service/selectors/private-consumer-pass';

import ConsumerPackRowItem from '../../libs/consumer-payment-pack/components/ConsumerPackRowItem.component';
import { fetchPrivateConsumerPassList } from '../../libs/private-service/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';
import { fetchByMember as fetchConsumerPackByMemberAction } from '../../libs/consumer-payment-pack/actions';

import type { PrivateConsumerPass } from '../../libs/private-service/types';
import type { ConsumerPaymentPack } from '../../libs/consumer-payment-pack/types';
import type { Membership } from '../../libs/membership/types';
import { urlToMarketplace } from '../../libs/marketplace/utils';

type Props = {
  t: TFunction,
  classes: Object,
  fetchPrivateConsumerPassList: () => void,
  consumerPackLoading: boolean,
  consumerPacks: Array<ConsumerPaymentPack>,
  consumerPackCount: number,
  consumerPackCurrentPage: number,
  fetchConsumerPacks: (
    member: number,
    page: number,
    page_size: number,
    params: any,
  ) => void,
  membership: Membership,
  privateBookingsLoading: boolean,
  private_consumer_pass_list: Array<PrivateConsumerPass>,
  goToPass: (company: number) => void,
};

const CONSUMER_PAYMENT_PACK_PAGE_SIZE = 10;

export class ConsumerPack extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPrivateConsumerPassList();
  }

  render() {
    return (
      <Grid container direction="row" spacing={1}>
        {!WidgetUtils.isWidget() && (
          <div className={this.props.classes.header}>
            <Button
              onClick={() =>
                this.props.goToPass(
                  this.props.membership.company_name,
                  this.props.membership.company,
                )
              }
              color="primary"
              variant="contained"
            >
              <VpnKeyIcon className={this.props.classes.iconLeft} />
              {this.props.t('actions.goToPass')}
            </Button>
          </div>
        )}
        <Grid item xs={12} lg={6}>
          <Typography
            variant="h4"
            component="h3"
            className={this.props.classes.title}
          >
            {this.props.t('pack.titlePaymentPack')}
          </Typography>
          <Divider className={this.props.classes.sectionDivider} />
          <Paper>
            <PaginatedListBase
              itemPerPage={CONSUMER_PAYMENT_PACK_PAGE_SIZE}
              loading={this.props.consumerPackLoading}
              listProps={{ disablePadding: true }}
              items={this.props.consumerPacks}
              nbItems={this.props.consumerPackCount}
              page={this.props.consumerPackCurrentPage}
              onPageRequested={(page, pageSize) =>
                this.props.fetchConsumerPacks(
                  this.props.membership.id,
                  page,
                  pageSize,
                  { disabled: false },
                )
              }
              renderItem={(cpp) => (
                <ConsumerPackRowItem
                  hideConsumer
                  key={cpp.id}
                  consumerPack={cpp}
                  paymentPack={cpp.payment_pack}
                />
              )}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Typography
            variant="h4"
            component="h3"
            className={this.props.classes.title}
          >
            {this.props.t('pack.titlePrivatePack')}
          </Typography>
          <Divider className={this.props.classes.sectionDivider} />
          <Paper>
            <PaginatedListStateful
              itemPerPage={5}
              loading={this.props.privateBookingsLoading}
              listProps={{ disablePadding: true }}
              items={this.props.private_consumer_pass_list}
              renderItem={(pcp) => (
                <PrivateConsumerPassBookerListItem
                  divider
                  key={pcp.id}
                  private_consumer_pass={pcp}
                />
              )}
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  sectionDivider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  header: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(1),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['consumerSpace']),
  withStyles(styles),
  connect(
    (state, { membership }) => ({
      consumerPacks: getConsumerPacksByMemberWithPaymentPack(
        state,
        membership.member,
      ),
      consumerPackCount: state.consumerPaymentPack.byMember.count,
      consumerPackCurrentPage: state.consumerPaymentPack.byMember.page,
      consumerPackLoading: state.consumerPaymentPack.byMember.loading,

      private_consumer_pass_list: getPrivateConsumerPassList(state),
      privateConsumerPassLoading:
        state.privateService.privateConsumerPass.loading,
      privateBookingsLoading: state.privateService.privateBooking.loading,
    }),
    {
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      fetchConsumerPacks: (
        memberId: number,
        page: number,
        page_size: number,
        options: OptionCallback,
        params: any,
      ) =>
        fetchConsumerPackByMemberAction(
          memberId,
          page,
          page_size,
          options,
          params,
        ),
      fetchPrivateConsumerPassList,
      goToPass: (name: string, id: number) =>
        push(`${urlToMarketplace(name, id)}/pass`),
    },
  ),
  withProps(({ fetchPaymentPackBulk, fetchConsumerPacks }) => ({
    fetchConsumerPacks: (memberId, page, page_size, options, params) =>
      fetchConsumerPacks(
        memberId,
        page,
        page_size,
        {
          onSuccess: (cpps) => {
            fetchPaymentPackBulk(cpps.map((c) => c.payment_pack));
            if (options && options.onSuccess) options.onSuccess(cpps);
          },
          onError: options && options.onError,
        },
        { ...(params || {}), mine: true, reverted: false },
      ),
  })),
)(ConsumerPack);
