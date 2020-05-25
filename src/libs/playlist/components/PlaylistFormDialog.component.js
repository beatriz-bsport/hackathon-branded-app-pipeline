// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { Form } from 'formik';
import PlaylistForm, { PlaylistFormHOC } from './PlaylistForm.component';
import { Submit } from '../../../components/forms';

type Props = {
  t: TFunction,
};
export const PlaylistFormDialog = (props: Props) => {
  return (
    <Dialog open={props.open}>
      <Form>
        <DialogContent>
          <PlaylistForm {...props} />
        </DialogContent>
        <DialogActions>
          <Button disabled={props.isSubmitting} onClick={props.onClose}>
            {props.t('playlist.form.cancel')}
          </Button>
          <Submit disabled={props.isSubmitting}>
            {props.t('playlist.form.submit')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

const styles = (theme) => ({
  container: {},
});

export default compose(
  withTranslation(['video']),
  withStyles(styles),
  PlaylistFormHOC,
)(PlaylistFormDialog);
