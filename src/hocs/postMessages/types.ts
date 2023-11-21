export enum BsportPostMessageIdentifier {
  MARKETPLACE_CALENDAR_FILTER_UPDATE = 'bsport:calendar:filter:update',
  MARKETPLACE_WORKSHOP_FILTER_UPDATE = 'bsport:workshop:filter:update',
}

export type BsportMessageType = `${BsportPostMessageIdentifier}`;
