import React from 'react';

import {
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  withStyles,
} from '@material-ui/core';

import { translate } from 'react-i18next';

import Level from '../Level.component';
import Sport from '../Sport.component';
import Avatar from '../Avatar.component';
import { formatAsDatetime } from '../../datetime';

const styles = () => ({
  listItem: {
    width: '100%',
  },
});

export function ActivityMinimalSummary(props) {
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
        <ListItemText
          primary={showCoachName ? coach.name : etablissement.title}
          secondary={<Level noStyle levelId={level} variant="caption" />}
        />
      </ListItem>
    </div>
  );
}

ActivityMinimalSummary.defaultProps = { overrideClickAction: () => {} };

export default translate()(withStyles(styles)(ActivityMinimalSummary));
