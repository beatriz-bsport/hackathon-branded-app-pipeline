import { createContext, useContext } from "react";

/** Which single pane is shown below the `lg` breakpoint. */
export type MobileView = "list" | "thread";

/**
 * Shared layout state for the Inbox. Held in context so the panels can read it
 * without prop-drilling; the `useInboxLayout` hook is the seam that lets the
 * implementation move to Zustand later (for cross-pane actions) without changing
 * the public API. Zustand here would be for *client state* only — server data
 * stays on react-query.
 */
export type InboxLayoutContextValue = {
  /** `true` at ≥`lg` (1024px): the 3-region desktop layout. */
  isDesktop: boolean;
  /** Active pane on mobile. Driven by the consumer's routing. */
  mobileView: MobileView;
  /** Desktop: the list rail is visible. Independent from `detailOpen`. */
  threadListOpen: boolean;
  /** Toggle the list rail. Pass a boolean to set it explicitly. */
  toggleThreadList: (next?: boolean) => void;
  /** The detail pane is visible. Independent from `threadListOpen`. */
  detailOpen: boolean;
  /** Toggle the detail pane. Pass a boolean to set it explicitly. */
  toggleDetail: (next?: boolean) => void;
};

export const InboxLayoutContext = createContext<InboxLayoutContextValue | null>(
  null,
);

/**
 * Access the Inbox layout state. Must be called inside `<InboxLayout>`.
 */
export function useInboxLayout(): InboxLayoutContextValue {
  const context = useContext(InboxLayoutContext);
  if (context === null) {
    throw new Error("useInboxLayout must be used within <InboxLayout>");
  }
  return context;
}
