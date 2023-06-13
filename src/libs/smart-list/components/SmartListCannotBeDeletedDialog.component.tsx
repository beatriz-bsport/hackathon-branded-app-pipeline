import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';

import GenericDialogWithIconHeaderMUI from '#components/genericDialog/GenericDialogWithIconHeaderMUI.component';

import WarningIcon from '#components/icons/WarningIcon.component';
import { Cadence } from '#libs/sequential_marketingDEPRECATED/types';

export type Props = {
  onCancel: () => void;
  open: boolean;
  cadences: Cadence[];
};

export const SmartListCannotBeDeletedDialog: React.FC<Props> = ({
  open,
  cadences,
  onCancel,
}) => {
  const { t } = useTranslation('smartList');
  return (
    <GenericDialogWithIconHeaderMUI
      open={open}
      headerIcon={<WarningIcon />}
      headerTitle={t('cannotBeDeletedDialog.title')}
      onCancelClick={onCancel}
      onCancelText={t('cannotBeDeletedDialog.cancel')}
      content={t('cannotBeDeletedDialog.content', {
        count: cadences?.length || 0,
      })}
    >
      {cadences?.map(
        (cadence) =>
          !!cadence && (
            <Typography key={cadence.id}>{`• ${cadence.name}`}</Typography>
          ),
      )}
    </GenericDialogWithIconHeaderMUI>
  );
};

export default React.memo(SmartListCannotBeDeletedDialog);
