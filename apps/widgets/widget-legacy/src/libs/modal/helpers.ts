import { DIALOG_MODE_DEACTIVATED } from '@bsport/common/lib/master-data/widget-dialog-mode.js';
import type { DialogMode } from './types';

export const shouldDisplayInPageInteractionPortal = (
  dialogMode: DialogMode,
  allowNoPopup: boolean,
  url?: string,
) => {
  return dialogMode === DIALOG_MODE_DEACTIVATED && allowNoPopup && !!url;
};
