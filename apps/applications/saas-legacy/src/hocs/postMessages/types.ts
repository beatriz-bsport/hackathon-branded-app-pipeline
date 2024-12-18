export enum BsportPostMessageIdentifier {
  MARKETPLACE_CALENDAR_FILTER_UPDATE = 'bsport:calendar:filter:update',
  MARKETPLACE_WORKSHOP_FILTER_UPDATE = 'bsport:workshop:filter:update',
  MARKETPLACE_CONSUMER_SPACE_PAGE_CHANGE = 'bsport:consumerspace:page:change',
}

export type BsportMessageType = `${BsportPostMessageIdentifier}`;

export enum BsportPostMessageControlledIdentifier {
  MARKETPLACE_CALENDAR_FILTER_UPDATE = 'bsport:calendar:filter:control',
  MARKETPLACE_WORKSHOP_FILTER_UPDATE = 'bsport:workshop:filter:control',
  MARKETPLACE_CONSUMER_SPACE_PAGE_CHANGE = 'bsport:consumerspace:page:change',
}

export type BsportControlledPropsMessageType =
  `${BsportPostMessageControlledIdentifier}`;
