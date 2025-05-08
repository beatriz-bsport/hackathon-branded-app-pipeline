import type { MarketingPreferenceData } from '#src/libs/communication/types';
export type ModalsAndDrawersProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  isOpen: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
  subtitle?: string;
  title: string;
  isLoading?: boolean;
  /** An optional error message */
  errorMessage?: string;
};

export type PortalProps = ModalsAndDrawersProps & {
  isMobile: boolean;
  /** An optional error message */
  errorMessage?: string;
};

export type BarcodeModalsAndDrawersProps = ModalsAndDrawersProps & {
  barcode: string;
};

export type BarcodePortalProps = PortalProps & {
  barcode: string;
};

export type TermsModalsAndDrawersProps = ModalsAndDrawersProps & {
  terms: string;
};

export type TermsPortalProps = PortalProps & {
  terms: string;
};

export type FranchiseMarketingPreferencesModalsAndDrawersProps =
  ModalsAndDrawersProps & {
    preferences: MarketingPreferenceData[];
    onSubmit: (values: MarketingPreferenceData[]) => void;
  };

export type FranchiseMarketingPreferencesProps = PortalProps & {
  preferences: MarketingPreferenceData[];
  updateMyFranchiseMarketingPreferences: (
    values: MarketingPreferenceData[],
  ) => void;
};
