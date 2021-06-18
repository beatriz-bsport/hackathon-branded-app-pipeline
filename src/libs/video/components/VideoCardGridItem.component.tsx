import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import CardActionArea from '@material-ui/core/CardActionArea';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import VideoStatus from './VideoStatus.component';
import withConfirm from '../../../hocs/with-confirm.hoc';
import TypographyWithShowMore from '../../../components/TypographyWithShowMore.component';
import SCT from '../../category/components/SCT.component';
import CoachGroupAvatar from '../../associated-coach/components/CoachGroupAvatar.component';
import { Video } from '../types';
import { Coach } from '../../associated-coach/types';

type Props = {
  onClick?: () => void;
  withStatus: boolean;
  video: Video<SCT, Coach>;
  onEdit: (v: Video<SCT, Coach>) => void;
  onDelete: (v: Video<SCT, Coach>) => void;
  onRequestUpload: (v: Video<SCT, Coach>) => void;
  onStream: (v: Video<SCT, Coach>) => void;
  goToDetail: () => void;
  onDuplicate: (v: Video<SCT, Coach>) => void;
};

const DeleteWithConfirm = withConfirm(IconButton, 'onClick', {
  title: 'video:video.delete.title',
  cancel: 'video:video.delete.cancel',
  confirm: 'video:video.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('video:video.delete.content')}</p>
  ),
});

export const VideoCardGridItem = (props: Props) => {
  const classes = useStyles(props);
  const { t } = useTranslation(['video']);
  const Wrapper = props.onClick ? CardActionArea : (p) => <div {...p} />;
  return (
    <Card style={{ height: '100%' }}>
      <div className={classes.inner}>
        <Wrapper onClick={props.onClick}>
          <div className={classes.mediaWrapper}>
            <CardMedia
              className={classes.media}
              image={props.video.cover_main}
              title={props.video.name}
            />
            {props.video.manager_only && (
              <div className={classes.managerOnlyWrapper}>
                <VisibilityOffIcon />
              </div>
            )}
          </div>

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
                  <Typography
                    variant="h6"
                    component="h3"
                    className={classes.title}
                  >
                    {props.video.name}
                  </Typography>
                </div>

                <div className={classes.headerAction}>
                  {!!props.onDuplicate && (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => props.onDuplicate(props.video)}
                    >
                      <FileCopyIcon />
                    </IconButton>
                  )}

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
                      onClick={() => props.onDelete(props.video)}
                    >
                      <DeleteIcon />
                    </DeleteWithConfirm>
                  )}
                </div>
              </div>

              <div className={classes.row}>
                <div className={classes.flex1}>
                  {props.video.SCT && (
                    <SCT
                      SCTName={props.video.SCT.name}
                      parentCategory={props.video.SCT.SCS.id}
                    />
                  )}
                </div>
                <Typography color="textSecondary" variant="body2" component="p">
                  {t('video.durationMinute', {
                    minute: parseInt(props.video.duration_second / 60, 10),
                  })}
                </Typography>
              </div>
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
    paddingBottom: theme.spacing(1),
  },
  title: {
    flex: 1,
    maxWidth: '100%',
    overflowWrap: 'anywhere',
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'baseline',
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  headerAction: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: theme.spacing(2),
  },
  row: {
    display: 'flex',
  },
  flex1: {
    flex: 1,
  },
  coachContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    flexWrap: 'wrap',
    '&>*': {
      margin: theme.spacing(0.5),
    },
  },
  mediaWrapper: {
    height: 240,
    width: '100%',
    position: 'relative',
  },
  media: {
    height: 240,
  },
  managerOnlyWrapper: {
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    width: 40,
    height: 40,
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

export default VideoCardGridItem;
