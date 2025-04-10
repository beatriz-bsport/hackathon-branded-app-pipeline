import { useState, useCallback } from 'react';
import {
  WRITE_EMAIL,
  WRITE_SMS,
  WRITE_PUSH_NOTIFICATION,
  TEXTFIELD_MAIL_TITLE,
  TEXTFIELD_MAIL_CONTENT,
  TEXTFIELD_SMS_CONTENT,
  TEXTFIELD_NOTIFICATION_TITLE,
  TEXTFIELD_NOTIFICATION_CONTENT,
  MAX_LENGTH_PUSH_TITLE,
  MAX_LENGTH_PUSH_CONTENT,
} from '#src/libs/communication-v2/constants';
import type { AutomatedCampaign } from '#src/libs/smart-list/types';

type InitializeFromDraftParams = {
  draft: AutomatedCampaign;
  communicationKind: number;
};

export const useAutomaticCampaignCommunicationManagement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mailTemplateSelected, setMailTemplateSelected] = useState<
    number | null
  >(null);
  const [limit, setLimit] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [resendDelay, setResendDelay] = useState(0);

  const [focusTextField, setFocusTextField] = useState(0);

  const setResendConfig = useCallback(
    (data: { resendCount: number; resendDelay: number }) => {
      if (!data || !data.resendCount || !data.resendDelay) return;
      setResendCount(data?.resendCount);
      setResendDelay(data?.resendDelay);
    },
    [],
  );

  const resetEmailTemplate = useCallback(() => {
    if (!mailTemplateSelected) return;
    setTitle('');
    setMailTemplateSelected(null);
  }, [mailTemplateSelected]);

  const initializeFromDraft = useCallback(
    ({ draft, communicationKind }: InitializeFromDraftParams) => {
      if (!draft) return;

      const {
        title: draftTitle,
        text,
        email_design,
        max_communications_sent_per_member,
      } = draft;

      setLimit(max_communications_sent_per_member ?? 0);
      switch (communicationKind) {
        case WRITE_EMAIL:
          const { email_resend_count, email_resend_delay } = draft;

          setResendConfig({
            resendCount: email_resend_count,
            resendDelay: email_resend_delay,
          });
          setTitle(draftTitle ?? '');
          if (email_design) {
            setMailTemplateSelected(email_design);
          } else {
            setContent(text ?? '');
          }
          break;
        case WRITE_SMS:
          setContent(text ?? '');
          break;
        case WRITE_PUSH_NOTIFICATION:
          setTitle(draftTitle ?? '');
          setContent(text ?? '');
          break;
        default:
          break;
      }
    },
    [setResendConfig],
  );

  const validateContent = useCallback(
    ({ communicationKind }: { communicationKind: number }) => {
      switch (communicationKind) {
        case WRITE_EMAIL:
          return (
            title !== '' && (content !== '' || mailTemplateSelected !== null)
          );
        case WRITE_SMS:
          return content !== '';
        case WRITE_PUSH_NOTIFICATION:
          return title !== '' && content !== '';
        default:
          return false;
      }
    },
    [mailTemplateSelected, title, content],
  );

  const addTag = useCallback(
    ({
      tagName,
      communicationKind,
    }: {
      tagName: string;
      communicationKind: number;
    }) => {
      if (!tagName) return;
      const tagString = `{${tagName}}`;

      switch (communicationKind) {
        case WRITE_EMAIL:
          if (focusTextField === TEXTFIELD_MAIL_TITLE) {
            setTitle((prev) => `${prev}${tagString}`);
          } else if (focusTextField === TEXTFIELD_MAIL_CONTENT) {
            setContent((prev) => `${prev}${tagString}`);
          }
          break;
        case WRITE_SMS:
          if (focusTextField === TEXTFIELD_SMS_CONTENT) {
            setContent((prev) => `${prev}${tagString}`);
          }
          break;
        case WRITE_PUSH_NOTIFICATION:
          if (
            focusTextField === TEXTFIELD_NOTIFICATION_TITLE &&
            title.length + tagString.length <= MAX_LENGTH_PUSH_TITLE
          ) {
            setTitle((prev) => `${prev}${tagString}`);
          } else if (
            focusTextField === TEXTFIELD_NOTIFICATION_CONTENT &&
            content.length + tagString.length <= MAX_LENGTH_PUSH_CONTENT
          ) {
            setContent((prev) => `${prev}${tagString}`);
          }
          break;
      }
    },
    [focusTextField, title, content],
  );

  const createAutomatedCampaignData = useCallback(
    ({
      communicationKind,
      eventKind,
    }: {
      communicationKind: number;
      eventKind: number;
    }) => {
      return {
        communication_kind: communicationKind,
        event_kind: eventKind,
        title,
        text: content,
        max_communications_sent_per_member: limit === 0 ? null : limit,
        email_design: mailTemplateSelected ? mailTemplateSelected : null,
        email_resend_count: resendCount,
        email_resend_delay: resendDelay,
      };
    },
    [title, content, mailTemplateSelected, resendCount, resendDelay, limit],
  );

  return {
    title,
    content,
    mailTemplateSelected,
    focusTextField,
    resendCount,
    resendDelay,
    limit,

    setTitle,
    setContent,
    setMailTemplateSelected,
    setFocusTextField,
    setLimit,

    resetEmailTemplate,
    initializeFromDraft,
    validateContent,
    setResendConfig,
    addTag,
    createAutomatedCampaignData,
  };
};
