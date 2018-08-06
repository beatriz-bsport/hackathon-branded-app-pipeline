import React, { Component } from 'react';

import { IconButton, withStyles, Input } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Avatar } from '../components';

const styles = (theme) => ({
  input: {
    display: 'none',
  },
});

type Props = {};

export class AvatarUploader extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      photo: null,
    };
  }

  onChange = (event) => {
    if (event.target.files.length) {
      const oldphoto = this.state.photo;
      debugger;
      this.setState({ photo: event.target.files[0] });
    }
  };
  render() {
    const { classes, t } = this.props;
    const { photo } = this.state;

    let photoURL =
      'https://ssl.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png';
    if (photo) {
      let photoURL = URL.createObjectURL(photo);
    }
    // const reader = new FileReader();
    // const photo = reader.readAsDataURL(value);
    return (
      <div>
        <Input
          accept="image/*"
          className={classes.input}
          id="avatar-loader-button"
          type="file"
          onChange={this.onChange}
        />
        <label htmlFor="avatar-loader-button">
          <IconButton
            variant="raised"
            component="span"
            className={classes.button}
          >
            <Avatar user={{ photo: photoURL }} noname variant="large" />
          </IconButton>
        </label>
      </div>
    );
  }
}

export default withStyles(styles)(translate()(AvatarUploader));
