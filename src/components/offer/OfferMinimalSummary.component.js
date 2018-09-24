// @flow
import React from 'react';

import {
  ListItem,
  ListItemText,
  Icon,
  IconButton,
  Tooltip,
  Divider,
  Avatar,
  withStyles,
} from '@material-ui/core';

import { translate } from 'react-i18next';

import Level from '../Level.component';
import Sport from '../Sport.component';
import { formatAsDatetime } from '../../datetime';
import type { Offer, ActivitySimplified } from '../../api/types';

const styles = () => ({
  listItem: {
    width: '100%',
  },
});

type Props = {
  offer: Offer,
  additionalInfo: ?string,
  additionalInfoTypoProps: *,
  additionalInfoSecondary: string,
  showCoachName: ?boolean,
  overrideClickAction: () => void,
  divider: ?boolean,
  t: (x: string) => string,
  classes: Object,
};

// prettier-disable-next-line
export function OfferMinimalSummary(props: Props) {
  const {
    offer,
    additionalInfo,
    additionalInfoTypoProps,
    additionalInfoSecondary,
    showCoachName,
    overrideClickAction,
    divider,
    t,
    classes,
  } = props;
  const {
    name,
    id,
    parent_category,
    level_id,
    etablissement,
    establishment_override,
    next_slot,
    coach,
    coach_override,
    available,
    date_start,
  } = offer;

  const disabledAvatarProps = {
    style: {
      opacity: '0.65',
      backgroundColor: 'rgb(0,0,0)',
    },
  };

  let formattedName = name;
  if (!available) {
    formattedName += ` - ${t('offer.disabled')}`;
  }
  const currentEstablishment = establishment_override || etablissement;
  return (
    <ListItem
      key={id}
      dense
      button
      onClick={overrideClickAction}
      className={classes.listItem}
      divider
    >
      <Tooltip title={coach.name}>
        <IconButton disableRipple disabled={coach_override}>
          <Avatar
            src={coach.photo}
            imgProps={coach_override ? disabledAvatarProps : {}}
          />
        </IconButton>
      </Tooltip>
      {coach_override ? (
        <Tooltip title={coach_override.name}>
          <IconButton disableRipple>
            <Avatar src={coach_override.photo} />
          </IconButton>
        </Tooltip>
      ) : null}
      <ListItemText
        primary={formattedName}
        secondary={formatAsDatetime(date_start)}
      />
      {additionalInfo ? (
        <ListItemText
          primary={additionalInfo}
          primaryTypographyProps={additionalInfoTypoProps}
          secondary={additionalInfoSecondary}
        />
      ) : null}
      <ListItemText
        primary={showCoachName ? coach.name : currentEstablishment.title}
        secondary={<Level noStyle levelId={level_id} variant="caption" />}
      />
    </ListItem>
  );
}

export default translate()(withStyles(styles)(OfferMinimalSummary));
