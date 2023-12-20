import * as Yup from 'yup';
import {
  MarketingActionKind,
  MarketingActions,
  CADENCE_MARKETING_ACTION_CHOICES,
} from '#libs/sequential_marketing/constants';

export const notificationValidationSchema = Yup.object().shape({
  id: Yup.number().nullable(),
  name: Yup.string().nullable(),
  kind: Yup.string().oneOf([MarketingActionKind.COMMUNICATION]).required(),
  action_spec: Yup.object().shape({
    text_content: Yup.string()
      .nullable()
      .test(
        'Test Communication Content',
        'communication_content_must_not_be_empty',
        (item) => !!item,
      ),
    subject: Yup.string()
      .nullable(false)
      .test(
        'Test Communication Subject',
        'communication_title_must_not_be_empty',
        (item) => !!item,
      ),
    communication_kind: Yup.number().oneOf([
      MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
    ]),
  }),
});

export const smsValidationSchema = Yup.object().shape({
  id: Yup.number().nullable(),
  name: Yup.string().nullable(),
  kind: Yup.string().oneOf([MarketingActionKind.COMMUNICATION]).required(),
  action_spec: Yup.object().shape({
    text_content: Yup.string()
      .nullable()
      .test(
        'Test Communication Content',
        'communication_content_must_not_be_empty',
        (item) => !!item,
      ),
    communication_kind: Yup.number().oneOf([
      MarketingActions.CADENCE_MARKETING_ACTION_SMS,
    ]),
  }),
});

export const tagValidationSchema = Yup.object().shape({
  id: Yup.number().nullable(),
  name: Yup.string().nullable(),
  kind: Yup.string().oneOf([MarketingActionKind.TAG]).required(),
  action_spec: Yup.object().shape({
    tag_id: Yup.number().nullable(false).required(),
  }),
});

export const templateEmailValidationSchema = Yup.object().shape({
  id: Yup.number().nullable(),
  name: Yup.string().nullable(),
  kind: Yup.string().oneOf([MarketingActionKind.COMMUNICATION]).required(),
  action_spec: Yup.object().shape({
    email_design: Yup.number()
      .nullable()
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
  id: Yup.number().nullable(),
  name: Yup.string().nullable(),
  kind: Yup.string().oneOf([MarketingActionKind.COMMUNICATION]).required(),
  action_spec: Yup.object().shape({
    text_content: Yup.string()
      .nullable(false)
      .test(
        'Test Communication Content',
        'communication_content_must_not_be_empty',
        (item) => !!item,
      ),
    subject: Yup.string()
      .nullable(false)
      .test(
        'Test Communication Subject',
        'communication_title_must_not_be_empty',
        (item) => !!item,
      ),
    communication_kind: Yup.number().oneOf([
      MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
    ]),
  }),
});

const marketingActionValidationSchema = Yup.object().shape({
  id: Yup.number().nullable(),
  name: Yup.string().nullable(),
  kind: Yup.string().oneOf(Object.values(MarketingActionKind)).required(),
  action_spec: Yup.object()
    .when('kind', {
      is: MarketingActionKind.TAG,
      then: Yup.object().shape({
        tag_id: Yup.number().required(),
      }),
    })
    .when('kind', {
      is: MarketingActionKind.COMMUNICATION,
      then: Yup.object().shape({
        communication_kind: Yup.number().oneOf(
          CADENCE_MARKETING_ACTION_CHOICES.filter(
            (kind) =>
              kind !== MarketingActions.CADENCE_MARKETING_ACTION_TAG_MANAGEMENT,
          ),
        ),
        subject: Yup.string()
          .when('communication_kind', {
            is: MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
            then: Yup.string().required(),
          })
          .when('communication_kind', {
            is: MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
            then: Yup.string().required(),
          })
          .when('communication_kind', {
            is: MarketingActions.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
            then: Yup.string().required(),
          }),
        text_content: Yup.string()
          .when('communication_kind', {
            is: MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
            then: Yup.string().required(),
          })
          .when('communication_kind', {
            is: MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
            then: Yup.string().required(),
          })
          .when('communication_kind', {
            is: MarketingActions.CADENCE_MARKETING_ACTION_SMS,
            then: Yup.string().required(),
          }),
        email_design: Yup.number().nullable().when('communication_kind', {
          is: MarketingActions.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
          then: Yup.number().required(),
        }),
        tag_id: Yup.number().nullable(),
      }),
    }),
});

export const uniqueMarketingActionValidationSchema = Yup.object().shape({
  marketingAction: marketingActionValidationSchema.nullable(),
});

export const multipleMarketingActionsValidationSchema = Yup.object().shape({
  marketingActions: Yup.array()
    .of(marketingActionValidationSchema)
    .max(5, 'The array cannot contain more than 5 marketing actions'),
});
