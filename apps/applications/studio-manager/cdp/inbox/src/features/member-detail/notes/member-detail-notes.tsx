import { useCallback, useState } from "react";

import { Body, cx } from "@bsport/kaizen-primitive-core";

import { MemberDetailSection } from "#src/features/member-detail/section/member-detail-section";
import type { MemberDetailNoteItem } from "#src/features/member-detail/types";
import { useTranslation } from "#src/utils/i18n";

export type MemberDetailNotesProps = {
  notes: MemberDetailNoteItem[];
};

export function MemberDetailNotes({ notes }: MemberDetailNotesProps) {
  const { t } = useTranslation("member-detail");

  return (
    <MemberDetailSection title={t("notes")}>
      {notes.length > 0 ? (
        <div className="flex flex-col gap-sm">
          {notes.map((note) => (
            <MemberDetailNote key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <Body size="sm" color="weak">
          {t("emptyNotes")}
        </Body>
      )}
    </MemberDetailSection>
  );
}

function MemberDetailNote({ note }: { note: MemberDetailNoteItem }) {
  const { t } = useTranslation("member-detail");

  const [expanded, setExpanded] = useState(false);
  const { ref, isOverflowing } = useClampOverflow<HTMLParagraphElement>();

  return (
    <div className="flex flex-col gap-2xs">
      <Body size="sm" color="weak">
        {note.date}
      </Body>
      {/* Kaizen `Body` is a plain FC and does not forward refs, so the measured
          node is a plain <p> carrying the body-md typography token. */}
      <p
        ref={ref}
        className={cx(
          "whitespace-pre-line break-words text-body-md",
          !expanded && "line-clamp-2",
        )}
      >
        {note.text}
      </p>
      {isOverflowing || expanded ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="self-start text-body-sm text-onsurface-weak"
        >
          {t(expanded ? "showLess" : "showMore")}
        </button>
      ) : null}
    </div>
  );
}

/**
 * Reports whether a clamped element overflows its visible (line-clamped) box,
 * so the "Show more" toggle only renders when there is hidden text. Re-measures
 * on resize via a `ResizeObserver`, so the toggle appears/disappears as the
 * panel width changes the wrapped line count. While expanded the clamp is gone,
 * so `scrollHeight === clientHeight` and this reads `false` — callers keep the
 * "Show less" toggle visible via the `expanded` flag.
 */
function useClampOverflow<T extends HTMLElement>() {
  const [isOverflowing, setIsOverflowing] = useState(false);

  const ref = useCallback((node: T | null) => {
    if (!node) return;

    const measure = () =>
      setIsOverflowing(node.scrollHeight > node.clientHeight);

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return { ref, isOverflowing };
}
