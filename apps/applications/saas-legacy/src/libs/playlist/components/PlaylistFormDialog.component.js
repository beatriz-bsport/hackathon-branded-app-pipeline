// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import { Form } from 'formik';
import PlaylistForm, { PlaylistFormHOC } from './PlaylistForm.component';
import { Submit } from '../../../components/forms';

type Props = {
  open: boolean,
  isSubmitting: boolean,
  onClose: () => void,
};
export const PlaylistFormDialog = (props: Props) => {
  const { t } = useTranslation(['video']);
  return (
    <Dialog open={props.open}>
      <Form>
        <DialogContent>
          <PlaylistForm {...props} />
        </DialogContent>
        <DialogActions>
          <Button disabled={props.isSubmitting} onClick={props.onClose}>
            {t('playlist.form.cancel')}
          </Button>
          <Submit disabled={props.isSubmitting}>
            {t('playlist.form.submit')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default PlaylistFormHOC(PlaylistFormDialog);
