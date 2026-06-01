import { describe, expect, it, vi } from "vitest";

import { SmartlistDateFilterType } from "@bsport/api-cdp/smartlist";
import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { createDefaultMemberSignUpDateFilter } from "#src/components/filters/member-sign-up-date-filter/default-value";
import { buildDirtyPatchPayload } from "#src/components/filters/member-sign-up-date-filter/mappers/build-dirty-patch";
import type { MemberSignUpDateFilterFormValue } from "#src/components/filters/member-sign-up-date-filter/types";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
} from "#src/components/primitive-filters/date-filter/constants";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

type DirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<MemberSignUpDateFilterFormValue>>
>;

describe("buildDirtyPatchPayload", () => {
  it("returns empty payload when sign-up date is not dirty", () => {
    const value = createDefaultMemberSignUpDateFilter(1);
    const dirtyFields: DirtyFields = {};

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits date fields when sign-up date is dirty", () => {
    const value = createDefaultMemberSignUpDateFilter(1);
    value.signUpDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.onOrBefore,
        fromDate: "2024-01-15",
        toDate: null,
      },
      relative: value.signUpDate.relative,
    };
    const dirtyFields: DirtyFields = {
      signUpDate: { absolute: { fromDate: true } },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({
      date_filter_type: SmartlistDateFilterType.DATE_BEFORE,
      date: "2024-01-15",
    });
  });
});
