// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import BookingOptionConsumerItem from '../../waiting-list/components/BookingOptionConsumerItem.component';

type Props = {
  t: TFunction,
  classes: Object,
  bookingOptionList: Array<BookingOption>,
  confirmBookingOption: (offerId: number, bookingOptionId: number) => void,
  cancelBookingOption: (optionId: number) => void,
};

export class ConsumerDashboardBookingOptionPanel extends React.PureComponent<Props> {
  render() {
    return (
      <div>
        {this.props.bookingOptionList && this.props.bookingOptionList.length ? (
          <div>
            <Typography
              variant="h4"
              component="h3"
              className={this.props.classes.sectionTitle}
            >
              {this.props.t('dashboard.optionTitle')}
            </Typography>
            {this.props.bookingOptionList.map((bo) => (
              <BookingOptionConsumerItem
                confirmBookingOption={() =>
                  this.props.confirmBookingOption(bo.offer.id, bo.id)
                }
                bookingOption={bo}
                cancelBookingOption={() =>
                  this.props.cancelBookingOption(bo.id)
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
    marginBottom: theme.spacing(3),
  },
});

export default compose(
  withNamespaces(['consumerSpace']),
  withStyles(styles),
)(ConsumerDashboardBookingOptionPanel);
