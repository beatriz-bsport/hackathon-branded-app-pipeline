export type EmailDesignContent = {
  /**
   * Unlayer "design" JSON serialized as a string.
   * We store it as a string because that's what we persist and pass around today.
   */
  design: string;
  /** Rendered HTML exported from Unlayer. */
  html: string;
};

export type EmailDesignEditorActionContext = {
  close: () => void;
};

export type EmailDesignEditorAction = {
  id: string;
  label: string;
  helperText?: string;
  run: (params: {
    content: EmailDesignContent;
    context: EmailDesignEditorActionContext;
  }) => Promise<void> | void;
};
