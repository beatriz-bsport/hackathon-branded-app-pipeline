// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import { useTranslation, TFunction } from 'react-i18next';
import TypographyWithShowMore from '../../../components/typo/TypographyWithShowMore.component';
import withConfirm from '../../../hocs/with-confirm.hoc';

type Props = {
  playlist: VideoPlaylist,
  onEdit?: (VideoPlaylist) => void,
  onDelete?: (VideoPlaylist) => void,
  onOpen: (id: number) => void,
};

const DeleteWithConfirm = withConfirm(IconButton, 'onClick', {
  title: 'video:video.delete.title',
  cancel: 'video:video.delete.cancel',
  confirm: 'video:video.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('video:video.delete.content')}</p>
  ),
});

const PaylistCardItem = (props: Props) => {
  const { playlist } = props;
  const { t } = useTranslation(['video']);
  const classes = useStyles();
  return (
    <Card>
      <CardMedia
        className={classes.media}
        image={playlist.cover_main}
        title={playlist.name}
      />
      <CardContent>
        <div className={classes.header}>
          <Typography component="h3" variant="h6">
            {playlist.name}
          </Typography>
          <div className={classes.headerAction}>
            {!!props.onEdit && (
              <IconButton
                color="primary"
                onClick={() => props.onEdit(playlist)}
                size="small"
              >
                <EditIcon />
              </IconButton>
            )}
            {!!props.onDelete && (
              <DeleteWithConfirm
                onClick={() => props.onDelete(props.playlist)}
                size="small"
              >
                <DeleteIcon />
              </DeleteWithConfirm>
            )}
          </div>
        </div>
        {!!playlist.description && (
          <div className={classes.descriptionContainer}>
            <TypographyWithShowMore
              multiline
              color="textSecondary"
              variant="body2"
            >
              {playlist.description}
            </TypographyWithShowMore>
          </div>
        )}
      </CardContent>
      {!!props.onOpen && (
        <CardActions>
          <Button
            color="primary"
            onClick={() => props.onOpen(playlist.id)}
            variant="outlined"
          >
            {t('playlist.open')}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerAction: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: theme.spacing(1),
  },
  media: {
    height: (props) => (props.compact ? 140 : 240),
  },
  descriptionContainer: {
    paddingTop: theme.spacing(2),
  },
}));

export default PaylistCardItem;
