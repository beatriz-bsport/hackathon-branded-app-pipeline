import React, { useState } from 'react';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import EstablishmentSelector from '#libs/establishment/components/EstablishmentSelector.component';
import InfoBox from '#components/box/InfoBox.component';
import { EstablishmentWithAssociatedId } from '#libs/establishment/types';

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  infobox: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export type Props = {
  establishments: Array<EstablishmentWithAssociatedId>;
  selectedEstablishments: Array<number>;
  isCoachProfile?: boolean;
  onSelectedEstablishmentsChange: (
    newValues: Array<{ label: string; value: string | number }>,
  ) => void;
};

export const SlotSpecificEstablishmentPicker: React.FC<Props> = ({
  establishments,
  selectedEstablishments,
  onSelectedEstablishmentsChange,
  isCoachProfile,
}) => {
  const [isSpecificSlot, setIsSpecificSlot] = useState(false);

  const classes = useStyles();

  const { t } = useTranslation('privateService');

  const handleToggle = () => {
    // If we deactivate the switch, reset selectedEstablishements
    if (isSpecificSlot) onSelectedEstablishmentsChange([]);
    setIsSpecificSlot(!isSpecificSlot);
  };

  return (
    <div>
      <FormControlLabel
        className={classes.input}
        control={
          <Switch
            checked={isSpecificSlot}
            color="primary"
            onChange={handleToggle}
            size="small"
          />
        }
        label={t('availabilitySlot.specificAvailabilityForm.switchLabel')}
      />
      <InfoBox
        className={classes.infobox}
        content={t(
          `availabilitySlot.specificAvailabilityForm.${
            isCoachProfile ? 'infoForCoach' : 'info'
          }`,
        )}
      />
      {isSpecificSlot && (
        <EstablishmentSelector
          establishments={establishments}
          selectedEstablishments={selectedEstablishments}
          selectOption={onSelectedEstablishmentsChange}
        />
      )}
    </div>
  );
};

export default SlotSpecificEstablishmentPicker;
