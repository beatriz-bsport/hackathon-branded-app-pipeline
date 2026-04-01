export type EmailDesignContent = {
  /**
   * Unlayer "design" JSON serialized as a string.
   * We store it as a string because that's what we persist and pass around today.
   */
  design: string;
  /** Rendered HTML exported from Unlayer. */
  html: string;
};

/**
 * The unified result shape emitted by every save action (overwrite, on-the-fly, create new).
 * `emailTemplateId` is null for on-the-fly campaigns that are not linked to a saved template.
 */
export type EmailTemplateChangeResult = {
  design: string;
  html: string;
  subject: string;
  emailTemplateId: number | null;
};
