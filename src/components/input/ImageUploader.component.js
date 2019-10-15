// @flow

import React from 'react';

import Dropzone from 'react-dropzone';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import classnames from 'classnames';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import { styles as baseStyles } from './uploader.styles';

type Props = {
  classes: *,
  initial: string,
  onChange: (*) => void,
  t: TFunction,
  name: string,
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

  handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      this.setState({
        // eslint-disable-next-line
        previewURL: (window.URL ? URL : webkitURL).createObjectURL(file),
      });

      if (this.props.onChange) {
        this.props.onChange(file);
      }
    }
  };

  render() {
    const { classes, t, name } = this.props;
    const { previewURL } = this.state;

    return (
      <Dropzone onDrop={this.handleDrop} accept="image/*">
        {({ getRootProps, getInputProps, isDragActive }) => {
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
              <div
                className={classnames(classes.textContainer, {
                  [classes.textContainerActive]: isDragActive,
                })}
              >
                <Typography className={classes.text}>
                  {t(`common.uploadOneImage.${previewURL ? 'edit' : 'new'}`)}
                </Typography>
              </div>
            </div>
          );
        }}
      </Dropzone>
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
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  textContainer: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  textContainerActive: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  text: {
    top: '50%',
    left: '50%',
    color: 'white',
    position: 'absolute',
    textAlign: 'center',
    transform: 'translate(-50%, -50%)',
  },
  dropzone: {
    width: '100%',
    position: 'relative',
    minHeight: 20 * theme.spacing.unit,
    backgroundColor: '#F7F7F7',
    cursor: 'pointer',
  },
});

export default withNamespaces()(withStyles(styles)(ImageUploader));
