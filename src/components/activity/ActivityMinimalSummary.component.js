// @flow
import React from 'react';

import {
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  ListItemSecondaryAction,
  withStyles,
} from '@material-ui/core';

import { translate } from 'react-i18next';

import Avatar from '../Avatar.component';
import { formatAsDatetime } from '../../datetime';
import { Level, Sport } from '../category';
import type { ActivitySimplified } from '../../api/types';

const styles = () => ({
  listItem: {
    width: '100%',
  },
});

type Props = {
  activity: ActivitySimplified,
  additionalInfo: ?string,
  additionalInfoTypoProps: *,
  additionalInfoSecondary: string,
  date: string,
  showCoach: ?boolean,
  showCoachName: ?boolean,
  overrideClickAction: () => void,
  noDivider: ?boolean,
  t: (x: string) => string,
  classes: Object,
};

// prettier-disable-next-line
export function ActivityMinimalSummary(props: Props) {
  const {
    activity,
    additionalInfo,
    additionalInfoTypoProps,
    additionalInfoSecondary,
    date,
    showCoach,
    showCoachName,
    overrideClickAction,
    noDivider,
    t,
    classes,
  } = props;
  const {
    name,
    id,
    parent_category,
    level,
    etablissement,
    next_slot,
    coach,
  } = activity;

  const nextSlotFormatted = next_slot
    ? formatAsDatetime(next_slot)
    : t('activity.noNextSlot');
  const dateToShow = date || nextSlotFormatted;

  return (
    <div>
      {noDivider ? null : <Divider />}
      <ListItem
        key={id}
        dense
        button
        onClick={overrideClickAction}
        className={classes.listItem}
      >
        {showCoach ? (
          <Tooltip title={coach.name}>
            <IconButton disableRipple className={classes.noMargin}>
              <Avatar user={coach} variant="small" noname />
            </IconButton>
          </Tooltip>
        ) : (
          <IconButton disableRipple>
            <Sport parentCategory={parent_category} noname />
          </IconButton>
        )}
        <ListItemText primary={name} secondary={dateToShow} />
        {additionalInfo ? (
          <ListItemText
            primary={additionalInfo}
            primaryTypographyProps={additionalInfoTypoProps}
            secondary={additionalInfoSecondary}
          />
        ) : null}
        <ListItemSecondaryAction>
          <ListItemText
            primary={showCoachName ? coach.name : etablissement.title}
            primaryTypographyProps={{ align: 'right' }}
            secondaryTypographyProps={{ align: 'right' }}
            secondary={<Level noStyle levelId={level} variant="caption" />}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  );
}

export default translate()(withStyles(styles)(ActivityMinimalSummary));
