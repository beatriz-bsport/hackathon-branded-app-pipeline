import { type Dispatch, type SetStateAction, useCallback } from "react";
import { useNavigate } from "react-router";

import type { Item } from "@bsport/kaizen-primitive-core";

import { ActionsMenuButton } from "#src/components/common/action-menu-button";
import { useObjectLevelPermission } from "#src/utils/permission";

type SeriesActionsMenuButtonProps = {
  editPath?: string;
  labels: {
    cancel?: string;
    duplicate: string;
    edit?: string;
    menu: string;
  };
  onCancel?: () => void;
  onDuplicate: () => void;
  prominent?: boolean;
};

export const SeriesActionsMenuButton = ({
  editPath,
  labels,
  onCancel,
  onDuplicate,
  prominent = false,
}: SeriesActionsMenuButtonProps) => {
  const navigate = useNavigate();
  const hasCreatePermission = useObjectLevelPermission(
    "session.workshop.allowed_actions.create",
  );
  const hasEditPermission = useObjectLevelPermission(
    "session.workshop.allowed_actions.edit",
  );
  const hasDeletePermission = useObjectLevelPermission(
    "session.workshop.allowed_actions.delete",
  );

  const canEditSeries = hasEditPermission && !!editPath && !!labels.edit;
  const canDuplicateSeries = hasCreatePermission && hasEditPermission;
  const canCancelSeries = hasDeletePermission && !!labels.cancel && !!onCancel;

  const getItems = useCallback(
    (setIsPopoverOpened: Dispatch<SetStateAction<boolean>>) => {
      const items: Item[] = [];
      const editLabel = labels.edit;
      const seriesEditPath = editPath;

      if (canEditSeries && seriesEditPath && editLabel) {
        items.push({
          id: "series-edit-action",
          type: "button",
          label: editLabel,
          iconLeft: "edit-05",
          onClick: () => {
            setIsPopoverOpened(false);
            navigate(seriesEditPath);
          },
        });
      }

      if (canDuplicateSeries) {
        items.push({
          id: "series-duplicate-action",
          type: "button",
          label: labels.duplicate,
          iconLeft: "copy-03",
          onClick: () => {
            setIsPopoverOpened(false);
            onDuplicate();
          },
        });
      }

      const cancelLabel = labels.cancel;
      const handleCancel = onCancel;

      if (canCancelSeries && cancelLabel && handleCancel) {
        items.push({
          id: "series-cancel-action",
          type: "button",
          label: cancelLabel,
          iconLeft: "x-circle-solid",
          onClick: () => {
            setIsPopoverOpened(false);
            handleCancel();
          },
        });
      }

      return items;
    },
    [
      canCancelSeries,
      canDuplicateSeries,
      canEditSeries,
      editPath,
      labels.cancel,
      labels.duplicate,
      labels.edit,
      navigate,
      onCancel,
      onDuplicate,
    ],
  );

  if (!canEditSeries && !canDuplicateSeries && !canCancelSeries) {
    return null;
  }

  return (
    <ActionsMenuButton
      label={labels.menu}
      items={getItems}
      prominent={prominent}
    />
  );
};
