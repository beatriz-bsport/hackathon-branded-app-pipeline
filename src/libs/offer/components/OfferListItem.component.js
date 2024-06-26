import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import type { TFunction } from 'react-i18next';

import Level from '#src/libs/level/components/Level.component';
import CoachAvatar from '../../associated-coach/components/CoachAvatar.component';
import { formatISOStringAsTime } from '../../../utils/datetime';

type Props = {
  offer: Object,
  t: TFunction,
  onClick: (offerId: number) => void,
  rightAction?: React.Node,
};

export const OfferListItem = (props: Props) => {
  const { offer, t } = props;

  const offerNameDisplay = React.useMemo(
    () =>
      offer?.name_override || offer?.meta_activity?.name || offer?.name || '',
    [offer],
  );

  const coach = React.useMemo(() => offer?.coach ?? null, [offer]);

  const coachOverride = React.useMemo(
    () => offer?.coach_override ?? null,
    [offer],
  );

  const coachName = React.useMemo(() => {
    if (coachOverride?.name || coach?.name) {
      return ` - ${coachOverride?.name || coach?.name}`;
    }
    return '';
  }, [coach?.name, coachOverride?.name]);

  return (
    <ListItem
      divider
      button={!!props.onClick}
      onClick={() => props.onClick(offer.id)}
    >
      <IconButton>
        <CoachAvatar
          coach={offer && offer.coach ? offer.coach : null}
          coach_override={offer.coach_override ? offer.coach_override : null}
          t={t}
        />
      </IconButton>
      <ListItemText
        primary={
          <div>
            <Typography inline>
              {offerNameDisplay}
              {offer && offer.date_start
                ? ` - ${formatISOStringAsTime(
                    offer.date_start,
                    offer.timezone_name,
                  )}`
                : ''}
              {coachName}
            </Typography>
            <Level noStyle customLevel={offer.level} variant="caption" />
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
