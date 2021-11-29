// @flow

import React from 'react';

import Dropzone from 'react-dropzone';
import classnames from 'classnames';

import { withTranslation, TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

type Props = {
  classes: any,
  t: TFunction,
  onChange: (image: ImageFile[]) => void,
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
      <Typography className={classes.typography} variant="body1" align="center">
        {file.name}
      </Typography>
      <Typography variant="body1" align="center">
        {t('file.imported')}
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
                {t('file.drop_file')}
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
    marginBottom: theme.spacing(2),
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
    minHeight: 10 * theme.spacing(1),
    backgroundColor: '#F7F7F7',
    cursor: 'pointer',
  },
});
export default withTranslation(['member'])(withStyles(styles)(FileUploader));
