// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import withTitle from '../../hocs/with-title.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import ViewSwitcher from '../../components/ViewSwitcher';
import withQueryParams from '../../hocs/with-query-params.hoc';
import { mapFormData } from '../form.utils';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import { getAllCoaches } from '../../libs/associated-coach/selectors';

import {
  getVideoList,
  getVideo,
  withCategory,
  withCoach,
} from '../../libs/video/selectors';
import {
  fetchVideoList as fetchVideoListAction,
  retrieveVideo as retrieveVideoAction,
  createOrUpdateVideo as createOrUpdateVideoAction,
  deleteVideo as deleteVideoAction,
  fetchMoreVideo as fetchMoreVideoAction,
  fetchVideoFilterableParams as fetchVideoFilterableParamsAction,
  setVideoProviderIdentifier,
  removeVideoSource,
  duplicateVideo,
} from '../../libs/video/actions';

import VideoCardGrid from '../../libs/video/components/VideoCardGrid.component';
import VideoCardList from '../../libs/video/components/VideoCardList.component';
import VideoFormDialog from '../../libs/video/components/VideoFormDialog.component';
import VideoUploadDialog from '../../libs/video/components/VideoUploadDialog.component';
import VideoStreamDialog from '../../libs/video/components/VideoStreamDialog.component';
import VideoSearchBar from '../../libs/video/components/VideoSearchBar.component';
import themeSelectors from '../../libs/theme/selectors';
import { Video } from '../../libs/video/types';
import { showDeleteDialog } from '../../components/GenericDialog/CustomDialogs';

