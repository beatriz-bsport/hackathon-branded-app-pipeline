// @ts-nocheck
export type BackgroundDialog = {
  messages: Array<{
    id: string;
    title: string;
    message: string;
    link: string;
    displayMode: string;
    actionMode: string;
  }>;
};

export type BackgroundDialogState = {
  messages: Array<BackgroundDialogState>;
};

export const ACTION_MODE_DOWNLOAD = 'DOWNLOAD';
export const ACTION_MODE_REDIRECT = 'REDIRECT';
export const DISPLAY_INFORMATION = 'INFORMATION';
export const DISPLAY_ACCESS_DENIED = 'ACCESS_DENIED';
export const DISPLAY_TEXT = 'TEXT';
export const DISPLAY_SUCCESS = 'SUCCESS';
