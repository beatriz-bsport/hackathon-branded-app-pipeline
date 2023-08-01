// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';

import { pure } from 'recompose';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import WarningIcon from '@material-ui/icons/Warning';
import {
  formatAsDatetime,
  formatAsDatetimeAdapted,
} from '../../../utils/datetime';
import CoachAvatar from '../../associated-coach/components/CoachAvatar.component';
import Level from '#libs/level/components/Level.component';

type Props = {
  offer: Object,
  onClick: (offerId: number) => void,
  editing_parameters?: any,
  disabled?: boolean,
  selected?: boolean,
  similarOffer?: boolean,
  handleChange?: () => void,
  checked?: boolean,
  divider?: boolean,
};

export const OfferListItem = (props: Props) => {
  const { offer } = props;
  const { t } = useTranslation(['offer']);
  const classes = useStyles();

  return (
    <ListItem
      button={!!props.onClick}
      disabled={props.disabled}
      divider={props?.divider ?? false}
      onClick={props.onClick ? () => props.onClick(offer.id) : null}
      selected={props.selected}
    >
      {props.similarOffer ? (
        <Checkbox
          checked={props.checked}
          disabled={props.disabled}
          onChange={props.handleChange}
        />
      ) : null}
      <ListItemAvatar>
        <CoachAvatar
          coach={offer && offer.coach ? offer.coach : null}
          coach_override={offer.coach_override ? offer.coach_override : null}
          t={t}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <div>
            <Typography inline>
              {offer && offer.meta_activity
                ? offer.meta_activity.name
                : offer.name}
            </Typography>
            <Typography inline variant="caption">
              {formatAsDatetimeAdapted(
                offer.date_start,
                'llll',
                offer.timezone_name || moment().tz() || 'Europe/Paris',
              )}
            </Typography>
            <div className={classes.row}>
              <Level
                noStyle
                align="left"
                className={classes.level}
                customLevel={offer && offer.customLevel}
                noWrap={false}
                variant="caption"
              />

              <Typography className={classes.marginLeft} variant="caption">
                {` ${offer?.validated_booking_count ?? offer?.nb_bookings}/${
                  offer.effectif
                }`}
              </Typography>
              {offer.full ? (
                <div className={classes.warning}>
                  <WarningIcon
                    className={classes.warningIcon}
                    color="error"
                    size={15}
                  />
                  <Typography className={classes.warningText} variant="caption">
                    {t('warningOfferFull')}
                  </Typography>
                </div>
              ) : null}
            </div>
          </div>
        }
        secondary={
          offer
            ? `${
                (
                  offer.establishment_override ||
                  offer.etablissement ||
                  offer.establishment
                )?.title ?? ''
              }`
            : ''
        }
      />
      {props.editing_parameters ? (
        <div>
          <Typography
            className={classes.inline}
            color="textSecondary"
            variant="caption"
          >
            <div className={classes.text}>{t('forms.old_date')}</div>
            {formatAsDatetime(offer.date_start, offer.timezone_name)}
          </Typography>
          <Typography
            className={classes.inline}
            color="textSecondary"
            variant="caption"
          >
            <div className={classes.text}>{t('forms.new_date')}</div>
            {formatAsDatetime(
              props.editing_parameters.new_date_start,
              offer.timezone_name,
            )}
          </Typography>
        </div>
      ) : null}
    </ListItem>
  );
};
const useStyles = makeStyles((theme) => ({
  warningText: {
    width: theme.spacing(30),
  },
  text: { marginRight: theme.spacing(1) },
  inline: { display: 'flex' },
  warning: {
    display: 'flex',
    alignItems: 'center',
  },
  warningIcon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  marginLeft: { marginLeft: theme.spacing(1) },
}));

export default pure(OfferListItem);
