import React from 'react';
import { compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import { useMediaQuery, useTheme, Theme, makeStyles } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  children: React.ReactNode;
  isWidget: boolean;
  open: boolean;
  maxWidth: 'sm' | 'md' | 'xs' | 'lg' | 'xl';
  fullWidth: boolean;
  onClose?: () => void;
};
type Props = OwnProps;

const useStyles = makeStyles((theme: Theme) => ({
  dialogHeader: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
}));
export const CustomFormViewDialog = (props: Props) => {
  const { isWidget, open, maxWidth, fullWidth, children, onClose } = props;
  const theme = useTheme();
  const { t } = useTranslation('member');
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullScreen={isWidget || fullScreen}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <div className={classes.dialogHeader}>
        <DialogTitle>
          {t('forms.title')} <Divider />
        </DialogTitle>
      </div>

      {children}
    </Dialog>
  );
};
export default compose<any, OwnProps>(CustomFormViewDialog);
