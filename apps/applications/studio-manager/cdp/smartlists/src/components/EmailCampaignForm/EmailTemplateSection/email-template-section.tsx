import React from "react";

import { EmailTemplateFormColumn } from "./email-template-form-column";
import { EmailTemplatePreviewColumn } from "./email-template-preview-column";

export const EmailTemplateSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
      <EmailTemplateFormColumn />
      <EmailTemplatePreviewColumn />
    </div>
  );
};
