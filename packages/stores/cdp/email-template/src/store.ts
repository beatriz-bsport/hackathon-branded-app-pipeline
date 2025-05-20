import { createStore } from "zustand/vanilla";

import { type PaginatedState, bindStore } from "@bsport/store-base";

import type {
  EmailTemplateCategory,
  EmailTemplateDetail,
  EmailTemplateSummary,
} from "#src/types";

export interface EmailTemplateState {
  summaries: {
    flatIds: number[];
    fuzzyIds: number[];
  } & PaginatedState<EmailTemplateSummary>;
  categories: PaginatedState<EmailTemplateCategory>;
  details: {
    byId: { [key: number]: EmailTemplateDetail };
    count: number;
    ids: number[];
  };
}

export const emailTemplateStore = createStore<EmailTemplateState>()(() => ({
  summaries: {
    byId: {},
    count: 0,
    ids: [],
    page: 1,
    flatIds: [],
    fuzzyIds: [],
  },
  categories: {
    byId: {},
    count: 0,
    ids: [],
    page: 1,
  },
  details: {
    byId: {},
    count: 0,
    ids: [],
  },
}));

export const useEmailTemplateStore = bindStore(emailTemplateStore);
