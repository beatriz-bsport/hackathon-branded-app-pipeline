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
  // facultative property, meant to display the modal on page leave, if the data of a given input is 'dirty' (i.e. unsaved).
  // The terminology 'clean' is meant to handle the cases with the field left as undefined.
  isDataClean?: boolean;
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
  isDataClean,
}) => {
  const classes = useStyles();

  const history = useHistory();

  const [showPrompt, setShowPrompt] = React.useState(false);

  const [currentPath, setCurrentPath] = React.useState('');

  React.useEffect(() => {
    if (openPromptOnPageLeave && !isDataClean) {
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
  }, [history, openPromptOnPageLeave, isDataClean]);

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
      noFullScreen={noFullScreen}
      onClose={onCancelLeave}
      open={showPrompt}
    >
      <DialogTitle disableTypography className={classes.modalTitle}>
        <Typography variant="h6">{title}</Typography>
        <IconButton className={classes.closeIconButton} onClick={onCancelLeave}>
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
          color="primary"
          onClick={handleSaveAndLeave}
          variant="contained"
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
