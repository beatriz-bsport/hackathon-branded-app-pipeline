// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';

import Avatar from '../Avatar.component';
import { formatAsDatetime } from '../../datetime';
import { Level } from '../category';
import Sport from '../../libs/category/components/SCT.component';
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
        <div>
          <ListItemText
            primary={showCoachName ? coach.name : etablissement.title}
            primaryTypographyProps={{ align: 'right' }}
            secondaryTypographyProps={{ align: 'right' }}
            secondary={<Level noStyle levelId={level} variant="caption" />}
          />
        </div>
      </ListItem>
    </div>
  );
}

export default withNamespaces()(withStyles(styles)(ActivityMinimalSummary));
