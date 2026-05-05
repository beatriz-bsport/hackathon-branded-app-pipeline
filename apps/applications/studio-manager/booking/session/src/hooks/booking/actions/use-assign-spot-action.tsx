import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import {
  bookingKeys,
  sessionKeys,
  setSpotForBookingAPI,
  spotSchedulingKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { SpotSelectorModal } from "#src/components/spot-selector";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export type UseAssignSpotActionArgs = {
  bookingId: number;
  sessionId: number;
  /** The participant's existing spot on this booking, if any. Passed through
   *  to the modal so it can render a "Your spot" marker on the canvas. */
  currentSpot?: number | null;
};

export type UseAssignSpotActionResult = {
  /** Open the spot-selection modal for this booking. */
  openModal: () => void;
  /** Render this somewhere stable in the row's JSX so the modal mounts. */
  modalElement: React.ReactNode;
};

/**
 * Consumers must gate the menu entry on `session.room_blueprint != null` —
 * this hook is intentionally ungated so it can be invoked imperatively.
 */
export const useAssignSpotAction = ({
  bookingId,
  sessionId,
  currentSpot,
}: UseAssignSpotActionArgs): UseAssignSpotActionResult => {
  const { t } = useTranslation("sessionManagement");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: bookingKeys.setSpotMutation(bookingId),
    mutationFn: (params: { spot_id: number }) =>
      setSpotForBookingAPI(fetch, bookingId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
      queryClient.invalidateQueries({ queryKey: spotSchedulingKeys.all });
      toast({
        status: "positive",
        description: t("actions.assignSpot.success"),
        icon: "check-circle-solid",
      });
      setIsOpen(false);
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("actions.assignSpot.error"),
        icon: "x-circle-solid",
      });
    },
  });

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const handleConfirm = useCallback(
    (spotIndex: number) => {
      // Guard against double-submit: confirm button stays disabled while the
      // mutation is in flight, but a click landing in the same frame as
      // isPending flipping true would otherwise queue a second POST.
      if (isPending) return;
      mutate({ spot_id: spotIndex });
    },
    [mutate, isPending],
  );

  // Closed modals stay inert: passing sessionId only while open keeps the
  // data hook from firing four queries per row at page load.
  const modalElement = useMemo(
    () => (
      <SpotSelectorModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        isConfirming={isPending}
        sessionId={isOpen ? sessionId : null}
        fetch={fetch}
        currentSpot={currentSpot}
      />
    ),
    [isOpen, closeModal, handleConfirm, isPending, sessionId, currentSpot],
  );

  return { openModal, modalElement };
};
