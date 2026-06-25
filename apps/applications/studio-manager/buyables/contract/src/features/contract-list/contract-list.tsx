import type { FC } from "react";
import { useNavigate } from "react-router";

import { useContractsQuery } from "#src/hooks/api/use-contracts-query";
import { URLS } from "#src/urls";

type ContractListProps = {
  archived?: boolean;
  searchQuery?: string;
};

export const ContractList: FC<ContractListProps> = ({ archived }) => {
  const { data } = useContractsQuery({
    disabled: !!archived,
  });

  const navigate = useNavigate();

  return (
    <ul>
      {data.map((contract) => (
        <li
          key={contract.id}
          onClick={() => navigate(URLS.EDITOR(contract.id))}
        >{`(${contract.id}) ${contract.name}`}</li>
      ))}
    </ul>
  );
};
