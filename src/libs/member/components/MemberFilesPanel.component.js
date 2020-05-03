// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import type { TFunction } from 'react-i18next';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import AddIcon from '@material-ui/icons/Add';
import { formatAsDatetime } from '../../../datetime';

type Props = {
  uploadedFiles: any,
  classes: Object,
  onDelete?: () => void,
  t: TFunction,
  openFileUploadDialog: boolean,
};
export const MemberFilesPanel = (props: Props) => {
  return (
    <div>
      <Typography component="h2" variant="h6" className={props.classes.title}>
        {props.t('file.title')}
      </Typography>
      <Divider />
      {props.uploadedFiles.length === 0 ? (
        <Typography
          variant="caption"
          color="textSecondary"
          className={props.classes.emptyMessage}
        >
          {props.t('file.nofileSaved')}
        </Typography>
      ) : (
        props.uploadedFiles.map((file) => (
          <ListItem>
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
              <IconButton
                onClick={async () => {
                  const link = document.createElement('a');
                  link.setAttribute('type', 'hidden');
                  link.href = file.file_path;
                  link.download = file.file_path.split('/').pop();
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                }}
              >
                <CloudDownloadIcon color="primary" />
              </IconButton>
              {props.onDelete ? (
                <IconButton onClick={() => props.onDelete(file.id)}>
                  <DeleteIcon />
                </IconButton>
              ) : null}
            </ListItemSecondaryAction>
          </ListItem>
        ))
      )}
      <Button
        className={props.classes.addButton}
        variant="outlined"
        color="primary"
        disabled={props.uploadedFiles.length >= 5}
        onClick={props.openFileUploadDialog}
      >
        <AddIcon className={props.classes.leftIcon} />
        {props.uploadedFiles.length >= 5
          ? props.t('file.addButtonBlocked')
          : props.t('file.add')}
      </Button>
    </div>
  );
};

const styles = (theme) => ({
  emptyMessage: {
    margin: theme.spacing.unit * 2,
    marginLeft: 0,
  },
  noteContainer: {
    paddingTop: theme.spacing.unit * 2,
  },
  addButton: {
    marginTop: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  title: {
    paddingBottom: theme.spacing.unit,
  },
});

export default withNamespaces(['member'])(withStyles(styles)(MemberFilesPanel));
