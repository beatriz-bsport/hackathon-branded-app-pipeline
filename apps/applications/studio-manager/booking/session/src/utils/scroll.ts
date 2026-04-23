import {
  type DateTime,
  fromIsoString,
  getIsoDate,
  getLocalNow,
} from "@bsport/datetime-manipulation";

import { EnrichedSession } from "#src/types.js";

export const scrollToDate = (date: DateTime) => {
  const dateString = getIsoDate(date);
  const dateElement = document.querySelector(`[data-date="${dateString}"]`);
  if (dateElement) {
    dateElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

// Scrolls to the current active session (ongoing or upcoming) in the given list of sessions.
//
// This function handles two main cases depending on how much content is visible:
//
// Case 1 — Range view, enough scroll distance:
//   When the session list spans multiple days (e.g. a week or month view), the scroll
//   area is usually tall enough to scroll directly to the ongoing or next upcoming session.
//   In this case, clicking "Today" brings the user straight to that session.
//
// Case 2 — Range view, not enough scroll distance (or single-day view):
//   When the content is too short to scroll far enough to reach the target session
//   (e.g. single-day view where the list barely fills the screen, or the session is
//   near the bottom of a short list), we fall back to scrolling to the day header instead.
//   This ensures clicking "Today" always does something meaningful without overcorrecting.
export const scrollToCurrentSession = (
  sessions: EnrichedSession[],
  timezone: string,
) => {
  const now = getLocalNow({ zone: timezone });
  let targetSession: EnrichedSession | undefined;

  const sortedSessions = [...sessions].sort((a, b) =>
    a.date_start < b.date_start ? -1 : a.date_start > b.date_start ? 1 : 0,
  );

  // Find ongoing session first
  for (const session of sortedSessions) {
    const start = fromIsoString(session.date_start, { zone: timezone });
    const end = start.plus({ minutes: session.duration_minute });
    if (now >= start && now < end) {
      targetSession = session;
      break;
    }
  }

  // Fall back to first upcoming session
  if (!targetSession) {
    for (const session of sortedSessions) {
      const start = fromIsoString(session.date_start, { zone: timezone });
      if (now < start) {
        targetSession = session;
        break;
      }
    }
  }

  if (targetSession) {
    const element = document.getElementById(targetSession.id.toString());
    if (element) {
      const header = document.querySelector(
        '[data-id="date-nav-header"]',
      ) as HTMLElement | null;
      const headerHeight = header?.offsetHeight ?? 0;

      // Measure scroll feasibility against the actual scrollable container,
      // not the document — the list content scrolls inside Kaizen-ListLayout-Content.
      const scrollContainer = document.querySelector(
        '[data-component="Kaizen-ListLayout-Content"]',
      ) as HTMLElement | null;

      if (!scrollContainer) {
        return;
      }

      const containerRect = scrollContainer.getBoundingClientRect();

      // Absolute position of the element within the scrollable content area
      const elementTop =
        element.getBoundingClientRect().top -
        containerRect.top +
        scrollContainer.scrollTop;

      // How far we'd need to scroll to place the element just below the sticky header
      const targetScrollTop = elementTop - headerHeight;

      // Maximum scrollable distance for the container
      const maxScrollTop =
        scrollContainer.scrollHeight - scrollContainer.clientHeight;

      if (targetScrollTop <= maxScrollTop) {
        // Case 1: enough scroll distance — scroll directly to the session
        element.style.scrollMarginTop = `${headerHeight}px`;
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        const cleanup = () => {
          element.style.scrollMarginTop = "";
          scrollContainer.removeEventListener("scroll", cleanup);
        };
        scrollContainer.addEventListener("scroll", cleanup, { once: true });
      } else {
        // Case 2: not enough scroll distance — fall back to scrolling to the day header
        scrollToDate(
          fromIsoString(targetSession.date_start, { zone: timezone }),
        );
      }
    }
  }
};
