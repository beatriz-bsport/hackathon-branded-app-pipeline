// @flow
import React from 'react';
import { withTranslation } from 'react-i18next';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';

import Avatar from '../Avatar.component';
import Level from '#libs/level/components/Level.component';

import { formatAsDatetime } from '../../utils/datetime';
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
  additionalInfoTypoProps: any,
  additionalInfoSecondary: string,
  date: string,
  showCoach: ?boolean,
  showCoachName: ?boolean,
  overrideClickAction: () => void,
  noDivider: ?boolean,
  t: (x: string) => string,
  classes: Object,
  offer: Offer,
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
    offer,
  } = props;
  const { name, id, parent_category, level, etablissement, next_slot, coach } =
    activity;

  const nextSlotFormatted = next_slot
    ? formatAsDatetime(next_slot)
    : t('activity.noNextSlot');
  const dateToShow = date || nextSlotFormatted;

  return (
    <div>
      {noDivider ? null : <Divider />}
      <ListItem
        key={id}
        button
        dense
        className={classes.listItem}
        onClick={overrideClickAction}
      >
        {showCoach ? (
          <Tooltip title={coach.name}>
            <IconButton disableRipple className={classes.noMargin}>
              <Avatar noname user={coach} variant="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <IconButton disableRipple>
            <Sport noname parentCategory={parent_category} />
          </IconButton>
        )}
        <ListItemText
          primary={offer?.name_override || name}
          secondary={dateToShow}
        />
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
            secondary={<Level noStyle customLevel={level} variant="caption" />}
            secondaryTypographyProps={{ align: 'right' }}
          />
        </div>
      </ListItem>
    </div>
  );
}

export default withTranslation()(withStyles(styles)(ActivityMinimalSummary));
