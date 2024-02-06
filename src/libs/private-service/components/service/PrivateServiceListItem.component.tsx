import React, { useCallback, useMemo } from 'react';

import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import ListItemResponsiveAction from '#components/button/ListItemResponsiveAction.component';

import {
  getCompatibilityText,
  getCompatibilityTextWithSlots,
} from '../../utils';

import type {
  PrivateService,
  PrivateServiceWithSlots,
  PrivateSlot,
  ServiceCompatibilityPass,
} from '#libs/private-service/types';

type Props = {
  compatibilityByService?: ServiceCompatibilityPass;
  dense?: boolean;
  excluded_slots?: number[];
  hideSecondary?: boolean;
  included_slots?: PrivateSlot[];
  onClick?: (id: number) => void;
  onDelete?: () => void;
  onEdit?: () => void;
  privateService: PrivateService | PrivateServiceWithSlots;
  selected?: boolean;
};

export const PrivateServiceListItem: React.FC<Props> = ({
  compatibilityByService,
  dense,
  excluded_slots,
  hideSecondary,
  included_slots,
  onClick,
  onDelete,
  onEdit,
  privateService,
  selected,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('privateService');

  const handleOnListItemClick = useCallback(() => {
    onClick?.(privateService.id);
  }, [onClick, privateService.id]);

  const privateCoachList = useMemo(() => {
    const coaches = privateService.coaches || [];
    return hideSecondary
      ? null
      : (coaches || [])
          // @ts-expect-error - Until we have better typing for private service page (selectors)
          .filter((coach) => !!coach && coach.name)
          // @ts-expect-error - Until we have better typing for private service page (selectors)
          .map((coach) => (!!coach && coach.name) || '')
          .join(', ');
  }, [hideSecondary, privateService.coaches]);

  return (
    <ListItem
      divider
      alignItems="center"
      // @ts-expect-error - MUI typing workaround: considering the way ListItem is typed, TS can't understand a boolean that is not explicitely true or false here
      button={!!onClick}
      dense={dense}
      onClick={handleOnListItemClick}
      selected={selected}
      style={{
        borderLeft: privateService.color !== '' ? '5px solid' : '0px',
        borderLeftColor: privateService.color,
      }}
    >
      <ListItemAvatar>
        <Avatar
          alt={privateService.name}
          className={classes.avatar}
          src={privateService.cover_main}
        />
      </ListItemAvatar>
      <ListItemText
        classes={{ secondary: classes.textSecondary }}
        primary={
          <div>
            <div>{privateService.name}</div>
            {compatibilityByService && (
              <Typography variant="caption">
                {getCompatibilityText(t, compatibilityByService)}
              </Typography>
            )}
            {(excluded_slots || included_slots) && (
              <Typography variant="caption">
                {getCompatibilityTextWithSlots(
                  t,
                  excluded_slots,
                  included_slots,
                )}
              </Typography>
            )}
          </div>
        }
        secondary={privateCoachList}
      />

      <ListItemResponsiveAction
        actions={[
          onEdit && {
            icon: EditIcon,
            label: t('serviceGroup.edit'),
            color: 'primary',
            onClick: onEdit,
          },
          onDelete && {
            icon: DeleteIcon,
            label: t('serviceGroup.delete'),
            onClick: onDelete,
          },
        ]}
      />
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(2),
  },
  textContainer: {
    display: 'flex',
    flex: 1,
    marginLeft: theme.spacing(2),
  },
  textSecondary: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

export default React.memo(PrivateServiceListItem);
