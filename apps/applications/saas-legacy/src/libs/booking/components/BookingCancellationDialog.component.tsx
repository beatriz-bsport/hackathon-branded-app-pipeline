import React from 'react';

import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import OfferListItemV2 from '#src/libs/offer/components/OfferListItemV2.component';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import type { Booking } from '#src/libs/booking/types';
import type { OffersGroup } from '#src/libs/group-offer/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { Offer } from '#src/libs/offer/types';
import RedButton from '../../../components/button/RedButton.component';
import { OptionCallback } from '../../../state/types';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';

type Props = {
  booking?: Booking<Offer<number, number, MetaActivity>>;
  onSubmit: (options: OptionCallback) => void;
  onCancel: () => void;
  onClose?: () => void;
  open: boolean;
  similarBookings: Booking[];
  similarBookingsLoading: boolean;
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
  similarBookingsLoading,
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
      // @ts-expect-error
      return (booking || {}).is_discardable;
    }
    const custom_restriction_rule =
      booking?.offer.meta_activity?.custom_restriction_rule ?? [];
    const last_discard_minutes = custom_restriction_rule.reduce(
      (acc: number, crr: any) => {
        if ((memberTags ?? []).some((tag) => crr.tags.includes(tag))) {
          return Math.min(acc, crr.last_discard_minutes);
        }
        return acc;
      },
      booking?.offer.meta_activity?.last_discard_minutes,
    );

    return (
      DateTime.now().plus({ minute: last_discard_minutes }) <
      DateTime.fromISO(booking.offer.date_start)
    );
  };
  return (
    <GenericResponsiveDialog onClose={onClose} open={!!open}>
      {booking?.offer?.group && similarBookingsLoading && <LinearProgress />}
      <DialogTitle>
        {booking && booking.offer && booking.offer.timezone_name
          ? t('consumer.booking.intro', {
              date: formatAsDatetimeAdapted(
                booking.offer.date_start,
                'DDDD t',
                booking.offer.timezone_name,
              ),
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
                      <div key={b.id} className={classes.item}>
                        {/* @ts-expect-error */}
                        <OfferListItemV2
                          divider={false}
                          offer={{
                            // @ts-expect-error
                            ...b.offer,
                            // @ts-expect-error
                            coach: b.coach,
                            // @ts-expect-error
                            customLevel: b.customLevel,
                          }}
                        />
                        {/* @ts-expect-error */}
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
                      <div key={b.id} className={classes.item}>
                        {/* @ts-expect-error */}
                        <OfferListItemV2
                          divider={false}
                          offer={{
                            // @ts-expect-error
                            ...b.offer,
                            // @ts-expect-error
                            coach: b.coach,
                            // @ts-expect-error
                            customLevel: b.customLevel,
                          }}
                        />
                        {t(
                          // @ts-expect-error
                          b.is_discardable
                            ? 'consumer.booking.willBeRefund'
                            : 'consumer.booking.willNotBeRefund',
                          {
                            day: DateTime.fromISO(
                              b.offer_date_start,
                            ).toLocaleString(DateTime.DATE_SHORT),
                          },
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
        <Button color="secondary" disabled={processing} onClick={onCancel}>
          {t('navigation.goBack')}
        </Button>
        {processing ? (
          <CircularProgress />
        ) : (
          <RedButton
            disabled={
              processing || (booking?.offer?.group && similarBookingsLoading)
            }
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
