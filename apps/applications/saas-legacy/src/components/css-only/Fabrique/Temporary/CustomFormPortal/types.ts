import type {
  CustomForm,
  CustomFormFieldAnswer,
  CustomFormFilled,
  CustomFormFilledAPI,
  ResponsiveLayouts,
} from '#src/libs/custom-form/types';
import type { ModalDialogSize } from '#Fabrique/ModalDialog/types';
import type { OptionCallback } from '../../../../../state/types';

export type CustomFormPortalProps = {
  asManager?: boolean;
  disconnectOnCancel?: boolean;
  fieldsAreIndependent?: boolean;
  generalTermsAndConditions?: string;
  hideBackButton?: boolean;
  initial?: CustomForm;
  initialWithAnswer?: CustomFormFieldAnswer;
  isCssVariantActivated?: boolean;
  isEditionForm?: boolean;
  isMobile?: boolean;
  isMulti?: boolean;
  isOpen: boolean;
  layouts?: ResponsiveLayouts;
  measureBeforeMount?: boolean;
  onCancel?: (data?: CustomFormFilled) => void;
  onClose: () => void;
  onSubmit?: (data: CustomFormFilled, options: OptionCallback) => void;
  onSubmitDraft?: (
    customFormwithAnswer: CustomFormFilled,
    options?: OptionCallback<CustomFormFilledAPI>,
  ) => void;
  refreshLoading?: boolean;
  rowHeight?: number;
  shouldWrapLayerInCssHoc?: boolean;
  simplifyUI?: boolean;
  size?: ModalDialogSize;
  subtitle?: string;
  title: string;
  userStatus?: number;
  waiver?: string;
};

export type CustomFormModalsProps = Omit<
  CustomFormPortalProps,
  'cancelLabel' | 'confirmLabel' | 'onClose' | 'onSubmit' | 'onCancel'
> & {
  cancelLabel?: string;
  confirmLabel?: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onClickSubmit: () => void;
  onClose: () => void;
};
