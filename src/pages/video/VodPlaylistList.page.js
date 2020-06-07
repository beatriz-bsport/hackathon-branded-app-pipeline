// @flow
import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import Grid from '@material-ui/core/Grid';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import {
  fetchPlaylistList as fetchPlaylistListAction,
  deletePlaylist as deletePlaylistAction,
  createOrUpdatePlaylist as createOrUpdatePlaylistAction,
} from '../../libs/playlist/actions';
import { mapFormData } from '../form.utils';
import { getPlaylistList } from '../../libs/playlist/selectors';
import PlaylistCardItem from '../../libs/playlist/components/PlaylistCardItem.component';
import PlaylistFormDialog from '../../libs/playlist/components/PlaylistFormDialog.component';

type Props = {
  t: TFunction,
  fetchPlaylistList: () => void,
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
      <div>
        {!!this.props.loading && <LinearProgress />}
        <Grid container spacing={2}>
          {this.props.playlistList.map((pl) => (
            <Grid key={pl.id} item xs={12} sm={6} md={4} lg={3}>
              <PlaylistCardItem
                onEdit={this.props.openEditForm}
                onDelete={this.props.deletePlaylist}
                onOpen={this.props.openPlaylist}
                playlist={pl}
              />
            </Grid>
          ))}
        </Grid>
        {!!this.props.createOpen && (
          <PlaylistFormDialog
            onSubmit={this.props.createOrUpdatePlaylist}
            onClose={this.props.closeCreateDialog}
            open
          />
        )}
        {!!this.props.editPlaylist && (
          <PlaylistFormDialog
            open
            onSubmit={this.props.createOrUpdatePlaylist}
            initial={this.props.editPlaylist}
            onClose={this.props.closeEditForm}
          />
        )}
        <BottomActionButtons
          onCreateLabel={this.props.t('video:playlist.bottomActions.create')}
          onCreate={this.props.openCreateForm}
        />
      </div>
    );
  }
}

export default compose(
  withTranslation(['video']),
  connect(
    (state) => ({
      playlistList: getPlaylistList(state),
      loading: state.playlist.loading,
    }),
    {
      fetchPlaylistList: (page, options) =>
        fetchPlaylistListAction({ mine: true }, page, options),
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
    deletePlaylist: ({ deletePlaylist, fetchPlaylistList }) => (
      playlist,
      options,
    ) => {
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
    createOrUpdatePlaylist: ({
      createOrUpdatePlaylist,
      fetchPlaylistList,
      closeEditForm,
      closeCreateDialog,
    }) => (values, options) => {
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
