// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { compose } from 'recompose';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import TypographyWithShowMore from '../../../components/TypographyWithShowMore.component';
import withConfirm from '../../../hocs/with-confirm.hoc';

type Props = {
  playlist: Playlist,
  t: TFunction,
};

const DeleteWithConfirm = withConfirm(IconButton, 'onClick', {
  title: 'video:playlist.delete.title',
  cancel: 'video:playlist.delete.cancel',
  confirm: 'video:playlist.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('video:playlist.delete.content')}</p>
  ),
});

export const PaylistCardItem = (props: Props) => {
  const { playlist, t } = props;
  const classes = useStyles();
  return (
    <Card>
      <CardMedia
        title={playlist.name}
        image={playlist.cover_main}
        className={classes.media}
      />
      <CardContent>
        <div className={classes.header}>
          <Typography variant="h6" component="h3">
            {playlist.name}
          </Typography>
          <div className={classes.headerAction}>
            {!!props.onEdit && (
              <IconButton
                size="small"
                color="primary"
                onClick={() => props.onEdit(playlist)}
              >
                <EditIcon />
              </IconButton>
            )}
            {!!props.onDelete && (
              <DeleteWithConfirm
                size="small"
                onClick={() => props.onDelete(props.playlist)}
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
              variant="body2"
              color="textSecondary"
            >
              {playlist.description}
            </TypographyWithShowMore>
          </div>
        )}
      </CardContent>
      {!!props.onOpen && (
        <CardActions>
          <Button
            onClick={() => props.onOpen(playlist.id)}
            color="primary"
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

export default compose(withTranslation(['video']))(PaylistCardItem);
