import React from 'react';
import { compose } from 'recompose';
import { Theme, withStyles } from '@material-ui/core/styles';

import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
  Avatar,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import { withTranslation, WithTranslation } from 'react-i18next';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import SCT from '../../category/components/SCT.component';
import { Video } from '../types';
import { Coach } from '../../associated-coach/types';
import { MaterialStyleType } from '../../../utils/types';
import { showDeleteDialog } from '../../../components/GenericDialog/CustomDialogs';

const VIDEO_STATUS_CREATED = 100;

type OwnProps = {
  video: Video<SCT, Coach>;
  onClick?: () => void;
  onEdit: (v: Video<SCT, Coach>) => void;
  onDelete: (v: Video<SCT, Coach>) => void;
  onRequestUpload: (v: Video<SCT, Coach>) => void;
  goToDetail: (id: number) => void;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export class VideoCardListItem extends React.PureComponent<Props> {
  onClickDelete = async () => {
    const { t } = this.props;

    const res = await showDeleteDialog(
      t('video:video.delete.title'),
      t('video:video.delete.content'),
    );

    res && this.props.onDelete(this.props.video);
  };

  render() {
    const { classes, t } = this.props;

    return (
      <ListItem
        button
        divider
        alignItems="center"
        dense
        onClick={() => this.props.goToDetail(this.props.video.id)}
      >
        <ListItemAvatar>
          <Avatar
            alt=""
            className={classes.avatar}
            src={this.props.video.cover_main}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" variant="subtitle1">
              {this.props.video.name} (
              {t('video:video.durationMinute', {
                minute: parseInt(this.props.video.duration_second / 60, 10) + 1,
              })}
              )
            </Typography>
          }
          secondary={this.props.video.SCT.name || ''}
        />

        <ListItemResponsiveAction
          actions={[
            this.props.video.manager_only && {
              icon: VisibilityOffIcon,
              label: t('video:video.manager_only'),
              onClick: () => null,
            },
            this.props.video.status === VIDEO_STATUS_CREATED &&
              this.props.onRequestUpload && {
                icon: CloudUploadIcon,
                label: t('video:video.status.submitted'),
                onClick: () => this.props.onRequestUpload(this.props.video),
                color: 'secondary',
              },
            {
              icon: EditIcon,
              label: t('common.edit'),
              color: 'primary',
              onClick: () => this.props.onEdit(this.props.video),
            },
            {
              icon: DeleteIcon,
              label: t('common.delete'),
              onClick: this.onClickDelete,
            },
          ]}
        />
      </ListItem>
    );
  }
}

const styles = (theme: Theme) => ({
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation([]),
)(VideoCardListItem);
