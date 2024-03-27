export type BackgroundDialog = {
  messages: Array<{
    id: string;
    title: string;
    message: string;
    link: string;
    displayMode: BackgroundDialogDisplayMode;
    actionMode: BackgroundDialogActionMode;
  }>;
};

export type BackgroundDialogState = {
  messages: Array<BackgroundDialogState>;
};

export enum BackgroundDialogDisplayMode {
  INFORMATION = 'INFORMATION',
  ACCESS_DENIED = 'ACCESS_DENIED',
  TEXT = 'TEXT',
  SUCCESS = 'SUCCESS',
}

export enum BackgroundDialogActionMode {
  DOWNLOAD = 'DOWNLOAD',
  REDIRECT = 'REDIRECT',
}
