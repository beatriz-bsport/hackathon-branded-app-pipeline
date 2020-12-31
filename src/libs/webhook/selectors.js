// @flow

import { createSelector } from 'reselect';

import Immutable from 'seamless-immutable';
import type { State } from '../../state/types';

export const getWebhookDict = (state: State): any => state.webhook.byId;

export const getWebhookId = (state: State): any => state.webhook.allIds;

export const getAllWebhooks = createSelector(
  [getWebhookDict, getWebhookId],
  (webhookDict, IdList) => Immutable(IdList.map((id) => webhookDict[id])),
);

export const getWebhook = (state: State, id: number): any =>
  state.webhook.byId[id];
