import {
  SIGN_ES_TERRITORY,
  type SignEsTerritory,
} from '#src/libs/invoice/types';

export type TicketbaiTerritory = Exclude<
  SignEsTerritory,
  typeof SIGN_ES_TERRITORY.SPAIN_OTHER
>;
