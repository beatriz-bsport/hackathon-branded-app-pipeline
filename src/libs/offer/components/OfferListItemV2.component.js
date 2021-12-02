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
import { formatAsDatetime } from '../../../utils/datetime';
import CoachAvatar from '../../associated-coach/components/CoachAvatar.component';
import Level from '../../../components/category/Level.component';

type Props = {
  offer: Object,
  onClick: (offerId: number) => void,
  editing_parameters?: any,
  disabled?: boolean,
  selected?: boolean,
  similarOffer?: boolean,
  handleChange?: () => void,
  checked?: boolean,
};

export const OfferListItem = (props: Props) => {
  const { offer } = props;
  const { t } = useTranslation(['offer']);
  const classes = useStyles();

  return (
    <ListItem
      button={!!props.onClick}
      disabled={props.disabled}
      divider
      selected={props.selected}
      onClick={props.onClick ? () => props.onClick(offer.id) : null}
    >
      {props.similarOffer ? (
        <Checkbox checked={props.checked} onChange={props.handleChange} />
      ) : null}
      <ListItemAvatar>
        <CoachAvatar
          t={t}
          coach={offer && offer.coach ? offer.coach : null}
          coach_override={offer.coach_override ? offer.coach_override : null}
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
              {moment(offer.date_start)
                .tz(offer.timezone_name || moment().tz() || 'Europe/Paris')
                .format('llll')}
            </Typography>
            <div className={classes.row}>
              <Level
                noStyle
                align="left"
                variant="caption"
                levelId={offer && offer.level}
                className={classes.level}
                noWrap={false}
              />

              <Typography className={classes.marginLeft} variant="caption">
                {` ${offer.validated_booking_count}/${offer.effectif}`}
              </Typography>
              {offer.full ? (
                <div className={classes.warning}>
                  <WarningIcon
                    color="error"
                    size={15}
                    className={classes.warningIcon}
                  />
                  <Typography variant="caption" className={classes.warningText}>
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
                ).title
              }`
            : ''
        }
      />
      {props.editing_parameters ? (
        <div>
          <Typography
            variant="caption"
            color="textSecondary"
            className={classes.inline}
          >
            <div className={classes.text}>{t('forms.old_date')}</div>
            {formatAsDatetime(offer.date_start, offer.timezone_name)}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            className={classes.inline}
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
