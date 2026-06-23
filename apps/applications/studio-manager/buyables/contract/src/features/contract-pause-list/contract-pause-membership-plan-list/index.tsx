import { type FC, useState } from "react";

import { useMembershipPlansSuspenseQuery } from "#src/hooks/api/use-billing-plans-query";

import {
  CONTROL_SUCCESS,
  type ControlSuccessKind,
  MembershipPlanEffectSelector,
} from "./membership-plan-effect-selector";
import { MembershipPlanList, PAGINATION_SIZE } from "./membership-plan-list";

const DEFAULT_PAGE = 1;

type ContractPauseMembershipPlanListProps = {
  contractId: number;
  pausedMembershipPlanIds: number[];
  notPausedMembershipPlanIds: number[];
};

export const ContractPauseMembershipPlanList: FC<
  ContractPauseMembershipPlanListProps
> = ({ contractId, pausedMembershipPlanIds, notPausedMembershipPlanIds }) => {
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE); // Frontend pagination - display only
  const [controlSuccess, setControlSuccess] = useState<ControlSuccessKind>(
    CONTROL_SUCCESS.PAUSED,
  );

  const onControlChange = (nextVal: ControlSuccessKind) => {
    setControlSuccess(nextVal);
    setCurrentPage(DEFAULT_PAGE);
  };

  const displayPausedPlans = controlSuccess === CONTROL_SUCCESS.PAUSED;

  const membershipPlanIds = [
    ...pausedMembershipPlanIds,
    ...notPausedMembershipPlanIds,
  ];

  const { data } = useMembershipPlansSuspenseQuery({
    contract: contractId,
    id__in: membershipPlanIds,
  });

  const membershipPlansSelection = data.filter((value) =>
    displayPausedPlans
      ? pausedMembershipPlanIds.includes(value.id)
      : notPausedMembershipPlanIds.includes(value.id),
  );

  const membershipPlansPage = membershipPlansSelection.slice(
    (currentPage - 1) * PAGINATION_SIZE,
    currentPage * PAGINATION_SIZE,
  );

  return (
    <>
      <MembershipPlanEffectSelector
        value={controlSuccess}
        onChange={onControlChange}
      />
      <MembershipPlanList
        contractId={contractId}
        currentPage={currentPage}
        membershipPlansPage={membershipPlansPage}
        onPageChange={setCurrentPage}
        totalItems={membershipPlansSelection.length}
      />
    </>
  );
};
