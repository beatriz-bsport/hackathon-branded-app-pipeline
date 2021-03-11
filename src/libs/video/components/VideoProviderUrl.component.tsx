import React from 'react';
import { TextField, Theme, Typography, withStyles } from '@material-ui/core';
import { compose, withProps } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { MaterialStyleType } from '../../../utils/types';

interface OwnProps {
  fowardedRef: (ref: VideoProviderUrl) => void;
}

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

interface State {
  url: string;
  error: string;
}

class VideoProviderUrl extends React.PureComponent<Props, State> {
  state: State = {
    url: '',
    error: '',
  };

  prepareBody = () => {
    if (!this.state.url) {
      this.setState({ error: this.props.t('video.upload.urlInputError') });
      return null;
    }
    return { url: this.state.url };
  };

  onChangeUrl = (url: string) => {
    this.setState((prevState: State) => {
      let { error } = prevState;
      if (prevState.error && url) {
        error = '';
      }

      return { url, error };
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
        {this.state.error && (
          <Typography color="error">{this.state.error}</Typography>
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
});

export default compose<any, OwnProps>(
  withTranslation(['video']),
  withStyles(styles),
  withProps(({ fowardedRef }) => ({ ref: fowardedRef })),
)(VideoProviderUrl);
