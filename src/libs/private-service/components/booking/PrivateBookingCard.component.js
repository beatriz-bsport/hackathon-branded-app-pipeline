// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';

import MemberListItem from '../../../member/components/MemberMinimalListItem.component';
import TypographyMultiline from '../../../../components/TypographyMultiline.component';
import type { PrivateBookingWithRelatedFields } from '../../types';
import RedButton from '../../../../components/button/RedButton.component';

import CoachListItem from '../../../associated-coach/components/CoachListItem.component';
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';

type Props = {
  private_booking: PrivateBookingWithRelatedFields,
  goToMember: ?(id: number) => void,
  onDelete: () => void,

  classes: Object,
  t: TFunction,
};
export const PrivateBookingCard = (props: Props) => {
  const { private_booking } = props;
  if (
    !private_booking.private_slot ||
    !private_booking.private_service ||
    !private_booking.member
  ) {
    return (
      <div className={props.classes.container}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className={props.classes.container}>
      {props.private_booking.booking_status_code !== BOOKING_STATUS_OK.id ? (
        <Typography variant="h6" color="error">
          {props.t('privateBooking.isCancelled')}
        </Typography>
      ) : null}
      <Typography variant="h5">
        {private_booking.private_slot.private_service.name}
      </Typography>
      <Typography variant="h6">{private_booking.private_slot.name}</Typography>
      <Typography variant="subtitle2">
        {`${moment(private_booking.date_start).format('HH:mm')} - ${moment(
          private_booking.date_end,
        ).format('HH:mm')}`}
      </Typography>
      <MemberListItem
        member={private_booking.member}
        onClick={props.goToMember}
      />
      {private_booking.address ? (
        <TypographyMultiline>{private_booking.address}</TypographyMultiline>
      ) : null}
      {private_booking.coach ? (
        <CoachListItem coach={private_booking.coach} />
      ) : null}
      {private_booking.establishment ? (
        <EstablishmentListItem establishment={private_booking.establishment} />
      ) : null}
      {props.onDelete &&
      props.private_booking.booking_status_code === BOOKING_STATUS_OK.id ? (
        <div className={props.classes.buttonContainer}>
          <RedButton onClick={props.onDelete}>
            {props.t('privateBooking.cancel')}
          </RedButton>
        </div>
      ) : (
        <div className={props.classes.buttonContainer}>
          <RedButton onClick={props.onDelete}>
            {props.t('privateBooking.hardDelete')}
          </RedButton>
        </div>
      )}
    </div>
  );
};

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit * 2,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingTop: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(PrivateBookingCard);
