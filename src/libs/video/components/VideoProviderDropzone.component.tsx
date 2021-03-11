import { Theme, Typography, withStyles } from '@material-ui/core';
import React from 'react';
import Dropzone from 'react-dropzone';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose, withProps } from 'recompose';
import { MaterialStyleType } from '../../../utils/types';

interface OwnProps {
  fowardedRef: (ref: VideoProviderDropzone) => void;
}

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

interface State {
  file: any;
}

class VideoProviderDropzone extends React.PureComponent<Props> {
  state: State = {
    file: null,
  };

  onDropAccepted = async (files: Array<File>) => {
    if (files.length === 1) {
      /* eslint-disable-next-line */
      this.setState({ file: files[0] });
    }
  };

  prepareBody = (params: { fields: any; bodyType: string }) => {
    const { bodyType } = params;
    let { fields } = params;

    if (!this.state.file) {
      return null;
    }

    if (!fields) {
      fields = {};
    }

    if (bodyType === 'binary') {
      return this.state.file;
    }
    if (bodyType === 'formData') {
      const formData = new FormData();
      for (const field of Object.keys(fields)) {
        formData.append(field, fields[field]);
      }
      formData.append('file', this.state.file);
      return formData;
    }
    return this.state.file;
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.dropZoneContainer}>
          <Dropzone
            multiple={false}
            accept="video/*"
            onDropAccepted={this.onDropAccepted}
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

                  <Typography variant="caption" color="textSecondary">
                    mp4, mov, avi, mkv, etc...
                  </Typography>
                </div>
              );
            }}
          </Dropzone>
        </div>
        {this.state.file && (
          <Typography
            variant="subtitle2"
            className={this.props.classes.fileName}
          >
            {this.state.file.name}
          </Typography>
        )}
      </div>
    );
  }
}

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

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
  },
  dropZoneContainer: {
    width: '100%',
  },
  fileName: {
    marginTop: theme.spacing(4),
    textAlign: 'center',
  },
});

export default compose<any, OwnProps>(
  withTranslation(['video']),
  withStyles(styles),
  withProps(({ fowardedRef }) => ({ ref: fowardedRef })),
)(VideoProviderDropzone);
