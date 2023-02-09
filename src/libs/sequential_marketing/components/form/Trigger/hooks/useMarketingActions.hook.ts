import React from 'react';

import { useFormikContext } from 'formik';

import {
  CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
  CADENCE_MARKETING_ACTION_SMS,
  CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
  CADENCE_MARKETING_ACTION_TAG_MANAGEMENT,
  CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
  CadenceMarketingActionsEnum,
} from '#libs/sequential_marketing/constants';

import type { FormikValues } from '../components';
import type { EmailTemplate } from '#libs/email-editor/types';

const useMarketingActionsContext = ({
  emails,
}: {
  emails: EmailTemplate[];
}) => {
  const [selectedMarketingActions, setSetlectedMarketingAction] =
    React.useState<CadenceMarketingActionsEnum>(null);

  const { values, setFieldValue }: FormikValues = useFormikContext();

  const {
    _setMarketingConfigurationIsConfigured,
    _resetWrittenEmailConfiguration,
    _resetSmsConfiguration,
    _resetPushNotificationConfiguration,
    _resetEmailTemplateConfiguration,
    _resetTagManagementConfiguration,
  } = _useMarketingActionsPrivateHandlers();

  const handleMarketingActionChange = (item: CadenceMarketingActionsEnum) => {
    switch (selectedMarketingActions) {
      case CADENCE_MARKETING_ACTION_WRITTEN_EMAIL: {
        if (
          values.marketing_actions[CADENCE_MARKETING_ACTION_WRITTEN_EMAIL]
            .title &&
          values.marketing_actions[CADENCE_MARKETING_ACTION_WRITTEN_EMAIL]
            .content
        ) {
          _setMarketingConfigurationIsConfigured(
            CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
            true,
          );
        } else {
          _setMarketingConfigurationIsConfigured(
            CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
            false,
          );
        }
        break;
      }

      case CADENCE_MARKETING_ACTION_SMS: {
        if (values.marketing_actions[CADENCE_MARKETING_ACTION_SMS].content) {
          _setMarketingConfigurationIsConfigured(
            CADENCE_MARKETING_ACTION_SMS,
            true,
          );
        } else {
          _setMarketingConfigurationIsConfigured(
            CADENCE_MARKETING_ACTION_SMS,
            false,
          );
        }
        break;
      }

      case CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION: {
        if (
          values.marketing_actions[CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION]
            .title &&
          values.marketing_actions[CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION]
            .content
        ) {
          _setMarketingConfigurationIsConfigured(
            CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
            true,
          );
        } else {
          _setMarketingConfigurationIsConfigured(
            CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
            false,
          );
        }
        break;
      }

      case CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE: {
        if (
          values.marketing_actions[CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE]
            .email_design_id &&
          values.marketing_actions[CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE]
            .title
        ) {
          _setMarketingConfigurationIsConfigured(
            CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
            true,
          );
        } else {
          _setMarketingConfigurationIsConfigured(
            CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
            false,
          );
        }
        break;
      }

      default:
        break;
    }

    if (item !== selectedMarketingActions) {
      setSetlectedMarketingAction(item);
    } else {
      setSetlectedMarketingAction(null);
    }
  };

  const handleResetMarketingAction = (item: CadenceMarketingActionsEnum) => {
    switch (item) {
      case CADENCE_MARKETING_ACTION_WRITTEN_EMAIL: {
        _resetWrittenEmailConfiguration();
        break;
      }
      case CADENCE_MARKETING_ACTION_SMS: {
        _resetSmsConfiguration();
        break;
      }

      case CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION: {
        _resetPushNotificationConfiguration();
        break;
      }
      case CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE: {
        _resetEmailTemplateConfiguration();
        break;
      }
      case CADENCE_MARKETING_ACTION_TAG_MANAGEMENT: {
        _resetTagManagementConfiguration();
        break;
      }
      default:
        break;
    }
  };

  const handlePushNotificationTitleChange = (title: string) =>
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION}.title`,
      title,
    );

  const handlePushNotificationContentChange = (text: string) =>
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION}.content`,
      text,
    );

  const handleEmailTemplateTitleChange = (title: string) =>
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE}.title`,
      title,
    );

  const handleWrittenEmailContentChange = (text: string) => {
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_WRITTEN_EMAIL}.content`,
      text,
    );
  };

  const handleWrittenEmailTitleChange = (title: string) =>
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_WRITTEN_EMAIL}.title`,
      title,
    );

  const handleSelectEmailDesign = (id: number) => {
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE}.email_design_id`,
      id,
    );
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE}.title`,
      emails.find((email) => email.id === id)?.subject ?? '',
    );
  };

  const handleSmsContentChange = (text: string) =>
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_SMS}.content`,
      text,
    );

  return {
    selectedMarketingActions,
    setSetlectedMarketingAction,
    handleMarketingActionChange,
    handleResetMarketingAction,
    handlePushNotificationTitleChange,
    handlePushNotificationContentChange,
    handleEmailTemplateTitleChange,
    handleWrittenEmailContentChange,
    handleWrittenEmailTitleChange,
    handleSelectEmailDesign,
    handleSmsContentChange,
  };
};

