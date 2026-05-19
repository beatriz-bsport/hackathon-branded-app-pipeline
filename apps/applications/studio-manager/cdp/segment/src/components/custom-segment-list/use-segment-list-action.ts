import { useState } from "react";

import type { Smartlist } from "@bsport/store-cdp-smartlist";

type SegmentInlineAction =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; smartlist: Smartlist }
  | { kind: "duplicate"; smartlist: Smartlist }
  | { kind: "delete"; smartlist: Smartlist };

export const useSegmentListAction = () => {
  const [inlineAction, setInlineAction] = useState<SegmentInlineAction>({
    kind: "closed",
  });

  const closeInlineAction = () => {
    setInlineAction({ kind: "closed" });
  };

  const openCreate = () => {
    setInlineAction({ kind: "create" });
  };

  const openEdit = (smartlist: Smartlist) => {
    setInlineAction({ kind: "edit", smartlist });
  };

  const openDuplicate = (smartlist: Smartlist) => {
    setInlineAction({ kind: "duplicate", smartlist });
  };

  const openDelete = (smartlist: Smartlist) => {
    setInlineAction({ kind: "delete", smartlist });
  };

  return {
    inlineAction,
    closeInlineAction,
    openCreate,
    openEdit,
    openDuplicate,
    openDelete,
  };
};
