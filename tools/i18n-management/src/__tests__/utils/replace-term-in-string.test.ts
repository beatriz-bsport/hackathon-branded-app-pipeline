import { describe, expect, it } from "vitest";

import {
  groupToFirstUpperCase,
  replaceTermInString,
  toFirstUpperCase,
} from "#src/utils/replace-term-in-string";

describe("toFirstUpperCase", () => {
  it("uppercases the first letter of a lowercase word", () => {
    expect(toFirstUpperCase("martha")).toBe("Martha");
  });

  it("keeps the rest of the string unchanged", () => {
    expect(toFirstUpperCase("mARtha")).toBe("MARtha");
  });

  it("returns an empty string when input is empty", () => {
    expect(toFirstUpperCase("")).toBe("");
  });

  it("works with a single character", () => {
    expect(toFirstUpperCase("a")).toBe("A");
  });
});

describe("groupToFirstUpperCase", () => {
  it("uppercases the first letter of a lowercase word", () => {
    expect(groupToFirstUpperCase("appointment pass")).toBe("Appointment Pass");
  });

  it("keeps the rest of the string unchanged", () => {
    expect(groupToFirstUpperCase("videos & eBooks")).toBe("Videos & EBooks");
  });

  it("returns an empty string when input is empty", () => {
    expect(groupToFirstUpperCase("")).toBe("");
  });

  it("works with a single word", () => {
    expect(toFirstUpperCase("pass")).toBe("Pass");
  });
});

describe("replaceTermInString", () => {
  it("replaces a singular lowercase term", () => {
    const result = replaceTermInString({
      sourceString: "this studio has one coach",
      previousTermSingular: "coach",
      previousTermPlural: "coaches",
      newTermSingular: "trainer",
      newTermPlural: "trainers",
    });

    expect(result.isPresent).toBe(true);
    expect(result.updatedString).toBe("this studio has one trainer");
  });

  it("replaces a plural lowercase term", () => {
    const result = replaceTermInString({
      sourceString: "many coaches are available",
      previousTermSingular: "coach",
      previousTermPlural: "coaches",
      newTermSingular: "trainer",
      newTermPlural: "trainers",
    });

    expect(result.isPresent).toBe(true);
    expect(result.updatedString).toBe("many trainers are available");
  });

  it("replaces capitalized terms while preserving capitalization", () => {
    const result = replaceTermInString({
      sourceString: "Coach and coaches are different",
      previousTermSingular: "coach",
      previousTermPlural: "coaches",
      newTermSingular: "trainer",
      newTermPlural: "trainers",
    });

    expect(result.isPresent).toBe(true);
    expect(result.updatedString).toBe("Trainer and trainers are different");
  });

  it("returns isPresent=false when no term is found", () => {
    const result = replaceTermInString({
      sourceString: "no matching word here",
      previousTermSingular: "coach",
      previousTermPlural: "coaches",
      newTermSingular: "trainer",
      newTermPlural: "trainers",
    });

    expect(result.isPresent).toBe(false);
    expect(result.updatedString).toBe("no matching word here");
  });

  it("handles singular being a substring of plural", () => {
    const result = replaceTermInString({
      sourceString: "coach coaches",
      previousTermSingular: "coach",
      previousTermPlural: "coaches",
      newTermSingular: "trainer",
      newTermPlural: "trainers",
    });

    expect(result.isPresent).toBe(true);
    expect(result.updatedString).toBe("trainer trainers");
  });

  it("handles plural being a substring of singular", () => {
    const result = replaceTermInString({
      sourceString: "Plural is Azerty, Singular is Azertyuiops",
      previousTermSingular: "Azertyuiops",
      previousTermPlural: "Azerty",
      newTermSingular: "Singular",
      newTermPlural: "Plural",
    });

    expect(result.isPresent).toBe(true);
    expect(result.updatedString).toBe("Plural is Plural, Singular is Singular");
  });

  it("preserves initial case for first replacement", () => {
    const result = replaceTermInString({
      sourceString: "Look at our Videos & eBooks",
      previousTermSingular: "Videos & eBooks",
      previousTermPlural: "Videos & eBooks",
      newTermSingular: "On-Demand",
      newTermPlural: "On-Deman",
    });

    expect(result.isPresent).toBe(true);
    expect(result.updatedString).toBe("Look at our On-Demand");
  });

  it("handles multiple words separated by space", () => {
    const result = replaceTermInString({
      sourceString: "Private Pass, private passes, Private pass",
      previousTermSingular: "Private pass",
      previousTermPlural: "Private passes",
      newTermSingular: "Appointment pass",
      newTermPlural: "Appointment passes",
    });

    expect(result.isPresent).toBe(true);
    expect(result.updatedString).toBe(
      "Appointment Pass, appointment passes, Appointment pass",
    );
  });
});

describe("replaceTermInString - i18n interpolation safety", () => {
  it("does not replace terms inside {{ }} blocks", () => {
    const result = replaceTermInString({
      sourceString: "Hello {{coach}}, the coach is available",
      previousTermSingular: "coach",
      previousTermPlural: "coaches",
      newTermSingular: "trainer",
      newTermPlural: "trainers",
    });

    expect(result.isPresent).toBe(true);
    expect(result.updatedString).toBe(
      "Hello {{coach}}, the trainer is available",
    );
  });

  it("does not replace plural terms inside {{ }} blocks", () => {
    const result = replaceTermInString({
      sourceString: "Hello {{coaches}}, many coaches are ready",
      previousTermSingular: "coach",
      previousTermPlural: "coaches",
      newTermSingular: "trainer",
      newTermPlural: "trainers",
    });

    expect(result.isPresent).toBe(true);
    expect(result.updatedString).toBe(
      "Hello {{coaches}}, many trainers are ready",
    );
  });

  it("does not replace capitalized terms inside {{ }} blocks", () => {
    const result = replaceTermInString({
      sourceString: "Welcome {{Coach}}, Coach and coaches are here",
      previousTermSingular: "coach",
      previousTermPlural: "coaches",
      newTermSingular: "trainer",
      newTermPlural: "trainers",
    });

    expect(result.isPresent).toBe(true);
    expect(result.updatedString).toBe(
      "Welcome {{Coach}}, Trainer and trainers are here",
    );
  });

  it("does not mark isPresent=true when matches exist only inside {{ }}", () => {
    const result = replaceTermInString({
      sourceString: "Hello {{coach}} and {{coaches}}",
      previousTermSingular: "coach",
      previousTermPlural: "coaches",
      newTermSingular: "trainer",
      newTermPlural: "trainers",
    });

    expect(result.isPresent).toBe(false);
    expect(result.updatedString).toBe("Hello {{coach}} and {{coaches}}");
  });

  it("handles multiple {{ }} blocks in the same string", () => {
    const result = replaceTermInString({
      sourceString: "{{coach}} vs {{coaches}} — coach and coaches",
      previousTermSingular: "coach",
      previousTermPlural: "coaches",
      newTermSingular: "trainer",
      newTermPlural: "trainers",
    });

    expect(result.isPresent).toBe(true);
    expect(result.updatedString).toBe(
      "{{coach}} vs {{coaches}} — trainer and trainers",
    );
  });
});
