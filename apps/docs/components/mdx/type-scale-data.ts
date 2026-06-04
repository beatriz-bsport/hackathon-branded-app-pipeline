import type { TypeScaleItem } from "#src/components/mdx/type-scale";

export const TITLE_SCALE: TypeScaleItem[] = [
  {
    label: "title / xl",
    sizePath: "font.size.title-xl",
    lineHeightPath: "line-height.xl",
    weightPath: "font.weight.strong",
    sample: "Page title",
    component: "Title htmlVariant=h1",
    usage:
      "One per page when maximum prominence is needed. Most Back Office screens use h2 instead.",
  },
  {
    label: "title / lg",
    sizePath: "font.size.title-lg",
    lineHeightPath: "line-height.xl",
    weightPath: "font.weight.strong",
    sample: "Page header",
    component: "Title htmlVariant=h2",
    usage: "Default page title in the Back Office.",
  },
  {
    label: "title / md",
    sizePath: "font.size.title-md",
    lineHeightPath: "line-height.md",
    weightPath: "font.weight.strong",
    sample: "Page section",
    component: "Title htmlVariant=h3",
    usage: "Section headings on the page.",
  },
  {
    label: "title / sm",
    sizePath: "font.size.title-sm",
    lineHeightPath: "line-height.md",
    weightPath: "font.weight.strong",
    sample: "Subsection or card title",
    component: "Title htmlVariant=h4",
    usage: "Headings inside containers such as cards, drawers, or modals.",
  },
  {
    label: "title / xs",
    sizePath: "font.size.title-xs",
    lineHeightPath: "line-height.sm",
    weightPath: "font.weight.weak",
    sample: "Menu group label",
    component: "Title htmlVariant=h5",
    usage:
      "Menu group labels and compact section headings. Typically weight=weak, color=weaker.",
  },
];

export const BODY_SCALE: TypeScaleItem[] = [
  {
    label: "body / lg",
    sizePath: "font.size.body-lg",
    lineHeightPath: "line-height.md",
    weightPath: "font.weight.weak",
    sample: "Primary body text for readable content blocks.",
    component: "Body size=lg",
    usage: "Long-form copy and primary prose blocks.",
  },
  {
    label: "body / md",
    sizePath: "font.size.body-md",
    lineHeightPath: "line-height.sm",
    weightPath: "font.weight.weak",
    sample: "Table cell and form label text at 14px.",
    component: "Body size=md",
    usage: "Base UI size (14px). Tables, forms, buttons, and dense layouts.",
  },
  {
    label: "body / sm",
    sizePath: "font.size.body-sm",
    lineHeightPath: "line-height.xs",
    weightPath: "font.weight.weak",
    sample: "Captions, metadata, and helper text.",
    component: "Body size=sm",
    usage: "Secondary details, hints, and compact labels.",
  },
  {
    label: "body / xs",
    sizePath: "font.size.body-xs",
    lineHeightPath: "line-height.2xs",
    weightPath: "font.weight.weak",
    sample: "Badge and avatar initials",
    component: "Utility: text-body-xs",
    usage:
      "Token-only — no Body size prop. Use the text-body-xs utility in avatars and chips.",
  },
];

export const DISPLAY_SCALE: TypeScaleItem[] = [
  {
    label: "display / lg",
    sizePath: "font.size.display-lg",
    lineHeightPath: "line-height.display",
    weightPath: "font.weight.weak",
    sample: "Display",
    usage: "Hero or marketing-scale display type.",
  },
  {
    label: "display / sm",
    sizePath: "font.size.display-sm",
    lineHeightPath: "line-height.display",
    weightPath: "font.weight.weak",
    sample: "Display",
    usage: "Secondary display size for large promotional headings.",
  },
];
