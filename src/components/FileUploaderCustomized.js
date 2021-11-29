// @flow

import React, { useMemo } from 'react';

import { useDropzone } from 'react-dropzone';

import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import { withTranslation, TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';

type Props = {
  classes: any,
  t: TFunction,
  onChange: (images: ImageFile[]) => void,
  onAddFile: (File) => void,
  name: string,
  file: File,
  onRemoveFile: () => void,
  disabled: boolean,
  allowPreview: boolean,
};

const baseStyle = () => {
  return {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  };
};

const activeStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

function StyledDropzone(props: Props) {
  const { t, classes, file } = props;
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop: (acceptedFiles: Array<File>) => {
      const _file = acceptedFiles[0];
      props.onAddFile(_file);
    },
    disabled: props.disabled,
  });

  const style = useMemo(
    () => ({
      ...baseStyle(),
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept],
  );

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <div className={classes.dropHere}>
          <div className={classes.iconContainer}>
            {file ? (
              <>
                <IconButton
                  color="secondary"
                  disabled={!props.file || props.disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onRemoveFile();
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                {props.allowPreview && (
                  <IconButton
                    color="secondary"
                    disabled={!props.file}
                    onClick={() => {
                      window.open(file);
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                )}
              </>
            ) : (
              <FolderOutlinedIcon size="large" color="primary" />
            )}
          </div>

          {!file ? (
            <Typography
              className={classes.typography}
              variant="body1"
              align="center"
            >
              {t('file.drop_file')}
            </Typography>
          ) : (
            <>
              <Typography
                className={classes.typography}
                variant="body1"
                align="center"
                color="primary"
              >
                {t('file.imported')}
              </Typography>
              <Typography
                className={classes.typography}
                variant="body1"
                align="center"
              >
                {file.name}
              </Typography>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = () => ({
  dropHere: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
  },
});
export default withTranslation(['member'])(withStyles(styles)(StyledDropzone));
