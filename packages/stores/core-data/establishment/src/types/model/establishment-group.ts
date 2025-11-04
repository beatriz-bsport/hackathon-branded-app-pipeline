// Core EstablishmentGroup model
// Model : EstablishmentGroup
// Serializer : EstablishmentGroupSerializer
export type EstablishmentGroup = {
  id: number;
  name: string;
  company_id: number;
  date_created: string; // ISO datetime
  date_updated?: string; // ISO datetime
  disabled?: boolean;
  // Additional fields based on serializer
};
