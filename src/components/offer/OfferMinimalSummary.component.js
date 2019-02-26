// @flow
import React from 'react';

import {
  Grid,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Avatar,
  withStyles,
} from '@material-ui/core';

import { withNamespaces } from 'react-i18next';

import { Level } from '../category';
import {
  humanizeDuration,
  formatAsDatetime,
  formatAsTime,
} from '../../datetime';
import type { Offer } from '../../api/types';

const styles = () => ({
  listItem: {
    width: '100%',
  },
  disabled: {
    backgroundColor: '#FFDDDD',
  },
});

type Props = {
  noDate: ?boolean,
  offer: Offer,
  additionalInfo: ?string,
  additionalInfoTypoProps: *,
  additionalInfoSecondary: string,
  showCoachName: ?boolean,
  selected: boolean,
  overrideClickAction: () => void,
  t: (x: string) => string,
  classes: Object,
};

// prettier-disable-next-line
export function OfferMinimalSummary(props: Props) {
  const {
    noDate,
    offer,
    additionalInfo,
    additionalInfoTypoProps,
    additionalInfoSecondary,
    showCoachName,
    overrideClickAction,
    selected,
    t,
    classes,
  } = props;
  const {
    name,
    id,
    level_id,
    etablissement,
    establishment_override,
    duration_minute,
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
  const dateFormatter = noDate ? formatAsTime : formatAsDatetime;
  return (
    <ListItem
      key={id}
      dense
      button
      selected={selected}
      onClick={overrideClickAction}
      className={[classes.listItem, available ? {} : classes.disabled]}
      divider
    >
      <Grid container directon="row" alignItems="center">
        <Grid item xs={6}>
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <Tooltip title={coach.name}>
                <IconButton disableRipple disabled={coach_override}>
                  <Avatar
                    src={coach.photo}
                    imgProps={coach_override ? disabledAvatarProps : {}}
                  />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item style={coach_override ? { marginLeft: -30 } : {}}>
              {coach_override ? (
                <Tooltip title={coach_override.name}>
                  <IconButton disableRipple>
                    <Avatar src={coach_override.photo} />
                  </IconButton>
                </Tooltip>
              ) : null}
            </Grid>
            <Grid item>
              <ListItemText
                primary={formattedName}
                secondary={`${dateFormatter(date_start)} - ${humanizeDuration(
                  duration_minute * 60000,
                )}`}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          {additionalInfo ? (
            <ListItemText
              primary={additionalInfo}
              primaryTypographyProps={additionalInfoTypoProps}
              secondary={additionalInfoSecondary}
            />
          ) : null}
        </Grid>
        <Grid item xs={3}>
          <ListItemText
            primary={showCoachName ? coach.name : currentEstablishment.title}
            secondary={<Level noStyle levelId={level_id} variant="caption" />}
          />
        </Grid>
      </Grid>
    </ListItem>
  );
}

export default withNamespaces()(withStyles(styles)(OfferMinimalSummary));
