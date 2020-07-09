// @flow

import React from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import CoachListItem from '../../../associated-coach/components/CoachListItem.component';

type Props = {
  privateBooking: PrivateBooking,
  coaches: Array<Coach>,
  updatePrivateBookingCoach: (associatedCoachId: number) => void,
  setIsUpdateCoachFormOpen: (boolean) => void,
};

export const PrivateBookingUpdateCoachDialog = (props: Props) => {
  const { t } = useTranslation(['privateService']);

  return (
    <div>
      <DialogTitle>{t('privateBooking.updateTime.title')}</DialogTitle>
      <DialogContent>
        <Typography>{t('privateBooking.updateCoach')}</Typography>
        {props.coaches.map((coach) => (
          <CoachListItem
            key={coach.id}
            divider
            coach={coach}
            selected={
              coach.associated_coach_id ===
              props.privateBooking.associated_coach
            }
            onCoachSelected={() =>
              props.updatePrivateBookingCoach(coach.associated_coach_id)
            }
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setIsUpdateCoachFormOpen(false)}>
          {t('privateBooking.updateTime.cancel')}
        </Button>
      </DialogActions>
    </div>
  );
};

export default PrivateBookingUpdateCoachDialog;
