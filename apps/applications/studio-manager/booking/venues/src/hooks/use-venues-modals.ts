import { useCallback, useReducer } from "react";

import type { Establishment, EstablishmentGroup } from "@bsport/api-book";

export type VenuesModalState =
  | { type: "venue-create" }
  | { type: "venue-edit"; venue: Establishment }
  | { type: "archive"; venue: Establishment }
  | { type: "location-create"; preselectedVenue?: Establishment }
  | { type: "location-edit"; location: EstablishmentGroup }
  | { type: "location-delete"; location: EstablishmentGroup }
  | null;

type Action =
  | { action: "venue-create" }
  | { action: "venue-edit"; venue: Establishment }
  | { action: "archive"; venue: Establishment }
  | { action: "location-create"; preselectedVenue?: Establishment }
  | { action: "location-edit"; location: EstablishmentGroup }
  | { action: "location-delete"; location: EstablishmentGroup }
  | { action: "close" };

const reducer = (
  _state: VenuesModalState,
  action: Action,
): VenuesModalState => {
  switch (action.action) {
    case "venue-create":
      return { type: "venue-create" };
    case "venue-edit":
      return { type: "venue-edit", venue: action.venue };
    case "archive":
      return { type: "archive", venue: action.venue };
    case "location-create":
      return {
        type: "location-create",
        preselectedVenue: action.preselectedVenue,
      };
    case "location-edit":
      return { type: "location-edit", location: action.location };
    case "location-delete":
      return { type: "location-delete", location: action.location };
    case "close":
      return null;
  }
};

export const useVenuesModals = () => {
  const [modalState, dispatch] = useReducer(reducer, null);

  const openVenueCreateModal = useCallback(
    () => dispatch({ action: "venue-create" }),
    [],
  );

  const openVenueEditModal = useCallback(
    (venue: Establishment) => dispatch({ action: "venue-edit", venue }),
    [],
  );

  const openArchiveModal = useCallback(
    (venue: Establishment) => dispatch({ action: "archive", venue }),
    [],
  );

  const openLocationCreateModal = useCallback(
    (preselectedVenue?: Establishment) =>
      dispatch({ action: "location-create", preselectedVenue }),
    [],
  );

  const openLocationEditModal = useCallback(
    (location: EstablishmentGroup) =>
      dispatch({ action: "location-edit", location }),
    [],
  );

  const openLocationDeleteModal = useCallback(
    (location: EstablishmentGroup) =>
      dispatch({ action: "location-delete", location }),
    [],
  );

  const closeModal = useCallback(() => dispatch({ action: "close" }), []);

  return {
    modalState,
    openVenueCreateModal,
    openVenueEditModal,
    openArchiveModal,
    openLocationCreateModal,
    openLocationEditModal,
    openLocationDeleteModal,
    closeModal,
  };
};
