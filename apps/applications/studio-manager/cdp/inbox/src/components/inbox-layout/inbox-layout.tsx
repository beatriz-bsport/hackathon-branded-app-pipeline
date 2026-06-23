import {
  Children,
  type ReactElement,
  type ReactNode,
  isValidElement,
  useCallback,
  useMemo,
} from "react";

import { Button, cx, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { useControllableState } from "#src/hooks/use-controllable-state";
import { useTranslation } from "#src/utils/i18n";

import {
  InboxLayoutContext,
  type MobileView,
  useInboxLayout,
} from "./inbox-layout-context";

/**
 * Desktop rail widths. Fixed so the center column flexes between them; the rail
 * carries a matching min-width so a collapsing sibling just reflows and the
 * center is never crushed. Exact values are pulled from Figma at build time.
 */
const LIST_PANE_WIDTH = "lg:w-[300px]";
const DETAIL_PANE_WIDTH = "lg:w-[320px]";

/** Light width/opacity transition on collapse/expand; off under reduced motion. */
const COLLAPSE_TRANSITION =
  "transition-[width,opacity] duration-200 ease-out motion-reduce:transition-none";

export type InboxLayoutProps = {
  /** Active pane on mobile (`<lg`). Controlled; the consumer drives it via routing. */
  mobileView?: MobileView;
  defaultMobileView?: MobileView;
  onMobileViewChange?: (next: MobileView) => void;
  /** Whether the desktop list rail is visible. Controlled or uncontrolled. */
  threadListOpen?: boolean;
  defaultThreadListOpen?: boolean;
  onThreadListOpenChange?: (next: boolean) => void;
  /** Whether the detail pane is visible. Controlled or uncontrolled. */
  detailOpen?: boolean;
  /** Defaults to `isDesktop` when omitted (detail-first on desktop, messages-first on mobile). */
  defaultDetailOpen?: boolean;
  onDetailOpenChange?: (next: boolean) => void;
  className?: string;
  children: ReactNode;
};

/**
 * Composable, responsive shell for the CDP Inbox. It arranges the three regions
 * — the thread list, the open thread (header + messages + composer), and the
 * member detail pane — and adapts between a 3-region desktop layout and a
 * single full-bleed pane below `lg`. It *contains* the feature components
 * without knowing anything about them: panels are opaque, correctly-sized,
 * `overflow`-bounded boxes, and the consumer arranges their interior.
 *
 * ```tsx
 * <InboxLayout onMobileViewChange={…}>
 *   <InboxLayout.ListPane>
 *     <ThreadList />
 *   </InboxLayout.ListPane>
 *   <InboxLayout.Content>
 *     <InboxLayout.Header onBack={() => navigate("/threads")}>
 *       <ThreadMessagesHeader … />
 *     </InboxLayout.Header>
 *     <ThreadMessages />
 *     <MessageComposer />
 *     <InboxLayout.DetailPane>
 *       <MemberDetail />
 *     </InboxLayout.DetailPane>
 *   </InboxLayout.Content>
 * </InboxLayout>
 * ```
 */
function InboxLayoutRoot({
  mobileView,
  defaultMobileView = "list",
  onMobileViewChange,
  threadListOpen,
  defaultThreadListOpen = true,
  onThreadListOpenChange,
  detailOpen,
  defaultDetailOpen,
  onDetailOpenChange,
  className,
  children,
}: InboxLayoutProps) {
  const isDesktop = useMatchMedia("lg");

  const [mobileViewValue] = useControllableState(
    mobileView,
    defaultMobileView,
    onMobileViewChange,
  );
  const [threadListOpenValue, setThreadListOpen] = useControllableState(
    threadListOpen,
    defaultThreadListOpen,
    onThreadListOpenChange,
  );
  // The detail pane defaults open on desktop, closed on mobile — both fall out
  // of one responsive default, still overridable via `defaultDetailOpen`.
  const [detailOpenValue, setDetailOpen] = useControllableState(
    detailOpen,
    defaultDetailOpen ?? isDesktop,
    onDetailOpenChange,
  );

  const toggleThreadList = useCallback(
    (next?: boolean) =>
      setThreadListOpen(
        typeof next === "boolean" ? next : !threadListOpenValue,
      ),
    [setThreadListOpen, threadListOpenValue],
  );
  const toggleDetail = useCallback(
    (next?: boolean) =>
      setDetailOpen(typeof next === "boolean" ? next : !detailOpenValue),
    [setDetailOpen, detailOpenValue],
  );

  const value = useMemo(
    () => ({
      isDesktop,
      mobileView: mobileViewValue,
      threadListOpen: threadListOpenValue,
      toggleThreadList,
      detailOpen: detailOpenValue,
      toggleDetail,
    }),
    [
      isDesktop,
      mobileViewValue,
      threadListOpenValue,
      toggleThreadList,
      detailOpenValue,
      toggleDetail,
    ],
  );

  return (
    <InboxLayoutContext.Provider value={value}>
      <div
        data-component="InboxLayout"
        className={cx(
          "flex h-full w-full overflow-hidden bg-surface-page",
          className,
        )}
      >
        {children}
      </div>
    </InboxLayoutContext.Provider>
  );
}

// ----- ListPane -----

type SlotProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Left rail holding the thread list. Desktop: a fixed ~300px rail that collapses
 * to zero width when `!threadListOpen`. Mobile: full-bleed when `mobileView` is
 * `"list"`, otherwise unmounted.
 */
function ListPane({ children, className }: SlotProps) {
  const { isDesktop, mobileView, threadListOpen } = useInboxLayout();

  if (!isDesktop) {
    if (mobileView !== "list") return null;
    return (
      <aside data-slot="list-pane" className={cx(MOBILE_PANE, className)}>
        {children}
      </aside>
    );
  }

  return (
    <aside
      data-slot="list-pane"
      aria-hidden={!threadListOpen}
      className={cx(
        "flex min-h-0 shrink-0 flex-col overflow-hidden border-r-stroke-thin border-r-stroke-divider bg-surface-default",
        COLLAPSE_TRANSITION,
        threadListOpen ? cx(LIST_PANE_WIDTH, "opacity-100") : "w-0 opacity-0",
        className,
      )}
    >
      {children}
    </aside>
  );
}

// ----- Content -----

/**
 * The right region: a column with the persistent `Header` on top and, below it,
 * a row of the swappable body (loose children) and the `DetailPane`. `Header`
 * and `DetailPane` must be **direct children** — they are filtered out by type;
 * everything else is the body. On mobile the whole region shows only while
 * `mobileView` is `"thread"`.
 */
function Content({ children, className }: SlotProps) {
  const { isDesktop, mobileView, detailOpen } = useInboxLayout();

  let header: ReactNode = null;
  let detail: ReactNode = null;
  const body: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Header) {
      header = child;
    } else if (isValidElement(child) && child.type === DetailPane) {
      detail = child;
    } else {
      body.push(child);
    }
  });

  if (!isDesktop && mobileView !== "thread") return null;

  // On mobile the detail pane replaces the body (the Header persists above both).
  const bodyHidden = !isDesktop && detailOpen;

  return (
    <section
      data-slot="content"
      className={cx(
        "flex min-w-0 flex-1 flex-col overflow-hidden bg-surface-default",
        className,
      )}
    >
      {header}
      <div className="flex min-h-0 flex-1">
        <div
          data-slot="body"
          className={cx(
            "flex min-w-0 flex-1 flex-col overflow-hidden",
            bodyHidden && "hidden",
          )}
        >
          {body}
        </div>
        {detail}
      </div>
    </section>
  );
}

