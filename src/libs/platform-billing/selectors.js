import { createSelector } from 'reselect';

const getPlatformInvoiceIdList = (state) =>
  state.platformBilling.platformInvoice.list.allIds;
const getPlatformInvoiceData = (state) =>
  state.platformBilling.platformInvoice.byId;

export const getPlatformInvoiceList = createSelector(
  [getPlatformInvoiceIdList, getPlatformInvoiceData],
  (ids, data) => ids.map((id) => data[id]),
);

export const _getPlatformBillingGroupData = (state) =>
  state.platformBilling.platformBillingGroup.data;

export const _getPlatformBillingPlanData = (state) =>
  state.platformBilling.billingPlan.byId;

export const _getPlatformBillingStageData = (state) =>
  state.platformBilling.billingStage.byId;

export const _getPlatformSubscription = (state) =>
  state.platformBilling.platformSubscription.data;

export const _getUpsellPackage = (state, id) => {
  return state.platformBilling.upsellPackage.byId[id];
};

export const getPlatformSubscription = (state) => {
  const platformSubscription = _getPlatformSubscription(state);
  if (!platformSubscription) return null;
  const {
    minimal_platform_billing_stage,
    maximum_platform_billing_stage,
  } = platformSubscription;

  return {
    ...platformSubscription,
    platformBillingGroup: getPlatformBillingGroup(
      state,
      platformSubscription.platform_billing_plan_group,
      minimal_platform_billing_stage,
      maximum_platform_billing_stage,
    ),
    current_platform_billing_stage: getPlatformBillingStage(
      state,
      platformSubscription.current_platform_billing_stage,
    ),
    current_platform_billing_plan: getPlatformBillingPlan(
      state,
      platformSubscription.current_platform_billing_plan,
      minimal_platform_billing_stage,
      maximum_platform_billing_stage,
    ),
    upsell_packages: (platformSubscription.upsell_packages || []).map((up) =>
      _getUpsellPackage(state, up),
    ),
  };
};

export const getPlatformBillingStage = (state, id) => {
  const stageData = state.platformBilling.billingStage.byId[id];
  if (!stageData) {
    return null;
  }
  return {
    ...stageData,
    next_platform_billing_stage: getPlatformBillingStage(
      state,
      stageData.next_platform_billing_stage,
    ),
  };
};

export const getPlatformBillingPlan = (
  state,
  id,
  minimal_platform_billing_stage,
  maximum_platform_billing_stage,
) => {
  const planData = state.platformBilling.billingPlan.byId[id];
  if (!planData) {
    return null;
  }

  const stageList = planData.platform_billing_stages
    .map((stageId) => getPlatformBillingStage(state, stageId))
    .filter((s) => !!s);
  let stageListFiltered = [];

  if (stageList.find((s) => s.id === minimal_platform_billing_stage)) {
    let analyzedStage = stageList.find((ps) => !ps.next_platform_billing_stage);
    if (analyzedStage) {
      // eslint-disable-next-line
      for (let i = 0; i < stageList.length; i++) {
        if (!analyzedStage) break;
        stageListFiltered = [analyzedStage, ...stageListFiltered];
        if (analyzedStage.id === minimal_platform_billing_stage) {
          break;
        }

        analyzedStage = stageList.find(
          // eslint-disable-next-line
          (pl) =>
            pl.next_platform_billing_stage &&
            pl.next_platform_billing_stage.id === analyzedStage.id,
        );
      }
    }
  } else {
    stageListFiltered = stageList;
  }

  if (
    maximum_platform_billing_stage &&
    stageListFiltered.find((s) => s.id === maximum_platform_billing_stage)
  ) {
    let stageListWithMax = [];
    // eslint-disable-next-line
    for (let i = 0; i < stageListFiltered.length; i++) {
      stageListWithMax = [...stageListWithMax, stageListFiltered[i]];
      if (stageListFiltered[i].id === maximum_platform_billing_stage) {
        break;
      }
    }
    stageListFiltered = stageListWithMax;
  }

  return {
    ...planData,
    next_platform_billing_plan: getPlatformBillingPlan(
      state,
      planData.next_platform_billing_plan,
      minimal_platform_billing_stage,
      maximum_platform_billing_stage,
    ),
    platform_billing_stages: stageListFiltered,
  };
};

export const getPlatformBillingGroup = (
  state,
  platfromBillingGroup,
  minimal_platform_billing_stage,
  maximum_platform_billing_stage,
) => {
  const group = state.platformBilling.platformBillingGroup.data;
  if (!group) {
    return null;
  }
  const platformSubscription = _getPlatformSubscription(state);

  const planList = group.platform_billing_plans
    .map((pl) =>
      getPlatformBillingPlan(
        state,
        pl,
        minimal_platform_billing_stage,
        maximum_platform_billing_stage,
      ),
    )
    .filter((pl) => !!pl && pl.platform_billing_stages.length);

  let planFilteredList = [];
  if (minimal_platform_billing_stage) {
    let analyzedPlan = planList.find((pl) => !pl.next_platform_billing_plan);

    // eslint-disable-next-line
    for (let i = 0; i < planList.length; i++) {
      if (!analyzedPlan) break;
      planFilteredList = [analyzedPlan, ...planFilteredList];

      if (
        analyzedPlan.platform_billing_stages.find(
          (s) => s.id === minimal_platform_billing_stage,
        )
      ) {
        break;
      }
      analyzedPlan = planList.find(
        // eslint-disable-next-line
        (pl) =>
          pl.next_platform_billing_plan &&
          pl.next_platform_billing_plan.id === analyzedPlan.id,
      );
    }
  } else {
    planFilteredList = planList;
  }

  let planFilteredWithMaxList = [];
  if (
    maximum_platform_billing_stage &&
    planFilteredList.find((pl) =>
      pl.platform_billing_stages.find(
        (ps) => ps.id === maximum_platform_billing_stage,
      ),
    )
  ) {
    // eslint-disable-next-line
    for (let i = 0; planFilteredList.length; i++) {
      planFilteredWithMaxList = [
        ...planFilteredWithMaxList,
        planFilteredList[i],
      ];
      if (
        planFilteredList[i].platform_billing_stages.find(
          (s) => s.id === maximum_platform_billing_stage,
        )
      ) {
        break;
      }
    }
  } else {
    planFilteredWithMaxList = planFilteredList;
  }

  return {
    ...group,
    platform_billing_plans: planFilteredWithMaxList,
    upsell_packages: group.upsell_packages
      .map((up) => _getUpsellPackage(state, up))
      .filter((up) => !!up)
      .map((up) => {
        return {
          ...up,
          subscribed:
            platformSubscription &&
            (platformSubscription.upsell_packages || []).includes(up.id),
        };
      }),
  };
};
