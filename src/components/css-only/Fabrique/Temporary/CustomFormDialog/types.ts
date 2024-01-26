import type {
  CustomForm,
  CustomFormFieldAnswer,
  CustomFormFilled,
  ResponsiveLayouts,
} from '#libs/custom-form/types';
import type { OptionCallback } from '../../../../../state/types';

export type CustomFormDialogProps = {
  isFullWidth?: boolean;
  onClose: () => void;
  open: boolean;
  title: string;
  generalTermsAndConditions?: string;
  initial?: CustomForm;
  isCssVariantActivated?: boolean;
  layouts?: ResponsiveLayouts;
  onSubmit?: (data: CustomFormFieldAnswer, options: OptionCallback) => void;
  onSubmitDraft?: (customFormwithAnswer: CustomFormFilled) => void;
  waiver?: string;
};
