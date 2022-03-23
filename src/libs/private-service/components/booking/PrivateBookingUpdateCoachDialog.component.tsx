import React from 'react';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import { LinearProgress, makeStyles } from '@material-ui/core';
import red from '@material-ui/core/colors/red';

import CoachListItem from '../../../associated-coach/components/CoachListItem.component';
import type { PrivateBooking, PrivateSlot } from '../../types';
import type { Coach } from '../../../associated-coach/types';
import { resourceAllocationChecker as resourceAllocationCheckerAPI } from '../../api';

type Props = {
  privateBooking: PrivateBooking<PrivateSlot>;
  coaches: Array<Coach>;
  updatePrivateBookingCoach: (associatedCoachId: number) => void;
  setIsUpdateCoachFormOpen: (boolean: boolean) => void;
};

export const PrivateBookingUpdateCoachDialog: React.FC<Props> = ({
  privateBooking,
  coaches,
  updatePrivateBookingCoach,
  setIsUpdateCoachFormOpen,
}) => {
  const { t } = useTranslation('privateService');
  const classes = useStyles();

  const [openedModal, setOpenedModal] = React.useState(false);

  const [selectedCoach, setSelectedCoach] = React.useState(
    privateBooking.associated_coach,
  );
  const [coachIsLoading, setCoachIsLoading] = React.useState(false);

  const handleCancelButton = () => {
    setOpenedModal(false);
    setSelectedCoach(privateBooking.associated_coach);
  };

  const handleSendButton = (associated_coach_id: number) => {
    setOpenedModal(false);
    updatePrivateBookingCoach(associated_coach_id);
  };

  const handleCoachSelected = (coach: Coach) => async () => {
    setCoachIsLoading(true);
    setOpenedModal(true);

    try {
      const response = await resourceAllocationCheckerAPI(
        privateBooking.private_slot.id,
        'coach',
        coach.id,
        privateBooking.date_start,
      );
      const error = !response?.data.find(
        (interval: string[]) =>
          moment(privateBooking.date_start).isSameOrAfter(interval[0]) &&
          moment(privateBooking.date_start).isSameOrBefore(interval[1]),
      );
      if (error) {
        setCoachIsLoading(false);
        setSelectedCoach(coach.associated_coach_id);
      } else {
        setOpenedModal(false);
        updatePrivateBookingCoach(coach.associated_coach_id);
      }
    } catch (err) {
      setCoachIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog
        open={openedModal}
        className={classes.dialogContainer}
        aria-labelledby="alert-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        {coachIsLoading ? <LinearProgress /> : null}
        <DialogTitle>{t('privateBooking.updateTime.title')}</DialogTitle>
        {!coachIsLoading ? (
          <>
            <DialogContent className={classes.titleWarning}>
              <InfoOutlineIcon
                className={classes.iconInfo}
                fontSize="small"
                color="error"
              />
              {t('resource.allocationWarning.coach')}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleSendButton(selectedCoach)}>
                {t('privateBooking.updateTime.title')}
              </Button>
              <Button onClick={handleCancelButton}>
                {t('privateBooking.updateTime.cancel')}
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogContent />
            <DialogActions />
          </>
        )}
      </Dialog>
      <DialogTitle>{t('privateBooking.updateTime.title')}</DialogTitle>
      <DialogContent>
        <Typography>{t('privateBooking.updateCoach')}</Typography>
        {coaches.map((coach) => (
          <CoachListItem
            key={coach.id}
            divider
            coach={coach}
            selected={
              coach.associated_coach_id === privateBooking.associated_coach
            }
            onCoachSelected={handleCoachSelected(coach)}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsUpdateCoachFormOpen(false)}>
          {t('privateBooking.updateTime.cancel')}
        </Button>
      </DialogActions>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  titleWarning: { color: red.A200 },
  iconInfo: { marginRight: theme.spacing(2) },
  dialogContainer: {
    overflow: 'hidden',
  },
}));

export default PrivateBookingUpdateCoachDialog;
