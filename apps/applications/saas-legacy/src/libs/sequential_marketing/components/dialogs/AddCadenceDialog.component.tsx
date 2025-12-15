import React from 'react';
import { useTranslation } from 'react-i18next';

import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import CadenceTemplatePicker from '#src/libs/sequential_marketing/components/CadenceTemplatePicker.component';
import type { CadenceConfigData } from '#src/libs/sequential_marketing/cadence_templates/types';

const DIALOG_MAX_WIDTH = 1130;
const DIALOG_MAX_HEIGHT = 800;

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    maxWidth: DIALOG_MAX_WIDTH,
    maxHeight: DIALOG_MAX_HEIGHT,
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

type Props = {
  isOpen: boolean;
  closeDialog: () => void;
  createFromScratch: () => void;
  onTemplateUse: (config: CadenceConfigData) => void;
};

const AddCadenceDialog = ({
  isOpen,
  closeDialog,
  createFromScratch,
  onTemplateUse,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('marketing');

  return (
    <Dialog fullWidth open={isOpen} PaperProps={{ className: classes.root }}>
      <div className={classes.dialogTitle}>
        <Typography variant="h6">
          {t(`audience.template.addCadenceDialog.title`)}
        </Typography>
        <IconButton onClick={closeDialog} size="small">
          <CloseIcon />
        </IconButton>
      </div>
      <CadenceTemplatePicker
        createFromScratch={createFromScratch}
        onTemplateUse={onTemplateUse}
      />
    </Dialog>
  );
};

export default React.memo(AddCadenceDialog);
