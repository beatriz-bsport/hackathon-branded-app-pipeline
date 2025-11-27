import { toast } from "@bsport/kaizen-primitive-core";
import {
  BUYABLE_IDENTIFIERS,
  type FetchInvoiceByInvoiceItemParams,
  fetchInvoiceByInvoiceItemAction,
} from "@bsport/store-financial-services-invoice";
import { useAsync } from "@bsport/use-async";

import { LEGACY_URLS } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const fetchInvoiceByInvoiceItemBound = fetchInvoiceByInvoiceItemAction.bind(
  null,
  fetch,
);

type BuyableIdentifierParams = {
  passIds: number[];
  appointmentPassIds: number[];
  webshopItemIds: number[];
};

const getBuyableIdentifier = ({
  passIds,
  appointmentPassIds,
  webshopItemIds,
}: BuyableIdentifierParams): FetchInvoiceByInvoiceItemParams | undefined => {
  if (passIds.length > 0) {
    return {
      buyableItemId: passIds[0],
      buyableItemIdentifier: BUYABLE_IDENTIFIERS.PASS,
    };
  }

  if (appointmentPassIds.length > 0) {
    return {
      buyableItemId: appointmentPassIds[0],
      buyableItemIdentifier: BUYABLE_IDENTIFIERS.APPOINTMENT_PASS,
    };
  }

  if (webshopItemIds.length > 0) {
    return {
      buyableItemId: webshopItemIds[0],
      buyableItemIdentifier: BUYABLE_IDENTIFIERS.WEBSHOP_ITEM,
    };
  }
};

export const useNavigateToInvoice = () => {
  const { t } = useTranslation("details");

  const onFailure = () => {
    toast({
      status: "critical",
      icon: "alert-circle",
      buttonIcon: "x-close",
      title: t("overviewPage.table.errors.failToGetInvoice"),
    });
  };

  const [{ isLoading }, fetchInvoiceByInvoiceItem] = useAsync<
    typeof fetchInvoiceByInvoiceItemBound
  >({
    asyncFn: fetchInvoiceByInvoiceItemBound,
    onSuccess: ({ value }) => {
      window.location.assign(LEGACY_URLS.INVOICE_DETAILS(value.uuid));
    },
    onFailure,
  });

  const navigateToInvoiceDetails = (params: BuyableIdentifierParams) => {
    const buyableConfig = getBuyableIdentifier(params);

    if (!buyableConfig) {
      console.warn("[Pack] Could not find adequate buyable config");
      onFailure();
      return;
    }

    fetchInvoiceByInvoiceItem(buyableConfig);
  };

  return {
    isLoading,
    navigateToInvoiceDetails,
  };
};
