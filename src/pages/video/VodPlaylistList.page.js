import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import Grid from '@material-ui/core/Grid';
import { withTranslation, TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Button, withStyles } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/styles';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import {
  fetchPlaylistList as fetchPlaylistListAction,
  fetchMorePlaylist as fetchMorePlaylistAction,
  deletePlaylist as deletePlaylistAction,
  createOrUpdatePlaylist as createOrUpdatePlaylistAction,
} from '../../libs/playlist/actions';
import { mapFormData } from '../form.utils';
import { getPlaylistList } from '../../libs/playlist/selectors';
import PlaylistCardItem from '../../libs/playlist/components/PlaylistCardItem.component';
import PlaylistFormDialog from '../../libs/playlist/components/PlaylistFormDialog.component';

type Props = {
  t: TFunction,
  classes: ClassNameMap,
  fetchPlaylistList: () => void,
  fetchMorePlaylist: () => void,
  playlistList: Array<VideoPlaylist>,
  openPlaylist: (id: number) => void,

  loading: boolean,

  deletePlaylist: (Playlist, OptionCallback) => void,

  openEditForm: (VideoPlaylist) => void,
  editPlaylist: ?Playlist,
  openCreateForm: () => void,
  closeEditForm: () => void,
  closeCreateDialog: () => void,
  createOpen: boolean,

  createOrUpdatePlaylist: (data: any, options: OptionCallback) => void,

  shouldDisplaySeeMoreButton: boolean,
};

const PlaylistMap = {
  id: 'id',
  cover_main: 'cover_main',
  description: 'description',
  name: 'name',
};

export class VodPlaylistListPage extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPlaylistList();
  }

  render() {
    return (
      <div className={this.props.classes.playlistListContainer}>
        {!!this.props.loading && <LinearProgress />}
        <Grid container spacing={2}>
          {this.props.playlistList.map((pl) => (
            <Grid key={pl.id} item lg={3} md={4} sm={6} xs={12}>
              <PlaylistCardItem
                onDelete={this.props.deletePlaylist}
                onEdit={this.props.openEditForm}
                onOpen={this.props.openPlaylist}
                playlist={pl}
              />
            </Grid>
          ))}
        </Grid>
        {!!this.props.createOpen && (
          <PlaylistFormDialog
            open
            onClose={this.props.closeCreateDialog}
            onSubmit={this.props.createOrUpdatePlaylist}
          />
        )}
        {!!this.props.editPlaylist && (
          <PlaylistFormDialog
            open
            initial={this.props.editPlaylist}
            onClose={this.props.closeEditForm}
            onSubmit={this.props.createOrUpdatePlaylist}
          />
        )}
        <BottomActionButtons
          onCreate={this.props.openCreateForm}
          onCreateLabel={this.props.t('video:playlist.bottomActions.create')}
        />
        {!this.props.loading &&
          !!this.props.shouldDisplaySeeMoreButton &&
          !!this.props.fetchMorePlaylist && (
            <div className={this.props.classes.buttonContainer}>
              <Button
                color="primary"
                onClick={this.props.fetchMorePlaylist}
                variant="outlined"
              >
                {this.props.t('video.showMore')}
              </Button>
            </div>
          )}
      </div>
    );
  }
}

const styles = (theme) => ({
  buttonContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  playlistListContainer: {
    paddingBottom: '20vh',
  },
});

export default compose(
  withStyles(styles),
  withTranslation('video'),
  connect(
    (state) => ({
      playlistList: getPlaylistList(state),
      loading: state.playlist.loading,
      shouldDisplaySeeMoreButton:
        state.playlist.list.nextPage && state.playlist.list.nextPage > 1,
    }),
    {
      fetchPlaylistList: (page, options) =>
        fetchPlaylistListAction({ mine: true }, page, options),
      fetchMorePlaylist: () => fetchMorePlaylistAction({ mine: true }),
      deletePlaylist: deletePlaylistAction,
      createOrUpdatePlaylist: createOrUpdatePlaylistAction,
      openPlaylist: (id) => push(`/vod/playlist/${id}`),
    },
  ),
  withStateHandlers(
    {
      editPlaylist: null,
      createOpen: false,
      videoToUpload: null,
      videoToStream: null,
    },
    {
      openCreateForm: () => () => ({
        createOpen: true,
      }),
      closeCreateDialog: () => () => ({
        createOpen: false,
      }),
      openEditForm: () => (editPlaylist) => ({
        editPlaylist,
      }),
      closeEditForm: () => () => ({ editPlaylist: null }),
    },
  ),
  withHandlers({
    deletePlaylist:
      ({ deletePlaylist, fetchPlaylistList }) =>
      (playlist, options) => {
        deletePlaylist(playlist.id, {
          onSuccess: (...args) => {
            if (options && options.onSuccess) {
              options.onSuccess(...args);
            }
            fetchPlaylistList(1);
          },
          onError: (options && options.onError) || null,
        });
      },
    createOrUpdatePlaylist:
      ({
        createOrUpdatePlaylist,
        fetchPlaylistList,
        closeEditForm,
        closeCreateDialog,
      }) =>
      (values, options) => {
        const formData = mapFormData(values, PlaylistMap);
        createOrUpdatePlaylist(formData, {
          onError: (options && options.onError) || null,
          onSuccess: (...args) => {
            if (options && options.onSuccess) {
              options.onSuccess(...args);
            }
            closeCreateDialog();
            closeEditForm();
            if (!formData.get('id')) {
              fetchPlaylistList(1);
            }
          },
        });
      },
  }),
)(VodPlaylistListPage);