// ----- Header -----

export type InboxLayoutHeaderProps = {
  /** Router seam: go back to the thread list (mobile, messages view). */
  onBack?: () => void;
  children?: ReactNode;
  className?: string;
};

/**
 * The bar above both the messages and the detail views, so no separate
 * `DetailHeader` is needed. It owns the layout-control toggles; the feature
 * header (`ThreadMessagesHeader`) it wraps stays layout-agnostic. The left icon
 * is a small state machine — collapse the list on desktop, otherwise go back —
 * and the only router seam is `onBack`.
 */
function Header({ onBack, children, className }: InboxLayoutHeaderProps) {
  const { isDesktop, detailOpen, toggleThreadList, toggleDetail } =
    useInboxLayout();
  const { t } = useTranslation("inbox-layout");

  let leftButton: ReactNode;
  if (isDesktop) {
    leftButton = (
      <Button
        kind="icon-button"
        intent="flat"
        color="default"
        size="md"
        icon="layout-left"
        label={t("toggleThreadList")}
        onClick={() => toggleThreadList()}
      />
    );
  } else if (detailOpen) {
    leftButton = (
      <Button
        kind="icon-button"
        intent="flat"
        color="default"
        size="md"
        icon="chevron-left"
        label={t("backToMessages")}
        onClick={() => toggleDetail(false)}
      />
    );
  } else {
    leftButton = (
      <Button
        kind="icon-button"
        intent="flat"
        color="default"
        size="md"
        icon="chevron-left"
        label={t("backToList")}
        onClick={onBack}
      />
    );
  }

  // The detail toggle is hidden on mobile while detail is open (the left
  // back-button already closes it).
  const showDetailToggle = isDesktop || !detailOpen;

  return (
    <div
      data-slot="header"
      className={cx(
        "flex shrink-0 items-center gap-2xs border-b-stroke-thin border-b-stroke-divider bg-surface-default px-sm py-xs",
        className,
      )}
    >
      {leftButton}
      <div className="min-w-0 flex-1">{children}</div>
      {showDetailToggle ? (
        <Button
          kind="icon-button"
          intent="flat"
          color="default"
          size="md"
          icon="layout-right"
          label={t("toggleDetail")}
          onClick={() => toggleDetail()}
        />
      ) : null}
    </div>
  );
}

