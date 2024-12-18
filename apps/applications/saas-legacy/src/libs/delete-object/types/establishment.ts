import { DeleteObjectSection } from '.';

export type CheckDeleteEstablishmentData = {
  can_destroy: boolean;
  has_upcoming_offers: boolean;
  has_upcoming_private_bookings: boolean;
  establishment_billing_group: {
    is_exclusive: boolean;
    establishment_billing_group_id?: number;
    establishment_billing_group_name?: string;
  };
  establishment_group: {
    has_related_establishment_groups: boolean;
    exclusive_establishment_groups: {
      establishment_group_id: number;
      establishment_group_name: string;
    }[];
  };
  private_service: {
    has_related_private_services: boolean;
    exclusive_private_services: {
      private_service_id: number;
      private_service_name: string;
    }[];
  };
  staff_location: {
    has_related_staff_configurations: boolean;
    has_exclusive_staff_configurations: boolean;
  };
  coach_availability_slot: {
    has_related_coach_availability_slots: boolean;
    exclusive_coaches: {
      coach_id: number;
      coach_name: string;
    }[];
  };
  associated_coach: {
    has_related_associated_coaches: boolean;
    exclusive_coaches: {
      coach_id: number;
      coach_name: string;
    }[];
  };
  payment_pack: {
    related_payment_packs: {
      payment_pack_id: number;
      payment_pack_name: string;
    }[];
    exclusive_payment_packs: {
      payment_pack_id: number;
      payment_pack_name: string;
    }[];
  };
  has_related_availability_slots: boolean;
  has_related_zoom_establishment: boolean;
  marketplace_component_config: {
    has_related_marketplace_component_configs: boolean;
    has_exclusive_marketplace_component_configs: boolean;
  };
  is_integrated_in_partnership: boolean;
  has_related_marketing_notifications: boolean;
};

export type DeleteEstablishmentSection =
  DeleteObjectSection<CheckDeleteEstablishmentData>;
