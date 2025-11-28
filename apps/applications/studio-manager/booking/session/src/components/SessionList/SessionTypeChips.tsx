import React from "react";

import type { EnrichedSession } from "#src/stores/session-list/types";

import { GroupedIconChip } from "../common/GroupedIconChip";
import { HybridChip } from "../common/HybridChip";
import { OnlineIconChip } from "../common/OnlineIconChip";

type SessionTypeChipsProps = {
  session: EnrichedSession;
};

export const SessionTypeChips: React.FC<SessionTypeChipsProps> = ({
  session,
}) => {
  return (
    <div className="flex gap-xs items-center">
      {session.linked_hybrid_offer_id && <HybridChip />}
      <div className="flex gap-2xs items-center">
        {session.group && <GroupedIconChip />}
        {session.is_broadcast && <OnlineIconChip />}
      </div>
    </div>
  );
};
