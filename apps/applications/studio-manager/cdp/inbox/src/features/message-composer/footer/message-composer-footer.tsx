import { type ReactNode } from "react";

import { Body, cx } from "@bsport/kaizen-primitive-core";

import { useMessageComposer } from "#src/features/message-composer/message-composer-context";

export type MessageComposerFooterProps = {
  /** Informational text shown left of the actions (e.g. marketing-consent warning). */
  notice?: ReactNode;
  /** Actions, typically a `<MessageComposerSendButton />`. */
  children?: ReactNode;
  className?: string;
};

/**
 * Composer footer row: optional notice on the left, actions on the right.
 */
export function MessageComposerFooter({
  notice,
  children,
  className,
}: MessageComposerFooterProps) {
  const { expanded } = useMessageComposer();

  return (
    <div
      className={cx(
        "flex w-full items-start justify-between gap-xs",
        expanded && "mt-auto",
        className,
      )}
    >
      <div className="flex min-w-px flex-1 items-center pr-xs">
        {notice && (
          <Body color="weak" className="text-body-xs leading-2xs">
            {notice}
          </Body>
        )}
      </div>
      {children}
    </div>
  );
}
