import type { GridSize } from '@material-ui/core/Grid';
import type { FiskalyOnboardingRequirement } from '#src/libs/invoice/types';

export type FormValues = {
  first_name: string;
  last_name: string;
  dni_nie: string;
  address: string;
  street_number: string;
  postal_code: string;
  city: string;
  municipality: string;
  country: string;
};

export type ChipConfig = {
  requirement: FiskalyOnboardingRequirement;
  validatedKey: string;
  missingKey: string;
};

export type FormFieldConfig = {
  name: keyof FormValues;
  labelKey: string;
  xs: GridSize;
  hasError?: boolean;
};
