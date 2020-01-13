// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import type { TFunction } from 'react-i18next';

import CoachAvatar from '../../associated-coach/components/CoachAvatar.component';
import Level from '../../../components/category/Level.component';
import { formatAsTime } from '../../../datetime';

type Props = {
  offer: Object,
  t: TFunction,
  onClick: (offerId: number) => void,
  rightAction: ?React.Node,
};

export const OfferListItem = (props: Props) => {
  const { offer, t } = props;
  return (
    <ListItem
      button={!!props.onClick}
      divider
      onClick={() => props.onClick(offer.id)}
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
              {offer && offer.name ? offer.name : ''}
            </Typography>
            <Typography inline>
              {offer && offer.date_start
                ? ` - ${formatAsTime(
                    offer.date_start,
                    offer.establishment ? offer.establishment.tzname : null,
                  )}`
                : ''}
            </Typography>
            <Level
              noStyle
              variant="caption"
              levelId={offer && offer.level_id ? offer.level_id || null : null}
            />
          </div>
        }
        secondary={
          offer
            ? (
                offer.establishment_override ||
                offer.etablissement ||
                offer.establishment || { title: '' }
              ).title
            : ''
        }
      />
      {props.rightAction}
    </ListItem>
  );
};
export default OfferListItem;
