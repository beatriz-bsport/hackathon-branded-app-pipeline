// @flow

import lodash from 'lodash';

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { Field, ErrorMessage } from 'formik';

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
  },
  alertError: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.error.dark,
  },
});

type Props = {
  t: TFunction,
  classes: any,
  onChange: () => void,
  id: number,
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
          <div>
            <input
              accept="image/*"
              className={classes.input}
              id={this.props.id || 'avatar-loader-button'}
              {...lodash.omit(field, ['value'])}
              {...this.inputProps}
              onChange={(e) => {
                const { files } = e.target;
                this.setState({
                  // eslint-disable-next-line
                  previewUrl: (window.URL
                    ? window.URL
                    : window.webkitURL
                  ).createObjectURL(files[0]),
                });
                setFieldValue(field.name, files[0]);
              }}
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
                style={{ width: '100%' }}
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
                  <div className={classes.emptyImageContainer}>
                    <Icon style={{ width: 140, height: 140 }}>
                      <InsertPhotoIcon
                        id={this.props.id}
                        style={{ width: 140, height: 140 }}
                      />
                    </Icon>
                    <Typography
                      variant="caption"
                      style={field?.required ? { color: 'red' } : null}
                      className={classes.text}
                    >
                      {this.props.t('common.uploadOneImage.new')}
                    </Typography>
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
      </Field>
    );
  }
}

function getUrl(previewUrl, value) {
  return previewUrl || (typeof value === 'string' ? value : null);
}

export default withStyles(styles)(withTranslation([])(ImageField));
