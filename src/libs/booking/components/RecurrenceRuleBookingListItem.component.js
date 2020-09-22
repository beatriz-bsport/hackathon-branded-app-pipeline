// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { useTranslation } from 'react-i18next';
import Avatar from '@material-ui/core/Avatar';
import { IconButton, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import withConfirm from '../../../hocs/with-confirm.hoc';

type Props = {
  recurrenceRuleBooking: Array,
  onDelete: (id: number) => void,
};

const IconButtonWithConfirm = withConfirm(IconButton, 'onClick', {
  title: 'booking:recurrenceRule.deleteModal.title',
  cancel: 'booking:recurrenceRule.deleteModal.cancel',
  confirm: 'booking:recurrenceRule.deleteModal.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('booking:recurrenceRule.deleteModal.content')}</p>
  ),
});

export const RecurrenceRuleBookingListItem = (props: Props) => {
  const { t } = useTranslation(['booking', 'datetime']);
  const { recurrenceRuleBooking, onDelete } = props;
  const { member, meta_activity } = recurrenceRuleBooking;
  return (
    <ListItem dense divider>
      {member && member.photo && (
        <ListItemAvatar>
          <Avatar alt="" src={member.photo} />
        </ListItemAvatar>
      )}
      <ListItemText
        primary={member && member.name ? member.name : '-'}
        primaryTypographyProps={{ variant: 'body2' }}
        secondary={
          <div>
            {!!meta_activity && (
              <Typography color="primary" variant="body2">
                {meta_activity.name}
              </Typography>
            )}
            <Typography variant="body2">
              {t('booking:recurrenceRule.item.explain', {
                dayOfWeek: t(
                  `datetime:time.weekdayNumber.${recurrenceRuleBooking.day_of_week}`,
                ),
                hour: `${recurrenceRuleBooking.hour}`.padStart(2, '0'),
                minute: `${recurrenceRuleBooking.minute}`.padStart(2, '0'),
                delayWeek: recurrenceRuleBooking.delay_week,
              })}
            </Typography>
          </div>
        }
      />
      <ListItemSecondaryAction>
        <IconButtonWithConfirm
          onClick={() => onDelete(recurrenceRuleBooking.id)}
        >
          <CancelIcon />
        </IconButtonWithConfirm>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default RecurrenceRuleBookingListItem;
