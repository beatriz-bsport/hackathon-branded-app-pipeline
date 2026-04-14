import { FC, useId } from "react";

import type { SessionWithActivity } from "@bsport/api-book";
import { DetailsLayout } from "@bsport/kaizen-primitive-core";

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

  const key = useId();
  return (
    <DetailsLayout.Header
      pageTitle={session.name_override || session.name}
      {...headerConfig}
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
