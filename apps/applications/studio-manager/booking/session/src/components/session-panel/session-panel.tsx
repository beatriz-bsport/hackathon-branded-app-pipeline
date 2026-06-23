import type { FC } from "react";

import { Divider } from "@bsport/kaizen-primitive-core";

import { DetailsSection } from "./details-section";
import { HybridSection } from "./hybrid-section";
import { NotesSection } from "./notes-section";
import { RecurringBookingsSection } from "./recurring-bookings-section";
import { SeriesSection } from "./series-section";
import { TagsSection } from "./tags-section";

export type SessionPanelProps = {
  sessionId: number;
};

export const SessionPanel: FC<SessionPanelProps> = ({ sessionId }) => (
  <div className="flex flex-col gap-md" data-component="SessionPanel">
    <DetailsSection sessionId={sessionId} />
    <SeriesSection sessionId={sessionId} />
    <NotesSection sessionId={sessionId} />
    <RecurringBookingsSection sessionId={sessionId} />
    <HybridSection sessionId={sessionId} />
    <TagsSection sessionId={sessionId} />
    <Divider weight="extra-thin" className="my-lg" />
  </div>
);
