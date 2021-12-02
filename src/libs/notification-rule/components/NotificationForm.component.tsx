// @flow

import React from 'react';
import { withFormik, Form } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

import DialogTitle from '@material-ui/core/DialogTitle';

import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';

import { Actions, Submit, TextField } from '../../../components/forms';
import NotificationContentInput from '../../communication/components/NotificationContentInput.component';
import { MAX_LENGTH_PUSH_TITLE } from '../../communication/constant';

type Props = {
  onCancel: () => void;
  initial: any;
  values: any;
  errors: any;
  isSubmitting: boolean;
  onSubmit: (data: {
    push_notification_title: string;
    push_notification_content: string;
  }) => void;
  tags: {
    label: string;
    options: { label: string; value: string }[];
  }[];
};

const NotificationForm = (props: Omit<Props, 'initial' | 'onSubmit'>) => {
  const { values, errors, isSubmitting, tags, onCancel } = props;
  const { t } = useTranslation(['paymentPack']);
  const classes = useStyles();
  const { notificationContent, notificationTitle } = values;

  return (
    <Dialog open>
      <DialogTitle>{t('notificationForm')}</DialogTitle>
      <div className={classes.dialogContainer}>
        <Form>
          <div className={classes.fieldContainer}>
            <Typography
              variant="subtitle2"
              className={classNames([classes.spacingTop], {
                [classes.errorText]:
                  errors.notificationTitle || errors.notificationContent,
              })}
            >
              {t('paymentPack:notification.form.pushTitle')}
            </Typography>
            <TextField
              label={t('communication:mail.titleNotification')}
              name="notificationTitle"
              fullWidth
              inputProps={{ maxLength: MAX_LENGTH_PUSH_TITLE }}
              className={classes.notificationInput}
            />
            <Typography variant="caption">
              {`${notificationTitle?.length ?? 0}/${MAX_LENGTH_PUSH_TITLE}`}
            </Typography>
            <NotificationContentInput
              label={t('communication:mail.contentNotification')}
              name="notificationContent"
              className={classes.notificationInput}
              value={notificationContent}
              tags={tags}
            />
          </div>
          <Actions>
            <Button onClick={onCancel} disabled={isSubmitting}>
              {t('booking:notification.form.cancel')}
            </Button>
            <Submit
              color="primary"
              disabled={
                !!errors.notificationTitle || !!errors.notificationContent
              }
            >
              {t('booking:notification.form.submit')}
            </Submit>
          </Actions>
        </Form>
      </div>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogContainer: {
    padding: theme.spacing(1),
    minWidth: '500px',
  },
  fieldContainer: {
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  errorText: {
    color: 'red',
  },
  notificationInput: {
    marginTop: theme.spacing(2),
  },
}));

const PaymentPackNotificationSchema = Yup.object().shape({
  notificationContent: Yup.string().required(),
  notificationTitle: Yup.string().required(),
});

export default compose<any, Props>(
  withFormik({
    mapPropsToValues: ({ initial }) => {
      if (initial) {
        const { push_notification_title, push_notification_content } = initial;

        return {
          notificationContent: push_notification_content,
          notificationTitle: push_notification_title,
        };
      }
      const values = {
        notificationContent: '',
        notificationTitle: '',
      };
      return values;
    },
    validationSchema: PaymentPackNotificationSchema,
    handleSubmit: (values, { props: { onSubmit } }) => {
      const data = {
        push_notification_title: values.notificationTitle,
        push_notification_content: values.notificationContent,
      };

      onSubmit(data);
    },
  }),
)(NotificationForm);
