// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import CoachListItem from '../../../associated-coach/components/CoachListItem.component';

type Props = {
  associatedCoachList: Array<Coach>,
  onSubmit: ({ coach: number }) => void,
  onClose: () => void,
  open: boolean,
};
export const PrivateBookingAttachCoachDialog = (props: Props) => {
  const { t } = useTranslation(['privateService']);
  return (
    <Dialog open={props.open}>
      <DialogTitle>{t('privateBooking.attachCoach.title')}</DialogTitle>
      <DialogContent>
        <Typography>{t('privateBooking.attachCoach.explain')}</Typography>
        {props.associatedCoachList
          .filter((c) => !c.disabled)
          .map((c) => (
            <CoachListItem
              noEdit
              onCoachSelected={() => {
                props.onSubmit({ coach: c.id });
              }}
              coach={c}
              key={c.id}
            />
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t('privateBooking.attachCoach.actions.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrivateBookingAttachCoachDialog;
