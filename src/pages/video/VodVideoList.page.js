// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import withTitle from '../../hocs/with-title.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import withQueryParams from '../../hocs/with-query-params.hoc';
import { mapFormData } from '../form.utils';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';

import {
  getVideoList,
  withCategory,
  withCoach,
} from '../../libs/video/selectors';
import {
  fetchVideoList as fetchVideoListAction,
  createOrUpdateVideo as createOrUpdateVideoAction,
  retrieveVideo,
  deleteVideo as deleteVideoAction,
  fetchMoreVideo as fetchMoreVideoAction,
} from '../../libs/video/actions';

import VideoCardList from '../../libs/video/components/VideoCardList.component';
import VideoFormDialog from '../../libs/video/components/VideoFormDialog.component';
import VideoUploadDialog from '../../libs/video/components/VideoUploadDialog.component';
import VideoStreamDialog from '../../libs/video/components/VideoStreamDialog.component';
import VideoSearchBar from '../../libs/video/components/VideoSearchBar.component';

type Props = {
  t: TFunction,
  location: Location,
  classes: Object,
  loading: boolean,

  searchParams: {
    coach: string,
    duration_second_range: string,
    SCT: string,
    search: string,
    level: string,
  },
  setSearchParams: (string, string) => void,

  fetchAssociatedCoachesList: () => void,
  coaches: Array<Coach>,
  SCTs: Array<SCT>,

  fetchVideoList: () => void,
  videoToStream: ?Video,
  hasMoreVideo: boolean,
  fetchMoreVideo: () => void,

  videoList: Array<Video>,
  openEditForm: (Video) => void,
  closeEditForm: () => void,
  setVideoToStream: (?Video) => void,
  closeVideoStream: () => void,
  createOrUpdateVideo: (data: any, options: OptionCallback) => void,
  deleteVideo: (id: number) => void,

  videoToUpload: ?Video,
  setVideoToUpload: (?Video) => void,

  retrieveVideo: (id: number) => void,
  closeUploadVideoForm: () => void,
  createOpen: boolean,
  closeCreateDialog: () => void,
  editVideo: ?Video,
  openCreateForm: () => void,
};

const VideoMap = {
  id: 'id',
  cover_main: 'cover_main',
  description: 'description',
  name: 'name',
  SCT: 'SCT',
  level: 'level',
  coaches: 'coaches',
  credit_price: 'credit_price',
};

