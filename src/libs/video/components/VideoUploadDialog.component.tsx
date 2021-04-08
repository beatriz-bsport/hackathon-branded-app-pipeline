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
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/styles';
import { withTranslation, WithTranslation } from 'react-i18next';

import VideoUploadFormMUX from './VideoUploadFormMUX.component';
import VideoUploadFormYoutube from './VideoUploadFormYoutube.component';

import { Video } from '../types';
import { MaterialStyleType } from '../../../utils/types';

type State = {
  isUploading: boolean;
  providerIdentifier: number;
};

type OwnProps = {
  onSubmit: () => void;
  video: Video;
  onClose: () => void;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

const STEP_CHOSE_PROVIDER = 0;
const STEP_FINISH = 1;

export class VideoUploadDialog extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
      providerIdentifier: props.video.provider_identifier,
      processing: false,
    };
  }

  getStep = () => {
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
                  name="provider-type"
                  disabled={
                    this.state.isUploading || this.props.video.upload_id
                  }
                  value={this.state.providerIdentifier}
                  onChange={(ev) =>
                    this.setState({
                      providerIdentifier: parseInt(ev.target.value, 10),
                    })
                  }
                >
                  <FormControlLabel
                    value={2}
                    control={<Radio />}
                    checked={this.state.providerIdentifier === 2}
                    disabled={this.state.processing}
                    label={this.props.t('video.upload.type.file')}
                  />
                  <Typography variant="caption">
                    {this.props.t('video.upload.type.fileExplain')}
                  </Typography>
                  <FormControlLabel
                    value={3}
                    control={<Radio />}
                    checked={this.state.providerIdentifier === 3}
                    label={this.props.t('video.upload.type.url')}
                    disabled={this.state.processing}
                  />
                  <Typography variant="caption">
                    {this.props.t('video.upload.type.urlExplain')}
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
              variant="contained"
              color="primary"
              onClick={this.submitProviderIdentifier}
              className={this.props.classes.marginLeft}
              disabled={this.state.processing}
            >
              {this.props.t('video.upload.submit')}
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
    return (
      <Dialog open>
        <DialogTitle>{this.props.t('video.upload.title')}</DialogTitle>
        <DialogContent>
          <div className={this.props.classes.container}>
            {this.props.video.provider_identifier === 2 && (
              <VideoUploadFormMUX
                onClose={this.props.onClose}
                video={this.props.video}
              />
            )}
            {this.props.video.provider_identifier === 3 && (
              <VideoUploadFormYoutube
                onClose={this.props.onClose}
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
  // @ts-ignore
  withStyles(styles),
)(VideoUploadDialog);
