import { createPortal } from "react-dom";

import { openIntercomConversation } from "@bsport/intercom";
import {
  GlobalAlert as KaizenGlobalAlert,
  useFetchGlobalAlerts,
} from "@bsport/kaizen-business-components/financial-services/global-alert";

import { GlobalAlertQueryClientProvider } from "#src/components/global-alert/global-alert-query-client-provider";
import { fetch } from "#src/utils/fetch";

type Props = {
  onNavigate: (url: string) => void;
  companyId?: number;
  franchiseId?: number;
};

const GlobalAlertContent = ({ onNavigate, companyId, franchiseId }: Props) => {
  // TODO: move the app identifier construction to a helper in @bsport/api-member-experience once agreed in guidelines
  const adpAppIdentifier = franchiseId
    ? `${franchiseId}_${companyId}`
    : `${companyId}`;
  const { globalAlertProps } = useFetchGlobalAlerts({
    fetch,
    adpAppIdentifier,
    onNavigate: (url) => {
      onNavigate(url);
    },
    openIntercom: () => {
      openIntercomConversation();
    },
    openAppleAgreements: () => {
      window.open(
        "https://appstoreconnect.apple.com/business",
        "_blank",
        "noopener",
      );
    },
  });

  if (typeof document === "undefined") return null;

  return createPortal(
    <KaizenGlobalAlert {...globalAlertProps} />,
    document.body,
  );
};

const GlobalAlert = (props: Props) => {
  return (
    <GlobalAlertQueryClientProvider>
      <GlobalAlertContent {...props} />
    </GlobalAlertQueryClientProvider>
  );
};

export default GlobalAlert;
