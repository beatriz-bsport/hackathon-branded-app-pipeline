// @flow

import lodash from 'lodash';

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { Field } from 'formik';

import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '../Avatar.component';

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
              <Avatar
                user={{ photo: getUrl(previewUrl, field.value) }}
                noname
                variant="large"
              />
            </label>
          </div>
        )}
      </Field>
    );
  }
}
const defaultUrl =
  'https://ssl.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png';

function getUrl(previewUrl, value) {
  return previewUrl || (typeof value === 'string' ? value : defaultUrl);
}

export default withStyles(styles)(withNamespaces([])(AvatarField));
