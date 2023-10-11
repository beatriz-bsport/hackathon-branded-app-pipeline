import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import { Checkbox, Theme, makeStyles } from '@material-ui/core';
import type { Member } from '../../member/types';
import type { BookingOption } from '#libs/booking/types';

type Props = {
  option: BookingOption;
  member?: Member;
  onDiscard: () => void;
  onClickRegister: () => void;
  disabled: boolean;
  waitingListPosition: {
    member_position: number;
    waiting_list_size: number;
  };
  displayPositionInWaitingList: boolean;
};

const BookingOptionForManager: React.FC<Props> = ({
  option,
  onClickRegister,
  member,
  waitingListPosition,
  displayPositionInWaitingList,
  disabled,
  onDiscard,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('translation');

  const handleListItemClick = React.useCallback(
    () => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();
      const url = `/member/${option.member}/`;
      const win = window.open(url);
      win.focus();
    },
    [option],
  );

  const getSecondaryTextToDisplay = React.useCallback(() => {
    if (option.is_convertible) return t('booking.waitingUserConfirmation');
    if (displayPositionInWaitingList && waitingListPosition)
      return t('booking.waitingListPosition', {
        position: waitingListPosition.member_position,
        size: waitingListPosition.waiting_list_size,
      });
    return t('booking.onWaitingList');
  }, [option, displayPositionInWaitingList, t, waitingListPosition]);

  if (option.cancelled) {
    return (
      <ListItem button disableRipple divider onClick={handleListItemClick()}>
        <ListItemAvatar>
          <Avatar src={member ? member.photo : ''} />
        </ListItemAvatar>
        <ListItemText
          primary={member ? member.name : ''}
          secondary={t('booking.cancelledFromWaitingList')}
        />
      </ListItem>
    );
  }

  return (
    <ListItem button disableRipple divider onClick={handleListItemClick}>
      <div className={classes.outerRow}>
        <Checkbox className={classes.checkBox} />
        <ListItemAvatar>
          <Avatar src={member ? member.photo : ''} />
        </ListItemAvatar>
        <ListItemText
          primary={member ? member.name : ''}
          secondary={getSecondaryTextToDisplay()}
        />

        <Button
          className={classes.addButton}
          color="primary"
          disabled={disabled}
          onClick={onClickRegister}
          variant="outlined"
        >
          <AddIcon />
          {t('booking.add')}
        </Button>
        {!!onDiscard && (
          <IconButton disabled={disabled} onClick={onDiscard}>
            <CancelIcon />
          </IconButton>
        )}
      </div>
    </ListItem>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  outerRow: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkBox: {
    marginRight: theme.spacing(1),
  },
  addButton: {
    marginRight: theme.spacing(1),
    alignItems: 'flex-start',
  },
  innerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default React.memo(BookingOptionForManager);
