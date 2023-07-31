// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles, Theme } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import AddIcon from '@material-ui/icons/Add';
import { formatAsDatetime } from '../../../utils/datetime';
import { MemberUploadedFile } from '../types';

const MAX_FILES_UPLOADED = 5;

type Props = {
  uploadedFiles: MemberUploadedFile[];
  updateVisibility: (file: MemberUploadedFile) => () => void;
  onDelete?: (id: number) => void;
  openFileUploadDialog: () => void;
};

export const MemberFilesPanel = (props: Props) => {
  const { uploadedFiles, onDelete, updateVisibility, openFileUploadDialog } =
    props;

  const { t } = useTranslation('member');
  const classes = useStyles();

  const handleDownload = (file: MemberUploadedFile) => async () => {
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = file.file_path;
    link.download = file.file_path.split('/').pop();
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDelete = (id: number) => () => {
    onDelete && onDelete(id);
  };

  const hasTooManyFilesUploaded = uploadedFiles.length >= MAX_FILES_UPLOADED;

  return (
    <div>
      <Typography component="h2" variant="h6" className={classes.title}>
        {t('file.title')}
      </Typography>
      <Divider />
      {uploadedFiles.length === 0 && (
        <div className={classes.emptyMessage}>
          <Typography variant="caption" color="textSecondary">
            {t('file.nofileSaved')}
          </Typography>
        </div>
      )}
      {uploadedFiles.map((file) => (
        <ListItem key={file.id}>
          <ListItemText
            primary={file.name}
            secondary={
              <React.Fragment>
                <div>{file.file_path.split('/').pop()}</div>
                <div>{formatAsDatetime(file.updated_at)} </div>
              </React.Fragment>
            }
          />
          <ListItemSecondaryAction>
            <IconButton onClick={updateVisibility(file)}>
              {file.coach_has_access && <VisibilityIcon color="secondary" />}
              {!file.coach_has_access && <VisibilityOffIcon />}
            </IconButton>
            <IconButton onClick={handleDownload(file)}>
              <CloudDownloadIcon color="primary" />
            </IconButton>
            {onDelete && (
              <IconButton onClick={handleDelete(file.id)}>
                <DeleteIcon />
              </IconButton>
            )}
          </ListItemSecondaryAction>
        </ListItem>
      ))}
      <Button
        className={classes.addButton}
        variant="outlined"
        color="primary"
        disabled={hasTooManyFilesUploaded}
        onClick={openFileUploadDialog}
      >
        <AddIcon className={classes.leftIcon} />
        {t(hasTooManyFilesUploaded ? 'file.addButtonBlocked' : 'file.add')}
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  emptyMessage: {
    margin: theme.spacing(2),
    marginLeft: 0,
  },
  noteContainer: {
    paddingTop: theme.spacing(2),
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
}));

export default MemberFilesPanel;
