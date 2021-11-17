export type SnackKind = 'success' | 'error' | 'info' | 'warning';

export type Snack = { id: number; message: string; kind: SnackKind };

export type BackgroundSnackKind = 'pending' | 'success' | 'error' | 'warning';

export type BackgroundSnack = {
  uuid: string;
  backgroundMessage: string;
  kind: BackgroundSnackKind;
};

export type SnackbarState = {
  messages: Array<Snack>;
  backgroundMessages: Array<BackgroundSnack>;
};
