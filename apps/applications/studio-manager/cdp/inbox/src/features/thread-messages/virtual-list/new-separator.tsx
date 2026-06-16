import { Body, Divider } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

/**
 * The seam separator: a green "NEW" label with a divider trailing to the right,
 * drawn immediately before the first unread message. Presentational only — the
 * feed decides whether and where to render it.
 */
export function NewSeparator() {
  const { t } = useTranslation("thread-messages");
  const label = t("messageFeed.newSeparator");

  return (
    <div
      role="separator"
      aria-label={label}
      className="flex items-center gap-sm px-sm py-xs"
    >
      <Body
        htmlVariant="span"
        color="main"
        weight="strong"
        className="shrink-0 text-body-xs uppercase"
      >
        {label}
      </Body>
      <Divider className="flex-1" />
    </div>
  );
}
