import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import GenericDialogWithIconHeaderMUI from '#src/components/genericDialog/GenericDialogWithIconHeaderMUI.component';

import WarningIcon from '#src/components/icons/WarningIcon.component';
import type { Cadence } from '#src/libs/sequential_marketing/types';

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
      content={
        cadences?.length === 1
          ? t('audience.content', {
              workflow_name: cadences[0].name ?? '',
            })
          : t('audience.content_plural', {
              count: cadences?.length ?? 0,
            })
      }
      headerIcon={<WarningIcon />}
      headerTitle={t('cannotBeDeletedDialogAudience.title')}
      onCancelClick={onCancel}
      onCancelText={t('cannotBeDeletedDialog.cancel')}
      open={open}
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
