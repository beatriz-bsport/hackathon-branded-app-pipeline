import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import EmailPreview from '#libs/email-editor/components/EmailPreview.components';

type Props = {
  fullScreen: boolean;
  html: any;
  loading?: boolean;
  onClose: () => void;
  open: boolean;
  title?: string;
};

const CommunicationMailPreview = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('communication');
  return (
    <Dialog open={props.open} fullScreen={props.fullScreen}>
      <DialogContent>
        <EmailPreview
          title={props.title}
          html={props.html}
          loading={props.loading}
        />
      </DialogContent>
      <DialogActions>
        <Button className={classes.buttonClose} onClick={props.onClose}>
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogTitle: {
    fontWeight: 'bold',
  },
  buttonClose: {
    color: theme.palette.text.secondary,
  },
}));

export default CommunicationMailPreview;
