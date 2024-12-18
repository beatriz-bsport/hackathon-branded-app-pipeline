export type ConsumerExtensionCreateFormValues = {
  extensionOption: 'numericInput' | 'datePicker';
  nbDays: number;
  note: string;
};

export type ExtensionOption = {
  label: string;
  value: 'numericInput' | 'datePicker';
};
