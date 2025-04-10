import React, { useCallback } from 'react';

import CommunicationTemplateModal from '#src/libs/communication-v2/components/MessageSender/ModalTemplate/CommunicationTemplateModal.component';

type EmailTemplateSelectorProps = {
  setOpenTemplateSelector: (open: boolean) => void;
  setMailTemplateSelected: (templateId: number | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  checkAndSetValidity: () => void;
  openTemplateSelector: boolean;
  mailTemplateSelected: number | null;
  title: string;
};

const EmailTemplateSelector: React.FC<EmailTemplateSelectorProps> = ({
  setOpenTemplateSelector,
  setMailTemplateSelected,
  setTitle,
  setContent,
  checkAndSetValidity,
  openTemplateSelector,
  mailTemplateSelected,
  title,
}: EmailTemplateSelectorProps) => {
  const onClose = useCallback(
    () => setOpenTemplateSelector(false),
    [setOpenTemplateSelector],
  );
  const setTemplate = useCallback(
    (templateId: number) => {
      setContent('');
      setMailTemplateSelected(templateId);
      checkAndSetValidity();
    },
    [setMailTemplateSelected, checkAndSetValidity, setContent],
  );

  return (
    <CommunicationTemplateModal
      closeDialog={onClose}
      open={openTemplateSelector}
      selectedTemplate={mailTemplateSelected}
      selectedTitle={title}
      setTemplate={setTemplate}
      setTitle={setTitle}
    />
  );
};

export default React.memo(EmailTemplateSelector);
