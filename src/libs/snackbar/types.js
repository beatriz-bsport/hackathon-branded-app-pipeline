// @flow

export type SnackKind = 'success' | 'error' | 'info' | 'warning';
export type Snack = { id: number, message: string, kind: SnackKind };
