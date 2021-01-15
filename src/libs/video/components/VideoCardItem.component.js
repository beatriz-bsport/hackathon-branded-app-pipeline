// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import CardActionArea from '@material-ui/core/CardActionArea';
import DeleteIcon from '@material-ui/icons/Delete';

import { useTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import VideoStatus from './VideoStatus.component';
import withConfirm from '../../../hocs/with-confirm.hoc';
import TypographyWithShowMore from '../../../components/TypographyWithShowMore.component';
import SCT from '../../category/components/SCT.component';
import CoachGroupAvatar from '../../associated-coach/components/CoachGroupAvatar.component';

type Props = {
  onClick?: () => void,
  withStatus: boolean,
  video: Video,
  onEdit: (Video) => void,
  onDelete: (id: number) => void,
  onRequestUpload: (id: number) => void,
  onStream: (Video) => void,
  goToDetail: () => void,
};

const DeleteWithConfirm = withConfirm(IconButton, 'onClick', {
  title: 'video:video.delete.title',
  cancel: 'video:video.delete.cancel',
  confirm: 'video:video.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('video:video.delete.content')}</p>
  ),
});

export const VideoCardItem = (props: Props) => {
  const classes = useStyles(props);
  const { t } = useTranslation(['video']);
  const Wrapper = props.onClick ? CardActionArea : (p) => <div {...p} />;
  return (
    <Card style={{ height: '100%' }}>
      <div className={classes.inner}>
        <Wrapper onClick={props.onClick}>
          <CardMedia
            className={classes.media}
            image={props.video.cover_main}
            title={props.video.name}
          />
          <CardContent
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              paddingBottom: 0,
              marginBottom: 0,
            }}
          >
            <div>
              <div className={classes.header}>
                <div className={classes.titleRow}>
                  <Typography inline variant="h6" component="h3">
                    {props.video.name}
                  </Typography>
                  <Typography
                    inline
                    color="textSecondary"
                    variant="body2"
                    component="p"
                  >
                    {t('video.durationMinute', {
                      minute:
                        parseInt(props.video.duration_second / 60, 10) + 1,
                    })}
                  </Typography>
                </div>

                <div className={classes.headerAction}>
                  {!!props.onEdit && (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => props.onEdit(props.video)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {!!props.onDelete && (
                    <DeleteWithConfirm
                      size="small"
                      onClick={() => props.onDelete(props.video.id)}
                    >
                      <DeleteIcon />
                    </DeleteWithConfirm>
                  )}
                </div>
              </div>
              {props.video.SCT && (
                <SCT
                  SCTName={props.video.SCT.name}
                  parentCategory={props.video.SCT.SCS.id}
                />
              )}
              <div className={classes.descriptionContainer}>
                <TypographyWithShowMore
                  multiline
                  variant="body2"
                  color="textSecondary"
                >
                  {props.video.description}
                </TypographyWithShowMore>
              </div>
            </div>
          </CardContent>
        </Wrapper>
        <div>
          {!!props.video.coaches && !!props.video.coaches.length && (
            <div className={classes.coachContainer}>
              <CoachGroupAvatar size="small" coaches={props.video.coaches} />
            </div>
          )}
          <CardActions disableSpacing className={classes.actions}>
            {!!props.withStatus && (
              <VideoStatus
                openStream={props.onStream}
                openUpload={() => props.onRequestUpload(props.video)}
                goToDetail={props.goToDetail}
                video={props.video}
              />
            )}
          </CardActions>
        </div>
      </div>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  inner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(1),
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  headerAction: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: theme.spacing(2),
  },
  coachContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    flexWrap: 'wrap',
    '&>*': {
      margin: theme.spacing(0.5),
    },
  },
  media: {
    height: 240,
  },
  descriptionContainer: {
    paddingTop: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
}));

export default VideoCardItem;
