// @ts-nocheck
import React, { useState, useCallback, useMemo } from 'react';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Divider from '@material-ui/core/Divider';

import { useTranslation } from 'react-i18next';
import SlotSpecificEstablishmentPicker from './SlotSpecificEstablishmentPicker.component';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import { EstablishmentWithAssociatedId } from '#libs/establishment/types';

export type Props = {
  establishments: Array<EstablishmentWithAssociatedId>;
  onCancel: () => void;
  onSubmit: (restriction_on_associated_establishments: number[]) => void;
  isCoachProfile?: boolean;
};

export const SlotSpecificEstablishmentDialog: React.FC<Props> = ({
  establishments,
  onCancel,
  onSubmit,
  isCoachProfile,
}) => {
  const [selectedEstablishments, setSelectedEstablishments] = useState([]);

  const { t } = useTranslation('privateService');

  const activeEstablishments = useMemo(
    () => (establishments || []).filter((e) => !e.disabled),
    [establishments],
  );

  const selectOption = useCallback(
    (newValues: Array<{ label: string; value: string | number }>) => {
      setSelectedEstablishments(newValues.map((e) => e.value));
    },
    [setSelectedEstablishments],
  );

  const handleSubmit = useCallback(() => {
    const restriction_on_associated_establishments = selectedEstablishments.map(
      (establishmentId) =>
        activeEstablishments.find(
          (establishment) => establishment.id === establishmentId,
        ).associated_establishment_id,
    );
    onSubmit(restriction_on_associated_establishments);
  }, [activeEstablishments, onSubmit, selectedEstablishments]);

  return (
    <GenericResponsiveDialog open>
      <DialogTitle>
        {t('availabilitySlot.form.resourceSelector.title')}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <SlotSpecificEstablishmentPicker
          establishments={activeEstablishments}
          selectedEstablishments={selectedEstablishments}
          onSelectedEstablishmentsChange={selectOption}
          isCoachProfile={!!isCoachProfile}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('common:cancel')}</Button>
        <Button color="primary" onClick={handleSubmit}>
          {t('availabilitySlot.form.resourceSelector.submit')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

export default SlotSpecificEstablishmentDialog;
