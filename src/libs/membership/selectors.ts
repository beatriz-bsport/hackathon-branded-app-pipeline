import { createSelector } from 'reselect';
import { RootState } from '../../reducers';

const _getMembershipData = (state: RootState) => state.membership.byId;
const _getConsumerMembershipIds = (state: RootState) =>
  state.membership.asConsumer.allIds;

export const getMembership = (state: RootState, id: number) => {
  return _getMembershipData(state)[id];
};

export const getActiveMembership = (state: RootState) =>
  _getMembershipData(state)[state.membership.activeMembership];

export const getConsumerMembershipList = createSelector(
  [_getMembershipData, _getConsumerMembershipIds],
  (data, ids) => ids.map((id) => data[id]),
);

export const getCustomFormMissingInformationsList = (state: RootState) =>
  state.membership.notifications.customForm.missingCustomFormInfos;
export const getCustomFormMissingList = createSelector(
  [getCustomFormMissingInformationsList],
  (missing_informations) =>
    missing_informations.map((info) => info.custom_form_id),
);

export const getCustomFormBlockingDisplayRuleIdsList = createSelector(
  [getCustomFormMissingInformationsList],
  (missing_informations) =>
    missing_informations.map((info) => info.custom_form_display_rule_id),
);
