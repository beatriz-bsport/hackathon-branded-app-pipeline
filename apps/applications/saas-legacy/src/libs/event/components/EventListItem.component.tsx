import React from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InfoIcon from '@material-ui/icons/Info';
import { GenericEvent, GenericEventSpec } from '../types';

type Props = {
  // @ts-expect-error
  event: GenericEvent;
  // @ts-expect-error
  onEventClick?: (event: GenericEvent) => void;
  // @ts-expect-error
  eventSpec: GenericEventSpec;
};

export const GenericEventListItem = (props: Props) => {
  const { event, eventSpec, onEventClick } = props;
  const { t } = useTranslation(['subscription', 'checkout', 'member']);

  const eventType = event?.event_type;

  // Dictionary of utils to retrieve different data from the event
  // The utils to get translation must specify the translation module :
  // "subscription:", "checkout:" or "member:"
  const eventTypeUtils = eventSpec[eventType];
  const disableOnClick = !!eventTypeUtils?.disableOnClick;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onClick = React.useCallback(
    onEventClick && !disableOnClick ? () => onEventClick(event) : null,
    [onEventClick, disableOnClick, event],
  );

  if (!event || !eventType) return null;

  // Icon
  const icon = eventTypeUtils.icon || <InfoIcon />;

  // First line
  const titlePrefix = eventTypeUtils?.titlePrefix
    ? eventTypeUtils.titlePrefix(event, t)
    : '';
  const primaryText = eventTypeUtils?.getPrimaryText
    ? eventTypeUtils.getPrimaryText(event, t)
    : event;

  // Second Line
  const defaultSecondaryText = DateTime.fromSeconds(event.date).toFormat(
    'DDDD t',
  ); // event date
  const secondaryText = eventTypeUtils?.getSecondaryText
    ? eventTypeUtils.getSecondaryText(event, t)
    : defaultSecondaryText;

  return (
    // @ts-expect-error
    <ListItem dense button={!!onClick} onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
        primary={titlePrefix + primaryText}
        secondary={secondaryText}
      />
    </ListItem>
  );
};

export default GenericEventListItem;
