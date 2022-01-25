import React from 'react';

import { compose } from 'recompose';

import { Theme, Button } from '@material-ui/core';

import { withStyles } from '@material-ui/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';

import { setUploadInstruction as getUploadInstructionAPI } from '../api';
import { Video } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import EbookProviderDropzone from '#libs/video/components/EbookProviderDropzone.component';
import { OptionCallback } from '../../../state/types';

type State = {
  progress: number;
  isUploading: boolean;
  dropzoneFilled: boolean;
};

type OwnProps = {
  video: Video;
  onClose: () => void;
  setExternalUrl: (id: number, data?: any, options?: OptionCallback) => void;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export class EbookUploadForm extends React.Component<Props, State> {
  file: any = null;

  state = {
    isUploading: false,
    progress: 0,
    dropzoneFilled: false,
  };

  DROPZONE_REF?: any;

  updateProgressStatus = (evt: any) => {
    if (evt.lengthComputable) {
      this.setState({ progress: Math.round((evt.loaded / evt.total) * 100) });
    }
  };

  onComplete = () => {
    setTimeout(() => {
      this.setState({ isUploading: false, progress: 0 });
      this.props.onClose();
      this.props.setExternalUrl(this.props.video.id);
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
    try {
      const { data } = await getUploadInstructionAPI(this.props.video.id);
      const { method, url, bodyType, fields } = data;

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
        body,
      });
    } catch (err) {
      console.error(err);
      this.setState({ isUploading: false });
    }
  };

  render() {
    const { classes, t } = this.props;

    return (
      <div className={classes.container}>
        <EbookProviderDropzone
          processing={this.state.isUploading}
          fowardedRef={(ref) => {
            this.DROPZONE_REF = ref;
          }}
          setDropzoneFilled={() => this.setState({ dropzoneFilled: true })}
        />
        {this.state.isUploading && (
          <LinearProgress
            className={classes.marginTop}
            variant="determinate"
            value={this.state.progress}
          />
        )}
        <div className={this.props.classes.row}>
          <Button
            disabled={this.state.isUploading}
            onClick={this.props.onClose}
          >
            {t('video.upload.cancel')}
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={this.onClickSubmit}
            className={this.props.classes.marginLeft}
            disabled={!this.state.dropzoneFilled || this.state.isUploading}
          >
            {t('video.upload.submit')}
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
  durationWrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    marginTop: theme.spacing(2),
  },
  durationLabel: {
    marginTop: theme.spacing(4),
  },
});

export default compose<any, OwnProps>(
  withTranslation(['video']),
  // @ts-ignore
  withStyles(styles),
)(EbookUploadForm);
