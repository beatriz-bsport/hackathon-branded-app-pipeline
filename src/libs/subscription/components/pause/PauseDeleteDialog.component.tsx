// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomMuiDialog from '#components/genericDialog/CustomMuiDialog.component';

type Props = {
  deleteContent: string;
  onCancelClick: () => void;
  onConfirmClick: () => void;
  open: boolean;
};

export const PauseDeleteDialog = (props: Props) => {
  const { t } = useTranslation('subscription');
  const buttons = [
    {
      label: t('pauseV2.common.actions.cancel'),
      variant: 'text',
      onClick: props.onCancelClick,
    },
    {
      label: t('pauseV2.common.actions.confirm'),
      variant: 'text',
      onClick: props.onConfirmClick,
      color: 'primary',
    },
  ];
  return (
    <CustomMuiDialog
      open={props.open}
      title={t('pauseV2.common.deleteDialog.title')}
      buttons={buttons}
      content={props.deleteContent}
    />
  );
};

export default PauseDeleteDialog;
