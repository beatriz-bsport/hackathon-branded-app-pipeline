import React from 'react';
import * as Yup from 'yup';

import { useFormik } from 'formik';

import { CadenceMarketingActionsEnum } from '#libs/sequential_marketing/constants';

import type { EmailTemplate } from '#libs/email-editor/types';
import type { Tag, TagGroup } from '#libs/tag/types';
import {
  StepMarketingActions,
  StepMarketingActionsKind,
} from '#libs/sequential_marketing/types';
import { OptionCallback } from '../../../../../state/types';

export type MarketingActionData = Omit<
  StepMarketingActions,
  'company' | 'cadence_step' | 'disabled'
>;

const getFormikInitialValues = (marketingAction: StepMarketingActions) => {
  return {
    id: marketingAction?.id,
    name: marketingAction?.name,
    kind: marketingAction?.kind,
    action_spec: marketingAction?.action_spec,
  };
};
const useMarketingActionsFormContext = ({
  emails,
  marketingActionsCommunication,
  marketingActionsTag,
  submitActionConfiguration,
  deleteStepMarketingAction,
}: {
  emails: EmailTemplate[];
  marketingActionsCommunication: StepMarketingActions[];
  marketingActionsTag: StepMarketingActions[];
  submitActionConfiguration: (
    data: MarketingActionData,
    options: OptionCallback,
  ) => void;
  deleteStepMarketingAction: (data: { id: number; stepId: number }) => void;
}) => {
  const [selectedMarketingActionKind, setSetlectedMarketingActionKind] =
    React.useState<CadenceMarketingActionsEnum>(null);

  const [selectedMarketingAction, setSelectedMarketingAction] =
    React.useState<StepMarketingActions>(null);

  const handleSelectMarketingAction = React.useCallback(
    (actionKind: CadenceMarketingActionsEnum | null) => {
      if (actionKind !== selectedMarketingActionKind) {
        setSetlectedMarketingActionKind(actionKind);
      } else {
        setSetlectedMarketingActionKind(null);
      }
      switch (actionKind) {
        case CadenceMarketingActionsEnum.CADENCE_MARKETING_ACTION_TAG_MANAGEMENT:
          return setSelectedMarketingAction(
            marketingActionsTag?.find(
              (ma) =>
                ma?.kind === StepMarketingActionsKind.TAG &&
                !!ma?.action_spec?.tag_id,
            ) ?? {
              id: null,
              name: '',
              company: null,
              cadence_step: null,
              disabled: false,
              kind: StepMarketingActionsKind.TAG,
              action_spec: {
                tag_id: null,
              },
            },
          );
        case CadenceMarketingActionsEnum.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL:
        case CadenceMarketingActionsEnum.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE:
        case CadenceMarketingActionsEnum.CADENCE_MARKETING_ACTION_SMS:
        case CadenceMarketingActionsEnum.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION:
          return setSelectedMarketingAction(
            marketingActionsCommunication?.find(
              (ma) => ma?.action_spec?.communication_kind === actionKind,
            ) ?? {
              id: null,
              name: '',
              company: null,
              cadence_step: null,
              disabled: false,
              kind: StepMarketingActionsKind.COMMUNICATION,
              action_spec: {
                email_design: null,
                text_content: '',
                subject: '',
                communication_kind: actionKind,
              },
            },
          );
        default:
          return null;
      }
    },
    [
      setSelectedMarketingAction,
      selectedMarketingActionKind,
      marketingActionsTag,
      marketingActionsCommunication,
    ],
  );

  const formik = useFormik<MarketingActionData>({
    initialValues: getFormikInitialValues(selectedMarketingAction),
    enableReinitialize: true,
    onSubmit: (values) => {
      submitActionConfiguration(values, {
        onSuccess: () => setSetlectedMarketingActionKind(null),
      });
    },
    validationSchema: getFormikValidationSchema(selectedMarketingAction),
  });

  const handleDeleteMarketingAction = React.useCallback(() => {
    if (selectedMarketingAction.id && selectedMarketingAction.cadence_step) {
      deleteStepMarketingAction({
        id: selectedMarketingAction.id,
        stepId: selectedMarketingAction.cadence_step,
      });
    }
    setSelectedMarketingAction(null);
    setSetlectedMarketingActionKind(null);
  }, [deleteStepMarketingAction, selectedMarketingAction]);

  const { setFieldValue } = formik;

  const handleCommunicationTitleChange = React.useCallback(
    (title: string) => setFieldValue('action_spec.subject', title),
    [setFieldValue],
  );

  const handleCommunicationTextContentChange = React.useCallback(
    (text: string) => setFieldValue('action_spec.text_content', text),
    [setFieldValue],
  );

  const handleSelectEmailDesign = React.useCallback(
    (id: number) => {
      setFieldValue('action_spec.email_design', id);
      handleCommunicationTitleChange(
        emails.find((email) => email.id === id)?.subject ?? '',
      );
    },
    [setFieldValue, handleCommunicationTitleChange, emails],
  );

  const handleCancelEmailDesignSelection = React.useCallback(() => {
    setFieldValue('action_spec.email_design', null);
    handleCommunicationTitleChange('');
  }, [setFieldValue, handleCommunicationTitleChange]);

  const handleChangeTag = React.useCallback(
    (option: { tag: Tag<TagGroup>; label: string; value: number } | null) => {
      setFieldValue('action_spec.tag_id', option?.value ?? null);
    },
    [setFieldValue],
  );

  return {
    formikValues: formik.values,
    formikErrors: formik.errors,
    formikSubmit: formik.handleSubmit,
    selectedMarketingActionKind,
    selectedMarketingAction,
    setSetlectedMarketingActionKind,
    handleSelectMarketingAction,
    handleCommunicationTitleChange,
    handleCommunicationTextContentChange,
    handleSelectEmailDesign,
    handleCancelEmailDesignSelection,
    handleChangeTag,
    handleDeleteMarketingAction,
  };
};

