export type PossibleSharedEmailTemplateType = "bsport" | "master";
export type PossibleEmailTemplateType =
  | "custom"
  | PossibleSharedEmailTemplateType;

export type ModalProps = {
  onSuccess?: () => void;
  onFailure?: () => void;
};

export type TextfieldStatuses = "default" | "positive" | "error" | undefined;
