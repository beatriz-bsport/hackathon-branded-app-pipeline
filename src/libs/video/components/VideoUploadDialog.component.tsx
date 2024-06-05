import React from 'react';
import { compose } from 'recompose';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Theme,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import { VideoProvider } from '@bsport/common/lib/master-data/video-provider';

import EbookUploadForm from '#libs/video/components/EbookUploadForm.component';
import VideoUploadFormMUX from './VideoUploadFormMUX.component';
import VideoUploadFormYoutube from './VideoUploadFormYoutube.component';
import VideoUploadFormVimeo from './VideoUploadFormVimeo.component';

import { Video } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import { OptionCallback } from '../../../state/types';

type State = {
  isUploading: boolean;
  providerIdentifier: number;
  processing: boolean;
};

type OwnProps = {
  onSubmit: () => void;
  video: Video;
  onClose: () => void;
  setExternalUrl: (
    videoId: number,
    data?: any,
    options?: OptionCallback,
  ) => void;
  submitProviderIdentifier: (data: any, options?: OptionCallback) => void;
  videoProviderList: Array<number>;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

const STEP_CHOSE_PROVIDER = 0;
const STEP_FINISH = 1;

export class VideoUploadDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isUploading: false,
      providerIdentifier: props.videoProviderList.includes(
        VideoProvider.MUX_PROVIDER,
      )
        ? props.video.provider_identifier
        : VideoProvider.YOUTUBE_URL_PROVIDER,
      processing: false,
    };
  }

  getStep = () => {
    // @ts-expect-error
    if (this.props.video.provider_identifier_defined_by_user) {
      return STEP_FINISH;
    }
    return STEP_CHOSE_PROVIDER;
  };

  submitProviderIdentifier = () => {
    this.setState({
      processing: true,
    });

    this.props.submitProviderIdentifier(this.state.providerIdentifier, {
      onSuccess: () => this.setState({ processing: false }),
      onError: () => this.setState({ processing: false }),
    });
  };

  render() {
    if (this.getStep() === STEP_CHOSE_PROVIDER) {
      return (
        <Dialog open>
          <DialogTitle>{this.props.t('video.upload.title')}</DialogTitle>
          <DialogContent>
            <div className={this.props.classes.container}>
              <FormControl>
                <RadioGroup
                  aria-label="provider-type"
                  // @ts-expect-error
                  disabled={
                    // @ts-expect-error
                    this.state.isUploading || this.props.video.upload_id
                  }
                  name="provider-type"
                  onChange={(ev) =>
                    this.setState({
                      providerIdentifier: parseInt(ev.target.value),
                    })
                  }
                  value={this.state.providerIdentifier}
                >
                  <FormControlLabel
                    checked={
                      this.state.providerIdentifier ===
                      VideoProvider.MUX_PROVIDER
                    }
                    control={<Radio />}
                    disabled={
                      this.state.processing ||
                      !this.props.videoProviderList.includes(
                        VideoProvider.MUX_PROVIDER,
                      )
                    }
                    label={this.props.t('video.upload.type.file')}
                    value={VideoProvider.MUX_PROVIDER}
                  />
                  <Typography
                    color={
                      this.props.videoProviderList.includes(
                        VideoProvider.MUX_PROVIDER,
                      )
                        ? 'inherit'
                        : 'textSecondary'
                    }
                    variant="caption"
                  >
                    {this.props.t('video.upload.type.fileExplain')}
                  </Typography>

                  <FormControlLabel
                    checked={
                      this.state.providerIdentifier ===
                      VideoProvider.YOUTUBE_URL_PROVIDER
                    }
                    control={<Radio />}
                    disabled={this.state.processing}
                    label={this.props.t('video.upload.type.youtube')}
                    value={VideoProvider.YOUTUBE_URL_PROVIDER}
                  />
                  <Typography variant="caption">
                    {this.props.t('video.upload.type.youtubeExplain')}
                  </Typography>

                  <FormControlLabel
                    checked={
                      this.state.providerIdentifier ===
                      VideoProvider.VIMEO_URL_PROVIDER
                    }
                    control={<Radio />}
                    disabled={this.state.processing}
                    label={this.props.t('video.upload.type.vimeo')}
                    value={VideoProvider.VIMEO_URL_PROVIDER}
                  />
                  <Typography variant="caption">
                    {this.props.t('video.upload.type.vimeoExplain')}
                  </Typography>

                  <FormControlLabel
                    checked={
                      this.state.providerIdentifier ===
                      VideoProvider.EBOOK_PROVIDER
                    }
                    control={<Radio />}
                    disabled={this.state.processing}
                    label={this.props.t('video.upload.type.ebook')}
                    value={VideoProvider.EBOOK_PROVIDER}
                  />
                  <Typography variant="caption">
                    {this.props.t('video.upload.type.ebookExplain')}
                  </Typography>
                </RadioGroup>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose}>
              {this.props.t('video.upload.cancel')}
            </Button>

            <Button
              className={this.props.classes.marginLeft}
              color="primary"
              disabled={this.state.processing}
              onClick={this.submitProviderIdentifier}
              variant="contained"
            >
              {this.props.t('video.upload.submit')}
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
    return (
      <Dialog open>
        <DialogTitle>
          {this.props.video.provider_identifier === VideoProvider.EBOOK_PROVIDER
            ? this.props.t('video.upload.ebookTitle')
            : this.props.t('video.upload.title')}
        </DialogTitle>
        <DialogContent>
          <div className={this.props.classes.container}>
            {this.props.video.provider_identifier ===
              VideoProvider.MUX_PROVIDER && (
              <VideoUploadFormMUX
                onClose={this.props.onClose}
                video={this.props.video}
              />
            )}
            {this.props.video.provider_identifier ===
              VideoProvider.YOUTUBE_URL_PROVIDER && (
              // @ts-expect-error
              <VideoUploadFormYoutube
                onClose={this.props.onClose}
                setExternalUrl={this.props.setExternalUrl}
                video={this.props.video}
              />
            )}
            {this.props.video.provider_identifier ===
              VideoProvider.VIMEO_URL_PROVIDER && (
              // @ts-expect-error
              <VideoUploadFormVimeo
                onClose={this.props.onClose}
                setExternalUrl={this.props.setExternalUrl}
                video={this.props.video}
              />
            )}
            {this.props.video.provider_identifier ===
              VideoProvider.EBOOK_PROVIDER && (
              <EbookUploadForm
                onClose={this.props.onClose}
                setExternalUrl={this.props.setExternalUrl}
                video={this.props.video}
              />
            )}
          </div>
        </DialogContent>
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
  // @ts-expect-error
  withStyles(styles),
)(VideoUploadDialog);
