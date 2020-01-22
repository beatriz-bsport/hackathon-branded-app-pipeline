// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import { pure } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { formatAsDatetime } from '../../../datetime';
import CoachAvatar from '../../associated-coach/components/CoachAvatar.component';
import Level from '../../../components/category/Level.component';

type Props = {
  offer: Object,
  t: TFunction,
  onClick: (offerId: number) => void,
  classes: Object,
};

export const OfferListItem = (props: Props) => {
  const { offer, t } = props;
  return (
    <ListItem
      button={!!props.onClick}
      divider
      onClick={props.onClick ? () => props.onClick(offer.id) : null}
    >
      <CoachAvatar
        t={t}
        coach={offer && offer.coach ? offer.coach : null}
        coach_override={offer.coach_override ? offer.coach_override : null}
      />
      <ListItemText
        primary={
          <div>
            <Typography inline>
              {offer && offer.meta_activity ? offer.meta_activity.name : ''}
            </Typography>
            <Level
              noStyle
              align="left"
              variant="caption"
              levelId={offer && offer.level}
            />
          </div>
        }
        secondary={
          offer
            ? (
                offer.establishment_override ||
                offer.etablissement ||
                offer.establishment
              ).title
            : ''
        }
      />
      <div>
        <Typography
          variant="caption"
          color="textSecondary"
          className={props.classes.inline}
        >
          <div className={props.classes.text}>{props.t('forms.old_date')}</div>
          {formatAsDatetime(offer.date_start)}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          className={props.classes.inline}
        >
          <div className={props.classes.text}>{props.t('forms.new_date')}</div>
          {formatAsDatetime(offer.new_date_start)}
        </Typography>
      </div>
    </ListItem>
  );
};
const styles = (theme) => ({
  text: { marginRight: theme.spacing.unit },
  inline: { display: 'flex' },
});

export default pure(
  withNamespaces(['offer'])(withStyles(styles)(OfferListItem)),
);