export class VodVideoListPage extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchVideoList();
    this.props.fetchAssociatedCoachesList();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.location.search !== this.props.location.search) {
      this.props.fetchVideoList();
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={this.props.classes.container}>
        {!!this.props.loading && <LinearProgress />}
        <div className={classes.searchContainer}>
          <VideoSearchBar
            searchParams={this.props.searchParams}
            onChangeSearchParams={this.props.setSearchParams}
            coaches={this.props.coaches}
            scts={this.props.SCTs}
          />
        </div>
        <Divider className={classes.divider} />
        <VideoCardList
          videoList={this.props.videoList}
          onEdit={this.props.openEditForm}
          onDelete={this.props.deleteVideo}
          onRequestUpload={this.props.setVideoToUpload}
          onStream={this.props.setVideoToStream}
          onShowMore={this.props.fetchMoreVideo}
          hasMoreVideo={this.props.hasMoreVideo}
          loading={this.props.loading}
        />
        {!!this.props.videoToStream && (
          <VideoStreamDialog
            video={this.props.videoToStream}
            onClose={this.props.closeVideoStream}
          />
        )}
        {!!this.props.videoToUpload && (
          <VideoUploadDialog
            video={this.props.videoToUpload}
            onSubmit={() => {
              this.props.retrieveVideo(this.props.videoToUpload.id);
              this.props.closeUploadVideoForm();
            }}
            onClose={this.props.closeUploadVideoForm}
          />
        )}
        {!!this.props.createOpen && (
          <VideoFormDialog
            coaches={this.props.coaches}
            onSubmit={this.props.createOrUpdateVideo}
            onClose={this.props.closeCreateDialog}
            SCTs={this.props.SCTs}
            open
          />
        )}
        {!!this.props.editVideo && (
          <VideoFormDialog
            open
            coaches={this.props.coaches}
            SCTs={this.props.SCTs}
            onSubmit={this.props.createOrUpdateVideo}
            initial={this.props.editVideo}
            onClose={this.props.closeEditForm}
          />
        )}
        <BottomActionButtons
          onCreateLabel={this.props.t('video:video.bottomActions.create')}
          onCreate={this.props.openCreateForm}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: '20vh',
  },
  searchContainer: {
    marginBottom: theme.spacing(2),
  },
  divider: {
    marginBottom: theme.spacing(4),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['video', 'titles']),
  withTitle(({ t }: { t: TFunction }) => t('titles:video.videoList')),
  withQueryParams([
    ['coach', 'duration_second_range', 'SCT', 'search', 'level'],
    'searchParams',
    'setSearchParams',
  ]),
  connect(
    (state) => ({
      videoList: withCoach(withCategory(getVideoList))(state),
      loading: state.video.loading,
      SCTs: state.category.SCTs,
      coaches: getActiveCoaches(state),
      hasMoreVideo: state.video.list.nextPage && state.video.list.nextPage > 1,
    }),
    {
      fetchVideoList: fetchVideoListAction,
      fetchAssociatedCoachesList,
      retrieveVideo,
      goToDetail: (videoId) => push(`/video/${videoId}/`),
      deleteVideo: deleteVideoAction,
      createOrUpdateVideo: createOrUpdateVideoAction,
      fetchMoreVideo: fetchMoreVideoAction,
    },
  ),
  withHandlers({
    fetchMoreVideo: ({ fetchMoreVideo }) => () => {
      fetchMoreVideo({ mine: true });
    },
    fetchVideoList: ({ fetchVideoList, searchParams }) => (options) => {
      fetchVideoList({ mine: true, ...(searchParams || {}) }, 1, {
        onError: options && options.onError,
        onSuccess: (videoList) => {
          if (options && options.onSuccess) {
            options.onSuccess(videoList);
          }
        },
      });
    },
  }),
  withStateHandlers(
    {
      editVideo: null,
      createOpen: false,
      videoToUpload: null,
      videoToStream: null,
    },
    {
      openCreateForm: () => () => {
        return {
          createOpen: true,
        };
      },
      setVideoToUpload: () => (videoToUpload) => ({ videoToUpload }),
      closeUploadVideoForm: () => () => ({ videoToUpload: null }),
      closeVideoStream: () => () => ({ videoToStream: null }),
      setVideoToStream: () => (videoToStream) => ({ videoToStream }),
      closeCreateDialog: () => () => ({
        createOpen: false,
      }),
      openEditForm: () => (editVideo) => {
        return {
          editVideo,
        };
      },
      closeEditForm: () => () => ({ editVideo: null }),
    },
  ),
  withHandlers({
    deleteVideo: ({ deleteVideo, fetchVideoList }) => (id, options) => {
      deleteVideo(id, {
        onSuccess: (...args) => {
          if (options && options.onSuccess) {
            options.onSuccess(...args);
          }
          fetchVideoList();
        },
        onError: (options && options.onError) || null,
      });
    },
    createOrUpdateVideo: ({
      createOrUpdateVideo,
      fetchVideoList,
      closeEditForm,
      closeCreateDialog,
    }) => (values, options) => {
      const formData = mapFormData(values, VideoMap);
      createOrUpdateVideo(formData, {
        onError: (options && options.onError) || null,
        onSuccess: (...args) => {
          if (options && options.onSuccess) {
            options.onSuccess(...args);
          }
          closeCreateDialog();
          closeEditForm();
          if (!formData.get('id')) {
            fetchVideoList();
          }
        },
      });
    },
  }),
)(VodVideoListPage);
