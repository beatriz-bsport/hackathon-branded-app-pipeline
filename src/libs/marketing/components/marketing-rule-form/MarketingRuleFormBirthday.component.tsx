import React, { useEffect } from 'react';
import { withFormik, Form } from 'formik';
import * as Yup from 'yup';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';

import Button from '@material-ui/core/Button';

import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

import { Actions, Submit } from '#components/forms';
import { SmartList } from '#libs/smart-list/types';
import { ResolvedGenericTags } from '#libs/email-editor/types';
import MarketingRuleSmartlistField from '../MarketingRuleSmartlistField.component';
import MarketingRuleSendingMethodField from '../MarketingRuleSendingMethodField.component';

type Props = {
  getEmails: () => void;
  getEmailDetail: (id: number) => void;
  emailListLoading: boolean;
  emails: Array<any>;
  emailDetailLoading: boolean;
  emailDetails: Array<any>;
  onCancel: () => void;
  onSubmitIntent: () => void;
  initial: any;
  values: any;
  setFieldValue: (key: string, value: any) => void;
  errors: any;
  isSubmitting: boolean;
  tags: { [tag_name: string]: string[] };
  smartLists: Array<SmartList>;
  getSmartLists: () => void;
  goToSmartlist: () => void;
  resolvedGenericTags: ResolvedGenericTags;
};

const MarketingRuleFormBirthday = (props: Props) => {
  const {
    getEmails,
    getEmailDetail,
    emailListLoading,
    emails,
    emailDetailLoading,
    emailDetails,
    onCancel,
    onSubmitIntent,
    initial,
    values,
    setFieldValue,
    errors,
    isSubmitting,
    tags,
    resolvedGenericTags,
    smartLists,
    getSmartLists,
    goToSmartlist,
  } = props;
  const { t } = useTranslation(['paymentPack', 'notificationRule']);
  const {
    send_email,
    send_notification_push,
    notificationContent,
    notificationTitle,
    email_design,
    smartlist_exclude,
    smartlist_include,
  } = values;

  useEffect(() => {
    if (initial) getEmailDetail(initial.email_design);
    getEmails();
    getSmartLists();
  }, [initial, getEmailDetail, getEmails, getSmartLists]);

  return (
    <GenericResponsiveDrawer
      open
      onClose={onCancel}
      title={t('notificationForm')}
      subtitle={t('notificationRule:tag.Birthday.name')}
    >
      <Form>
        <MarketingRuleSmartlistField
          goToSmartList={goToSmartlist}
          smartLists={smartLists}
          smartlist_include={smartlist_include}
          smartlist_exclude={smartlist_exclude}
        />
        <MarketingRuleSendingMethodField
          send_email={send_email}
          send_notification_push={send_notification_push}
          notificationTitle={notificationTitle}
          notificationContent={notificationContent}
          errors={errors}
          emailListLoading={emailListLoading}
          emails={emails}
          email_design={email_design}
          getEmailDetail={getEmailDetail}
          emailDetailLoading={emailDetailLoading}
          emailDetails={emailDetails}
          setFieldValue={setFieldValue}
          tags={tags}
          resolvedGenericTags={resolvedGenericTags}
        />

        <Actions>
          <Button
            onClick={() => {
              onCancel();
            }}
            disabled={isSubmitting}
          >
            {t('booking:notification.form.cancel')}
          </Button>
          <Submit
            onClick={onSubmitIntent}
            color="primary"
            disabled={
              !!errors.email_design ||
              !!errors.notificationTitle ||
              !!errors.notificationContent ||
              !!errors.atLeastOneChannel
            }
          >
            {t('booking:notification.form.submit')}
          </Submit>
        </Actions>
      </Form>
    </GenericResponsiveDrawer>
  );
};

const BirthdayNotificationSchema = Yup.object().shape({
  atLeastOneChannel: Yup.boolean().when(
    ['send_notification_push', 'send_email'],
    {
      is: (push, email) => push || email,
      then: Yup.boolean().nullable(),
      otherwise: Yup.boolean().required(),
    },
  ),
  notificationContent: Yup.string().when('send_notification_push', {
    is: (value) => value,
    then: Yup.string().required(),
    otherwise: Yup.string().nullable(),
  }),
  email_design: Yup.number().when('send_email', {
    is: (value) => !!value,
    then: Yup.number().required(),
    otherwise: Yup.number().nullable(),
  }),
  smartlist_include: Yup.array().of(Yup.number()),
  smartlist_exclude: Yup.array().of(Yup.number()),
});
export default compose<any, Props>(
  withFormik({
    validateOnMount: true,
    mapPropsToValues: ({ initial }) => {
      if (initial) {
        const {
          email_design,
          push_notification_title,
          push_notification_content,
        } = initial;
        const { smartlist_include, smartlist_exclude } = initial.event_rules;
        return {
          email_design,
          send_email: !!email_design,
          send_notification_push:
            push_notification_title !== '' || push_notification_content !== '',
          notificationContent: push_notification_content,
          notificationTitle: push_notification_title,
          smartlist_include: smartlist_include || [],
          smartlist_exclude: smartlist_exclude || [],
        };
      }
      const values = {
        send_email: true,
        send_notification_push: false,
        notificationContent: '',
        notificationTitle: '',
        smartlist_include: [],
        smartlist_exclude: [],
      };
      return values;
    },
    validationSchema: BirthdayNotificationSchema,
    handleSubmit: (values, { props: { onSubmit } }) => {
      const data = {
        email_design: values.send_email ? values.email_design : null,
        push_notification_title: values.send_notification_push
          ? values.notificationTitle
          : '',
        push_notification_content: values.send_notification_push
          ? values.notificationContent
          : '',
        kind: NOTIFICATION_KIND.BIRTHDAY,
        event_rules: {
          smartlist_include: values.smartlist_include,
          smartlist_exclude: values.smartlist_exclude,
        },
      };

      onSubmit(data);
    },
  }),
)(MarketingRuleFormBirthday);
