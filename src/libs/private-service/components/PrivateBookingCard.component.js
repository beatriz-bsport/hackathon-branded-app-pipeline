// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';

import MemberListItem from '../../member/components/MemberMinimalListItem.component';
import TypographyMultiline from '../../../components/TypographyMultiline.component';
import type { PrivateBookingWithRelatedFields } from '../types';
import RedButton from '../../../components/button/RedButton.component';

type Props = {
  private_booking: PrivateBookingWithRelatedFields,
  goToMember: ?(id: number) => void,
  onDelete: () => void,

  classes: Object,
  t: TFunction,
};
export const PrivateBookingCard = (props: Props) => {
  const { private_booking } = props;
  return (
    <div className={props.classes.container}>
      {props.private_booking.booking_status_code !== BOOKING_STATUS_OK.id ? (
        <Typography variant="h6" color="error">
          {props.t('privateBooking.isCancelled')}
        </Typography>
      ) : null}
      <Typography variant="h6">
        {private_booking.private_service.name}
      </Typography>
      <Typography variant="subtitle2">
        {`${moment(private_booking.date_start).format('HH:mm')} - ${moment(
          private_booking.date_end,
        ).format('HH:mm')}`}
      </Typography>
      <Typography variant="subtitle2">
        {private_booking.private_slot.name}
      </Typography>
      <TypographyMultiline>{private_booking.address}</TypographyMultiline>
      <MemberListItem
        member={private_booking.member}
        onClick={props.goToMember}
      />
      {props.onDelete &&
      props.private_booking.booking_status_code === BOOKING_STATUS_OK.id ? (
        <div className={props.classes.buttonContainer}>
          <RedButton onClick={props.onDelete}>
            {props.t('privateBooking.cancel')}
          </RedButton>
        </div>
      ) : null}
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
