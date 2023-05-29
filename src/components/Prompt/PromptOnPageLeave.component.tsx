import React from 'react';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import GenericResponsiveDialog from '../genericDialog/GenericResponsiveDialog';

type Props = {
  openPromptOnPageLeave: boolean;
  title: string;
  description: string;
  leaveWithoutSavingText: string;
  leaveWithSavingText: string;
  onLeaveWithoutSaving?: () => void;
  onLeaveWithSaving?: () => void;
  onCancel?: () => void;
  noFullScreen?: boolean;
};

const PromptOnPageLeave: React.FC<Props> = ({
  openPromptOnPageLeave,
  title,
  description,
  leaveWithoutSavingText,
  leaveWithSavingText,
  onLeaveWithoutSaving,
  onLeaveWithSaving,
  onCancel,
  noFullScreen,
}) => {
  const classes = useStyles();

  const history = useHistory();

  const [showPrompt, setShowPrompt] = React.useState(false);

  const [currentPath, setCurrentPath] = React.useState('');

  React.useEffect(() => {
    if (openPromptOnPageLeave) {
      history.block((prompt) => {
        setCurrentPath(prompt.pathname);
        setShowPrompt(true);
        return false;
      });
    } else {
      history.block(() => {});
    }

    return () => {
      history.block(() => {});
    };
  }, [history, openPromptOnPageLeave]);

  const handleSaveAndLeave = React.useCallback(() => {
    onLeaveWithSaving?.();
    history.block(() => {});
    history.push(currentPath);
  }, [currentPath, history, onLeaveWithSaving]);

  const handleLeaveWithoutSaving = React.useCallback(() => {
    onLeaveWithoutSaving?.();
    history.block(() => {});
    history.push(currentPath);
  }, [currentPath, history, onLeaveWithoutSaving]);

  const onCancelLeave = React.useCallback(() => {
    setShowPrompt(false);
    onCancel?.();
  }, [onCancel]);

  return (
    <GenericResponsiveDialog
      maxWidth="sm"
      open={showPrompt}
      onClose={onCancelLeave}
      noFullScreen={noFullScreen}
    >
      <DialogTitle disableTypography className={classes.modalTitle}>
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onCancelLeave} className={classes.closeIconButton}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1">{description}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleLeaveWithoutSaving}>
          {leaveWithoutSavingText}
        </Button>
        <Button
          onClick={handleSaveAndLeave}
          variant="contained"
          color="primary"
        >
          {leaveWithSavingText}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles(() => ({
  modalTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeIconButton: {
    padding: 0,
  },
}));

export default React.memo(PromptOnPageLeave);
