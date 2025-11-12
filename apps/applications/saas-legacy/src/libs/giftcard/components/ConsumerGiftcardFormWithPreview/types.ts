import type { FormikProps } from 'formik';

import type { OptionCallback } from '#src/state/types';
import type {
  Giftcard,
  ConsumerGiftcardAPI,
  GiftcardBackgroundImage,
} from '#src/libs/giftcard/types';

/**
 * State managed with Formik
 */
export type ConsumerGiftcardFormValues = Omit<ConsumerGiftcardAPI, 'force'>;

/**
 * Props of the composed Form with the HOC, e.g. how the component is consumed
 */
export type OuterProps = {
  companyCover?: string;
  consumerVariant?: boolean;
  forceVertical?: boolean;
  giftcard: Giftcard | null;
  giftcardBackgroundImageList?: Array<GiftcardBackgroundImage>;
  isManager?: boolean;
  onCancel?: () => void;
  onSubmit: (data: ConsumerGiftcardAPI, options?: OptionCallback) => void;
};

export type ConsumerGiftcardFormWithPreviewProps = OuterProps &
  FormikProps<ConsumerGiftcardFormValues>;
