// @flow
import React from 'react';

import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import { OptionCallback } from '../../../state/types';
import RedButton from '../../../components/button/RedButton.component';
import OfferListItemV2 from '#libs/offer/components/OfferListItemV2.component';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import type { Booking } from '#libs/booking/types';
import type { OffersGroup } from '#libs/group-offer/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import type { Offer } from '#libs/offer/types';

type Props = {
  booking?: Booking<Offer<number, number, MetaActivity>>;
  onSubmit: (options: OptionCallback) => void;
  onCancel: () => void;
  onClose?: () => void;
  open: boolean;
  similarBookings: Booking[];
  group: OffersGroup;
  memberTags: Array<any>;
};

const useStyles = makeStyles((theme: Theme) => ({
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

export const BookingCancellationDialog: React.FC<Props> = ({
  booking,
  onSubmit,
  onCancel,
  onClose,
  open,
  similarBookings,
  group,
  memberTags,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [processing, setProcessing] = React.useState(false);
  const is_discardable = () => {
    if (
      !booking?.offer.meta_activity?.custom_restriction_rule ||
      booking?.offer.meta_activity?.custom_restriction_rule?.length === 0
    ) {
      return (booking || {}).is_discardable;
    }
    const custom_restriction_rule =
      booking?.offer.meta_activity?.custom_restriction_rule ?? [];
    const last_discard_minutes = custom_restriction_rule.reduce(
      (acc: number, crr: any) => {
        if ((memberTags || []).some((tag) => crr.tags.includes(tag))) {
          return Math.min(acc, crr.last_discard_minutes);
        }
        return acc;
      },
      booking?.offer.meta_activity?.last_discard_minutes,
    );

    return moment()
      .add(last_discard_minutes, 'minutes')
      .isBefore(moment(booking.offer.date_start));
  };

  return (
    <GenericResponsiveDialog open={!!open} onClose={onClose}>
      <DialogTitle>
        {booking && booking.offer && booking.offer.timezone_name
          ? t('consumer.booking.intro', {
              date: moment(booking.offer.date_start)
                .tz(booking.offer.timezone_name)
                .format('LLLL'),
            })
          : t('consumer.booking.discardBookingTitle')}
      </DialogTitle>
      <div className={classes.container}>
        {!booking ? (
          <CircularProgress />
        ) : (
          <>
            {is_discardable() && (
              <>
                {booking?.offer?.group ? (
                  <>
                    <Typography>
                      {t('consumer.booking.discardGroup1', {
                        group: group?.name,
                      })}
                    </Typography>
                    <Typography>
                      {t('consumer.booking.discardGroup2')}
                    </Typography>
                    <Typography>
                      {t('consumer.booking.discardGroupPossibleExplain')}
                    </Typography>
                    <Typography>
                      {t('consumer.booking.discardGroup3')}
                    </Typography>
                    <Alert className={classes.alert} severity="error">
                      {t('consumer.booking.discardAllGroup')}
                    </Alert>
                    {similarBookings?.map((b) => (
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
                            {t('consumer.booking.willNotBeRefund')}
                          </Typography>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <Typography>
                    {t('consumer.booking.discardPossibleExplain')}
                  </Typography>
                )}
              </>
            )}
            {!is_discardable() && (
              <>
                {booking?.offer?.group ? (
                  <>
                    <Typography>
                      {t('consumer.booking.discardGroup1', {
                        group: group?.name,
                      })}
                    </Typography>
                    <Typography>
                      {t('consumer.booking.discardGroup2')}
                    </Typography>
                    <Typography>
                      {t('consumer.booking.discardGroupImpossibleExplain')}
                    </Typography>
                    <Typography>
                      {t('consumer.booking.discardGroup3')}
                    </Typography>

                    <Alert className={classes.alert} severity="error">
                      {t('consumer.booking.discardAllGroup')}
                    </Alert>
                    {similarBookings?.map((b) => (
                      <div className={classes.item} key={b.id}>
                        {t(
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
                    {t('consumer.booking.discardImpossibleExplain')}
                  </Typography>
                )}
              </>
            )}
          </>
        )}
      </div>
      <DialogActions>
        <Button color="secondary" onClick={onCancel} disabled={processing}>
          {t('navigation.goBack')}
        </Button>
        {processing ? (
          <CircularProgress />
        ) : (
          <RedButton
            disabled={processing}
            onClick={() => {
              setProcessing(true);
              onSubmit({
                onSuccess: () => setProcessing(false),
                onError: () => setProcessing(false),
              });
            }}
          >
            {t('common.confirm')}
          </RedButton>
        )}
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

export default BookingCancellationDialog;
