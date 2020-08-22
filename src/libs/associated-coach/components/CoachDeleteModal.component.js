// @flow
import React from 'react';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import DeleteDialogWithCheck from '../../../components/DeleteDialogWithCheck.component';

type Props = {
  t: TFunction,
  coachToDeleteId: ?number,
  onClose: () => void,
  deleteCoach: (id: number) => void,
};

export const CoachDeleteDialog = (props: Props) => (
  <DeleteDialogWithCheck
    idToDelete={props.coachToDeleteId}
    onClose={props.onClose}
    deleteObject={() => props.deleteCoach(props.coachToDeleteId)}
    t={props.t}
  />
);

export default withTranslation(['coach'])(CoachDeleteDialog);
