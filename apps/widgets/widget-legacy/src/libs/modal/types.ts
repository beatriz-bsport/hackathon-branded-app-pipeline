import {
  DIALOG_MODE_TAB,
  DIALOG_MODE_IFRAME,
  DIALOG_MODE_POPUP,
  DIALOG_MODE_DEACTIVATED,
} from '@bsport/common/lib/master-data/widget-dialog-mode.js';

const DIALOG_ENUM = [
  DIALOG_MODE_TAB,
  DIALOG_MODE_IFRAME,
  DIALOG_MODE_POPUP,
  DIALOG_MODE_DEACTIVATED,
] as const;

export type DialogMode = (typeof DIALOG_ENUM)[number];
