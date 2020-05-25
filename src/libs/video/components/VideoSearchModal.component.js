// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import DelayedTextField from '../../../components/DelayedTextField.component';
import VideoThumbnail from './VideoThumbnail.component';

type Props = {
  t: TFunction,
};
export const VideoSearchModal = (props: Props) => {
  const classes = useStyles();
  return (
    <Dialog open>
      <DialogContent className={classes.content}>
        <DelayedTextField
          variant="outlined"
          fullWidth
          value={props.text}
          onChange={props.onChangeText}
          placeholder={props.placeholder || props.t('video.search.placeholder')}
        />
        {props.loading && <LinearProgress />}
        <div className={classes.content}>
          {props.text &&
            !props.loading &&
            (!props.videoList || !props.videoList.length) && (
              <Typography color="textSecondary" variant="h6" component="p">
                {props.t('video.search.isEmpty')}
              </Typography>
            )}
          {props.videoList.map((v) => (
            <VideoThumbnail video={v} onClick={() => props.onSubmit(v.id)} />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {props.t('video.search.cancel')}
        </Button>
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

export default compose(withTranslation(['video']))(VideoSearchModal);
