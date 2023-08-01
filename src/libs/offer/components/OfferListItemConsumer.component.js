// @flow

import React from 'react';

import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import VideocamIcon from '@material-ui/icons/Videocam';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment-timezone';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';
import { pure } from 'recompose';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import Level from '#libs/level/components/Level.component';

import { formatAsTime } from '../../../utils/datetime';
import CoachAvatar from '../../associated-coach/components/CoachAvatar.component';
import Tooltip from '../../../components/Tooltip.component';
import { getCoachOrSubstitute } from '../utils';
import { isOfferInThePast } from '../../marketplace/utils';

type Props = {
  offer: Offer,
  selected: ?boolean,
  showOfferFilling: boolean,
  establishmentLoading: boolean,
  activityLoading: boolean,
  onClick: () => void,
  actions?: any,
  hideCoach: boolean,
  isRegistered?: boolean,
};

export const OfferListItemConsumer = (props: Props) => {
  const { offer, selected } = props;
  const classes = useStyles();
  const { t } = useTranslation(['marketplace']);
  const isInThePast = isOfferInThePast(offer);
  const coachName = getCoachOrSubstitute(offer)?.name ?? ' - ';
  const metaActivityName = offer?.meta_activity?.name ?? ' - ';
  const establishmentName = offer?.establishment?.title ?? ' - ';

  return (
    <ListItem
      divider
      button={!isInThePast}
      onClick={props.onClick}
      selected={selected}
      style={{
        borderLeft: '5px solid',
        borderLeftColor: offer.meta_activity_color
          ? offer.meta_activity_color
          : '#FFFFFF00',
      }}
    >
      {!props.hideCoach && (
        <Hidden xsDown>
          <ListItemAvatar>
            <CoachAvatar
              coach={offer.coach}
              coach_override={offer.coach_override}
            />
          </ListItemAvatar>
        </Hidden>
      )}
      <ListItemText
        primary={
          <div className={classes.primaryTextContainer}>
            <div className={classes.inlineContainer}>
              {(props.activityLoading && metaActivityName === ' - ') ||
              !offer.establishment.tzname ? (
                <MoreHorizIcon className={classes.icon} fontSize="small" />
              ) : (
                <div className={classes.offerTitleText}>
                  {offer.meta_activity && offer.meta_activity.is_broadcast ? (
                    <VideocamIcon className={classes.videocamIcon} />
                  ) : null}
                  <Typography style={{ margin: 0 }}>
                    {`${metaActivityName} ${formatAsTime(
                      offer.date_start,
                      offer.timezone_name,
                    )}-${formatAsTime(
                      moment(offer.date_start).add(
                        offer.duration_minute,
                        'minute',
                      ),
                      offer.timezone_name,
                    )}`}
                    {props.isRegistered && (
                      <Tooltip
                        placement="right"
                        title={t('calendar.registered')}
                      >
                        <CheckCircleIcon
                          className={classes.registrationIcon}
                          color="primary"
                        />
                      </Tooltip>
                    )}
                  </Typography>
                </div>
              )}
            </div>
            <div className={classes.levelCoachContainer}>
              <Level
                noStyle
                align="left"
                customLevel={offer.customLevel}
                variant="caption"
              />
              {!props.hideCoach && (
                <Typography className={classes.coachName} variant="caption">
                  {`  ${coachName}${
                    props.showOfferFilling
                      ? ` (${offer.tot_slots}/${offer.effectif})`
                      : ''
                  }`}
                </Typography>
              )}
            </div>
          </div>
        }
        secondary={
          props.establishmentLoading && establishmentName === ' - ' ? (
            <MoreHorizIcon fontSize="small" />
          ) : (
            establishmentName
          )
        }
      />
      {props.actions ? (
        <ListItemSecondaryAction>{props.actions}</ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => {
  return {
    primaryTextContainer: { flexDirection: 'column', alignItems: 'flex-start' },
    inlineContainer: { alignItems: 'center', display: 'flex' },
    icon: { marginRight: theme.spacing(2) },
    levelCoachContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      display: 'flex',
    },
    coachName: { marginLeft: theme.spacing(2) },
    offerTitleText: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      margin: 0,
    },
    videocamIcon: {
      marginRight: theme.spacing(0.5),
    },
    registrationIcon: {
      marginLeft: theme.spacing(2),
      marginBottom: -theme.spacing(0.6),
    },
  };
});

export default pure(OfferListItemConsumer);