export default useMarketingActionsContext;

const _useMarketingActionsPrivateHandlers = () => {
  const { setFieldValue }: FormikValues = useFormikContext();

  /**
  @param {CadenceMarketingActionsEnum} marketingAction Selected marketing action
  @param {boolean} confiugred  Representing if the marketing actions is configured.
  @returns {void} Set the values.configured
  */
  const _setMarketingConfigurationIsConfigured = (
    marketingAction: CadenceMarketingActionsEnum,
    confiugred: boolean,
  ) => {
    setFieldValue(
      `marketing_actions.${marketingAction}.configured`,
      confiugred,
    );
  };

  /**
  Reset forms values and set the is configured value to false for WRITTEN EMAIL
  */
  const _resetWrittenEmailConfiguration = () => {
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_WRITTEN_EMAIL}.title`,
      '',
    );
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_WRITTEN_EMAIL}.content`,
      '',
    );
    _setMarketingConfigurationIsConfigured(
      CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
      false,
    );
  };

  /**
  Reset forms values and set the is configured value to false for SMS
  */
  const _resetSmsConfiguration = () => {
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_SMS}.content`,
      '',
    );

    _setMarketingConfigurationIsConfigured(CADENCE_MARKETING_ACTION_SMS, false);
  };

  /**
  Reset forms values and set the is configured value to false for PUSH NOTIFICATION
  */
  const _resetPushNotificationConfiguration = () => {
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION}.title`,
      '',
    );
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION}.content`,
      '',
    );
    _setMarketingConfigurationIsConfigured(
      CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
      false,
    );
  };

  /**
  Reset forms values and set the is configured value to false for EMAIL TEMPLATE
  */
  const _resetEmailTemplateConfiguration = () => {
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE}.title`,
      '',
    );
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE}.email_design_id`,
      null,
    );
    _setMarketingConfigurationIsConfigured(
      CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
      false,
    );
  };

  /**
  Reset forms values and set the is configured value to false for TAG
  */
  const _resetTagManagementConfiguration = () => {
    setFieldValue(
      `marketing_actions.${CADENCE_MARKETING_ACTION_TAG_MANAGEMENT}.tag_id`,
      null,
    );
    _setMarketingConfigurationIsConfigured(
      CADENCE_MARKETING_ACTION_TAG_MANAGEMENT,
      false,
    );
  };

  return {
    _setMarketingConfigurationIsConfigured,
    _resetWrittenEmailConfiguration,
    _resetSmsConfiguration,
    _resetPushNotificationConfiguration,
    _resetEmailTemplateConfiguration,
    _resetTagManagementConfiguration,
  };
};
