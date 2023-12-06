import React, { useCallback, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import ZoomEstablishmentTable from '#libs/zoom-app/components/ZoomEstablishmentTable.component';

import type {
  ZoomApp,
  ZoomEstablishment,
  ZoomMember,
  ZoomEstablishmentBulkEditData,
} from '#libs/zoom-app/types';
import type { Establishment } from '#libs/establishment/types';
import { OptionCallback } from '../../../state/types';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  noMarginLeft: {
    marginLeft: 0,
  },
  alert: {
    marginTop: theme.spacing(2),
    alignItems: 'center',
  },
  configurationContainer: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  groupConfiguration: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  groupInput: {
    [theme.breakpoints.up('sm')]: {
      minWidth: 350,
    },
  },
  textSecondary: {
    color: theme.palette.text.secondary,
  },
}));

type Props = {
  zoomApp: ZoomApp;
  toggleMultiZoomUserSupport: (option?: OptionCallback<ZoomApp>) => void;
  updateZoomGroupId: (
    data: { zoom_group_id: string },
    options?: OptionCallback<ZoomApp>,
  ) => void;
  resetZoomEstablishments: (options?: OptionCallback) => void;
  fetchZoomMembersAndEstablishments: () => void;
  zoomEstablishmentTableDataLoading: boolean;
  zoomEstablishments: ZoomEstablishment[];
  zoomMembersById: Record<string, ZoomMember>;
  establishmentsById: Record<number, Establishment>;
  bulkEditZoomEstablishments: (
    data: ZoomEstablishmentBulkEditData,
    options?: OptionCallback<ZoomEstablishment[]>,
  ) => void;
  zoomAppUpdateLoading: boolean;
};

export const ZoomMultiUserSupportForm: React.FC<Props> = ({
  zoomApp,
  toggleMultiZoomUserSupport,
  updateZoomGroupId,
  resetZoomEstablishments,
  fetchZoomMembersAndEstablishments,
  zoomEstablishmentTableDataLoading,
  zoomEstablishments,
  establishmentsById,
  zoomMembersById,
  bulkEditZoomEstablishments,
  zoomAppUpdateLoading,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['settings', 'common']);

  const [zoomGroupIdUserInput, setZoomGroupIdUserInput] = useState('');
  const [resetConfirmationDialogOpen, setResetConfirmationDialogOpen] =
    useState(false);
  const [tableRefreshKey, setTableRefreshKey] = useState(uuidv4());

  useEffect(() => {
    // Set a new uuid when loading is finished to remount ZoomEstablishmentTable
    if (!zoomEstablishmentTableDataLoading) setTableRefreshKey(uuidv4());
  }, [zoomEstablishmentTableDataLoading]);

  const handleToggleMultiZoomUserSupport = useCallback(
    () =>
      toggleMultiZoomUserSupport({
        onSuccess: (updatedZoomApp) => {
          if (
            updatedZoomApp.multi_zoom_user_support_enabled &&
            updatedZoomApp.zoom_group_id
          ) {
            fetchZoomMembersAndEstablishments();
          }
        },
      }),
    [toggleMultiZoomUserSupport, fetchZoomMembersAndEstablishments],
  );

  const handleZoomGroupIdChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setZoomGroupIdUserInput(event.target.value);
    },
    [],
  );

  const closeResetConfirmationDialog = () =>
    setResetConfirmationDialogOpen(false);

  const confirmResetConfirmationDialog = () =>
    resetZoomEstablishments({
      onSuccess: () => {
        setZoomGroupIdUserInput('');
        closeResetConfirmationDialog();
      },
    });

  const handleZoomGroupActionButtonClick = useCallback(() => {
    if (zoomApp.zoom_group_id) {
      setResetConfirmationDialogOpen(true);
    } else {
      updateZoomGroupId(
        { zoom_group_id: zoomGroupIdUserInput },
        {
          onSuccess: fetchZoomMembersAndEstablishments,
        },
      );
    }
  }, [
    updateZoomGroupId,
    zoomGroupIdUserInput,
    zoomApp.zoom_group_id,
    fetchZoomMembersAndEstablishments,
  ]);

  return (
    <>
      <div className={classes.container}>
        <FormControlLabel
          checked={zoomApp.multi_zoom_user_support_enabled}
          classes={{ root: classes.noMarginLeft }}
          control={<Switch color="primary" />}
          disabled={zoomApp.is_disabled || !zoomApp.is_configured}
          label={t('broadcast.zoom.multiZoomUserSupport.switchLabel')}
          labelPlacement="end"
          onChange={handleToggleMultiZoomUserSupport}
        />

        {zoomApp.multi_zoom_user_support_enabled ? (
          <div className={classes.configurationContainer}>
            <div className={classes.groupConfiguration}>
              <TextField
                className={classes.groupInput}
                disabled={!!zoomApp.zoom_group_id}
                label={t('broadcast.zoom.zoomGroupId')}
                onChange={handleZoomGroupIdChange}
                value={
                  zoomApp.zoom_group_id
                    ? zoomApp.zoom_group_id
                    : zoomGroupIdUserInput
                }
                variant="outlined"
              />

              <Button
                color="primary"
                disabled={zoomAppUpdateLoading}
                onClick={handleZoomGroupActionButtonClick}
                variant="contained"
              >
                {zoomApp.zoom_group_id
                  ? t('broadcast.zoom.groupActionButton.reset')
                  : t('broadcast.zoom.groupActionButton.save')}
              </Button>
            </div>

            {zoomApp.zoom_group_id && (
              <ZoomEstablishmentTable
                key={tableRefreshKey}
                establishmentsById={establishmentsById}
                loading={zoomEstablishmentTableDataLoading}
                zoomEstablishmentBulkEdit={bulkEditZoomEstablishments}
                zoomEstablishments={zoomEstablishments}
                zoomMembersById={zoomMembersById}
              />
            )}
          </div>
        ) : (
          <Alert className={classes.alert} severity="info">
            {t('broadcast.zoom.multiZoomUserSupport.explain')}
          </Alert>
        )}
      </div>

      <Dialog maxWidth="sm" open={resetConfirmationDialogOpen}>
        <DialogTitle>
          {t('broadcast.zoom.resetConfirmationDialog.title')}
        </DialogTitle>
        <DialogContent>
          {t('broadcast.zoom.resetConfirmationDialog.content')}
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.textSecondary}
            onClick={closeResetConfirmationDialog}
          >
            {t('common:cancel')}
          </Button>
          <Button color="primary" onClick={confirmResetConfirmationDialog}>
            {t('common:confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(ZoomMultiUserSupportForm);
