import { describe, expect, it } from "vitest";

import { createDefaultTagFilterFormValue } from "#src/components/filters/tag-filter/default-value";
import { mapTagFilterToFormValue } from "#src/components/filters/tag-filter/mappers/api-to-form-value";
import { buildTagFilterDirtyPatch } from "#src/components/filters/tag-filter/mappers/build-dirty-patch";
import type { TagFilterFormValue } from "#src/components/filters/tag-filter/types";

describe("buildTagFilterDirtyPatch", () => {
  it("returns empty object when nothing changed vs baseline", () => {
    const value = createDefaultTagFilterFormValue(1);
    value.includeSectionEnabled = true;
    value.tagsIncluded = [2, 1];

    const baseline: TagFilterFormValue = { ...value };

    expect(buildTagFilterDirtyPatch(value, baseline)).toEqual({});
  });

  it("emits tags_included when included ids change", () => {
    const baseline = createDefaultTagFilterFormValue(1);
    baseline.includeSectionEnabled = true;
    baseline.tagsIncluded = [1];

    const value: TagFilterFormValue = {
      ...baseline,
      tagsIncluded: [1, 2],
    };

    expect(buildTagFilterDirtyPatch(value, baseline)).toEqual({
      tags_included: [1, 2],
    });
  });

  it("emits explicit empty array when include section is turned off with prior tags", () => {
    const baseline = mapTagFilterToFormValue({
      id: 4,
      company_id: 1,
      smartlist: 1,
      filter_identifier: 11,
      tags_included: [10],
      tags_excluded: [],
    });

    const value: TagFilterFormValue = {
      ...baseline,
      includeSectionEnabled: false,
      tagsIncluded: [],
    };

    expect(buildTagFilterDirtyPatch(value, baseline)).toEqual({
      tags_included: [],
    });
  });

  it("emits tags_excluded when excluded ids change", () => {
    const baseline = createDefaultTagFilterFormValue(1);
    baseline.excludeSectionEnabled = true;
    baseline.tagsExcluded = [5];

    const value: TagFilterFormValue = {
      ...baseline,
      tagsExcluded: [5, 6],
    };

    expect(buildTagFilterDirtyPatch(value, baseline)).toEqual({
      tags_excluded: [5, 6],
    });
  });

  it("second save uses updated baseline", () => {
    const initialBaseline = mapTagFilterToFormValue({
      id: 4,
      company_id: 1,
      smartlist: 1,
      filter_identifier: 11,
      tags_included: [1],
      tags_excluded: [],
    });

    const valueAfterFirstEdit: TagFilterFormValue = {
      ...initialBaseline,
      tagsIncluded: [1, 2],
    };

    expect(
      buildTagFilterDirtyPatch(valueAfterFirstEdit, initialBaseline),
    ).toEqual({
      tags_included: [1, 2],
    });

    const updatedBaseline: TagFilterFormValue = { ...valueAfterFirstEdit };

    expect(
      buildTagFilterDirtyPatch(valueAfterFirstEdit, updatedBaseline),
    ).toEqual({});
  });
});
