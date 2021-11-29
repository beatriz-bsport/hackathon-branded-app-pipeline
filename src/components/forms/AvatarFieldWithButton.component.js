// @flow
import omit from 'lodash/omit';

import React, { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';

import { Field } from 'formik';

import withStyles from '@material-ui/core/styles/withStyles';
import Chip from '@material-ui/core/Chip';
import ImageIcon from '@material-ui/icons/Image';
import Badge from '@material-ui/core/Badge';
import Avatar from '../Avatar.component';

type Props = {
  t: TFunction,
  classes: any,
  onChange: (data: any) => void,
  buttonText: string,
  required: boolean,
  disabled: boolean,
};
type State = {
  previewUrl: string,
};

export class AvatarFieldWithButton extends Component<Props, State> {
  state = { previewUrl: '' };

  render() {
    const { classes, buttonText, required, disabled } = this.props;
    const { previewUrl } = this.state;

    return (
      <Field {...this.props}>
        {({ field, form: { setFieldValue } }) => (
          <div className={classes.root}>
            <input
              accept="image/*"
              className={classes.input}
              id="avatar-loader-button"
              {...omit(field, ['value'])}
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
              required={required}
              disabled={disabled}
            />
            <label htmlFor="avatar-loader-button" style={{ cursor: 'pointer' }}>
              <Badge
                badgeContent={
                  disabled ? null : (
                    <div className={classes.chip}>
                      <Chip
                        icon={<ImageIcon />}
                        size="small"
                        label={buttonText}
                        color="secondary"
                      />
                    </div>
                  )
                }
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                className={classes.badge}
              >
                <div className={classes.avatar}>
                  <Avatar
                    user={{ photo: getUrl(previewUrl, field.value) }}
                    noname
                    variant="large"
                  />
                </div>
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
  avatar: {
    transition: 'transform .5s ease-in-out',
    transform: '.5s ease-in-out',
  },
  chip: {
    transition: 'all .5s ease-in-out',
    marginBottom: '40px',
    marginLeft: '20px',
  },
  badge: {
    '&:hover': {
      '& $avatar': {
        transform: 'scale(1.05)',
      },
    },
  },
});

const defaultUrl = require('../form/avatar-circle-blue.png');

function getUrl(previewUrl, value) {
  return previewUrl || (typeof value === 'string' ? value : defaultUrl);
}

export default withStyles(styles)(withTranslation([])(AvatarFieldWithButton));
