import React from 'react';
import ResetPasswordConfirmation, {
  ResetPasswordConfirmationStorybook,
} from './ResetPasswordConfirmation.component';

import {
  RESET_PASSWORD_CONFIRMATION_CONFIGURATION,
  RESET_PASSWORD_CONFIRMATION_PREVIEW,
} from './custom_css_variant';

export type Props = React.ComponentProps<typeof ResetPasswordConfirmation>;
export {
  ResetPasswordConfirmationStorybook,
  RESET_PASSWORD_CONFIRMATION_CONFIGURATION,
  RESET_PASSWORD_CONFIRMATION_PREVIEW,
};
export default ResetPasswordConfirmation;