type Props = {
  t: TFunction,
  location: Location,
  classes: Object,
  loading: boolean,
  theme: CompanyTheme,

  searchParams: {
    coaches: string,
    duration_second_range: string,
    SCTs: string,
    search: string,
    levels: string,
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
  deleteVideo: (video: Video) => void,

  videoToUploadId: ?number,
  videoToUpload: ?Video,
  setVideoToUpload: (?Video) => void,

  closeUploadVideoForm: () => void,
  createOpen: boolean,
  closeCreateDialog: () => void,
  editVideo: ?Video,
  openCreateForm: () => void,
  goToDetail: (videoId: number) => void,
  fetchVideoFilterableParams: (params: any) => void,
  videoFilterableParams: { SCTs: Array<SCT>, coaches: Array<AssociatedCoach> },

  submitVideoProviderIdentifier: (data: any, options: OptionCallback) => void,
  viewMode: string,
  setViewMode: (viewMode: string) => void,
  removeVideoSource: () => void,
  onDuplicateVideo: (v: Video) => void,
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
  manager_only: 'manager_only',
  duration_second: 'duration_second',
};

const VIEW_MODE = {
  grid: 'grid',
  list: 'list',
};

export class VodVideoListPage extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchVideoList();
    this.props.fetchAssociatedCoachesList();
    this.props.fetchVideoFilterableParams({ mine: true });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.location.search !== this.props.location.search) {
      this.props.fetchVideoList();
    }
  }

  closeUploadVideoForm = () => {
    this.props.retrieveVideo(this.props.videoToUploadId);
    this.props.closeUploadVideoForm();
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={this.props.classes.container}>
        {!!this.props.loading && <LinearProgress />}
        <div className={classes.searchContainer}>
          <VideoSearchBar
            searchParams={this.props.searchParams}
            onChangeSearchParams={this.props.setSearchParams}
            coaches={this.props.videoFilterableParams.coaches || []}
            scts={this.props.videoFilterableParams.SCTs || []}
          />
        </div>
        <div className={classes.viewModeContainer}>
          <ViewSwitcher
            value={this.props.viewMode}
            onChange={this.props.setViewMode}
          />
        </div>

        {this.props.viewMode === 'grid' ? (
          <VideoCardGrid
            goToDetail={this.props.goToDetail}
            videoList={this.props.videoList}
            onEdit={this.props.openEditForm}
            onDelete={this.props.deleteVideo}
            onRequestUpload={this.props.setVideoToUpload}
            onStream={this.props.setVideoToStream}
            onShowMore={this.props.fetchMoreVideo}
            hasMoreVideo={this.props.hasMoreVideo}
            loading={this.props.loading}
            onDuplicate={this.props.onDuplicateVideo}
          />
        ) : (
          <VideoCardList
            goToDetail={this.props.goToDetail}
            videoList={this.props.videoList}
            onEdit={this.props.openEditForm}
            onDelete={this.props.deleteVideo}
            onRequestUpload={this.props.setVideoToUpload}
            onStream={this.props.setVideoToStream}
            onShowMore={this.props.fetchMoreVideo}
            hasMoreVideo={this.props.hasMoreVideo}
            loading={this.props.loading}
            onDuplicate={this.props.onDuplicateVideo}
          />
        )}

        {!!this.props.videoToStream && (
          <VideoStreamDialog
            video={this.props.videoToStream}
            onClose={this.props.closeVideoStream}
          />
        )}
        {!!this.props.videoToUploadId && (
          <VideoUploadDialog
            video={this.props.videoToUpload}
            videoProviderList={this.props.theme.vod_providers}
            submitProviderIdentifier={this.props.submitVideoProviderIdentifier}
            onClose={this.closeUploadVideoForm}
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
            onRemoveVideoSource={this.props.removeVideoSource}
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
  viewModeContainer: {
    marginBottom: theme.spacing(4),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['video', 'titles']),
  withTitle(({ t }: { t: TFunction }) => t('titles:video.videoList')),
  withQueryParams([
    ['coaches', 'duration_second_range', 'SCTs', 'search', 'levels'],
    'searchParams',
    'setSearchParams',
  ]),
  withStateHandlers(
    {
      editVideo: null,
      createOpen: false,
      videoToUploadId: null,
      videoToStream: null,
      viewMode: VIEW_MODE.grid,
    },
    {
      openCreateForm: () => () => {
        return {
          createOpen: true,
        };
      },
      setVideoToUpload: () => (videoToUpload) => ({
        videoToUploadId: videoToUpload.id,
      }),
      closeUploadVideoForm: () => () => ({ videoToUploadId: null }),
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
      setViewMode: () => (viewMode: string) => ({ viewMode }),
    },
  ),
  connect(
    (state, { videoToUploadId }) => ({
      videoList: withCoach(withCategory(getVideoList))(state),
      videoToUpload: getVideo(state, videoToUploadId),
      loading: state.video.loading,
      SCTs: state.category.SCTs,
      coaches: getAllCoaches(state),
      hasMoreVideo: state.video.list.nextPage && state.video.list.nextPage > 1,
      videoFilterableParams: state.video.filterableParams.items,
      theme: themeSelectors.getTheme(state),
    }),
    {
      fetchVideoList: fetchVideoListAction,
      retrieveVideo: retrieveVideoAction,
      fetchAssociatedCoachesList,
      goToDetail: (videoId) => push(`/vod/video/${videoId}/`),
      deleteVideo: deleteVideoAction,
      createOrUpdateVideo: createOrUpdateVideoAction,
      fetchMoreVideo: fetchMoreVideoAction,
      fetchVideoFilterableParams: fetchVideoFilterableParamsAction,
      submitVideoProviderIdentifier: setVideoProviderIdentifier,
      removeVideoSourceAction: removeVideoSource,
      duplicateVideo,
    },
  ),
  withHandlers({
    turnSearchParamsIntoQueryParams: ({ searchParams }) => () => {
      const params = {};
      if (searchParams.SCTs) {
        params.SCT__pk__in = searchParams.SCTs;
      }
      if (searchParams.coaches) {
        params.coaches__id__in = searchParams.coaches;
      }
      if (searchParams.levels) {
        params.level__pk__in = searchParams.levels;
      }
      return params;
    },
  }),
  withHandlers({
    fetchMoreVideo: ({
      fetchMoreVideo,
      turnSearchParamsIntoQueryParams,
    }) => () => {
      const params = turnSearchParamsIntoQueryParams();
      fetchMoreVideo({ mine: true, ...params });
    },
    fetchVideoList: ({ fetchVideoList, turnSearchParamsIntoQueryParams }) => (
      options,
    ) => {
      const params = turnSearchParamsIntoQueryParams();
      fetchVideoList({ mine: true, ...params }, 1, {
        onError: options && options.onError,
        onSuccess: (videoList) => {
          if (options && options.onSuccess) {
            options.onSuccess(videoList);
          }
        },
      });
    },
  }),
  withHandlers({
    submitVideoProviderIdentifier: ({
      submitVideoProviderIdentifier,
      retrieveVideo,
      videoToUploadId,
    }) => (data, options) => {
      submitVideoProviderIdentifier(videoToUploadId, data, {
        onSuccess: (...args) => {
          retrieveVideo(videoToUploadId);
          if (options && options.onSuccess) {
            options.onSuccess(...args);
          }
        },
        onError: options && options.onError,
      });
    },
    deleteVideo: ({
      deleteVideo,
      fetchVideoList,
      fetchVideoFilterableParams,
    }) => (video, options) => {
      deleteVideo(video.id, {
        onSuccess: (...args) => {
          if (options && options.onSuccess) {
            options.onSuccess(...args);
          }
          fetchVideoList();
          fetchVideoFilterableParams({ mine: true });
        },
        onError: (options && options.onError) || null,
      });
    },
    createOrUpdateVideo: ({
      createOrUpdateVideo,
      fetchVideoList,
      closeEditForm,
      closeCreateDialog,
      fetchVideoFilterableParams,
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
          fetchVideoFilterableParams({ mine: true });
          if (!formData.get('id')) {
            fetchVideoList();
          }
        },
      });
    },
    removeVideoSource: (props) => async (video: Video) => {
      const res = await showDeleteDialog(
        props.t('video.form.video_source.change_popup_title'),
        props.t('video.form.video_source.change_popup_text'),
      );
      if (res) {
        props.closeEditForm();
        await props.removeVideoSourceAction(video.id);
        props.setVideoToUpload(video);
      }
    },
  }),
  withHandlers({
    onDuplicateVideo: (props) => (video: Video) => {
      props.duplicateVideo(video.id, {
        onSuccess: () => props.fetchVideoList(),
      });
    },
  }),
)(VodVideoListPage);
