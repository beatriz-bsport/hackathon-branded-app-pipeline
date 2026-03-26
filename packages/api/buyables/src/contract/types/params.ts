import type { AppointmentPassDetails, Contract, PassDetails } from "./models";

export type FetchContractsParams = {
  /**
   * Filter contracts compatible with a specific offer ID.
   */
  offer?: number;
  /**
   * Filter contracts by a list of IDs.
   */
  id__in?: number[];
  /**
   * Filter contracts by company ID.
   */
  company?: number;
  /**
   * Filter contracts that are manager-only.
   */
  manager_only?: boolean;
  /**
   * Filter contracts by disabled status.
   */
  disabled?: boolean;
  /**
   * Filter contracts usable by staff.
   */
  is_usable_by_staff?: boolean;
  /**
   * Page number for pagination.
   */
  page?: number;
  /**
   * Number of items per page.
   */
  page_size?: number;
};

export type FetchContractParams = {
  /**
   * Id of the Contract to fetch details.
   */
  id: number;
};

export type CreateContractParams = Omit<
  Contract,
  | "id"
  | "company"
  | "contract_terms_pdf_link"
  | "disabled"
  | "tax" // defined at benefit level
  | "payment_pack" // deprecated in revamped contract
  | "private_pass" // deprecated in revamped contract
  | "payment_combo" // deprecated in revamped contract
> & {
  payment_pack_details: PassDetails | null;
  private_pass_details: AppointmentPassDetails | null;
};

export type UpdateContractParams = CreateContractParams & { id: number };

export type CreateLegacyContractParams = Omit<
  Contract,
  | "id"
  | "company"
  | "contract_terms_pdf_link"
  | "disabled"
  | "tax" // defined at benefit level
  | "payment_pack_details"
  | "private_pass_details"
>;

export type UpdateLegacyContractParams = CreateLegacyContractParams & {
  id: number;
};
