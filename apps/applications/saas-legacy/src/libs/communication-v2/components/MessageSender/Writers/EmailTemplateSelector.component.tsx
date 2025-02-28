import React, { useCallback } from 'react';

import CommunicationTemplateModal from '#src/libs/communication-v2/components/MessageSender/ModalTemplate/CommunicationTemplateModal.component';

type EmailTemplateSelectorProps = {
  setOpenTemplateSelector: (open: boolean) => void;
  setMailTemplateSelected: (templateId: number | null) => void;
  setMailTitle: (title: string) => void;
  checkAndSetValidity: () => void;
  openTemplateSelector: boolean;
  mailTemplateSelected: number | null;
  mailTitle: string;
};

const EmailTemplateSelector: React.FC<EmailTemplateSelectorProps> = ({
  setOpenTemplateSelector,
  setMailTemplateSelected,
  setMailTitle,
  checkAndSetValidity,
  openTemplateSelector,
  mailTemplateSelected,
  mailTitle,
}: EmailTemplateSelectorProps) => {
  const onClose = useCallback(
    () => setOpenTemplateSelector(false),
    [setOpenTemplateSelector],
  );
  const setTitle = useCallback(
    (title: string) => setMailTitle(title),
    [setMailTitle],
  );
  const setTemplate = useCallback(
    (templateId: number) => {
      setMailTemplateSelected(templateId);
      checkAndSetValidity();
    },
    [setMailTemplateSelected, checkAndSetValidity],
  );

  return (
    <CommunicationTemplateModal
      closeDialog={onClose}
      open={openTemplateSelector}
      selectedTemplate={mailTemplateSelected}
      selectedTitle={mailTitle}
      setTemplate={setTemplate}
      setTitle={setTitle}
    />
  );
};

export default React.memo(EmailTemplateSelector);
