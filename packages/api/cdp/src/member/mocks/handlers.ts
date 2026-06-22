import { HttpResponse, delay, http } from "msw";

import type { MemberDetail } from "../types";
import { mockMemberDetail } from "./data";

export const MEMBER_DETAIL_URL_PATTERN = "*/customer-data-platform/v1/member/*";

type MakeMemberHandlersOptions = {
  member?: MemberDetail;
  delayMs?: number | "infinite";
  errorOnLoad?: boolean;
};

export const makeMemberHandlers = ({
  member = mockMemberDetail,
  delayMs = 400,
  errorOnLoad = false,
}: MakeMemberHandlersOptions = {}) => [
  http.get(MEMBER_DETAIL_URL_PATTERN, async () => {
    await delay(delayMs);

    if (errorOnLoad) {
      return HttpResponse.json(
        { detail: "Internal server error" },
        { status: 500 },
      );
    }

    return HttpResponse.json(member);
  }),
];
