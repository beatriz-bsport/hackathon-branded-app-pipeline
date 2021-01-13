export type PaymentMethod = {
  type: string;
  id: string;
  readable_identifier: string;
  brand: string;
  payment_backend_identifier: number;
  additional_info: string;
};
