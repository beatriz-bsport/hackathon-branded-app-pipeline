import React from 'react';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';

import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/Warning';

import { formatAsDatetime, formatAsDatetimeAdapted } from '#utils/datetime';

import CoachAvatar from '#libs/associated-coach/components/CoachAvatar.component';
import Level from '#libs/level/components/Level.component';

import type { OfferDataListItem } from '#libs/offer/types';

type Props = {
  checked?: boolean;
  disabled?: boolean;
  divider?: boolean;
  editing_parameters?: any;
  handleChange?: () => void;
  offer: OfferDataListItem;
  onClick: (offerId: number) => void;
  selected?: boolean;
  similarOffer?: boolean;
};

export const OfferListItemV2: React.FC<Props> = ({
  checked,
  disabled,
  divider,
  editing_parameters,
  handleChange,
  offer,
  onClick,
  selected,
  similarOffer,
}) => {
  const { t } = useTranslation(['offer']);
  const classes = useStyles();

  const handleClickItem = React.useCallback(() => {
    if (onClick && offer.id) {
      onClick(offer.id);
    }
  }, [offer, onClick]);

  const offerNameDisplay = React.useMemo(
    () => offer?.name_override || offer?.meta_activity?.name || offer?.name,
    [offer],
  );

  const coach = React.useMemo(() => offer?.coach ?? null, [offer]);

  const coachOverride = React.useMemo(
    () => offer?.coach_override ?? null,
    [offer],
  );

  const offerDateStart = React.useMemo(
    () =>
      formatAsDatetimeAdapted(
        offer.date_start,
        'llll',
        offer.timezone_name || moment().tz() || 'Europe/Paris',
      ),
    [offer],
  );
  return (
    <ListItem
      // @ts-expect-error
      button={!!onClick}
      disabled={disabled}
      divider={!!divider}
      onClick={handleClickItem}
      selected={selected}
    >
      {similarOffer ? (
        <Checkbox
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
        />
      ) : null}
      <ListItemAvatar>
        <CoachAvatar coach={coach} coach_override={coachOverride} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <div>
            <Typography>{offerNameDisplay}</Typography>
            <Typography variant="caption">{offerDateStart}</Typography>
            <div className={classes.row}>
              <Level
                noStyle
                align="left"
                customLevel={offer && offer.customLevel}
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
                    fontSize="medium"
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
                  // @ts-expect-error Not deleted to make sure we are not breaking anything on all endpoints.
                  offer.etablissement ||
                  offer.establishment
                )?.title ?? ''
              }`
            : ''
        }
      />
      {editing_parameters ? (
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
              editing_parameters.new_date_start,
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

export default React.memo(OfferListItemV2);
