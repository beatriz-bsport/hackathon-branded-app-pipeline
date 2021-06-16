// @flow
import lodash from 'lodash';

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { Field } from 'formik';

import withStyles from '@material-ui/core/styles/withStyles';
import Chip from '@material-ui/core/Chip';
import ImageIcon from '@material-ui/icons/Image';
import Badge from '@material-ui/core/Badge';
import Avatar from '../Avatar.component';

type Props = {
  t: TFunction,
  classes: *,
  onChange: (*) => void,
  buttonText: string,
};
type State = {
  previewUrl: string,
};

export class AvatarFieldWithButton extends Component<Props, State> {
  state = { previewUrl: '' };

  render() {
    const { classes, buttonText } = this.props;
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
                  previewUrl: (window.URL || window.webkitURL).createObjectURL(
                    files[0],
                  ),
                });
                setFieldValue(field.name, files[0]);
              }}
              type="file"
            />
            <label htmlFor="avatar-loader-button" style={{ cursor: 'pointer' }}>
              <Badge
                badgeContent={
                  <div style={{ marginBottom: 40, marginLeft: 20 }}>
                    <Chip
                      icon={<ImageIcon />}
                      size="small"
                      label={buttonText}
                      color="secondary"
                    />
                  </div>
                }
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              >
                <Avatar
                  user={{ photo: getUrl(previewUrl, field.value) }}
                  noname
                  variant="large"
                />
              </Badge>
            </label>
          </div>
        )}
      </Field>
    );
  }
}
const styles = () => ({
  input: {
    display: 'none',
  },
});

const defaultUrl = require('../form/avatar-circle-blue.png');

function getUrl(previewUrl, value) {
  return previewUrl || (typeof value === 'string' ? value : defaultUrl);
}

export default withStyles(styles)(withTranslation([])(AvatarFieldWithButton));
