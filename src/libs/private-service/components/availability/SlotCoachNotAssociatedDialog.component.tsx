import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Divider from '@material-ui/core/Divider';

import { useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

export type Props = {
  onClose: (arg: boolean) => void;
};

const useStyle = makeStyles(() => ({
  alert: {
    alignItems: 'center',
  },
}));

export const SlotCoachNotAssociatedDialog: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation('privateService');
  const classes = useStyle();

  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return (
    <GenericResponsiveDialog open>
      <DialogTitle>
        {t('availabilitySlot.notAssociatedDialog.title')}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Alert className={classes.alert} severity="info">
          {t('availabilitySlot.notAssociatedDialog.info')}
        </Alert>
        <FormControlLabel
          control={<Checkbox onChange={handleChange} />}
          label={t('availabilitySlot.notAssociatedDialog.checkbox')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(isChecked)}>
          {t('availabilitySlot.notAssociatedDialog.close')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

export default SlotCoachNotAssociatedDialog;
