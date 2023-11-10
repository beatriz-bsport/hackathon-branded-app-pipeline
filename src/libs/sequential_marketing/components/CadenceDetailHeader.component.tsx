import React from 'react';

import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import EditIcon from '@material-ui/icons/Edit';
import BuildIcon from '@material-ui/icons/Build';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import CadenceCreateAndUpdateForm from '#libs/sequential_marketing/components/form/CadenceCreateAndUpdateForm.component';
import ToolTip from '#components/Tooltip.component';
import StopBuildIcon from '#components/icons/StopBuildIcon.component';

import type { OptionCallback } from '../../../state/types';
import type { Cadence } from '#libs/sequential_marketing/types';
import CadenceUtilityDialog from '#libs/sequential_marketing/components/dialogs/DialogUtility';

type Props = {
  cadence: Cadence;
  loading: boolean;
  cadenceEditMode: boolean;
  hidePauseDialogCadenceIds: number[];
  goBack: () => void;
  onEdit: (data: { name: string }, options: OptionCallback) => void;
  onActivate: (options?: OptionCallback) => void;
  onShutOff: (options?: OptionCallback) => void;
  switchCadenceEditMode: () => void;
  doNotDisplayPauseDialogAnymore: (cadenceId: number) => void;
};

type HeaderActionsProps = {
  cadence: Cadence;
  loading: boolean;
  hidePauseDialogCadenceIds: number[];
  cadenceEditMode: boolean;
  goBack: () => void;
  setOpenEditDialog: (open: boolean) => void;
  setOpenActivateDialog: (open: boolean) => void;
  openPauseDialog: () => void;
  switchCadenceEditMode: () => void;
  handlePause: (isChecked: boolean) => void;
};

const CadenceDetailHeaderActions: React.FC<HeaderActionsProps> = React.memo(
  ({
    cadence,
    cadenceEditMode,
    hidePauseDialogCadenceIds,
    loading,
    goBack,
    handlePause,
    openPauseDialog,
    setOpenActivateDialog,
    setOpenEditDialog,
    switchCadenceEditMode,
  }) => {
    const { t } = useTranslation('marketing');
    const classes = useStyles();

    const canBeActivated = cadence.initialized;

    const handleOpenEditDialog = React.useCallback(
      () => setOpenEditDialog?.(true),
      [setOpenEditDialog],
    );

    const handleOpenActivateDialog = React.useCallback(
      () => setOpenActivateDialog?.(true),
      [setOpenActivateDialog],
    );

    const handleOpenPauseDialog = React.useCallback(() => {
      if (!hidePauseDialogCadenceIds.includes(cadence.id)) {
        openPauseDialog?.();
      } else {
        handlePause(false);
      }
    }, [cadence.id, handlePause, hidePauseDialogCadenceIds, openPauseDialog]);

    return (
      <>
        <div className={classes.leftInnerContainer}>
          <ToolTip title={t('cadence.back')}>
            <IconButton disabled={loading} onClick={goBack}>
              <KeyboardArrowLeftIcon />
            </IconButton>
          </ToolTip>

          <div className={classes.nameWithIcon}>
            <Typography className={classes.titleTypo} variant="h6">
              {cadence?.name}
            </Typography>
            <ToolTip title={t('cadence.form.modify_name_label')}>
              <IconButton
                disabled={loading || cadenceEditMode || cadence?.active}
                onClick={handleOpenEditDialog}
              >
                <EditIcon />
              </IconButton>
            </ToolTip>
          </div>
        </div>

        <div className={classes.rightInnerContainer}>
          <div className={classes.actions}>
            {cadence?.active ? (
              <Button
                color="primary"
                disabled={loading || cadenceEditMode}
                onClick={handleOpenPauseDialog}
                variant="contained"
              >
                <PauseIcon className={classes.leftIcon} />
                {t('cadence.shutOff')}
              </Button>
            ) : (
              <ToolTip
                title={
                  canBeActivated
                    ? t('cadence.activate.button')
                    : t('cadence.activate.setupBeforeActivationHelper')
                }
              >
                <div>
                  <Button
                    color="primary"
                    disabled={loading || cadenceEditMode || !canBeActivated}
                    onClick={handleOpenActivateDialog}
                    variant="outlined"
                  >
                    <PlayArrowIcon className={classes.leftIcon} />
                    {t('cadence.activate.button')}
                  </Button>
                </div>
              </ToolTip>
            )}
            <ToolTip
              title={
                cadenceEditMode
                  ? t('cadence.exitEditModeLabel')
                  : t('cadence.editModeLabel')
              }
            >
              <Button
                color="secondary"
                disabled={cadence?.active || loading || !canBeActivated}
                onClick={switchCadenceEditMode}
                variant="contained"
              >
                {cadenceEditMode ? (
                  <>
                    <StopBuildIcon className={classes.leftIcon} />
                    {t('cadence.exitEditMode')}
                  </>
                ) : (
                  <>
                    <BuildIcon className={classes.leftIcon} />
                    {t('cadence.editMode')}
                  </>
                )}
              </Button>
            </ToolTip>
          </div>
        </div>
      </>
    );
  },
);

