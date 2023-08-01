import React from 'react';
import { useTranslation } from 'react-i18next';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import CoachListItem from '../../../associated-coach/components/CoachListItem.component';
import ResourceAllocationConfirmDialog from '../slot-searcher/ResourceAllocationConfirmDialog.component';
import type { PrivateBooking, PrivateService, PrivateSlot } from '../../types';
import type { Coach } from '../../../associated-coach/types';
import { Establishment } from '../../../establishment/types';

type Props = {
  privateBooking: PrivateBooking<
    PrivateSlot,
    Coach,
    Establishment,
    PrivateService
  >;
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

  const [openAllocationModal, setOpenAllocationModal] = React.useState(false);

  const [selectedCoach, setSelectedCoach] = React.useState<Coach>(null);

  const handleCancelButton = () => {
    setOpenAllocationModal(false);
    setSelectedCoach(null);
  };

  const handleSubmitButton = () => {
    setOpenAllocationModal(false);
    updatePrivateBookingCoach(selectedCoach.associated_coach_id);
  };

  const handleCoachSelected = (coach: Coach) => () => {
    setSelectedCoach(coach);
    setOpenAllocationModal(true);
  };

  return (
    <>
      {openAllocationModal && (
        <ResourceAllocationConfirmDialog
          coach={selectedCoach}
          onCancel={handleCancelButton}
          onSubmit={handleSubmitButton}
          privateBooking={privateBooking}
        />
      )}
      <DialogTitle>{t('privateBooking.updateTime.title')}</DialogTitle>
      <DialogContent>
        <Typography>{t('privateBooking.updateCoach')}</Typography>
        {coaches?.map((coach) => (
          <CoachListItem
            key={coach.id}
            divider
            coach={coach}
            onCoachSelected={handleCoachSelected(coach)}
            selected={
              coach.associated_coach_id === privateBooking.associated_coach
            }
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsUpdateCoachFormOpen(false)}>
          {t('privateBooking.updateTime.cancel')}
        </Button>
      </DialogActions>
    </>
  );
};

export default PrivateBookingUpdateCoachDialog;
