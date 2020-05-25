// @flow

import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
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

  render() {
    const { onCancel, onSubmit, open, t, fileUploader, classes } = this.props;
    return (
      <Dialog open={open} scroll="paper">
        <DialogTitle>{t('file.upload_file')}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              onSubmit(this.state.file, this.state.name);
              onCancel();
              this.setState({ name: null, file: null });
            }}
          >
            <TextField
              name="File name"
              label={t('file.name')}
              fullWidth
              required
              placeholder={t('file.name')}
              value={this.state.name}
              onChange={(e) => this.setState({ name: e.target.value })}
            />
            <div className={classes.fieldSeparator} />
            <FileUploader
              onAddFile={(file) => this.setState({ file })}
              onRemoveFile={fileUploader.onRemoveFile}
              file={this.state.file}
            />
            <div className={classes.fieldSeparator} />
            <DialogActions>
              <Button
                onClick={() => {
                  onCancel();
                  this.setState({ name: null, file: null });
                }}
              >
                {t('file.cancel')}
              </Button>
              <Button
                variant="outlined"
                disabled={this.state.file === null || this.state.name === null}
                type="submit"
                color="primary"
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
