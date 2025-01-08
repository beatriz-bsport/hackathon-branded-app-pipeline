// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { MarketPlaceCoachDisplay } from '@bsport/common/master-data/personalization.js';
import { OfferStatusWaitingListPosition } from '#src/libs/offer/types';
import BookingOptionConsumerItem from '../../waiting-list/components/BookingOptionConsumerItem.component';

type Props = {
  t: TFunction,
  classes: Object,
  bookingOptionList: Array<BookingOption>,
  displayPositionInWaitingList: boolean,
  offerStatusWaitinListPositionById: {
    [key: number]: OfferStatusWaitingListPosition,
  },
  confirmBookingOption: (offerId: number, bookingOptionId: number) => void,
  cancelBookingOption: (optionId: number) => void,
  coachDisplay?: MarketPlaceCoachDisplay,
  getMetaActivity: (id: number) => MetaActivity,
};

export class ConsumerDashboardBookingOptionPanel extends React.PureComponent<Props> {
  render() {
    return (
      <div>
        {this.props.bookingOptionList && this.props.bookingOptionList.length ? (
          <div>
            <Typography
              className={this.props.classes.sectionTitle}
              component="h3"
              variant="h4"
            >
              {this.props.t('dashboard.optionTitle')}
            </Typography>
            <Divider className={this.props.classes.divider} />
            {this.props.bookingOptionList.map((bookingOption) => (
              <BookingOptionConsumerItem
                key={bookingOption.id}
                bookingOption={bookingOption}
                cancelBookingOption={() =>
                  this.props.cancelBookingOption(bookingOption.id)
                }
                coachDisplay={this.props.coachDisplay}
                confirmBookingOption={() =>
                  this.props.confirmBookingOption(
                    bookingOption.offer.id,
                    bookingOption.id,
                  )
                }
                displayPositionInWaitingList={
                  this.props.displayPositionInWaitingList
                }
                metaActivity={this.props.getMetaActivity(
                  bookingOption.meta_activity,
                )}
                waitingListPosition={
                  this.props.offerStatusWaitinListPositionById?.[
                    bookingOption.offer.id
                  ]?.waiting_list_position
                }
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {},
  sectionTitle: {
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['consumerSpace']),
  withStyles(styles),
)(ConsumerDashboardBookingOptionPanel);
