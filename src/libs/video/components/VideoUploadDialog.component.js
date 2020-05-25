import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import { compose, withState } from 'recompose';
// import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';

import Dropzone from 'react-dropzone';

import { getUploadInstruction as getUploadInstructionAPI } from '../api';

const baseStyle = {
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
  color: '#777777',
  outline: 'none',
  '&:hover': {
    borderColor: '#00e676',
    color: 'red',
    backgroundColor: 'red',
    borderStyle: 'solid',
  },
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

export class VideoUploadDialog extends React.Component<Props> {
  state = {
    progress: 0,
    isUploading: false,
  };

  updateProgressStatus = (evt) => {
    if (evt.lengthComputable) {
      this.setState({ progress: Math.round((evt.loaded / evt.total) * 100) });
    }
  };

  onComplete = () => {
    setTimeout(() => {
      this.setState({ isUploading: false, progress: 0 });
      this.props.onSubmit();
    }, 5000);
  };

  prepareRequest = (method, url) => {
    const xhrObj = new XMLHttpRequest();
    // xhrObj.upload.addEventListener("loadstart", this.requestStart, false);
    xhrObj.upload.addEventListener(
      'progress',
      this.updateProgressStatus,
      false,
    );
    xhrObj.upload.addEventListener('load', this.onComplete, false);
    xhrObj.open(method, url);
    // xhrObj.setRequestHeader("Content-type", file.type);
    // xhrObj.setRequestHeader("X_FILE_NAME", file.name);
    return xhrObj;
  };

  prepareBody = (file, fields = {}, bodyType) => {
    if (bodyType === 'binary') {
      return file;
    }
    if (bodyType === 'formData') {
      const formData = new FormData();
      for (const field of Object.keys(fields)) {
        formData.append(field, fields[field]);
      }
      formData.append('file', file);
      return formData;
    }
    return file;
  };

  uploadFile = async (files: Array<File>) => {
    if (files.length !== 1) {
      return;
    }
    this.setState({ isUploading: true });
    try {
      const { data } = await getUploadInstructionAPI(this.props.video.id);
      const { method, fields, url, bodyType } = data;
      /*
      let axiosMethod = null;
      if (method.toUpperCase() === 'POST') {
        axiosMethod = axios.post;
      }
      if (method.toUpperCase() === 'PUT') {
        axiosMethod = axios.put;
      }
      */

      const body = this.prepareBody(files[0], fields, bodyType);
      const request = this.prepareRequest(method, url);

      request.send(body);
      /*
      const response = fetch(url, {
        method,
        body,
        headers: {
          'Content-type': files[0].type,
        },
      });
      */
    } catch (err) {
      console.error(err);
      this.setState({ isUploading: false });
    }
  };

  render() {
    return (
      <Dialog open>
        <DialogTitle>{this.props.t('video.upload.title')}</DialogTitle>
        <DialogContent>
          <Dropzone
            multiple={false}
            accept="video/*"
            onDropAccepted={(acceptedFiles) => this.uploadFile(acceptedFiles)}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject,
            }) => {
              const styles = {
                ...baseStyle,
                ...(isDragActive ? activeStyle : {}),
                ...(isDragAccept ? acceptStyle : {}),
                ...(isDragReject ? rejectStyle : {}),
              };
              return (
                <div style={styles} {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>{this.props.t('video.upload.content')}</p>
                </div>
              );
            }}
          </Dropzone>
          {this.state.isUploading && (
            <LinearProgress variant="determinate" value={this.state.progress} />
          )}
        </DialogContent>
        <DialogActions>
          {this.state.isUploading ? (
            <CircularProgress />
          ) : (
            <Button onClick={this.props.onClose}>
              {this.props.t('video.upload.cancel')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

export default compose(withTranslation(['video']))(VideoUploadDialog);
