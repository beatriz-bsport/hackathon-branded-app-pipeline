import { TFunction } from 'react-i18next';
import Memoize from 'memoize-one';
import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
} from '@bsport/common/lib/master-data/communication-kind';
import {
  COMMUNICATION_RECIPIENT_BOOKINGS,
  COMMUNICATION_RECIPIENT_BOOKINGS_CANCELLED,
  COMMUNICATION_RECIPIENT_WAITING_LIST,
  COMMUNICATION_CHANNEL_SESSION,
  COMMUNICATION_CHANNEL_NOTIFICATION,
  COMMUNICATION_CHANNEL_SMARTLIST,
  COMMUNICATION_CHANNEL_MESSAGE_DIRECT,
  COMMUNICATION_SEND_PARAMETER_AUTO,
  COMMUNICATION_SEND_PARAMETER_MANUAL,
} from '@bsport/common/lib/master-data/communication-filters';
import { SelectFieldItem } from './types';

import {
  FILTER_IDENTIFIER_CHANNEL,
  FILTER_IDENTIFIER_KIND,
  FILTER_IDENTIFIER_RECIPIENT,
  FILTER_IDENTIFIER_SEND_PARAMETER,
} from './constants';

export const getFieldChoicesByIdentifier = Memoize(
  (identifier: number, t: TFunction) => {
    switch (identifier) {
      case FILTER_IDENTIFIER_KIND:
        return [
          {
            value: COMMUNICATION_KIND_EMAIL,
            label: t(`campaign.kind.${COMMUNICATION_KIND_EMAIL}`),
          },
          {
            value: COMMUNICATION_KIND_SMS,
            label: t(`campaign.kind.${COMMUNICATION_KIND_SMS}`),
          },
          {
            value: COMMUNICATION_KIND_PUSH_NOTIFICATION,
            label: t(`campaign.kind.${COMMUNICATION_KIND_PUSH_NOTIFICATION}`),
          },
        ];
      case FILTER_IDENTIFIER_CHANNEL:
        return [
          {
            value: COMMUNICATION_CHANNEL_SESSION,
            label: t(`filter.choicesLabels.${COMMUNICATION_CHANNEL_SESSION}`),
          },
          {
            value: COMMUNICATION_CHANNEL_NOTIFICATION,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_CHANNEL_NOTIFICATION}`,
            ),
          },
          {
            value: COMMUNICATION_CHANNEL_SMARTLIST,
            label: t(`filter.choicesLabels.${COMMUNICATION_CHANNEL_SMARTLIST}`),
          },
          {
            value: COMMUNICATION_CHANNEL_MESSAGE_DIRECT,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_CHANNEL_MESSAGE_DIRECT}`,
            ),
          },
        ];
      case FILTER_IDENTIFIER_RECIPIENT:
        return [
          {
            value: COMMUNICATION_RECIPIENT_BOOKINGS,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_RECIPIENT_BOOKINGS}`,
            ),
          },
          {
            value: COMMUNICATION_RECIPIENT_BOOKINGS_CANCELLED,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_RECIPIENT_BOOKINGS_CANCELLED}`,
            ),
          },
          {
            value: COMMUNICATION_RECIPIENT_WAITING_LIST,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_RECIPIENT_WAITING_LIST}`,
            ),
          },
        ];
      case FILTER_IDENTIFIER_SEND_PARAMETER:
        return [
          {
            value: COMMUNICATION_SEND_PARAMETER_AUTO,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_SEND_PARAMETER_AUTO}`,
            ),
          },
          {
            value: COMMUNICATION_SEND_PARAMETER_MANUAL,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_SEND_PARAMETER_MANUAL}`,
            ),
          },
        ];
      default:
        return undefined;
    }
  },
);

export const getPersonnalizedChoicesByIdentifier = Memoize(
  (identifiers: Array<number>, t: TFunction) => {
    const choices: SelectFieldItem[] = [];
    identifiers.forEach((identifier) => {
      choices.push({
        value: identifier,
        label: t(`filter.choicesLabels.${identifier}`),
      });
    });
    return choices;
  },
);
