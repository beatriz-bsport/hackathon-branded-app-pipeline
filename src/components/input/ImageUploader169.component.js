// @flow

import React from 'react';

import Dropzone from 'react-dropzone';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';

import withStyles from '@material-ui/core/styles/withStyles';

import { styles as baseStyles } from './uploader.styles';

type Props = {
  classes: *,
  initial: string,
  label: ?string,
  helperText: ?string,
  onChange: (*) => void,
  name: string,
};
type State = {
  previewURL: string | *,
};

export class ImageUploader extends React.Component<Props, State> {
  state = {
    previewURL: '',
  };

  constructor(props: Props) {
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

  handleDrop = (acceptedFiles: Array<File>) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      this.setState({
        // eslint-disable-next-line
        previewURL: URL.createObjectURL(file),
      });

      if (this.props.onChange) {
        this.props.onChange(file);
      }
    }
  };

  render() {
    const { classes, name } = this.props;
    const { previewURL } = this.state;

    return (
      <FormControl>
        <FormLabel component="legend">{this.props.label}</FormLabel>
        <div className={classes.container}>
          <Dropzone onDrop={this.handleDrop} accept="image/*">
            {({ getRootProps, getInputProps }) => {
              return (
                <div className={classes.dropzone} {...getRootProps()}>
                  <input {...getInputProps()} name={name} />
                  {previewURL ? (
                    <div className={classes.imagePreview} key={previewURL}>
                      <img
                        alt="preview"
                        src={previewURL}
                        className={classes.image}
                      />
                    </div>
                  ) : null}
                </div>
              );
            }}
          </Dropzone>
        </div>
        <FormHelperText>{this.props.helperText}</FormHelperText>
      </FormControl>
    );
  }
}

const styles = (theme) => ({
  ...baseStyles(theme),
  imagePreview: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  image: {
    height: 20 * theme.spacing.unit,
    border: '2px solid #E0E0E0',
    objectFit: 'contain',
  },
  dropzone: {
    position: 'relative',
    height: 20 * theme.spacing.unit,
    backgroundColor: '#F7F7F7',
    cursor: 'pointer',
  },
});

export default withStyles(styles)(ImageUploader);
