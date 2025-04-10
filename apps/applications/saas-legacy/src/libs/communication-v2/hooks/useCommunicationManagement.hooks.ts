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
  MINUTE_LIMIT_TO_SCHEDULE_COMMUNICATION,
} from '#src/libs/communication-v2/constants';
import { DateTime } from 'luxon';
import type { CommunicationScheduled } from '#src/libs/communication-v2/types';
import { formatDateForScheduledCommunication } from '#src/libs/communication-v2/utils';

export const useCommunicationManagement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mailTemplateSelected, setMailTemplateSelected] = useState<
    number | null
  >(null);
  const [resendCount, setResendCount] = useState(0);
  const [resendDelay, setResendDelay] = useState(0);
  const [communicationSchedulingDate, setCommunicationSchedulingDate] =
    useState<DateTime | null>(null);

  const [focusTextField, setFocusTextField] = useState(0);

  const setResendConfig = useCallback(
    (data: { resendCount: number; resendDelay: number }) => {
      if (!data || !data.resendCount || !data.resendDelay) return;
      setResendCount(data?.resendCount);
      setResendDelay(data?.resendDelay);
    },
    [],
  );

  const resetAllContent = useCallback(() => {
    setTitle('');
    setContent('');
    setMailTemplateSelected(null);
    setCommunicationSchedulingDate(null);
    setResendConfig({
      resendCount: 0,
      resendDelay: 0,
    });
    setFocusTextField(0);
  }, [setResendConfig]);

  const resetEmailTemplate = useCallback(() => {
    if (!mailTemplateSelected) return;
    setTitle('');
    setMailTemplateSelected(null);
  }, [mailTemplateSelected]);

  const initializeFromDraft = useCallback(
    ({
      draft,
      communicationKind,
    }: {
      draft: CommunicationScheduled;
      communicationKind: number;
    }) => {
      if (!draft) return;

      const {
        title: draftTitle,
        text,
        email_design,
        datetime_scheduled,
      } = draft;

      if (datetime_scheduled) {
        setCommunicationSchedulingDate(DateTime.fromISO(datetime_scheduled));
      }

      switch (communicationKind) {
        case WRITE_EMAIL:
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
    [],
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

  const createCommunicationSenderData = useCallback(
    ({ communicationKind }: { communicationKind: number }) => {
      switch (communicationKind) {
        case WRITE_EMAIL:
          return {
            content: mailTemplateSelected
              ? { subject: title, email_template: mailTemplateSelected }
              : { subject: title, body: content },
            autoResend: {
              email_resend_count: resendCount,
              email_resend_delay: resendDelay,
            },
          };
        case WRITE_SMS:
          return {
            content: { sms: content },
            autoResend: { email_resend_count: 0, email_resend_delay: 0 },
          };
        case WRITE_PUSH_NOTIFICATION:
          return {
            content: {
              notification_title: title,
              notification_content: content,
            },
            autoResend: { email_resend_count: 0, email_resend_delay: 0 },
          };
        default:
          return { content: {}, autoResend: {} };
      }
    },
    [title, content, mailTemplateSelected, resendCount, resendDelay],
  );

  const createCommunicationSchedulingData = useCallback(
    ({
      timezone,
      communicationKind,
    }: {
      timezone: string;
      communicationKind: number;
    }) => {
      if (!timezone) return;
      const emailDesignSelected =
        communicationKind === WRITE_EMAIL && !!mailTemplateSelected
          ? mailTemplateSelected
          : undefined;
      const data = {
        title: title,
        text: content,
        communication_kind: communicationKind,
        email_design: emailDesignSelected,
        datetime_scheduled: formatDateForScheduledCommunication(
          communicationSchedulingDate,
          timezone,
        ),
        autoResend: {
          email_resend_count: resendCount,
          email_resend_delay: resendDelay,
        },
      };
      return data;
    },
    [
      title,
      content,
      mailTemplateSelected,
      communicationSchedulingDate,
      resendCount,
      resendDelay,
    ],
  );

  const checkIsMessageSchedulable = useCallback(() => {
    if (!communicationSchedulingDate) return true;
    return (
      communicationSchedulingDate >
      DateTime.now().plus({ minute: MINUTE_LIMIT_TO_SCHEDULE_COMMUNICATION })
    );
  }, [communicationSchedulingDate]);

  return {
    title,
    content,
    mailTemplateSelected,
    focusTextField,
    communicationSchedulingDate,
    resendCount,
    resendDelay,

    setTitle,
    setContent,
    setMailTemplateSelected,
    setFocusTextField,
    setCommunicationSchedulingDate,

    resetAllContent,
    resetEmailTemplate,
    initializeFromDraft,
    validateContent,
    setResendConfig,
    addTag,
    createCommunicationSenderData,
    createCommunicationSchedulingData,
    checkIsMessageSchedulable,
  };
};
