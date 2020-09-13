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
  return {
    ...platformSubscription,
    platformBillingGroup: getPlatformBillingGroup(
      state,
      platformSubscription.platform_billing_plan_group,
    ),
    current_platform_billing_stage: getPlatformBillingStage(
      state,
      platformSubscription.current_platform_billing_stage,
    ),
    current_platform_billing_plan: getPlatformBillingPlan(
      state,
      platformSubscription.current_platform_billing_plan,
    ),
    upsell_packages: platformSubscription.upsell_packages.map((up) =>
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

export const getPlatformBillingPlan = (state, id) => {
  const planData = state.platformBilling.billingPlan.byId[id];
  if (!planData) {
    return null;
  }
  return {
    ...planData,
    next_platform_billing_plan: getPlatformBillingPlan(
      state,
      planData.next_platform_billing_plan,
    ),
    platform_billing_stages: planData.platform_billing_stages.map((stageId) =>
      getPlatformBillingStage(state, stageId),
    ),
  };
};

export const getPlatformBillingGroup = (state) => {
  const group = state.platformBilling.platformBillingGroup.data;
  if (!group) {
    return null;
  }
  const platformSubscription = _getPlatformSubscription(state);
  return {
    ...group,
    platform_billing_plans: group.platform_billing_plans.map((pl) =>
      getPlatformBillingPlan(state, pl),
    ),
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
