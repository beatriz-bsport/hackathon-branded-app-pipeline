import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

import { SmartListPopupSending } from '../types';

export const MEMBER_PAGE_SIZE = 10;

type Props = {
  smartListPopup: SmartListPopupSending;
  openPreview: (smartListPopup: SmartListPopupSending) => void;
  openMemberList: (smartListPopup: SmartListPopupSending) => void;
  noDivider?: boolean;
};

const SmartListPopupListItem: React.FC<Props> = ({
  smartListPopup,
  openPreview,
  openMemberList,
  noDivider,
}) => {
  const classes = useStyle();
  const { t } = useTranslation(['communication']);

  const openPreviewDialog = React.useCallback(
    () => openPreview(smartListPopup),
    [openPreview, smartListPopup],
  );

  const openMemberListDialog = React.useCallback(
    () => openMemberList(smartListPopup),
    [openMemberList, smartListPopup],
  );

  return (
    <div>
      {!noDivider && <Divider />}
      <div className={classes.listItemContainer}>
        <Typography variant="caption" className={classes.listItemDate}>
          {moment(smartListPopup?.custom_app_popup_link?.date_created).format(
            'LLLL',
          )}
        </Typography>

        <div className={classes.listItemInfo}>
          <div className={classes.listItemTitleAndRecipients}>
            <Typography variant="h6" color="primary">
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

          <Button
            onClick={openPreviewDialog}
            variant="outlined"
            className={classes.previewButton}
          >
            <VisibilityIcon className={classes.leftIcon} />
            {t('smartListPopup.see')}
          </Button>
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
  previewButton: {
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default React.memo(SmartListPopupListItem);