export const CadenceDetailHeader: React.FC<Props> = ({
  cadence,
  cadenceEditMode,
  hidePauseDialogCadenceIds,
  loading,
  doNotDisplayPauseDialogAnymore,
  goBack,
  onActivate,
  onEdit,
  onShutOff,
  switchCadenceEditMode,
}) => {
  const classes = useStyles();

  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openActivateDialog, setOpenActivateDialog] = React.useState(false);
  const [openPauseDialog, setOpenPauseDialog] = React.useState(false);

  const handleCloseEditForm = React.useCallback(
    () => setOpenEditDialog(false),
    [],
  );

  const handleCloseActivateDialog = React.useCallback(
    () => setOpenActivateDialog(false),
    [],
  );

  const handleClosePauseDialog = React.useCallback(
    () => setOpenPauseDialog(false),
    [],
  );

  const handleOpenPauseDialog = React.useCallback(
    () => setOpenPauseDialog(true),
    [],
  );

  const handleEdit = React.useCallback(
    (data: { name: string }, options: OptionCallback) =>
      onEdit?.(data, {
        onSuccess: () => {
          options?.onSuccess?.();
          setOpenEditDialog(false);
        },
        onError() {
          options?.onError?.();
        },
      }),
    [onEdit],
  );

  const handleActivate = React.useCallback(() => {
    onActivate?.({
      onSuccess: () => setOpenActivateDialog(false),
      onError: () => setOpenActivateDialog(false),
    });
  }, [onActivate]);

  const handlePause = React.useCallback(
    (isChecked: boolean) => {
      onShutOff?.({
        onSuccess: () => setOpenPauseDialog(false),
        onError: () => setOpenPauseDialog(false),
      });
      isChecked && doNotDisplayPauseDialogAnymore(cadence.id);
    },
    [doNotDisplayPauseDialogAnymore, cadence.id, onShutOff],
  );

  const activateDialogVariant = 'activate';
  const pauseDialogVariant = 'pause-workflow';

  if (loading || !cadence) {
    return (
      <div className={classes.centerVerticalContent}>
        <div className={classes.flexContent}>
          <div className={classes.leftInnerContainer}>
            <CircularProgress size={40} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={classes.centerVerticalContent}>
        <div className={classes.flexContent}>
          <CadenceDetailHeaderActions
            cadence={cadence}
            cadenceEditMode={cadenceEditMode}
            goBack={goBack}
            handlePause={handlePause}
            hidePauseDialogCadenceIds={hidePauseDialogCadenceIds}
            loading={loading}
            openPauseDialog={handleOpenPauseDialog}
            setOpenActivateDialog={setOpenActivateDialog}
            setOpenEditDialog={setOpenEditDialog}
            switchCadenceEditMode={switchCadenceEditMode}
          />
        </div>
      </div>
      {openEditDialog && !loading && (
        <CadenceCreateAndUpdateForm
          open
          initial={cadence}
          loading={false}
          onCancel={handleCloseEditForm}
          onSubmit={handleEdit}
        />
      )}
      <CadenceUtilityDialog
        onCancel={handleCloseActivateDialog}
        onConfirm={handleActivate}
        open={openActivateDialog}
        variant={activateDialogVariant}
      />
      <CadenceUtilityDialog
        onCancel={handleClosePauseDialog}
        onConfirm={handlePause}
        open={openPauseDialog}
        variant={pauseDialogVariant}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  centerVerticalContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  flexContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    flexWrap: 'wrap',
  },
  leftInnerContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  rightInnerContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  titleTypo: {
    textOverflow: 'ellipsis',
    maxWidth: '200px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  nameWithIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  triggerCards: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
  },
}));

export default React.memo(CadenceDetailHeader);
