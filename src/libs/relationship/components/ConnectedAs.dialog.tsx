import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, Typography } from '@material-ui/core';

import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import type { Member } from '#libs/member/types';

type Props = {
  memberList: Member[];
  onConfirm: (member: number) => void;
  closeDialog: () => void;
};

type SelectorOption = {
  value: number;
  label: string;
};

export const ConnectedAsDialog: React.FC<Props> = ({
  memberList,
  onConfirm,
  closeDialog,
}) => {
  const { t } = useTranslation('relationship');

  const classes = useStyles();

  const [selectedMemberId, setSelectedMemberId] = useState<number>(null);

  const handleChange = useCallback(
    (value: SelectorOption) => setSelectedMemberId(value.value),
    [],
  );

  const handleCancel = useCallback(() => closeDialog?.(), [closeDialog]);

  const handleConfirm = useCallback(() => {
    onConfirm?.(selectedMemberId);
    closeDialog?.();
  }, [closeDialog, onConfirm, selectedMemberId]);

  const selectedValue = useMemo(
    () =>
      selectedMemberId
        ? {
            label: memberList?.find((member) => selectedMemberId === member?.id)
              ?.name,
            value: selectedMemberId,
          }
        : { label: t('connectedAs.selectRelation'), value: null },
    [memberList, selectedMemberId, t],
  );

  const options = useMemo(
    () =>
      [...memberList].map((member) => ({
        value: member.id,
        label: member.name,
      })),
    [memberList],
  );

  if (!memberList?.length) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Typography variant="h6">{t('connectedAs.title')}</Typography>
      <Typography>{t('connectedAs.info')}</Typography>
      <Typography>{t('connectedAs.wichUser')}</Typography>
      <MaterialUISelector
        onChange={handleChange}
        options={options}
        value={selectedValue}
      />
      <div className={classes.bottomButtons}>
        <Button onClick={handleCancel}>{t('member.form.cancel')}</Button>
        <Button
          color="primary"
          disabled={!selectedMemberId}
          onClick={handleConfirm}
          variant="contained"
        >
          {t('member.form.confirm')}
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  bottomButtons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
  },
}));

export default React.memo(ConnectedAsDialog);
