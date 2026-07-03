export type ChecklistItemOwner = "you" | "bsport" | "thirdParty";

export type ChecklistItemId =
  | "p1_1"
  | "p1_2"
  | "p1_3"
  | "p2_1"
  | "p2_2"
  | "p2_3"
  | "p3_1"
  | "p3_2"
  | "p3_3"
  | "p4_1"
  | "p4_2"
  | "p4_3"
  | "p4_4"
  | "p5_1"
  | "p5_2"
  | "p5_3"
  | "p6_1"
  | "p6_2";

export interface ChecklistItemDefinition {
  id: ChecklistItemId;
  owner: ChecklistItemOwner;
  parallel?: boolean;
  warning?: boolean;
  hasTimeline?: boolean;
  hasVideo?: boolean;
}

export type PhaseId = 1 | 2 | 3 | 4 | 5 | 6;

export interface PhaseDefinition {
  id: PhaseId;
  items: ChecklistItemDefinition[];
}

export const PHASES: PhaseDefinition[] = [
  {
    id: 1,
    items: [
      { id: "p1_1", owner: "you" },
      { id: "p1_2", owner: "you" },
      { id: "p1_3", owner: "you", hasVideo: true },
    ],
  },
  {
    id: 2,
    items: [
      { id: "p2_1", owner: "bsport" },
      { id: "p2_2", owner: "bsport", parallel: true, hasVideo: true },
      { id: "p2_3", owner: "bsport", hasTimeline: true },
    ],
  },
  {
    id: 3,
    items: [
      {
        id: "p3_1",
        owner: "bsport",
        parallel: true,
        hasTimeline: true,
        hasVideo: true,
      },
      {
        id: "p3_2",
        owner: "bsport",
        parallel: true,
        hasTimeline: true,
        hasVideo: true,
      },
      {
        id: "p3_3",
        owner: "bsport",
        parallel: true,
        hasTimeline: true,
        hasVideo: true,
      },
    ],
  },
  {
    id: 4,
    items: [
      {
        id: "p4_1",
        owner: "you",
        warning: true,
        parallel: true,
        hasTimeline: true,
        hasVideo: true,
      },
      { id: "p4_2", owner: "you", parallel: true },
      { id: "p4_3", owner: "you", parallel: true, hasVideo: true },
      { id: "p4_4", owner: "bsport", parallel: true, hasVideo: true },
    ],
  },
  {
    id: 5,
    items: [
      { id: "p5_1", owner: "bsport" },
      { id: "p5_2", owner: "bsport" },
      { id: "p5_3", owner: "thirdParty" },
    ],
  },
  {
    id: 6,
    items: [
      { id: "p6_1", owner: "you" },
      { id: "p6_2", owner: "bsport" },
    ],
  },
];

export const ALL_CHECKLIST_ITEMS: ChecklistItemDefinition[] = PHASES.flatMap(
  (phase) => phase.items,
);
