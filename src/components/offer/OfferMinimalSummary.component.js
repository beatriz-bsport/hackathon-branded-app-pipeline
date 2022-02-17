// @flow
import React from 'react';

import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import VideocamIcon from '@material-ui/icons/Videocam';
import withStyles from '@material-ui/core/styles/withStyles';
import { pure } from 'recompose';

import { withTranslation, TFunction } from 'react-i18next';
import Tooltip from '../Tooltip.component';
import EmptyListItem from '../LoadingListItem.component';

import {
  formatMinutes,
  formatAsDatetime,
  formatAsTime,
} from '../../utils/datetime';
import type { Offer } from '../../api/types';

import { DEFAULT_AVATAR } from '../../libs/associated-coach/utils';

const styles = (theme) => ({
  offerTitleText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  videocamIcon: {
    marginRight: theme.spacing(1) / 2,
  },
  listItem: {
    width: '100%',
  },
  disabled: {
    backgroundColor: '#FFDDDD',
    '&:hover': {
      backgroundColor: '#FFC1C1',
    },
  },
});

type Props = {
  noDate: ?boolean,
  offer: Offer,
  showCoachName: ?boolean,
  selected: boolean,
  overrideClickAction: () => void,
  t: TFunction,
  loading: boolean,
  classes: Object,
  isCoach: boolean,
};

const getFillingInfo = (offer: Offer) => {
  const fillingInfo = (
    <div style={{ display: 'inline-flex', alignItems: 'flex-end' }}>
      <Typography inline variant="subtitle2" color="secondary">
        {`${offer.nb_bookings} `}
      </Typography>
      <Typography color="textPrimary" variant="subtitle2">
        {`/${offer.effectif}`}
      </Typography>
      <Hidden smDown>
        <React.Fragment>
          <Typography inline color="textPrimary" variant="caption">
            &nbsp;(
          </Typography>
          <Typography inline variant="caption" color="primary">
            {offer.nb_attendant}
          </Typography>
          <Typography inline variant="caption">
            +
          </Typography>
          <Typography inline variant="caption" color="error">
            {offer.nb_non_attendant}
          </Typography>
          <Typography color="textPrimary" variant="caption">
            )
          </Typography>
        </React.Fragment>
      </Hidden>
    </div>
  );
  const fillingInfoProps = {
    color: offer.nb_bookings < offer.effectif ? 'error' : 'primary',
  };
  const formattedFillingRate = `${parseInt(
    (offer.nb_bookings / offer.effectif) * 100,
    10,
  )}%`;

  return [fillingInfo, fillingInfoProps, formattedFillingRate];
};

export function OfferMinimalSummary(props: Props) {
  const {
    noDate,
    offer,
    showCoachName,
    overrideClickAction,
    selected,
    t,
    classes,
    loading,
    isCoach,
  } = props;
  if (!offer || loading) {
    return <EmptyListItem key="" divider dense />;
  }

  const {
    name,
    id,
    establishment,
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
    formattedName += ` - ${t('offer:disabled')}`;
  }
  const currentEstablishment =
    establishment_override || establishment || offer.etablissement;
  const dateFormatter = noDate ? formatAsTime : formatAsDatetime;
  const [fillingInfo, fillingInfoProps, formattedFillingRate] =
    getFillingInfo(offer);

  let actualCoachName = '  -  ';
  if (coach && !coach_override) {
    actualCoachName = coach.name;
  }
  if (coach_override) {
    actualCoachName = coach_override.name;
  }

  return (
    <ListItem
      key={id}
      dense
      button={!!overrideClickAction}
      selected={selected}
      onClick={overrideClickAction}
      className={classNames(
        classes.listItem,
        available ? {} : classes.disabled,
      )}
      divider
      style={{
        borderLeft: offer.meta_activity_color ? '5px solid' : '0px',
        borderLeftColor: offer.meta_activity_color,
      }}
    >
      <Grid container directon="row" alignItems="center">
        <Grid item xs={6}>
          <Grid container direction="row" alignItems="center">
            <Hidden smDown>
              <Grid item>
                {coach_override && isCoach ? (
                  <Tooltip title={coach_override.name}>
                    <div>
                      <Avatar
                        src={
                          coach_override
                            ? coach_override.photo || DEFAULT_AVATAR
                            : ''
                        }
                      />
                    </div>
                  </Tooltip>
                ) : (
                  <Tooltip title={coach ? coach.name : ''}>
                    <div>
                      <IconButton disableRipple disabled={!!coach_override}>
                        <Avatar
                          src={coach ? coach.photo || DEFAULT_AVATAR : ''}
                          imgProps={coach_override ? disabledAvatarProps : {}}
                        />
                      </IconButton>
                    </div>
                  </Tooltip>
                )}
              </Grid>
            </Hidden>
            <Grid item style={coach_override ? { marginLeft: -30 } : {}}>
              {coach_override && !isCoach ? (
                <Tooltip title={coach_override ? coach_override.name : ''}>
                  <IconButton disableRipple>
                    <Avatar
                      src={
                        coach_override
                          ? coach_override.photo || DEFAULT_AVATAR
                          : ''
                      }
                    />
                  </IconButton>
                </Tooltip>
              ) : null}
            </Grid>
            <Grid item>
              <ListItemText
                primary={
                  <div className={classes.offerTitleText}>
                    {offer.is_broadcast ? (
                      <VideocamIcon className={classes.videocamIcon} />
                    ) : null}
                    <Typography variant="inherit">{formattedName}</Typography>
                  </div>
                }
                secondary={`${dateFormatter(
                  date_start,
                  offer.timezone_name,
                )} - ${formatMinutes(duration_minute, t)}`}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <ListItemText
            primary={fillingInfo}
            primaryTypographyProps={fillingInfoProps}
            secondary={formattedFillingRate}
          />
        </Grid>
        <Grid item xs={3}>
          <ListItemText
            primary={
              showCoachName
                ? actualCoachName
                : (currentEstablishment || {}).title
            }
            secondary={actualCoachName}
          />
        </Grid>
      </Grid>
    </ListItem>
  );
}

export default withTranslation(['offer', 'datetime'])(
  withStyles(styles)(pure(OfferMinimalSummary)),
);
