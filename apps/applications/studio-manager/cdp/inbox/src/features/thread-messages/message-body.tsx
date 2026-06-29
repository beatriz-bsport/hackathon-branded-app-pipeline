import DOMPurify from "dompurify";

import { cx } from "@bsport/kaizen-primitive-core";

export type MessageBodyProps = {
  /** Raw message content. May be HTML (email) or plain text (sms/push/in_app). */
  html: string;
  className?: string;
};

/**
 * Renders a message's content as rich text. Email bodies arrive as HTML, while
 * sms/push/in_app are plain text — both go through the same path so plain text is
 * also escaped safely.
 *
 * We use `dangerouslySetInnerHTML` to render HTML easily, but that can lead to
 * XSS attacks, so the content is sanitized with DOMPurify before rendering.
 * `whitespace-pre-line` preserves the newlines of plain-text messages.
 */
export function MessageBody({ html, className }: MessageBodyProps) {
  return (
    <div
      data-component="MessageBody"
      className={cx(
        "whitespace-pre-line break-words text-body-sm leading-xs text-onsurface-default",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );
}
