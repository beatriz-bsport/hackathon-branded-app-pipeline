// @ts-nocheck
import React from 'react';
import Button from '@material-ui/core/Button';
import {
  CircularProgress,
  TextField,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import { compose, withProps } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import getVideoId from 'get-video-id';

import { MaterialStyleType } from '../../../utils/types';
import NumericInput from '../../../components/input/NumericInput.component';
import { Video } from '../types';
import { OptionCallback } from '../../../state/types';

interface OwnProps {
  fowardedRef: (ref: VideoProviderUrl) => void;
  onClose: () => void;
  video: Video;
  setExternalUrl: (
    videoId: number,
    data: any,
    options?: OptionCallback,
  ) => void;
}

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

interface State {
  url: string;
  urlError: string;
  durationError: string;
  minutes: number;
  hours: number;
  isUploading: boolean;
}

class VideoProviderUrl extends React.PureComponent<Props, State> {
  state: State = {
    url: '',
    urlError: '',
    durationError: '',
    minutes: 0,
    hours: 0,
    isUploading: false,
  };

  submit = () => {
    const hasDuration = this.state.minutes + this.state.hours > 0;

    const hasUrl = !!this.state.url;

    const { id } = getVideoId(this.state.url);

    if (!hasUrl || !hasDuration || !id) {
      this.setState({
        urlError:
          !hasUrl || !id ? this.props.t('video.upload.urlInputError') : '',
        durationError: !hasDuration
          ? this.props.t('video.upload.durationInputError')
          : '',
      });

      return;
    }

    this.setState({ isUploading: true });

    const duration_second = this.state.minutes * 60 + this.state.hours * 3600;
    this.props.setExternalUrl(
      this.props.video.id,
      {
        url: this.state.url,
        duration_second,
      },
      {
        onSuccess: () => {
          this.props.onClose();
          this.setState({ isUploading: false });
        },
      },
    );
  };

  onChangeUrl = (url: string) => {
    this.setState((prevState: State) => {
      let { urlError } = prevState;
      if (prevState.urlError && url) {
        urlError = '';
      }

      return { url, urlError };
    });
  };

  onChangeDuration = (key: 'minutes' | 'hours', value: string) => {
    // @ts-expect-error
    this.setState((prevState: State) => {
      let { durationError } = prevState;

      if (prevState.durationError && prevState.hours + prevState.minutes > 1) {
        durationError = '';
      }

      return {
        [key]: parseInt(value),
        durationError,
      };
    });
  };

  render() {
    const { classes, t } = this.props;

    return (
      <div className={classes.container}>
        <TextField
          className={classes.urlInput}
          label={t('video.upload.youtubeUrlInput')}
          onChange={(ev) => this.onChangeUrl(ev.target.value)}
          placeholder={t('')}
          value={this.state.url}
          variant="outlined"
        />

        {this.state.urlError && (
          <Typography
            className={classes.marginTop}
            color="error"
            variant="caption"
          >
            {this.state.urlError}
          </Typography>
        )}

        <Typography className={classes.durationLabel}>
          {t('video.upload.durationLabel')}
        </Typography>

        <div className={classes.durationWrapper}>
          <NumericInput
            fullWidth
            InputProps={{
              inputProps: { step: 1, min: 0 },
            }}
            label={t('video.upload.hours')}
            onChange={(ev: any) =>
              this.onChangeDuration('hours', ev.target.value)
            }
            value={this.state.hours}
          />
          <NumericInput
            fullWidth
            classes={{ textInput: classes.marginLeft }}
            InputProps={{
              inputProps: { step: 1, min: 0 },
            }}
            label={t('video.upload.minutes')}
            onChange={(ev: any) =>
              this.onChangeDuration('minutes', ev.target.value)
            }
            value={this.state.minutes}
          />
        </div>
        {this.state.durationError && (
          <Typography
            className={classes.marginTop}
            color="error"
            variant="caption"
          >
            {this.state.durationError}
          </Typography>
        )}
        <div className={classes.row}>
          <Button
            disabled={this.state.isUploading}
            onClick={this.props.onClose}
          >
            {this.props.t('video.upload.cancel')}
          </Button>

          {this.state.isUploading ? (
            <CircularProgress className={classes.marginLeft} />
          ) : (
            <Button
              className={this.props.classes.marginLeft}
              color="primary"
              disabled={this.state.isUploading}
              onClick={this.submit}
              variant="contained"
            >
              {this.props.t('video.upload.submit')}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
  },
  urlInput: {
    width: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
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
  marginLeft: {
    marginLeft: theme.spacing(2),
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  withTranslation(['video']),
  withStyles(styles),
  withProps(({ fowardedRef }) => ({ ref: fowardedRef })),
)(VideoProviderUrl);
