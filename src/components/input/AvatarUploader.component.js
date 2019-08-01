// @flow

import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import Avatar from '../Avatar.component';

const styles = () => ({
  input: {
    display: 'none',
  },
});

type Props = {
  classes: *,
  onChange: (*) => void,
};
type State = {
  photo: *,
  previewUrl: string,
};

export class AvatarUploader extends Component<Props, State> {
  state = {
    photo: null,
    previewUrl:
      'https://ssl.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png',
  };

  constructor(props) {
    super(props);

    if (props.initial) {
      this.state.previewUrl = props.initial;
    }
  }

  componentWillUnmount() {
    const { previewUrl } = this.state;
    if (previewUrl && typeof previewUrl !== 'string') {
      URL.revokeObjectURL(previewUrl);
    }
  }

  onChange = (event) => {
    const { files } = event.target;
    if (files.length) {
      this.setState({
        photo: files[0],
        previewUrl: (window.URL ? URL : window.webkitURL).createObjectURL(
          files[0],
        ),
      });

      if (this.props.onChange) {
        this.props.onChange(files[0]);
      }
    }
  };

  render() {
    const { classes } = this.props;
    const { previewUrl } = this.state;

    return (
      <div>
        <input
          accept="image/*"
          className={classes.input}
          id="avatar-loader-button"
          type="file"
          onChange={this.onChange}
        />
        <label htmlFor="avatar-loader-button" style={{ cursor: 'pointer' }}>
          <Avatar user={{ photo: previewUrl }} noname variant="large" />
        </label>
      </div>
    );
  }
}

export default withStyles(styles)(withNamespaces()(AvatarUploader));
