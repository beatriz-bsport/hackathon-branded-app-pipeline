import React from 'react';

import { useTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
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
import CadenceActivateDialog from '#libs/sequential_marketing/components/CadenceActivateDialog.component';
import ToolTip from '#components/Tooltip.component';
import StopBuildIcon from '#components/icons/StopBuildIcon.component';
import { isMinimalCadenceConfigurationCompleted } from '#libs/sequential_marketing/utils';

import type { OptionCallback } from '../../../state/types';
import type { Cadence } from '#libs/sequential_marketing/types';

type Props = {
  cadence: Cadence;
  loading: boolean;
  goBack: () => void;
  onEdit: (data: { name: string }, options: OptionCallback) => void;
  onActivate: (options?: OptionCallback) => void;
  onShutOff: (options?: OptionCallback) => void;
  cadenceEditMode: boolean;
  switchCadenceEditMode: () => void;
  cadenceMinimalConfigurationState: {
    cadenceWinConfigured: boolean;
    cadenceLoseConfigured: boolean;
    cadenceEntryConfigured: boolean;
  };
};

type HeaderActionsProps = {
  cadence: Cadence;
  loading: boolean;
  goBack: () => void;
  cadenceEditMode: boolean;
  setOpenEditDialog: (open: boolean) => void;
  setOpenActivateDialog: (open: boolean) => void;
  onShutOff: (options?: OptionCallback) => void;
  switchCadenceEditMode: () => void;
  cadenceMinimalConfigurationState: {
    cadenceWinConfigured: boolean;
    cadenceLoseConfigured: boolean;
    cadenceEntryConfigured: boolean;
  };
};

const CadenceDetailHeaderActions: React.FC<HeaderActionsProps> = React.memo(
  ({
    cadence,
    goBack,
    loading,
    cadenceEditMode,
    setOpenEditDialog,
    setOpenActivateDialog,
    onShutOff,
    switchCadenceEditMode,
    cadenceMinimalConfigurationState,
  }) => {
    const { t } = useTranslation('marketing');
    const classes = useStyles();

    const [canBeActivated, setCanbeActivated] = React.useState(false);

    const handleOpenEditDialog = React.useCallback(
      () => setOpenEditDialog?.(true),
      [setOpenEditDialog],
    );

    const handleOpenActivateDialog = React.useCallback(
      () => setOpenActivateDialog?.(true),
      [setOpenActivateDialog],
    );

    const handleShutOff = React.useCallback(() => onShutOff?.(), [onShutOff]);

    React.useEffect(() => {
      if (
        isMinimalCadenceConfigurationCompleted(cadenceMinimalConfigurationState)
      ) {
        setCanbeActivated(true);
      } else {
        setCanbeActivated(false);
      }
    }, [cadenceMinimalConfigurationState]);

    return (
      <>
        <div className={classes.leftInnerContainer}>
          <ToolTip title={t('cadence.back')}>
            <IconButton onClick={goBack} disabled={loading}>
              <KeyboardArrowLeftIcon />
            </IconButton>
          </ToolTip>

          <div className={classes.nameWithIcon}>
            <Typography variant="h6" className={classes.titleTypo}>
              {cadence?.name}
            </Typography>
            <ToolTip title={t('cadence.form.modify_name_label')}>
              <IconButton
                onClick={handleOpenEditDialog}
                disabled={loading || cadenceEditMode || cadence?.active}
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
                variant="contained"
                color="primary"
                disabled={loading || cadenceEditMode}
                onClick={handleShutOff}
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
                    onClick={handleOpenActivateDialog}
                    disabled={loading || cadenceEditMode || !canBeActivated}
                    variant="outlined"
                    color="primary"
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
                variant="contained"
                color="secondary"
                disabled={cadence?.active || loading || !canBeActivated}
                onClick={switchCadenceEditMode}
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
  loading,
  goBack,
  onEdit,
  onActivate,
  onShutOff,
  cadenceEditMode,
  switchCadenceEditMode,
  cadenceMinimalConfigurationState,
}) => {
  const classes = useStyles();

  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openActivateDialog, setOpenActivateDialog] = React.useState(false);

  const handleCloseEditForm = React.useCallback(
    () => setOpenEditDialog(false),
    [],
  );

  const handleCloseActivateDialog = React.useCallback(
    () => setOpenActivateDialog(false),
    [],
  );

  const handleEdit = React.useCallback(
    (data: { name: string }, options: OptionCallback) =>
      onEdit?.(data, {
        onSuccess: () => {
          options.onSuccess && options.onSuccess();
          setOpenEditDialog(false);
        },
        onError() {
          options.onError && options.onError();
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
            goBack={goBack}
            loading={loading}
            cadenceEditMode={cadenceEditMode}
            setOpenEditDialog={setOpenEditDialog}
            setOpenActivateDialog={setOpenActivateDialog}
            onShutOff={onShutOff}
            switchCadenceEditMode={switchCadenceEditMode}
            cadenceMinimalConfigurationState={cadenceMinimalConfigurationState}
          />
        </div>
      </div>
      {openEditDialog && !loading && (
        <CadenceCreateAndUpdateForm
          initial={cadence}
          open
          onSubmit={handleEdit}
          onCancel={handleCloseEditForm}
          loading={false}
        />
      )}
      <CadenceActivateDialog
        open={openActivateDialog}
        onCancel={handleCloseActivateDialog}
        onConfirm={handleActivate}
      />
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
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
