import React from 'react';

import ModalDialog, { ModalDialogStorybook } from './ModalDialog.component';
import {
  FABRIQUE_MODAL_DIALOG_CONFIGURATION,
  FABRIQUE_MODAL_DIALOG_PREVIEW,
} from './custom_css_variant';

export { FABRIQUE_MODAL_DIALOG_CONFIGURATION, FABRIQUE_MODAL_DIALOG_PREVIEW };
export type Props = React.ComponentProps<typeof ModalDialog>;
export { ModalDialogStorybook };
export default ModalDialog;
