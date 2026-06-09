import { createPortal } from "react-dom";

import { openIntercomConversation } from "@bsport/intercom";
import {
  GlobalAlert as KaizenGlobalAlert,
  useFetchGlobalAlerts,
} from "@bsport/kaizen-business-components/financial-services/global-alert";

import { fetch } from "#src/utils/fetch";

type Props = {
  onNavigate: (url: string) => void;
  companyId?: number;
  franchiseId?: number;
};

const GlobalAlert = ({ onNavigate, companyId, franchiseId }: Props) => {
  // TODO: move the app identifier construction to a helper in @bsport/api-member-experience once agreed in guidelines
  const adpAppIdentifier = franchiseId
    ? `${franchiseId}_${companyId}`
    : `${companyId}`;
  const { globalAlertProps } = useFetchGlobalAlerts({
    fetch,
    adpAppIdentifier,
    onNavigate,
    openIntercom: () => {
      openIntercomConversation();
    },
  });

  if (typeof document === "undefined") return null;

  return createPortal(
    <KaizenGlobalAlert {...globalAlertProps} />,
    document.body,
  );
};

export default GlobalAlert;
