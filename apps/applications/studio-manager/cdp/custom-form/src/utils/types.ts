export type ModalProps = {
  onSuccess?: () => void;
  onFailure?: () => void;
};

export type AvailabilityModalProps = {
  onRestoreSuccess?: () => void;
  onRestoreFailure?: () => void;
  onDisableSuccess?: () => void;
  onDisableFailure?: () => void;
};

export type CustomFormCreationData = {
  name: string;
};
