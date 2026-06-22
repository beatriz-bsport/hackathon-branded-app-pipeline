import { HttpResponse, delay, http } from "msw";

import type { Tag, TagGroup } from "../types";
import { mockTagGroups, mockTags } from "./data";

export const TAGS_URL_PATTERN = "*/tagging/tag/";
export const TAG_GROUPS_URL_PATTERN = "*/tagging/tag-group/";

type MakeTagHandlersOptions = {
  tags?: Tag[];
  tagGroups?: TagGroup[];
  delayMs?: number | "infinite";
};

export const makeTagHandlers = ({
  tags = mockTags,
  tagGroups = mockTagGroups,
  delayMs = 0,
}: MakeTagHandlersOptions = {}) => [
  http.get(TAGS_URL_PATTERN, async () => {
    if (delayMs) await delay(delayMs);
    return HttpResponse.json(tags);
  }),
  http.get(TAG_GROUPS_URL_PATTERN, async () => {
    if (delayMs) await delay(delayMs);
    return HttpResponse.json(tagGroups);
  }),
];
