// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';

import { withTranslation, TFunction } from 'react-i18next';
import BookingConsumerItem from '../../booking/components/BookingConsumerItem.component';

type Props = {
  t: TFunction,
  classes: Object,
  open: boolean,
  onCancel: () => void,

  basketGeneratedObjects: BasketObjects,
  offerBooked: ?Offer,
  goToCalendar: (params: any) => void,
};
export class CongratulationDialog extends React.PureComponent<Props> {
  render() {
    const { offerBooked } = this.props;
    return (
      <Dialog open={!!this.props.open}>
        <DialogContent>
          <div className={this.props.classes.content}>
            <CheckCircleOutlineIcon
              color="primary"
              className={this.props.classes.bigCheck}
            />
            <Typography
              color="textSecondary"
              align="left"
              className={this.props.classes.contentText}
            >
              {this.props.t('congratulation.content')}
            </Typography>
          </div>
          <div>
            {this.props.offerBooked ? (
              <BookingConsumerItem
                variant="after_checkout"
                booking={{ offer: this.props.offerBooked }}
                key={this.props.offerBooked.id}
                goToCalendar={
                  offerBooked &&
                  offerBooked.meta_activity &&
                  offerBooked.establishment &&
                  offerBooked.coach
                    ? () =>
                        this.props.goToCalendar({
                          f_metaActivities: `[${offerBooked.meta_activity.id}]`,
                          f_establishments: `[${offerBooked.establishment.id}]`,
                          f_coaches: `[${offerBooked.coach.id}]`,
                          date: moment(offerBooked.date_start).format(
                            'YYYY-MM-DD',
                          ),
                        })
                    : null
                }
              />
            ) : null}

            {this.props.basketGeneratedObjects &&
            this.props.basketGeneratedObjects.offerList
              ? this.props.basketGeneratedObjects.offerList.map((o) => (
                  <BookingConsumerItem
                    variant="after_checkout"
                    booking={{ offer: o }}
                    key={o.id}
                    goToCalendar={() =>
                      this.props.goToCalendar({
                        f_metaActivities: `[${o.meta_activity.id}]`,
                        f_establishments: `[${o.establishment.id}]`,
                        f_coaches: `[${o.coach.id}]`,
                        date: moment(o.date_start).format('YYYY-MM-DD'),
                      })
                    }
                  />
                ))
              : null}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onCancel}>
            {this.props.t('congratulation.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  container: {},
  bigCheck: {
    height: 200,
    width: 200,
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentText: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['consumerSpace']),
  withStyles(styles),
)(CongratulationDialog);
