// @flow

import lodash from 'lodash';

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';

import { Field } from 'formik';

import withStyles from '@material-ui/core/styles/withStyles';

const styles = () => ({
  input: {
    display: 'none',
  },
});

type Props = {
  t: TFunction,
  classes: *,
  onChange: (*) => void,
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
              id="avatar-loader-button"
              {...lodash.omit(field, ['value'])}
              {...this.inputProps}
              onChange={(e) => {
                const { files } = e.target;
                this.setState({
                  previewUrl: (window.URL
                    ? URL
                    : window.webkitURL
                  ).createObjectURL(files[0]),
                });
                setFieldValue(field.name, files[0]);
              }}
              type="file"
            />
            <label htmlFor="avatar-loader-button" style={{ cursor: 'pointer' }}>
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
                  <Icon style={{ width: 140, height: 140 }}>
                    <InsertPhotoIcon style={{ width: 140, height: 140 }} />
                  </Icon>
                )}
              </Grid>
            </label>
          </div>
        )}
      </Field>
    );
  }
}
function getUrl(previewUrl, value) {
  return previewUrl || (typeof value === 'string' ? value : null);
}

export default withStyles(styles)(withNamespaces([])(ImageField));
