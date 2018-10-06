// @flow

import React from 'react';

import { withStyles } from '@material-ui/core';

const styles = () => ({
  input: {
    display: 'none',
  },
});

type Props = {
  classes: *,
  children: React.Node,
  initial: string,
  onChange: (*) => void,
};
type State = {
  photo: *,
  previewURL: string | *,
};

export class ImageUploader extends React.Component<Props, State> {
  state = {
    previewURL: '',
  };

  constructor(props) {
    super(props);

    if (props.initial) {
      this.state.previewURL = props.initial;
    }
  }

  componentWillUnmount() {
    const { previewURL } = this.state;
    if (previewURL && typeof previewURL !== 'string') {
      URL.revokeObjectURL(previewURL);
    }
  }

  handleUpload = (event) => {
    const { files } = event.target;
    if (files.length) {
      const file = files[0];
      this.setState({
        previewURL: URL.createObjectURL(file),
      });

      if (this.props.onChange) {
        this.props.onChange(file);
      }
    }
  };

  render() {
    const { classes, children } = this.props;
    const { previewURL } = this.state;

    return (
      <div>
        <input
          accept="image/*"
          className={classes.input}
          id="image-uploader"
          type="file"
          onChange={this.handleUpload}
        />
        <label htmlFor="image-uploader" style={{ cursor: 'pointer' }}>
          {React.cloneElement(children, { previewURL })}
        </label>
      </div>
    );
  }
}

export default withStyles(styles)(ImageUploader);
