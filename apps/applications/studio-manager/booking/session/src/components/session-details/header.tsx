import { FC, useId } from "react";

import type { SessionWithActivity } from "@bsport/api-book";
import { DetailsLayout } from "@bsport/kaizen-primitive-core";

import { useSessionPageTabs } from "#src/components/session-management/page-tabs";
import { useSessionDetailsHeaderConfig } from "#src/hooks/use-session-details-header-config";

import { ShortcutActionsButton } from "../update-session-form/shortcut-actions-button";

export const Header: FC<{
  session: SessionWithActivity;
  onOpenCancelSessionModal: () => void;
  onOpenDuplicateSessionModal: () => void;
  onOpenRestoreSessionModal: () => void;
}> = ({
  session,
  onOpenCancelSessionModal,
  onOpenDuplicateSessionModal,
  onOpenRestoreSessionModal,
}) => {
  const headerConfig = useSessionDetailsHeaderConfig(session);
  const pageTabs = useSessionPageTabs(session.id, session.group);

  const key = useId();
  return (
    <DetailsLayout.Header
      pageTitle={session.name_override || session.name}
      {...headerConfig}
      pageTabs={pageTabs}
      endGroupActions={[
        <ShortcutActionsButton
          onOpenCancelSessionModal={onOpenCancelSessionModal}
          onOpenDuplicateSessionModal={onOpenDuplicateSessionModal}
          onOpenRestoreSessionModal={onOpenRestoreSessionModal}
          session={session}
          key={key}
        />,
      ]}
    />
  );
};
