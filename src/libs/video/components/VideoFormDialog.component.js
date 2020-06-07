// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import { Form } from 'formik';
import VideoForm, { VideoFormHOC } from './VideoForm.component';
import { Submit } from '../../../components/forms';

type Props = {
  isSubmitting?: boolean,
  onClose: () => void,
  open: boolean,
};
export const VideoFormDialog = (props: Props) => {
  const { t } = useTranslation(['video']);
  return (
    <Dialog open={props.open}>
      <Form>
        <DialogContent>
          <VideoForm {...props} />
        </DialogContent>
        <DialogActions>
          <Button disabled={props.isSubmitting} onClick={props.onClose}>
            {t('video.form.cancel')}
          </Button>
          <Submit disabled={props.isSubmitting}>
            {t('video.form.submit')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default VideoFormHOC(VideoFormDialog);
