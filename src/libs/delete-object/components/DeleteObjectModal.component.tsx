import React, { useCallback, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
// eslint-disable-next-line
import { useSelector, useDispatch } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

import RedButton from '#src/components/button/RedButton.component';

import type { RootState } from '#src/reducers';
import type { DeleteObjectVariant } from '../types';

import {
  CHECK_CAN_DELETE_OBJECT_ACTIONS,
  CHECK_CAN_DELETE_OBJECT_FUNCTIONS,
  DELETE_OBJECT_FUNCTIONS,
} from '../constants';

type Props = {
  idToCheckAndDelete?: number;
  variant: DeleteObjectVariant;
  onClose: () => void;
};

/** Generic component to delete an object
 *
 * To avoid holding the deletion checks in the state as it was before, we now use a dedicated store section.
 * This store section is separated by object type to avoid conflicts.
 *
 * According to the variant, the component will dispatch the appropriate actions, in the correct store section,
 * to check if the object can be deleted, and then delete it.
 *
 * The declared variant is also used as translation namespace.
 */
const DeleteObjectModal: React.FC<Props> = ({
  idToCheckAndDelete,
  variant,
  onClose,
}) => {
  const { t } = useTranslation(variant);

  const { canDestroy, id, isLoading } = useSelector(
    (state: RootState) => state.deleteObject[variant],
  );

  const dispatch = useDispatch();

  const checkCanDeleteObject = CHECK_CAN_DELETE_OBJECT_FUNCTIONS[variant];
  const deleteObject = DELETE_OBJECT_FUNCTIONS[variant];
  const deleteObjectActions = CHECK_CAN_DELETE_OBJECT_ACTIONS[variant];

  useEffect(() => {
    if (idToCheckAndDelete) {
      checkCanDeleteObject(idToCheckAndDelete)(dispatch, null);
    }
  }, [deleteObjectActions, checkCanDeleteObject, dispatch, idToCheckAndDelete]);

  const handleClose = useCallback(() => {
    onClose?.();
    dispatch(deleteObjectActions.clear());
  }, [onClose, dispatch, deleteObjectActions]);

  const performDelete = useCallback(() => {
    deleteObject(id)(dispatch, null);
    handleClose?.();
  }, [deleteObject, handleClose, id, dispatch]);

  if (isLoading) {
    return (
      <Dialog open={!!idToCheckAndDelete}>
        <DialogTitle>{t(`${variant}:forms.delete.title`)}</DialogTitle>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={!!idToCheckAndDelete}>
      <DialogTitle>{t(`${variant}:forms.delete.title`)}</DialogTitle>
      <DialogContent>
        {/** Next commit */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {t(`${variant}:forms.delete.actions.cancel`)}
        </Button>
        <RedButton disabled={!canDestroy} onClick={performDelete}>
          {t(`${variant}:forms.delete.actions.confirm`)}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(DeleteObjectModal);
