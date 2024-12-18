import { DeleteObjectSection } from '.';

export type CheckDeleteEstablishmentGroupData = {
  can_destroy: boolean;
  has_related_staff_configurations: boolean;
  associated_coach: {
    has_related_associated_coaches: boolean;
    exclusive_coaches: {
      coach_id: number;
      coach_name: string;
    }[];
  };
  marketplace_component_config: {
    has_related_marketplace_component_configs: boolean;
    has_exclusive_marketplace_component_configs: boolean;
  };
  has_related_marketing_notifications: boolean;
};

export type DeleteEstablishmentGroupSection =
  DeleteObjectSection<CheckDeleteEstablishmentGroupData>;
