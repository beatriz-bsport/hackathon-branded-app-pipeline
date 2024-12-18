// @flow

import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';

import TextField from '@material-ui/core/TextField';
import FileUploader from './FileUploader';

type Props = {
  open: boolean,
  onCancel: () => void,
  onSubmit: () => void,
  t: TFunction,
  classes: Object,
  fileUploader: any,
};

type State = {
  name: string,
  file: File,
};

export class FileUploadDialog extends Component<Props, State> {
  state = {
    name: null,
    file: null,
  };

  handleOnSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.file, this.state.name);
    this.props.onCancel();
    this.setState({ name: null, file: null });
  };

  handleOnChange = (event) => this.setState({ name: event.target.value });

  handleAddFile = (file) => this.setState({ file });

  handleCancel = () => {
    this.props.onCancel();
    this.setState({ name: null, file: null });
  };

  render() {
    const { open, t, fileUploader, classes } = this.props;

    return (
      <Dialog open={open} scroll="paper">
        <DialogTitle>{t('file.upload_file')}</DialogTitle>
        <DialogContent>
          <form onSubmit={this.handleOnSubmit}>
            <TextField
              fullWidth
              required
              label={t('file.name')}
              name="File name"
              onChange={this.handleOnChange}
              placeholder={t('file.name')}
              value={this.state.name}
            />
            <div className={classes.fieldSeparator} />
            <FileUploader
              file={this.state.file}
              onAddFile={this.handleAddFile}
              onRemoveFile={fileUploader.onRemoveFile}
            />
            <div className={classes.fieldSeparator} />
            <DialogActions>
              <Button onClick={this.handleCancel}>{t('file.cancel')}</Button>
              <Button
                color="primary"
                disabled={this.state.file === null || this.state.name === null}
                type="submit"
                variant="outlined"
              >
                {t('file.submit')}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  fieldSeparator: {
    marginBottom: theme.spacing(3),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['member']),
)(FileUploadDialog);
