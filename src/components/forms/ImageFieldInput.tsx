import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import { Field, ErrorMessage } from 'formik';

import withStyles from '@material-ui/core/styles/withStyles';
import { MaterialStyleType } from '../../utils/types';

const styles = (theme) => ({
  hide: {
    display: 'none',
  },
  alertError: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.error.dark,
  },
});

type OwnProps = {
  name: string;
  onChange: (any) => void;
  id: string;
};

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

export class ImageFieldInput extends Component<Props> {
  render() {
    return (
      <Field {...this.props}>
        {({ field, form: { setFieldValue } }) => (
          <div>
            <input
              accept="image/*"
              id={this.props.id}
              onChange={(e) => {
                const { files } = e.target;
                setFieldValue(field.name, files[0]);
              }}
              type="file"
              className={this.props.children ? this.props.classes.hide : ''}
            />

            {this.props.children && (
              <label htmlFor={this.props.id}>{this.props.children}</label>
            )}

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

export default withStyles(styles)(withTranslation([])(ImageFieldInput));
