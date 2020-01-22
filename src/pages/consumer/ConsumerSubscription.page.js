// @flow
import React from 'react';
import { compose } from 'recompose';

import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { push } from 'react-router-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import SubscriptionTable from '../../libs/subscription/components/SubscriptionTable.component';
import { fetchSubscriptionListByMember } from '../../libs/subscription/actions';
import { getSubscriptionListByMember } from '../../libs/subscription/selectors';

import type { Subscription } from '../../libs/subscription/types';
import type { Membership } from '../../libs/membership/types';

type Props = {
  subscriptionList: Array<Subscription>,
  membership: Membership,
  classes: Object,
  subscriptionCount: number,
  subscriptionLoading: boolean,
  fetchSubscriptionListByMember: (
    member: number,
    { page: number, page_size: number },
  ) => void,
  t: TFunction,
  goToSubscription: (string, nubmer) => void,
};

export class ConsumerSubscription extends React.Component<Props> {
  fetchSubscriptionList = (page: number) => {
    this.props.fetchSubscriptionListByMember(this.props.membership.id, {
      page,
      page_size: 10,
    });
  };

  render() {
    return (
      <div className={this.props.classes.table}>
        <div className={this.props.classes.header}>
          <Button
            onClick={() =>
              this.props.goToSubscription(
                this.props.membership.company_name,
                this.props.membership.company,
              )
            }
            color="primary"
            variant="contained"
          >
            <ReceiptIcon className={this.props.classes.iconLeft} />
            {this.props.t('actions.goToSubscription')}
          </Button>
        </div>
        <SubscriptionTable
          showOnlyCore
          subscriptionList={this.props.subscriptionList}
          loading={this.props.subscriptionLoading}
          count={this.props.subscriptionCount}
          onPageChange={this.fetchSubscriptionList}
        />
      </div>
    );
  }
}
const styles = (theme) => ({
  table: {
    marginBottom: theme.spacing.unit * 2,
  },
  header: {
    display: 'flex',
    padding: theme.spacing.unit,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  iconLeft: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['consumerSpace']),
  withStyles(styles),
  connect(
    (state) => ({
      subscriptionList: getSubscriptionListByMember(state),
      subscriptionLoading: state.subscription.byMember.loading,
      subscriptionCount: state.subscription.byMember.count,
    }),
    {
      fetchSubscriptionListByMember,
      goToSubscription: (name, id) => push(`/m/${name}/${id}/subscription`),
    },
  ),
)(ConsumerSubscription);