export default useMarketingActionsFormContext;

const getFormikValidationSchema = (marketingAction: StepMarketingActions) => {
  return Yup.object().shape({
    id: Yup.number().nullable(!marketingAction?.id),
    name: Yup.string().nullable(true),
    kind: Yup.string()
      .oneOf([
        StepMarketingActionsKind.COMMUNICATION,
        StepMarketingActionsKind.TAG,
      ])
      .required(),
    action_spec: Yup.object()
      .when('kind', {
        is: StepMarketingActionsKind.TAG,
        then: Yup.object().shape({
          tag_id: Yup.number().nullable(false).required(),
        }),
      })
      .when('kind', {
        is: StepMarketingActionsKind.COMMUNICATION,
        then: Yup.object().shape({
          email_design: Yup.number()
            .nullable(true)
            .test(
              'Test Email Desgin Selection',
              'email_design_must_be_selected',
              function CheckEmailDesign(item) {
                return (
                  this.parent.communication_kind !==
                    CadenceMarketingActionsEnum.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE ||
                  !!item
                );
              },
            ),
          text_content: Yup.string()
            .nullable(true)
            .test(
              'Text Communication Content',
              'communication_content_must_not_be_empty',
              function CheckCommunicationContent(item) {
                return (
                  this.parent.communication_kind ===
                    CadenceMarketingActionsEnum.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE ||
                  !!item
                );
              },
            ),
          subject: Yup.string()
            .nullable(false)
            .test(
              'Text Communication Subject',
              'communication_title_must_not_be_empty',
              function CheckCommunicationTitle(item) {
                return (
                  this.parent.communication_kind ===
                    CadenceMarketingActionsEnum.CADENCE_MARKETING_ACTION_SMS ||
                  !!item
                );
              },
            ),
          communication_kind: Yup.number().oneOf([
            CadenceMarketingActionsEnum.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
            CadenceMarketingActionsEnum.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
            CadenceMarketingActionsEnum.CADENCE_MARKETING_ACTION_SMS,
            CadenceMarketingActionsEnum.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
          ]),
        }),
      }),
  });
};