// ----- DetailPane -----

/**
 * Member detail sub-column. Desktop: a fixed ~320px rail shown when `detailOpen`.
 * Mobile: full-bleed, replacing the body, when `mobileView` is `"thread"` and
 * `detailOpen`. Rendered as a direct child of `Content`.
 */
function DetailPane({ children, className }: SlotProps) {
  const { isDesktop, mobileView, detailOpen } = useInboxLayout();

  if (!isDesktop) {
    if (mobileView !== "thread" || !detailOpen) return null;
    return (
      <aside data-slot="detail-pane" className={cx(MOBILE_PANE, className)}>
        {children}
      </aside>
    );
  }

  return (
    <aside
      data-slot="detail-pane"
      aria-hidden={!detailOpen}
      className={cx(
        "flex min-h-0 shrink-0 flex-col overflow-hidden border-l-stroke-thin border-l-stroke-divider bg-surface-default",
        COLLAPSE_TRANSITION,
        detailOpen ? cx(DETAIL_PANE_WIDTH, "opacity-100") : "w-0 opacity-0",
        className,
      )}
    >
      {children}
    </aside>
  );
}

/** Shared full-bleed sizing for the active mobile pane. */
const MOBILE_PANE =
  "flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-surface-default";

// ----- Compound assembly -----

type InboxLayoutComponent = ((props: InboxLayoutProps) => ReactElement) & {
  ListPane: typeof ListPane;
  Content: typeof Content;
  Header: typeof Header;
  DetailPane: typeof DetailPane;
};

export const InboxLayout = InboxLayoutRoot as InboxLayoutComponent;
InboxLayout.ListPane = ListPane;
InboxLayout.Content = Content;
InboxLayout.Header = Header;
InboxLayout.DetailPane = DetailPane;
