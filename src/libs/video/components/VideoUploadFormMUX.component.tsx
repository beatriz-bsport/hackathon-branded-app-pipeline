import React from 'react';

import { compose } from 'recompose';

import { Theme, Button } from '@material-ui/core';

import { withStyles } from '@material-ui/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';

import { VideoProvider } from '@bsport/common/lib/master-data/video-provider';

import { Video } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import VideoProviderDropzone from './VideoProviderDropzone.component';
import { OptionCallback } from '../../../state/types';
import { setUploadInstruction as getUploadInstructionAPI } from '#libs/video/api';

type State = {
  progress: number;
  isUploading: boolean;
};

type OwnProps = {
  video: Video;
  onClose: () => void;
  setProviderIdentifier: (data: any, options?: OptionCallback) => void;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export class VideoUploadFormMUX extends React.Component<Props, State> {
  file: any = null;

  state = {
    isUploading: false,
    progress: 0,
  };

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
      this.props.onClose();
    }, 5000);
  };

  requestStrategy = async (params: {
    method: string;
    url: string;
    body: any;
  }) => {
    const { method, url, body } = params;

    const xhrObj = new XMLHttpRequest();
    xhrObj.upload.addEventListener(
      'progress',
      this.updateProgressStatus,
      false,
    );
    xhrObj.upload.addEventListener('load', this.onComplete, false);
    xhrObj.open(method, url);
    xhrObj.send(body);
  };

  onClickSubmit = async () => {
    this.setState({ isUploading: true });
    this.props.setProviderIdentifier(VideoProvider.MUX_PROVIDER);
    try {
      const { data } = await getUploadInstructionAPI(this.props.video.id);
      const { providerType, method, url, bodyType, fields } = data;

      let body = null;

      if (this.DROPZONE_REF) {
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

  render() {
    return (
      <div className={this.props.classes.container}>
        <VideoProviderDropzone
          processing={this.state.isUploading}
          fowardedRef={(ref) => {
            this.DROPZONE_REF = ref;
          }}
        />
        {this.state.isUploading && (
          <LinearProgress
            className={this.props.classes.marginTop}
            variant="determinate"
            value={this.state.progress}
          />
        )}
        <div className={this.props.classes.row}>
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
        </div>
      </div>
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
  row: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  withTranslation(['video']),
  // @ts-ignore
  withStyles(styles),
)(VideoUploadFormMUX);
