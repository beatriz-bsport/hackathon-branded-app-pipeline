import React from 'react';

import { useTranslation } from 'react-i18next';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import CanvasSpotCreatorForm from './CanvasSpotCreatorForm.component';
import { SpotType } from '#libs/spot-scheduling/types';

type Props = {
  id: number;
  open: boolean;
  closeDialog: () => void;
  onCreateSpot: (spotType: SpotType) => void;
  onUpdateSpot: (spotType: SpotType) => void;
  spotTypeToUpdate: boolean | SpotType;
};

export const CanvasSpotCreatorDrawer = (props: Props) => {
  const { t } = useTranslation('spotScheduling');
  return (
    <GenericResponsiveDrawer
      onClose={props.closeDialog}
      open={props.open}
      subtitle={t('spotCreatorForm.subtitle')}
      title={t('spotCreatorForm.title')}
    >
      <CanvasSpotCreatorForm {...props} />
    </GenericResponsiveDrawer>
  );
};
export default CanvasSpotCreatorDrawer;
