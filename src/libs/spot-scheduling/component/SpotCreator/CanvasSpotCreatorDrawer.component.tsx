import React from 'react';

import { useTranslation } from 'react-i18next';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import type {
  SpotNameFormatCustomization,
  SpotType,
} from '#src/libs/spot-scheduling/types';
import CanvasSpotCreatorForm from './CanvasSpotCreatorForm.component';

type Props = {
  id: number;
  open: boolean;
  closeDialog: () => void;
  onCreateSpot: (
    spotType: SpotType,
    name_format_customization: SpotNameFormatCustomization,
  ) => void;
  onUpdateSpot: (
    spotType: SpotType,
    name_format_customization: SpotNameFormatCustomization,
  ) => void;
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
