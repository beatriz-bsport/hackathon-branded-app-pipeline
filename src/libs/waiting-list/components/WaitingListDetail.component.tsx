import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import OfferMinimalSummary from '../../../components/offer/OfferMinimalSummary.component';
import { formatAsDatetime } from '../../../utils/datetime';
import { BookingSource } from '../../booking/utils';
import { MaterialStyleType } from '../../../utils/types';
import { BookingOption } from '../../booking/types';
import { Offer } from '../../offer/types';

type OwnProps = {
  bookingOption: BookingOption;
  loading: boolean;
  offer: Offer;
  onOfferClick: (offer: number) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class WaitingListDetail extends React.PureComponent<Props> {
  render() {
    const { t, classes, bookingOption } = this.props;

    if (this.props.loading) {
      return <LinearProgress />;
    }

    return (
      <div>
        <Typography component="h2" variant="h5">
          {t('member.detail.title')}
        </Typography>
        <Paper className={classes.paperContainer}>
          <div className={classes.parametersContainer}>
            <div className={classes.parameter}>
              <Typography>{t('member.detail.registeredOn')}:</Typography>
              <Typography>{formatAsDatetime(bookingOption.date)}</Typography>
            </div>
            <div className={classes.parameter}>
              <Typography>
                {`${t('member.detail.registrationSource')}: `}
              </Typography>
              <BookingSource t={this.props.t} source={bookingOption.source} />
            </div>
          </div>
        </Paper>
        <Typography component="h3" variant="h6">
          {`${t('member.detail.offerTitle')}`}
        </Typography>
        <Paper className={classes.paperContainer}>
          <OfferMinimalSummary
            loading={false}
            overrideClickAction={() =>
              this.props.onOfferClick(this.props.offer.id)
            }
            offer={this.props.offer}
          />
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  parametersContainer: {
    padding: theme.spacing(2),
  },
  parameter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  paperContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['waitingList']),
)(WaitingListDetail);
