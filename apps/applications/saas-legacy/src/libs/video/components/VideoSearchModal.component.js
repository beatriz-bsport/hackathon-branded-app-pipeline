// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import DelayedTextField from '../../../components/DelayedTextField.component';
import VideoThumbnail from './VideoThumbnail.component';

type Props = {
  loading: boolean,
  text: string,
  onChangeText: (string) => void,
  placeholder?: string,
  videoList: Array<Video>,
  onSubmit: (id: number) => void,
  onClose: () => void,
};
const VideoSearchModal = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['video']);
  return (
    <Dialog open>
      <DialogContent className={classes.content}>
        <DelayedTextField
          fullWidth
          onChange={props.onChangeText}
          placeholder={props.placeholder || t('video.search.placeholder')}
          value={props.text}
          variant="outlined"
        />
        {props.loading && <LinearProgress />}
        <div className={classes.content}>
          {props.text &&
            !props.loading &&
            (!props.videoList || !props.videoList.length) && (
              <Typography color="textSecondary" component="p" variant="h6">
                {t('video.search.isEmpty')}
              </Typography>
            )}
          {props.videoList.map((v) => (
            <VideoThumbnail onClick={() => props.onSubmit(v.id)} video={v} />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{t('video.search.cancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {},
  content: {
    minWidth: 340,
    marginTop: theme.spacing(1),
    '&>*': {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
  },
}));

export default VideoSearchModal;
