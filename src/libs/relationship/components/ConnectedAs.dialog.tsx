import React, { useState } from 'react';
import { useTranslation, WithTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, Typography } from '@material-ui/core';
import { Member } from '#libs/member/types';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';

type OwnProps = {
  memberList: Array<Member>;
  onConfirm: (member: number) => void;
  closeDialog: () => void;
};
type Props = OwnProps & WithTranslation;
export const ConnectedAsDialog: React.FC<Props> = (props) => {
  const { memberList, onConfirm, closeDialog } = props;
  const { t } = useTranslation(['relationship']);
  const classes = useStyles();
  const [selectedMemberId, setSelectedMemberId] = useState<number>(null);
  const selectedValue = selectedMemberId
    ? {
        label: memberList?.find((member) => selectedMemberId === member?.id)
          ?.name,
        value: selectedMemberId,
      }
    : { label: t('connectedAs.selectRelation'), value: null };
  if (!memberList?.length) {
    return null;
  }
  return (
    <div className={classes.container}>
      <Typography variant="h6">{t('connectedAs.title')}</Typography>
      <Typography>{t('connectedAs.info')}</Typography>
      <Typography>{t('connectedAs.wichUser')}</Typography>
      <MaterialUISelector
        value={selectedValue}
        isMulti={false}
        onChange={(value) => setSelectedMemberId(value.value)}
        options={[...memberList].map((member) => ({
          value: member.id,
          label: member.name,
        }))}
      />
      <div className={classes.bottomButtons}>
        <Button
          onClick={() => {
            closeDialog();
          }}
        >
          {t('member.form.cancel')}
        </Button>
        <Button
          onClick={() => {
            onConfirm(selectedMemberId);
            closeDialog();
          }}
          variant="contained"
          color="primary"
          disabled={!selectedMemberId}
        >
          {t('member.form.confirm')}
        </Button>
      </div>
    </div>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
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
export default ConnectedAsDialog;
