// @flow
import React, { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import { Field, ErrorMessage } from 'formik';
import Dropzone from 'react-dropzone';

import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
  input: {
    display: 'none',
  },
  emptyImageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    minWidth: 400,
    minHeight: 200,
    borderRadius: 2,
  },
  alertError: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.error.dark,
  },
  icon: {
    fill: theme.palette.primary.main,
  },
  text: {
    fontSize: 16,
  },
  subHelper: {
    paddingTop: theme.spacing(2),
  },
});

type Props = {
  t: TFunction,
  classes: any,
  onChange: () => void,
  id: number,
  children?: React.ReactChild,
  subHelper?: string,
};
type State = {
  previewUrl: string,
};

export class ImageField extends Component<Props, State> {
  state = { previewUrl: '' };

  render() {
    const { classes } = this.props;
    const { previewUrl } = this.state;

    return (
      <Field {...this.props}>
        {({ field, form: { setFieldValue } }) => (
          <Dropzone
            onDrop={(acceptedFiles) => {
              try {
                if (acceptedFiles?.length > 0) {
                  const _previewUrl = (
                    window.URL ? window.URL : window.webkitURL
                  ).createObjectURL(acceptedFiles[0]);

                  this.setState({
                    previewUrl: _previewUrl,
                  });
                  setFieldValue(field.name, acceptedFiles[0]);
                }
                // eslint-disable-next-line no-empty
              } catch (err) {}
            }}
            accept="image/*"
          >
            {({ getRootProps, getInputProps, isDragAccept }) => (
              <div {...getRootProps()}>
                <input
                  accept="image/*"
                  className={classes.input}
                  {...getInputProps()}
                  type="file"
                />
                <label
                  htmlFor={this.props.id || 'avatar-loader-button'}
                  style={{ cursor: 'pointer' }}
                >
                  <Grid
                    container
                    item
                    alignItems="center"
                    justify="center"
                    style={{
                      width: '100%',
                    }}
                  >
                    {getUrl(previewUrl, field.value) ? (
                      <img
                        alt="some-cover"
                        src={getUrl(previewUrl, field.value)}
                        style={{
                          width: '100%',
                          maxHeight: 400,
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        className={classes.emptyImageContainer}
                        style={
                          isDragAccept
                            ? {
                                borderWidth: 1,
                                borderColor: 'black',
                                borderStyle: 'dashed',
                              }
                            : {}
                        }
                      >
                        <Icon fontSize="large">
                          <FolderOpenIcon
                            id={this.props.id}
                            className={classes.icon}
                            fontSize="large"
                          />
                        </Icon>
                        <Typography
                          variant="caption"
                          style={
                            field?.required
                              ? { color: 'red' }
                              : { color: '#BDBDBD' }
                          }
                          className={classes.text}
                        >
                          {this.props.t('common.uploadOneImage.new')}
                        </Typography>
                        {this.props.subHelper && (
                          <div className={this.props.classes.subHelper}>
                            <Typography variant="caption" color="textSecondary">
                              {this.props.subHelper}
                            </Typography>
                          </div>
                        )}
                        {this.props?.children}
                      </div>
                    )}
                  </Grid>
                </label>
                <ErrorMessage {...this.props}>
                  {(message) => (
                    <Typography
                      variant="body2"
                      className={this.props.classes.alertError}
                    >
                      {this.props.t(message)}
                    </Typography>
                  )}
                </ErrorMessage>
              </div>
            )}
          </Dropzone>
        )}
      </Field>
    );
  }
}

function getUrl(previewUrl, value) {
  return previewUrl || (typeof value === 'string' ? value : null);
}

export default withStyles(styles)(withTranslation([])(ImageField));
