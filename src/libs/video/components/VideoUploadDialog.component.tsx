import React from 'react';
import { compose } from 'recompose';

import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Theme,
  Button,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core';

import { withStyles } from '@material-ui/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';

import {
  VideoProvider,
  VideoProviderType,
} from '@bsport/common/lib/master-data/video-provider';

import {
  getUploadInstruction as getUploadInstructionAPI,
  setProviderIdentifier,
} from '../api';
import { Video } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import VideoProviderUrl from './VideoProviderUrl.component';
import VideoProviderDropzone from './VideoProviderDropzone.component';
import { postAuth } from '../../../http';

type State = {
  progress: number;
  isUploading: boolean;
  videoStrategy: VideoProviderType;
};

type OwnProps = {
  onSubmit: () => void;
  video: Video;
  onClose: () => void;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export class VideoUploadDialog extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      isUploading: false,
      videoStrategy: this.props.videoProviderList.includes(
        VideoProvider.MUX_PROVIDER,
      )
        ? VideoProviderType.TYPE_FILE_UPLOAD
        : VideoProviderType.TYPE_EXTERNAL_URL,
    };
  }

  file: any = null;

  DROPZONE_REF?: any;

  URL_REF?: any;

  updateProgressStatus = (evt: any) => {
    if (evt.lengthComputable) {
      this.setState({ progress: Math.round((evt.loaded / evt.total) * 100) });
    }
  };

  onComplete = () => {
    setTimeout(() => {
      this.setState({ isUploading: false, progress: 0 });
      this.props.onSubmit();
    }, 5000);
  };

  requestStrategy = async (params: {
    method: string;
    url: string;
    providerStrategy: VideoProviderType;
    body: any;
  }) => {
    const { method, url, providerStrategy, body } = params;

    if (providerStrategy === VideoProviderType.TYPE_FILE_UPLOAD) {
      const xhrObj = new XMLHttpRequest();
      xhrObj.upload.addEventListener(
        'progress',
        this.updateProgressStatus,
        false,
      );
      xhrObj.upload.addEventListener('load', this.onComplete, false);
      xhrObj.open(method, url);
      xhrObj.send(body);
    } else {
      const res = await postAuth(url, body);
      if (res.status === 200) {
        this.props.onSubmit();
      }
    }
  };

  onClickSubmit = async () => {
    this.setState({ isUploading: true });
    try {
      let provider_identifier = VideoProvider.MUX_PROVIDER;
      if (this.state.videoStrategy === VideoProviderType.TYPE_EXTERNAL_URL) {
        provider_identifier = VideoProvider.EXTERNAL_URL_PROVIDER;
      }

      const providerData = { provider_identifier };
      const response = await setProviderIdentifier(
        this.props.video.id,
        providerData,
      );

      if (response.status !== 200) {
        throw new Error();
      }

      const { data } = await getUploadInstructionAPI(this.props.video.id);
      const { providerType, method, url, bodyType, fields } = data;

      let body = null;

      if (providerType === VideoProviderType.TYPE_EXTERNAL_URL) {
        body = this.URL_REF.prepareBody();
      } else if (
        providerType === VideoProviderType.TYPE_FILE_UPLOAD &&
        this.DROPZONE_REF
      ) {
        body = this.DROPZONE_REF.prepareBody({
          fields,
          bodyType,
        });
      }

      if (!body) {
        this.setState({ isUploading: false });
        return;
      }

      await this.requestStrategy({
        method,
        url,
        providerStrategy: providerType,
        body,
      });
    } catch (err) {
      console.error(err);
      this.setState({ isUploading: false });
    }
  };

  onChangeProvider = (e: any) => {
    this.setState({ videoStrategy: parseInt(e.target.value) });
  };

  render() {
    return (
      <Dialog open>
        <DialogTitle>{this.props.t('video.upload.title')}</DialogTitle>
        <DialogContent>
          <div className={this.props.classes.container}>
            <FormControl>
              <RadioGroup
                aria-label="provider-type"
                name="provider-type"
                disabled={this.state.isUploading}
                value={this.state.videoStrategy}
                onChange={this.onChangeProvider}
              >
                <FormControlLabel
                  value={VideoProviderType.TYPE_FILE_UPLOAD}
                  control={<Radio />}
                  disabled={
                    !this.props.videoProviderList.includes(
                      VideoProvider.MUX_PROVIDER,
                    ) || this.state.isUploading
                  }
                  label={this.props.t('video.upload.type.file')}
                />
                <FormControlLabel
                  value={VideoProviderType.TYPE_EXTERNAL_URL}
                  control={<Radio />}
                  label={this.props.t('video.upload.type.url')}
                  disabled={
                    !this.props.videoProviderList.includes(
                      VideoProvider.EXTERNAL_URL_PROVIDER,
                    ) || this.state.isUploading
                  }
                />
              </RadioGroup>
            </FormControl>

            {this.state.videoStrategy ===
              VideoProviderType.TYPE_FILE_UPLOAD && (
              <VideoProviderDropzone
                fowardedRef={(ref) => {
                  this.DROPZONE_REF = ref;
                }}
              />
            )}

            {this.state.videoStrategy ===
              VideoProviderType.TYPE_EXTERNAL_URL && (
              <VideoProviderUrl
                fowardedRef={(ref) => {
                  this.URL_REF = ref;
                }}
              />
            )}

            {this.state.isUploading && (
              <LinearProgress
                className={this.props.classes.marginTop}
                variant="determinate"
                value={this.state.progress}
              />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={this.state.isUploading}
            onClick={this.props.onClose}
          >
            {this.props.t('video.upload.cancel')}
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={this.onClickSubmit}
            className={this.props.classes.marginLeft}
            disabled={this.state.isUploading}
          >
            {this.props.t('video.upload.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    minWidth: 350,
    maxWidth: 350,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  marginLeft: {
    marginLeft: theme.spacing(2),
  },
  marginTop: {
    marginTop: theme.spacing(4),
  },
});

export default compose(
  withTranslation(['video']),
  // @ts-ignore
  withStyles(styles),
)(VideoUploadDialog);
