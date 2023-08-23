// @ts-nocheck
// @flow

import omit from 'lodash/omit';

import React, { Component } from 'react';

import { Field } from 'formik';
import { WithStyles, withStyles } from '@material-ui/core';
import Avatar from '../Avatar.component';
import { createUrl } from '../../utils/createUrlHandlers';
import DEFAULT_PROFILE_PICTURE_URL from '../../assets/constants';

const styles = () => ({
  input: {
    display: 'none',
  },
});

type Props = {
  onChange: () => void;
} & WithStyles<typeof styles>;

type State = {
  previewUrl: string;
};

export class AvatarField extends Component<Props, State> {
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
              {...omit(field, ['value'])}
              {...this.inputProps}
              onChange={(e) => {
                const { files } = e.target;
                if (files.length) {
                  this.setState({
                    previewUrl: createUrl(files[0]),
                  });
                  setFieldValue(field.name, files[0]);
                }
              }}
              type="file"
            />
            <label htmlFor="avatar-loader-button" style={{ cursor: 'pointer' }}>
              <Avatar
                noname
                user={{ photo: getUrl(previewUrl, field.value) }}
                variant="large"
              />
            </label>
          </div>
        )}
      </Field>
    );
  }
}

function getUrl(previewUrl, value) {
  return (
    previewUrl ||
    (typeof value === 'string' ? value : DEFAULT_PROFILE_PICTURE_URL)
  );
}

export default withStyles(styles)(AvatarField);
