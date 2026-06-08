import type { IconName } from "@bsport/kaizen-primitive-core";

export type PackCategory =
  | "communications"
  | "digital"
  | "integrations"
  | "growth"
  | "compliance";

export type PackId =
  | "bi-connect"
  | "data-as-a-service"
  | "access-control"
  | "fiskaly-twint"
  | "branded-app";

export type Pack = {
  id: PackId;
  name: string;
  description: string;
  /** Price in the smallest unit (e.g. cents). */
  price: number;
  /** Currency symbol to display alongside {@link price} (e.g. "€", "£"). */
  currency: string;
  /** When true, appends "· per location" to the pricing line. */
  perLocation: boolean;
  category: PackCategory;
  icon: IconName;
  features: string[];
  learnMoreUrl?: string;
};
