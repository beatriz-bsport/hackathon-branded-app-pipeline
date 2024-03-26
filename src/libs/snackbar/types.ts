import { AccessStatus } from '#libs/access-control/const';

import type { MemberMinimal } from '#libs/member/types';

export type SnackKind = 'success' | 'error' | 'info' | 'warning';

export type Snack = { id: number; message: string; kind: SnackKind };

export type AccessControlSnack = {
  id: number;
  member: MemberMinimal;
  accessStatus: AccessStatus;
};

export type BackgroundSnackKind = 'pending' | 'success' | 'error' | 'warning';

export type BackgroundSnack = {
  uuid: string;
  backgroundMessage: string;
  kind: BackgroundSnackKind;
};

export type SnackbarState = {
  topMessages: Array<Snack>;
  bottomMessages: Array<Snack>;
  backgroundMessages: Array<BackgroundSnack>;
  accessControlMessages: Array<AccessControlSnack>;
};
