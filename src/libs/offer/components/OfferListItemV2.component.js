// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import type { TFunction } from 'react-i18next';

import { formatAsDatetime } from '../../../datetime';
import CoachAvatar from '../../associated-coach/components/CoachAvatar.component';
import Level from '../../../components/category/Level.component';

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
              {offer && offer.meta_activity ? offer.meta_activity.name : ''}
            </Typography>
            <Level noStyle variant="caption" levelId={offer && offer.level} />
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
      <Typography variant="caption" color="textSecondary">
        {formatAsDatetime(offer.date_start)}
      </Typography>
    </ListItem>
  );
};
export default OfferListItem;
