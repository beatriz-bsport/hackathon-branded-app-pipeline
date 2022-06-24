// @flow
import React from 'react';

import { withTranslation, TFunction } from 'react-i18next';
import { compose, withState } from 'recompose';
import moment from 'moment-timezone';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import RedButton from '../../../components/button/RedButton.component';
import OfferListItemV2 from '#libs/offer/components/OfferListItemV2.component';

type Props = {
  booking: ?Booking,
  t: TFunction,
  onSubmit: () => void,
  onCancel: () => void,
  onClose: ?() => void,
  fullScreen: boolean,
  open: boolean,
  processing: boolean,
  setProcessing: (boolean) => void,
  similarBookings: Booking[],
  group: OffersGroup,
  memberTags: Array<any>,
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  alert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  item: {
    marginLeft: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
}));

export const BookingCancellationDialog = (props: Props) => {
  const classes = useStyles();
  const is_discardable = () => {
    if (!props.booking?.offer.meta_activity?.custom_restriction_rule) {
      return (props.booking || {}).is_discardable;
    }
    const custom_restriction_rule =
      props.booking?.offer.meta_activity?.custom_restriction_rule ?? [];
    const last_discard_minutes = custom_restriction_rule.reduce(
      (acc: number, crr: any) => {
        if ((props.memberTags || []).some((tag) => crr.tags.includes(tag))) {
          return Math.min(acc, crr.last_discard_minutes);
        }
        return acc;
      },
      props.booking?.offer.meta_activity?.custom_restriction_rule[0]
        .last_discard_minutes,
    );

    return moment()
      .add('minutes', last_discard_minutes)
      .isBefore(moment(props.booking.offer.date_start));
  };

  return (
    <Dialog
      open={!!props.open}
      fullScreen={props.fullScreen}
      onClose={props.onClose}
    >
      <DialogTitle>
        {props.booking &&
        props.booking.offer &&
        props.booking.offer.timezone_name
          ? props.t('consumer.booking.intro', {
              date: moment(props.booking.offer.date_start)
                .tz(props.booking.offer.timezone_name)
                .format('LLLL'),
            })
          : props.t('consumer.booking.discardBookingTitle')}
      </DialogTitle>
      <div className={classes.container}>
        {!props.booking ? (
          <CircularProgress />
        ) : (
          <>
            {is_discardable() && (
              <>
                {props.booking?.offer?.group ? (
                  <>
                    <Typography>
                      {props.t('consumer.booking.discardGroup1', {
                        group: props.group?.name,
                      })}
                    </Typography>
                    <Typography>
                      {props.t('consumer.booking.discardGroup2')}
                    </Typography>
                    <Typography>
                      {props.t('consumer.booking.discardGroupPossibleExplain')}
                    </Typography>
                    <Typography>
                      {props.t('consumer.booking.discardGroup3')}
                    </Typography>
                    <Alert className={classes.alert} severity="error">
                      {props.t('consumer.booking.discardAllGroup')}
                    </Alert>
                    {props.similarBookings?.map((b) => (
                      <div className={classes.item} key={b.id}>
                        <OfferListItemV2
                          offer={{
                            ...b.offer,
                            coach: b.coach,
                            customLevel: b.customLevel,
                          }}
                          divider={false}
                        />
                        {!b.is_discardable && (
                          <Typography color="error">
                            {props.t('consumer.booking.willNotBeRefund')}
                          </Typography>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <Typography>
                    {props.t('consumer.booking.discardPossibleExplain')}
                  </Typography>
                )}
              </>
            )}
            {!is_discardable() && (
              <>
                {props.booking?.offer?.group ? (
                  <>
                    <Typography>
                      {props.t('consumer.booking.discardGroup1', {
                        group: props.group?.name,
                      })}
                    </Typography>
                    <Typography>
                      {props.t('consumer.booking.discardGroup2')}
                    </Typography>
                    <Typography>
                      {props.t(
                        'consumer.booking.discardGroupImpossibleExplain',
                      )}
                    </Typography>
                    <Typography>
                      {props.t('consumer.booking.discardGroup3')}
                    </Typography>

                    <Alert className={classes.alert} severity="error">
                      {props.t('consumer.booking.discardAllGroup')}
                    </Alert>
                    {props.similarBookings?.map((b) => (
                      <div className={classes.item} key={b.id}>
                        {props.t(
                          b.is_discardable
                            ? 'consumer.booking.willBeRefund'
                            : 'consumer.booking.willNotBeRefund',
                          { day: moment(b.offer_date_start).format('L') },
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <Typography>
                    {props.t('consumer.booking.discardImpossibleExplain')}
                  </Typography>
                )}
              </>
            )}
          </>
        )}
      </div>
      <DialogActions>
        <Button
          color="secondary"
          onClick={props.onCancel}
          disabled={props.processing}
        >
          {props.t('navigation.goBack')}
        </Button>
        {props.processing ? (
          <CircularProgress />
        ) : (
          <RedButton
            disabled={props.processing}
            onClick={() => {
              props.setProcessing(true);
              props.onSubmit({
                onSuccess: () => props.setProcessing(false),
                onError: () => props.setProcessing(false),
              });
            }}
          >
            {props.t('common.delete')}
          </RedButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default compose(
  withTranslation(),
  withMobileDialog(),
  withState('processing', 'setProcessing', false),
)(BookingCancellationDialog);
