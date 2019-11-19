// @flow

import React from 'react';

import Dropzone from 'react-dropzone';
import classnames from 'classnames';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

type Props = {
  classes: *,
  t: TFunction,
  onChange: (ImageFile[]) => void,
  onAddFile: (File) => void,
  name: string,
  file: File,
};

export function FileUploader(props: Props) {
  const handleDrop = (acceptedFiles: Array<File>) => {
    const file = acceptedFiles[0];
    props.onAddFile(file);
  };

  const { classes, t, name, file } = props;
  return file ? (
    <div>
      <Typography className={classes.typography} variant="body2" align="center">
        {file.name}
      </Typography>
      <Typography variant="body2" align="center">
        {t('member.file.imported')}
      </Typography>
    </div>
  ) : (
    <Dropzone onDrop={handleDrop}>
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
                {t('member.file.drop_file')}
              </Typography>
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
}

const styles = (theme) => ({
  typography: {
    marginBottom: theme.spacing.unit * 2,
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
    width: '500px',
    position: 'relative',
    minHeight: 10 * theme.spacing.unit,
    backgroundColor: '#F7F7F7',
    cursor: 'pointer',
  },
});
export default withNamespaces()(withStyles(styles)(FileUploader));
