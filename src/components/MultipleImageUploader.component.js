// @flow

import lodash from 'lodash';
import React from 'react';

import Dropzone from 'react-dropzone';
import classnames from 'classnames';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

type ImageFile = {
  id: ?number,
  image: ?DOMString,
  file: ?File,
};

type Props = {
  classes: *,
  initial: string,
  t: TFunction,
  onChange: (ImageFile[]) => void,
  onAddImage: (File) => void,
  name: string,
};

type State = {
  files: ImageFile[],
};

export class ImageUploader extends React.Component<Props, State> {
  state = {
    files: [],
  };

  constructor(props: Props) {
    super(props);

    if (props.initial) {
      this.state.files = props.initial;
    }
  }

  componentWillUnmount() {
    const { files } = this.state;
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
  }

  handleDrop = (acceptedFiles: Array<File>) => {
    const { files } = this.state;

    acceptedFiles.forEach((file) => {
      this.props.onAddImage(file);
    });

    const newFiles = acceptedFiles.map((file, i) => ({
      id: -lodash.sum(files.map((x) => Math.abs(x.id))) - i - 1,
      previewUrl: (window.URL ? URL : window.webkitURL).createObjectURL(file),
      file,
    }));
    const allFiles = newFiles.concat(files);
    this.setState({ files: allFiles });

    if (this.props.onChange) {
      this.props.onChange(allFiles);
    }
  };

  render() {
    const { classes, t, name } = this.props;

    return (
      <Dropzone onDrop={this.handleDrop} accept="image/*" multiple>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div className={classes.dropzone} {...getRootProps()}>
            <input {...getInputProps()} name={name} />
            <div className={classes.previews}>
              <div
                className={classnames(classes.textContainer, {
                  [classes.textContainerActive]: isDragActive,
                })}
              >
                <Typography className={classes.text}>
                  {t('common.uploadOneImage.new')}
                </Typography>
              </div>
            </div>
          </div>
        )}
      </Dropzone>
    );
  }
}

const styles = (theme) => ({
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
    backgroundColor: 'rgba(0,0,0,0.2)',
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
    minHeight: 5 * theme.spacing.unit,
    backgroundColor: '#F7F7F7',
    cursor: 'pointer',
  },
});
export default withNamespaces()(withStyles(styles)(ImageUploader));
