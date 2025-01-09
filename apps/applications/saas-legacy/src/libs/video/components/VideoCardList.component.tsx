import React, { memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Theme,
  List,
  Button,
  CircularProgress,
  Paper,
} from '@material-ui/core';

import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import VideoCardListItem from './VideoCardListItem.component';
import { Video } from '../types';
import { SCT } from '../../category/types';
import { Coach } from '../../associated-coach/types';
import { VideoProvider } from '@bsport/common/lib/master-data/video-provider.js';

type Props = {
  videoList: Array<Video<SCT, Coach>>;
  onEdit: (v: Video<SCT, Coach>) => void;
  onDelete: (v: Video<SCT, Coach>) => void;
  loading: boolean;
  onRequestUpload: (v: Video<SCT, Coach>) => void;
  hasMoreVideo: boolean;
  onShowMore: () => void;
  onStream: (v: Video<SCT, Coach>) => void;
  goToDetail: (id: number) => void;
  onDuplicate: (v: Video<SCT, Coach>) => void;
};

export const VideoCardList = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['video']);

  return (
    <div className={classes.container}>
      <Paper>
        <List disablePadding>
          {props.videoList
            .filter(
              (videoItem) =>
                videoItem?.provider_identifier !== VideoProvider.MUX_PROVIDER ||
                videoItem?.provider_identifier_defined_by_user === false,
            )
            .map((videoItem) => (
              <VideoCardListItem
                key={videoItem.id}
                // @ts-expect-error
                withStatus
                goToDetail={props.goToDetail}
                onDelete={props.onDelete}
                onDuplicate={props.onDuplicate}
                onEdit={props.onEdit}
                onRequestUpload={props.onRequestUpload}
                onStream={props.onStream}
                video={videoItem}
              />
            ))}
        </List>
      </Paper>

      {!props.loading && !props.videoList.length && (
        <div className={classes.buttonContainer}>
          <Typography color="textSecondary" component="p" variant="h6">
            {t('video.search.isEmpty')}
          </Typography>
        </div>
      )}
      {!!props.loading && (
        <div className={classes.buttonContainer}>
          <CircularProgress />
        </div>
      )}
      {!props.loading && !!props.hasMoreVideo && !!props.onShowMore && (
        <div className={classes.buttonContainer}>
          <Button color="primary" onClick={props.onShowMore} variant="outlined">
            {t('video.showMore')}
          </Button>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
}));

export default memo(VideoCardList);
