import React, { useMemo, useCallback } from 'react';

import { useDropzone } from 'react-dropzone';

import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import { CSSProperties, createStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import { Alert } from '@material-ui/lab';

export type Props = {
  customClasses?: { [className: string]: string };
  file: File;
  disabled: boolean;
  allowPreview: boolean;
  withLoader?: boolean;
  label: string;
  subtitle?: string;
  helperText?: string;
  isFullWidth?: boolean;
  error?: string | string[];
  customStyle?: CSSProperties;
  onAddFile: (file: File) => void;
  onRemoveFile: () => void;
};

const useStyles = makeStyles((theme) =>
  createStyles({
    dropHere: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    fullWidth: {
      width: '100%',
      gap: 0,
    },
    containerWithHelperText: {
      flexDirection: 'column',
      backgroundColor: 'transparent',
    },
    helperText: {
      color: theme.palette.text.secondary,
    },
    errorMessageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      alignSelf: 'stretch',
    },
    alertError: {
      backgroundColor: 'transparent',
      color: theme.palette.error.main,
    },
  }),
);

const baseStyle: CSSProperties = {
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

const activeStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

const FileUploaderCustomized: React.FC<Props> = React.memo(
  ({
    file,
    onAddFile,
    disabled,
    onRemoveFile,
    allowPreview,
    customStyle,
    customClasses,
    label,
    subtitle,
    helperText,
    isFullWidth,
    error,
  }) => {
    const { t } = useTranslation('member');

    const classes = useStyles();

    const handleOnDrop = useCallback(
      (acceptedFiles: File[]) => {
        const _file = acceptedFiles?.[0];
        _file && onAddFile(_file);
      },
      [onAddFile],
    );

    const handleRemove = useCallback(
      (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        ev.stopPropagation();
        onRemoveFile();
      },
      [onRemoveFile],
    );

    const handleOpenWindow = useCallback(() => {
      let fileToPreview = '';
      try {
        fileToPreview = webkitURL.createObjectURL(file);
      } catch {
        fileToPreview = file.toString();
      }

      window.open(fileToPreview, '_blank');
    }, [file]);

    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      onDrop: handleOnDrop,
      disabled,
    });

    const style = useMemo(
      () => ({
        ...baseStyle,
        ...(customStyle || {}),
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
      }),
      [isDragActive, isDragReject, isDragAccept, customStyle],
    );

    const rootStyle = useMemo(
      () => getRootProps({ style }),
      [getRootProps, style],
    );

    const inputProps = useMemo(() => getInputProps(), [getInputProps]);

    return (
      <div
        className={classNames('container', {
          [classes.fullWidth]: isFullWidth,
          [classes.containerWithHelperText]: !!helperText,
        })}
      >
        <div {...rootStyle}>
          <input {...inputProps} />
          <div className={classes.dropHere}>
            <div className={classes.iconContainer}>
              {file && !error ? (
                <>
                  <IconButton
                    color="secondary"
                    disabled={!file || disabled}
                    onClick={handleRemove}
                  >
                    <DeleteIcon />
                  </IconButton>
                  {allowPreview && (
                    <IconButton
                      color="secondary"
                      disabled={!file}
                      onClick={handleOpenWindow}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  )}
                </>
              ) : (
                <FolderOutlinedIcon
                  className={customClasses?.folderIcon}
                  color="primary"
                  fontSize="large"
                />
              )}
            </div>

            {!file || error ? (
              <>
                <Typography
                  align="center"
                  className={customClasses?.title}
                  variant="body1"
                >
                  {label}
                </Typography>
                {subtitle && (
                  <Typography
                    align="center"
                    className={classes.helperText}
                    variant="body2"
                  >
                    {subtitle}
                  </Typography>
                )}
              </>
            ) : (
              <>
                <Typography align="center" color="primary" variant="body1">
                  {t('file.imported')}
                </Typography>
                <Typography align="center" variant="body1">
                  {file.name}
                </Typography>
              </>
            )}
          </div>
        </div>
        {helperText && (
          <Typography
            align="left"
            className={classes.helperText}
            variant="body2"
          >
            {helperText}
          </Typography>
        )}
        {error && (
          <div className={classes.errorMessageContainer}>
            <Alert className={classes.alertError} severity="error">
              {t(error)}
            </Alert>
          </div>
        )}
      </div>
    );
  },
);

export default FileUploaderCustomized;
