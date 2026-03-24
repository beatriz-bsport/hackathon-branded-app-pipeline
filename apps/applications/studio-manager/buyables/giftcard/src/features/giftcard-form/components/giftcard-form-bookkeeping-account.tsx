import type { FC } from "react";

import { isBookkeepingAccountActive } from "@bsport/kaizen-business-components/financial-services/bookkeeping-account/is-active";
import { BookkeepingAccountFormSelector } from "@bsport/kaizen-business-components/financial-services/bookkeeping-account/selector";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";

import { GiftcardFormData } from "../types";

type GiftcardFormBookkeepingAccountProps = {
  isSharedGiftcard?: boolean;
};

export const GiftcardFormBookkeepingAccount: FC<
  GiftcardFormBookkeepingAccountProps
> = ({ isSharedGiftcard }) => {
  const companyTheme = dataAccessLayer.useCompanyTheme();
  if (!isBookkeepingAccountActive(companyTheme)) {
    return null;
  }

  return (
    <BookkeepingAccountFormSelector<GiftcardFormData, "bookkeeping_account">
      idFieldName="bookkeeping_account"
      fetch={fetch}
      withCreationFlow
      disabled={!!isSharedGiftcard}
    />
  );
};
