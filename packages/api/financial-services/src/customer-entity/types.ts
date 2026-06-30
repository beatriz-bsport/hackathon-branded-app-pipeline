export type CustomerEntity = {
  id: number;
  is_vat_id_collection_required: boolean;
  is_valid_vat_id_missing: boolean;
  vat_id: string | null;
  vat_id_type: string | null;
  vat_id_verification_status: string;
};
