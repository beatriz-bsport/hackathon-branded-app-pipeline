import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  withStyles,
} from '@material-ui/core';
import * as Yup from 'yup';
import { Form, withFormik } from 'formik';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';

import { Submit } from '../../../components/forms';
import ImageFieldInput from '../../../components/forms/ImageFieldInput';
import { MaterialStyleType } from '../../../utils/types';
import { OptionCallback } from '../../../state/types';

interface OwnProps {
  open: boolean;
  initial?: {
    spot_free: string;
    spot_taken: string;
  };
  onSubmit: (
    images: { spot_free: any; spot_taken: any },
    options: OptionCallback,
  ) => void;
  onClose: () => void;
}

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

class SpotImageUploadDialog extends React.PureComponent<Props> {
  render() {
    const { t, classes } = this.props;

    return (
      <Dialog open={this.props.open}>
        <Form>
          <DialogTitle>{t('spotImageDialog.title')}</DialogTitle>
          <DialogContent>
            <Typography>{t('spotImageDialog.helper')}</Typography>

            <div className={classes.spotExampleContainer}>
              <div className={classes.spotImageContainer}>
                <svg
                  width="73"
                  height="73"
                  viewBox="0 0 73 73"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="36.5"
                    cy="36.5"
                    r="35.5"
                    stroke="black"
                    strokeWidth="2"
                  />
                </svg>
                <Typography>{t('spotImageDialog.free')}</Typography>
              </div>
              <div className={classes.spotImageContainer}>
                <svg
                  width="73"
                  height="73"
                  viewBox="0 0 73 73"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="36.5"
                    cy="36.5"
                    r="35.5"
                    stroke="darkgrey"
                    fill="lightgrey"
                    strokeWidth="2"
                  />
                </svg>
                <Typography>{t('spotImageDialog.taken')}</Typography>
              </div>
            </div>

            <div className={classes.inputsContainer}>
              <ImageFieldInput name="spot_free" id="free-spot-image-input">
                <div className={classes.input}>
                  <Typography>{t('spotImageDialog.freeImageLabel')}</Typography>

                  <Typography className={classes.inputFakeButton}>
                    {t('spotImageDialog.imageUploadButton')}
                  </Typography>

                  {this.props.values.spot_free && (
                    <Typography className={classes.imageName}>
                      {this.props.values.spot_free.name}
                    </Typography>
                  )}
                </div>
              </ImageFieldInput>

              <div className={classes.marginTop} />

              <ImageFieldInput name="spot_taken" id="taken-spot-image-input">
                <div className={classes.input}>
                  <Typography>
                    {t('spotImageDialog.takenImageLabel')}
                  </Typography>

                  <Typography className={classes.inputFakeButton}>
                    {t('spotImageDialog.imageUploadButton')}
                  </Typography>

                  {this.props.values.spot_taken && (
                    <Typography className={classes.imageName}>
                      {this.props.values.spot_taken.name}
                    </Typography>
                  )}
                </div>
              </ImageFieldInput>
            </div>

            <Typography
              className={classes.marginTop}
              variant="body1"
              color="textSecondary"
            >
              {t('spotImageDialog.imageFormat')}
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button
              disabled={this.props.isSubmitting}
              onClick={this.props.onClose}
            >
              {t('spotImageDialog.actions.cancel')}
            </Button>

            <Submit disabled={this.props.isSubmitting}>
              {t('spotImageDialog.actions.submit')}
            </Submit>
          </DialogActions>
        </Form>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  content: {
    minWidth: 700,
    maxWidth: '100%',
  },
  spotExampleContainer: {
    display: 'flex',
    flex: 1,
    marginTop: theme.spacing(4),
  },
  spotImageContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(4),
  },
  input: {
    display: 'flex',
  },
  inputFakeButton: {
    backgroundColor: '#EEE',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
    borderColor: '#CCC',
    color: '#CCC',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  imageName: {
    marginLeft: theme.spacing(1),
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
});

export const SpotImageSchema = Yup.object().shape({
  spot_free: Yup.mixed().required(),
  spot_taken: Yup.mixed().required(),
});

export const SpotImageFormHOC = withFormik({
  mapPropsToValues: (props: OwnProps) => {
    if (props.initial) {
      return {
        ...props.initial,
      };
    }
    return {
      spot_free: '',
      spot_taken: '',
    };
  },
  validationSchema: SpotImageSchema,
  handleSubmit: (values, { props, setSubmitting }) => {
    const { spot_free, spot_taken } = values;
    const { onSubmit } = props;

    const data = {
      spot_free,
      spot_taken,
    };

    onSubmit(data, {
      onSuccess: () => {
        setSubmitting(false);
      },
      onError: () => {
        setSubmitting(false);
      },
    });
  },
});

export default compose<any, OwnProps>(
  withTranslation(['spotScheduling']),
  withStyles(styles),
  SpotImageFormHOC,
)(SpotImageUploadDialog);
