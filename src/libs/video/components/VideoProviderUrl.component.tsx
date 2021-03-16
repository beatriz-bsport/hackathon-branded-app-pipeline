import React from 'react';
import { TextField, Theme, Typography, withStyles } from '@material-ui/core';
import { compose, withProps } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { MaterialStyleType } from '../../../utils/types';
import NumericInput from '../../../components/input/NumericInput.component';

interface OwnProps {
  fowardedRef: (ref: VideoProviderUrl) => void;
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
}

class VideoProviderUrl extends React.PureComponent<Props, State> {
  state: State = {
    url: '',
    urlError: '',
    durationError: '',
    minutes: 0,
    hours: 0,
  };

  prepareBody = () => {
    const hasDuration = this.state.minutes + this.state.hours > 1;

    const hasUrl = !!this.state.url;

    if (!hasUrl || !hasDuration) {
      this.setState({
        urlError: !hasUrl ? this.props.t('video.upload.urlInputError') : '',
        durationError: !hasDuration
          ? this.props.t('video.upload.durationInputError')
          : '',
      });
      return null;
    }

    const duration_second = this.state.minutes * 60 + this.state.hours * 3600;

    return {
      url: this.state.url,
      duration_second,
    };
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
    // @ts-ignore
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
          variant="outlined"
          placeholder={t('')}
          label={t('video.upload.urlInputLabel')}
          value={this.state.url}
          onChange={(ev) => this.onChangeUrl(ev.target.value)}
        />

        {this.state.urlError && (
          <Typography
            className={classes.marginTop}
            variant="caption"
            color="error"
          >
            {this.state.urlError}
          </Typography>
        )}

        <Typography className={classes.durationLabel}>
          {t('video.upload.durationLabel')}
        </Typography>

        <div className={classes.durationWrapper}>
          <NumericInput
            value={this.state.hours}
            fullWidth
            label={t('video.upload.hours')}
            onChange={(ev: any) =>
              this.onChangeDuration('hours', ev.target.value)
            }
            InputProps={{
              inputProps: { step: 1, min: 0 },
            }}
          />
          <NumericInput
            classes={{ textInput: classes.marginLeft }}
            value={this.state.minutes}
            fullWidth
            label={t('video.upload.minutes')}
            onChange={(ev: any) =>
              this.onChangeDuration('minutes', ev.target.value)
            }
            InputProps={{
              inputProps: { step: 1, min: 0 },
            }}
          />
        </div>
        {this.state.durationError && (
          <Typography
            className={classes.marginTop}
            variant="caption"
            color="error"
          >
            {this.state.durationError}
          </Typography>
        )}
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
