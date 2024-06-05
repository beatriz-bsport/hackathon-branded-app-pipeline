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
import classNames from 'classnames';

import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

import type { BookingOption } from '#libs/booking/types';
import type { Member } from '../../member/types';

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
  handleCheckBookingOption: (bookingOptionId: number) => void;
  handleUncheckBookingOption: (bookingOptionId: number) => void;
  selectedBookingOptionsIds: number[];
  shouldHideBookButton?: Boolean;
  shouldHideRemoveWaitlistButton?: Boolean;
};

const BookingOptionForManager: React.FC<Props> = ({
  option,
  onClickRegister,
  member,
  waitingListPosition,
  displayPositionInWaitingList,
  disabled,
  onDiscard,
  handleCheckBookingOption,
  handleUncheckBookingOption,
  selectedBookingOptionsIds,
  shouldHideBookButton,
  shouldHideRemoveWaitlistButton,
}) => {
  const classes = useStyles({ disabled });

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

  const isChecked = selectedBookingOptionsIds?.includes(option.id) ?? false;

  const handleSelectBookingOption = React.useCallback(() => {
    isChecked
      ? handleUncheckBookingOption(option?.id)
      : handleCheckBookingOption(option?.id);
  }, [
    handleUncheckBookingOption,
    handleCheckBookingOption,
    option?.id,
    isChecked,
  ]);

  const isIndividualButtonDisabled =
    disabled || !!selectedBookingOptionsIds?.length;

  if (!option) return null;

  if (option.cancelled) {
    return (
      <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
        {(hasMemberProfileAccessPermission: boolean) => (
          <ListItem
            disableRipple
            divider
            button={hasMemberProfileAccessPermission as any}
            onClick={
              hasMemberProfileAccessPermission ? handleListItemClick() : null
            }
          >
            <ListItemAvatar>
              <Avatar src={member ? member.photo : ''} />
            </ListItemAvatar>
            <ListItemText
              primary={member ? member.name : ''}
              secondary={t('booking.cancelledFromWaitingList')}
            />
          </ListItem>
        )}
      </ObjectLevelPermissionProvider>
    );
  }

  return (
    <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
      {(hasMemberProfileAccessPermission: boolean) => (
        <ListItem
          disableRipple
          divider
          button={hasMemberProfileAccessPermission as any}
        >
          <div className={classes.outerRow}>
            <div
              className={classNames(classes.avatarWithCheckbox, {
                [classes.avatarWithCheckboxAndSelection]:
                  !!selectedBookingOptionsIds?.length,
              })}
            >
              <div
                className={classNames(classes.avatarContainer, {
                  [classes.avatarContainerWithHover]:
                    !disabled && !shouldHideBookButton,
                })}
              >
                <div className={classes.avatar}>
                  <ListItemAvatar>
                    <Avatar src={member ? member.photo : ''} />
                  </ListItemAvatar>
                </div>
                {!disabled && !shouldHideBookButton && (
                  <div className={classes.checkBoxContainer}>
                    <Checkbox
                      checked={isChecked}
                      className={classes.checkBox}
                      onChange={handleSelectBookingOption}
                    />
                  </div>
                )}
              </div>
            </div>
            <ListItemText
              onClick={
                hasMemberProfileAccessPermission ? handleListItemClick() : null
              }
              primary={member ? member.name : ''}
              secondary={getSecondaryTextToDisplay()}
            />

            {!shouldHideBookButton && (
              <Button
                className={classes.addButton}
                color="primary"
                disabled={isIndividualButtonDisabled}
                onClick={onClickRegister}
                variant="outlined"
              >
                <AddIcon />
                {t('booking.add')}
              </Button>
            )}
            {!!onDiscard && !shouldHideRemoveWaitlistButton && (
              <IconButton
                disabled={isIndividualButtonDisabled}
                onClick={onDiscard}
              >
                <CancelIcon />
              </IconButton>
            )}
          </div>
        </ListItem>
      )}
    </ObjectLevelPermissionProvider>
  );
};

const useStyles = makeStyles<Theme, { disabled: boolean }>((theme) => ({
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
  avatarWithCheckbox: {
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainerWithHover: {
    '&:hover': {
      '& $avatar': {
        opacity: '10%',
      },
      '& $checkBoxContainer': {
        visibility: 'visible',
      },
    },
  },
  avatar: {
    opacity: '100%',
  },
  checkBoxContainer: {
    visibility: 'hidden',
    position: 'absolute',
    transform: 'translate(-8%, 0%)',
  },
  avatarWithCheckboxAndSelection: {
    '& $avatar': {
      opacity: '10%',
    },
    '& $checkBoxContainer': {
      visibility: 'visible',
    },
  },
}));

export default React.memo(BookingOptionForManager);
