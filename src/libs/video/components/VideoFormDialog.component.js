// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { Form } from 'formik';
import VideoForm, { VideoFormHOC } from './VideoForm.component';
import { Submit } from '../../../components/forms';

type Props = {
  t: TFunction,
};
export const VideoFormDialog = (props: Props) => {
  return (
    <Dialog open={props.open}>
      <Form>
        <DialogContent>
          <VideoForm {...props} />
        </DialogContent>
        <DialogActions>
          <Button disabled={props.isSubmitting} onClick={props.onClose}>
            {props.t('video.form.cancel')}
          </Button>
          <Submit disabled={props.isSubmitting}>
            {props.t('video.form.submit')}
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
  VideoFormHOC,
)(VideoFormDialog);
