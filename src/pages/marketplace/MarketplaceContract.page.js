// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { getMarketplaceContractList as getContractList } from '../../libs/subscription/selectors';
import { fetchMarketplaceContractList } from '../../libs/subscription/actions';
import SubscriptionContractListItem from '../../libs/subscription/components/SubscriptionContractListItem.component';

type Props = {
  t: TFunction,
};

export class MarketplaceContract extends React.Component<Props> {
  componentWillMount() {
    this.props.fetchMarketplaceContractList();
  }

  render() {
    if (this.props.contractLoading) {
      return <LinearProgress />;
    }
    return (
      <Paper className={this.props.classes.container}>
        <List>
          {this.props.contractList.map((c) => (
            <SubscriptionContractListItem contract={c} key={c.id} />
          ))}
        </List>
      </Paper>
    );
  }
}

const styles = (theme) => ({
  container: {
    margin: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(),
  withStyles(styles),
  connect(
    (state) => ({
      contractList: getContractList(state),
      contractLoading: state.subscription.contract.byMarketplace.loading,
    }),
    {
      fetchMarketplaceContractList,
    },
  ),
)(MarketplaceContract);
