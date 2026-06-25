import type {
  CreateGroupSessionsPayload,
  GroupSessionOfferPayload,
  GroupSessionWithOffers,
  PrepareGroupSessionsCreationResponse,
} from "@bsport/api-book";

type GroupSessionPreviewGroupPayload = GroupSessionWithOffers["group"] & {
  last_offer_date?: string | null;
};

const normalizeOfferForGroupCreation = (
  offer: GroupSessionOfferPayload,
): GroupSessionOfferPayload => {
  // `generate_preview/` returns `coach_payment_rule`, while final creation
  // reads `coach_payment_rule_id`. Destructuring documents the discarded
  // preview-only fields and keeps them out of the create payload.
  const {
    id: _previewOfferId,
    coach_payment_rule: previewCoachPaymentRule,
    coach_payment_rule_id: previewCoachPaymentRuleId,
    ...offerForCreation
  } = offer;
  const coachPaymentRuleId =
    previewCoachPaymentRuleId ?? previewCoachPaymentRule ?? null;

  return {
    ...offerForCreation,
    allow_guest_offer: offerForCreation.allow_guest_offer ?? false,
    available: true,
    coach_payment_rule_id: coachPaymentRuleId,
  };
};

const normalizeGroupForCreation = (
  groupSessionWithOffers: GroupSessionWithOffers,
): GroupSessionWithOffers => {
  // The preview response is not a valid create payload as-is. `_preview...`
  // bindings intentionally discard metadata that would either update/link an
  // existing recurrence or pass read-only values into `OfferGroup.objects.create`.
  const previewGroup =
    groupSessionWithOffers.group as GroupSessionPreviewGroupPayload;
  const {
    first_offer_date: _previewFirstOfferDate,
    last_offer_date: _previewLastOfferDate,
    id: _previewGroupId,
    offers: _previewOfferIds,
    recurrence_id: _previewRecurrenceId,
    recurrence_index: _previewRecurrenceIndex,
    recurrence_rule: _previewRecurrenceRule,
    ...groupForCreation
  } = previewGroup;

  return {
    group: {
      ...groupForCreation,
      available: true,
    },
    offers_data: groupSessionWithOffers.offers_data.map(
      normalizeOfferForGroupCreation,
    ),
  };
};

export const normalizePreparedGroupSessionsForCreation = (
  previewResponse: PrepareGroupSessionsCreationResponse,
): CreateGroupSessionsPayload => {
  // `create_groups_with_offers/` expects the same group index map returned by
  // preview, but with each group/offer cleaned for final creation.
  return {
    group_data_with_offers: Object.entries(previewResponse).reduce<
      CreateGroupSessionsPayload["group_data_with_offers"]
    >((normalizedGroups, [groupIndex, groupSessionWithOffers]) => {
      normalizedGroups[Number(groupIndex)] = normalizeGroupForCreation(
        groupSessionWithOffers,
      );
      return normalizedGroups;
    }, {}),
  };
};
