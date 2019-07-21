// @flow
import React from 'react';

import { compose } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Moment from 'moment';

import MarketplaceWorkshop from '../../libs/marketplace/components/MarketplaceWorkshop.component';
import {
  getOffersWorkshop,
  getWorkshops,
  isOfferLoading,
} from '../../libs/marketplace/selectors';
import { fetchCompanyOffersWorkshopAction } from '../../libs/marketplace/actions';

type Props = {
  // t: TFunction,
  companyId: number,
  loading: boolean,
  offers: Array<Offer>,
  workshops: Array<MetaActivity>,
  classes: *,

  fetchCompanyOffers: (companyId: number, min_date: string) => void,
  goToBook: (offerId: number, companyId: number) => void,
  goToBookOption: (offerId: number, companyId: number) => void,
};

export class MarketplaceWorkshopPage extends React.Component<Props> {
  componentDidMount() {
    const min_date = Moment()
      .startOf('month')
      .format('YYYY-MM-DD');
    const max_date = Moment()
      .startOf('month')
      .add('years', 1)
      .format('YYYY-MM-DD');
    this.props.fetchCompanyOffers(this.props.companyId, min_date, max_date);
  }

  render() {
    const { classes, offers, workshops, loading } = this.props;
    if (loading) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.container}>
        <MarketplaceWorkshop
          offers={offers}
          workshops={workshops}
          onBook={(id) => this.props.goToBook(id, this.props.companyId)}
          onBookOption={(id) =>
            this.props.goToBookOption(id, this.props.companyId)
          }
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});
export default compose(
  withStyles(styles),
  connect(
    (state) => ({
      offers: getOffersWorkshop(state),
      workshops: getWorkshops(state),
      loading: isOfferLoading(state),
    }),
    {
      fetchCompanyOffers: fetchCompanyOffersWorkshopAction,
      goToBook: (id: number, companyId: number) =>
        push(`/customer/payment/offer/${id}?membership=${companyId}`),
      goToBookOption: (id: number, companyId: number) =>
        push(`/customer/payment/offer/${id}?membership=${companyId}`),
    },
  ),
)(MarketplaceWorkshopPage);
