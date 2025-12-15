import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { SmartListPopupSending } from '#src/libs/communication-v2/types';
// @ts-expect-error
import withConfirm from '#src/hocs/with-confirm.hoc';
import { OptionCallback } from '#src/state/types';

export const MEMBER_PAGE_SIZE = 10;

type Props = {
  smartListPopup: SmartListPopupSending;
  openPreview: (smartListPopup: SmartListPopupSending) => void;
  openMemberList: (smartListPopup: SmartListPopupSending) => void;
  noDivider?: boolean;
  onSmartListPopupDelete: (
    customAppPopupLinkId: number,
    options?: OptionCallback,
  ) => void;
};

const SmartListPopupListItem: React.FC<Props> = ({
  smartListPopup,
  openPreview,
  openMemberList,
  noDivider,
  onSmartListPopupDelete,
}) => {
  const classes = useStyle();
  const { t } = useTranslation(['communication']);

  const openPreviewDialog = useCallback(
    () => openPreview(smartListPopup),
    [openPreview, smartListPopup],
  );

  const openMemberListDialog = useCallback(
    () => openMemberList(smartListPopup),
    [openMemberList, smartListPopup],
  );

  const handleDelete = () => {
    onSmartListPopupDelete(smartListPopup.custom_app_popup_link.id);
  };

  const DeleteWithConfirm = withConfirm(
    ({ onClick }: { onClick: () => void }) => (
      <Button className={classes.button} onClick={onClick} variant="outlined">
        <DeleteIcon />
      </Button>
    ),
    'onClick',
    {
      title: 'communication:smartListPopup.deleteModal.title',
      cancel: 'communication:smartListPopup.deleteModal.cancel',
      confirm: 'communication:smartListPopup.deleteModal.confirm',
      Content: () => (
        <>
          <p>{t('communication:smartListPopup.deleteModal.description')}</p>
          <p>{t('communication:smartListPopup.deleteModal.headsUp')}</p>
        </>
      ),
      isDeletion: true,
    },
  );

  return (
    <div>
      {!noDivider && <Divider />}
      <div className={classes.listItemContainer}>
        <Typography className={classes.listItemDate} variant="caption">
          {DateTime.fromISO(
            smartListPopup?.custom_app_popup_link?.date_created ||
              DateTime.now().toISO(),
          ).toFormat('DDDD t')}
        </Typography>

        <div className={classes.listItemInfo}>
          <div className={classes.listItemTitleAndRecipients}>
            <Typography color="primary" variant="h6">
              {smartListPopup?.custom_app_popup_link?.name}
            </Typography>
            <div className={classes.recipients}>
              <Typography variant="body1">
                {`${t('smartListPopup.recipients')}: ${
                  smartListPopup?.member_ids.length ?? 0
                }`}
              </Typography>
              <IconButton onClick={openMemberListDialog}>
                <Tooltip title={t('smartListPopup.seeRecipients')}>
                  <VisibilityIcon />
                </Tooltip>
              </IconButton>
            </div>
          </div>

          <div>
            <Button
              className={classes.button}
              onClick={openPreviewDialog}
              variant="outlined"
            >
              <VisibilityIcon className={classes.leftIcon} />
              {t('smartListPopup.see')}
            </Button>
            <DeleteWithConfirm color="secondary" onClick={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  );
};

const useStyle = makeStyles((theme) => ({
  listItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1.75),
    paddingBottom: theme.spacing(1.75),
  },
  listItemInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemTitleAndRecipients: {
    display: 'flex',
    flexDirection: 'column',
  },
  listItemDate: {
    textTransform: 'capitalize',
  },
  recipients: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  button: {
    marginLeft: theme.spacing(1),
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default React.memo(SmartListPopupListItem);
