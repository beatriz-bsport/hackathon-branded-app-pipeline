import appointmentPassCategories from "#src/fixtures/appointment-pass-categories-data.json";
import appointmentPasses from "#src/fixtures/appointment-pass-data.json";

import { getCategoriesById, getItemsById } from "./helpers";

export type AppointmentPass = {
  id: number;
  name: string;
  price: string;
  credits: number | null;
  manager_only: boolean; // Unavailable
  is_usable_by_staff: boolean; // Invisible
  category: number | null;
  ordering_in_category: number | null;
  available: boolean; // Archived
};

export const useSelectAppointmentPasses = () => appointmentPasses;

export const useSelectAppointmentPassCategories = () =>
  appointmentPassCategories;

export const useSelectAppointmentPassById = () => {
  return getItemsById<AppointmentPass>("appointmentPass");
};

export const useSelectAppointmentPassCategoryById = () => {
  return getCategoriesById("appointmentPass");
};
