// @ts-nocheck
import React, { useState } from 'react';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import PauseIcon from '@material-ui/icons/Pause';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import DateRangeIcon from '@material-ui/icons/DateRange';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import EditIcon from '@material-ui/icons/Edit';
import { OptionCallback } from '../../../../state/types';
import PauseDeleteDialog from './PauseDeleteDialog.component';
import { SubscriptionPause, Subscription } from '../../types';

type OwnProps = {
  pause: SubscriptionPause;
  dateStartIsPast: boolean;
  dateEndIsPast: boolean;
  deletePause: (
    pauseId: number,
    options?: OptionCallback<Subscription>,
  ) => void;
  updatePause: () => void;
  updateEventList: () => void;
  isLastPauseAfterEndItem?: boolean;
};

type Props = OwnProps;

const PauseDetailListItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('subscription');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateTooltip, setOpenUpdateTooltip] = useState(false);
  const [openCancelTooltip, setOpenCancelTooltip] = useState(false);

  const onUpdatePause = () => {
    setMenuAnchor(null);
    props.updatePause();
  };

  const onDeletePause = () => {
    setOpenDeleteDialog(true);
  };

  const onConfirmDeletePause = () => {
    props.deletePause(props.pause.id, {
      onSuccess: () => setTimeout(props.updateEventList, 6000),
    });
    setOpenDeleteDialog(false);
    setMenuAnchor(null);
  };

  const onCancelDeletePause = () => {
    setOpenDeleteDialog(false);
    setMenuAnchor(null);
  };

  const handleHoverInUpdatePause = () => {
    setOpenUpdateTooltip(!!props.pause.contract_pause || props.dateEndIsPast);
  };

  const handleHoverOutUpdatePause = () => {
    setOpenUpdateTooltip(false);
  };

  const handleHoverInCancelPause = () => {
    setOpenCancelTooltip(props.dateStartIsPast);
  };

  const handleHoverOutCancelPause = () => {
    setOpenCancelTooltip(false);
  };

  return (
    <React.Fragment>
      <div className={classes.listItem}>
        <PauseIcon className={classes.icon} />
        <div className={classes.smallLinkH} />
        <div className={classes.listItemBody}>
          <Typography>
            {t('pauseV2.common.listItem.label', {
              fromDate: moment(props.pause.from_date).format('L'),
              untilDate: props.pause.until_date
                ? moment(props.pause.until_date).format('L')
                : moment(props.pause.from_date)
                    .add(props.pause.days - 1, 'days')
                    .format('L'),
            })}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {`${
              t('pauseV2.common.listItem.createdAt') +
              moment(props.pause.date_created).format('L')
            } : ${props.pause.name}`}
          </Typography>
        </div>
        <div className={classes.expandedLink} />
        <IconButton
          color="secondary"
          onClick={(ev) => setMenuAnchor(ev.currentTarget)}
        >
          <EditIcon />
        </IconButton>
      </div>
      <Menu
        onClose={() => setMenuAnchor(null)}
        anchorEl={menuAnchor}
        open={!!menuAnchor}
      >
        <Tooltip
          open={openCancelTooltip}
          title={t('pauseV2.common.menu.cancelForbidden')}
          onPointerEnter={handleHoverInCancelPause}
          onPointerLeave={handleHoverOutCancelPause}
          onTouchStart={handleHoverInCancelPause}
          onTouchEnd={handleHoverOutCancelPause}
        >
          <span>
            <MenuItem onClick={onDeletePause} disabled={props.dateStartIsPast}>
              <ListItemIcon>
                <TimerOffIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">
                {t('pauseV2.common.menu.delete')}
              </Typography>
            </MenuItem>
          </span>
        </Tooltip>
        <Tooltip
          open={openUpdateTooltip}
          title={t(
            `pauseV2.common.menu.${
              props.dateEndIsPast
                ? 'changeForbidden'
                : 'changeContractForbidden'
            }`,
          )}
          onPointerEnter={handleHoverInUpdatePause}
          onPointerLeave={handleHoverOutUpdatePause}
          onTouchStart={handleHoverInUpdatePause}
          onTouchEnd={handleHoverOutUpdatePause}
        >
          <span>
            <MenuItem
              onClick={onUpdatePause}
              disabled={props.dateEndIsPast || !!props.pause.contract_pause}
            >
              <ListItemIcon>
                <DateRangeIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">
                {t('pauseV2.common.menu.change')}
              </Typography>
            </MenuItem>
          </span>
        </Tooltip>
      </Menu>
      {!props.isLastPauseAfterEndItem && <div className={classes.endLine} />}
      {openDeleteDialog && (
        <PauseDeleteDialog
          open={openDeleteDialog}
          onConfirmClick={onConfirmDeletePause}
          onCancelClick={onCancelDeletePause}
          deleteContent={t('pauseV2.subscriptionPause.deleteDialogContent')}
        />
      )}
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    height: theme.spacing(5),
    width: theme.spacing(5),
    padding: theme.spacing(1),
    border: '1px solid black',
    borderRadius: 100,
  },
  listItemBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  smallLinkH: {
    height: 1,
    width: theme.spacing(1.5),
    borderBottom: '1px solid gray',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  expandedLink: {
    height: 1,
    flexGrow: 1,
    borderBottom: '1px dashed gray',
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  endLine: {
    borderLeft: '1px dashed black',
    height: theme.spacing(3),
    marginLeft: 19,
  },
}));

export default PauseDetailListItem;
