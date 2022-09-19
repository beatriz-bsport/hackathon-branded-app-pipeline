import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomMuiDialog from '#components/genericDialog/CustomMuiDialog.component';

type Props = {
  onCancelClick: () => void;
  onConfirmClick: () => void;
};

export const PauseDeleteDialog = (props: Props) => {
  const { t } = useTranslation('subscription');
  const buttons = [
    {
      label: t('pause.dialogs.common.cancel'),
      variant: 'text',
      onClick: props.onCancelClick,
    },
    {
      label: t('pause.dialogs.common.confirm'),
      variant: 'text',
      onClick: props.onConfirmClick,
      color: 'primary',
    },
  ];
  return (
    <CustomMuiDialog
      open
      title={t('pause.dialogs.delete.title')}
      buttons={buttons}
      content={t('pause.dialogs.delete.content')}
    />
  );
};

export default PauseDeleteDialog;
