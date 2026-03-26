import type { FC } from "react";
import { useNavigate } from "react-router";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { useFetchContracts } from "#src/hooks/api/use-fetch-contracts";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const ContractListPage: FC = () => {
  const { t } = useTranslation("contract-list");

  const { data } = useFetchContracts({ disabled: false });
  const navigate = useNavigate();

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("pages.contractList")} />
      <ListLayout.Content>
        <ul>
          {(data ?? []).map((contract) => (
            <li
              key={contract.id}
              onClick={() => navigate(URLS.EDITOR(contract.id))}
            >{`(${contract.id}) ${contract.name}`}</li>
          ))}
        </ul>
      </ListLayout.Content>
    </ListLayout>
  );
};
