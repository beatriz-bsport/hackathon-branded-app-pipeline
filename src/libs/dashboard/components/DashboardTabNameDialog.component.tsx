import React, { useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { useTranslation } from 'react-i18next';

type Props = {
  tabIndexToRename: number | null;
  initialValue: string;
  onClose: () => void;
  addNewTab: (tabName: string) => void;
  renameTab: (tabName: string, indexToRename: number) => void;
};

export const DashboardTabNameDialog = (props: Props) => {
  const [tabName, setTabName] = useState(() => props.initialValue);

  const { t } = useTranslation(['dashboard']);

  return (
    <Dialog open>
      <DialogTitle>
        {props.tabIndexToRename === null
          ? t('tabNameDialog.titleAdd')
          : t('tabNameDialog.titleRename')}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTabName(e.target.value)
          }
          placeholder={t('tabNameDialog.placeholder')}
          value={tabName}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{t('resetModal.cancel')}</Button>
        <Button
          color="primary"
          disabled={!tabName.length}
          onClick={() => {
            if (props.tabIndexToRename === null) {
              props.addNewTab(tabName);
            } else {
              props.renameTab(tabName, props.tabIndexToRename);
            }
          }}
        >
          {t('resetModal.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DashboardTabNameDialog;
