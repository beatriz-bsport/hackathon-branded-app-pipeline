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
      open={props.open}
      onClose={props.closeDialog}
      title={t('spotCreatorForm.title')}
      subtitle={t('spotCreatorForm.subtitle')}
    >
      <CanvasSpotCreatorForm {...props} />
    </GenericResponsiveDrawer>
  );
};
export default CanvasSpotCreatorDrawer;
