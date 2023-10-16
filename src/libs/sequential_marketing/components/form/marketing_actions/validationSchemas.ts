import * as Yup from 'yup';
import {
  MarketingActionKind,
  MarketingActions,
} from '#libs/sequential_marketing/constants';

export const notificationValidationSchema = Yup.object().shape({
  id: Yup.number().nullable(true),
  name: Yup.string().nullable(true),
  kind: Yup.string().oneOf([MarketingActionKind.COMMUNICATION]).required(),
  action_spec: Yup.object().shape({
    text_content: Yup.string()
      .nullable(true)
      .test(
        'Text Communication Content',
        'communication_content_must_not_be_empty',
        (item) => !!item,
      ),
    subject: Yup.string()
      .nullable(false)
      .test(
        'Text Communication Subject',
        'communication_title_must_not_be_empty',
        (item) => !!item,
      ),
    communication_kind: Yup.number().oneOf([
      MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
    ]),
  }),
});

export const smsValidationSchema = Yup.object().shape({
  id: Yup.number().nullable(true),
  name: Yup.string().nullable(true),
  kind: Yup.string().oneOf([MarketingActionKind.COMMUNICATION]).required(),
  action_spec: Yup.object().shape({
    text_content: Yup.string()
      .nullable(true)
      .test(
        'Text Communication Content',
        'communication_content_must_not_be_empty',
        (item) => !!item,
      ),
    communication_kind: Yup.number().oneOf([
      MarketingActions.CADENCE_MARKETING_ACTION_SMS,
    ]),
  }),
});

export const tagValidationSchema = Yup.object().shape({
  id: Yup.number().nullable(true),
  name: Yup.string().nullable(true),
  kind: Yup.string().oneOf([MarketingActionKind.TAG]).required(),
  action_spec: Yup.object().shape({
    tag_id: Yup.number().nullable(false).required(),
  }),
});

export const templateEmailValidationSchema = Yup.object().shape({
  id: Yup.number().nullable(true),
  name: Yup.string().nullable(true),
  kind: Yup.string().oneOf([MarketingActionKind.COMMUNICATION]).required(),
  action_spec: Yup.object().shape({
    email_design: Yup.number()
      .nullable(true)
      .test(
        'Test Email Desgin Selection',
        'email_design_must_be_selected',
        (item) => !!item,
      ),
    communication_kind: Yup.number().oneOf([
      MarketingActions.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
    ]),
  }),
});

export const writtenEmailValidationSchema = Yup.object().shape({
  id: Yup.number().nullable(true),
  name: Yup.string().nullable(true),
  kind: Yup.string().oneOf([MarketingActionKind.COMMUNICATION]).required(),
  action_spec: Yup.object().shape({
    text_content: Yup.string()
      .nullable(false)
      .test(
        'Text Communication Content',
        'communication_content_must_not_be_empty',
        (item) => !!item,
      ),
    subject: Yup.string()
      .nullable(false)
      .test(
        'Text Communication Subject',
        'communication_title_must_not_be_empty',
        (item) => !!item,
      ),
    communication_kind: Yup.number().oneOf([
      MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
    ]),
  }),
});
