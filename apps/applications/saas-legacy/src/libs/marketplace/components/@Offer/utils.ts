import { Offer, OfferREST } from '#src/libs/offer/types';

/**
 * Generates a unique identifier for the provided offer.
 *
 * @param {Offer | OfferREST} offer - The offer for which the identifier is generated.
 * @returns {string} - The generated offer identifier.
 */
export const generateUniqueOfferIdentifier = (
  offer: Offer | OfferREST,
  prefix?: string,
): string => {
  // Check if the offer is not provided
  if (!offer) {
    // Return a default identifier with null values
    return `${`${
      prefix ? `${prefix}::` : ''
    }`}offer_id-${null}::coach_id-${null}::establishment_id-${null}::activity_id-${null}::activity_group_id-${null}`;
  }

  // Determine the coach ID based on whether there is a coach override
  let offerCoachId = offer?.coach_override
    ? offer?.coach_override
    : offer?.coach;

  if (offerCoachId && typeof offerCoachId === 'object') {
    // @ts-expect-error
    offerCoachId = offerCoachId?.id;
  }

  let establishmentId = offer?.establishment;
  if (establishmentId && typeof establishmentId === 'object') {
    // @ts-expect-error
    establishmentId = establishmentId?.id;
  }

  let metaActivityId = offer?.meta_activity;
  if (metaActivityId && typeof metaActivityId === 'object') {
    // @ts-expect-error
    metaActivityId = metaActivityId?.id;
  }

  let offerGroup = offer?.group;
  if (offerGroup && typeof offerGroup === 'object') {
    // @ts-expect-error
    offerGroup = offerGroup?.id;
  }

  // Construct the offer identifier with the relevant information
  return `${`${prefix ? `${prefix}::` : ''}`}offer_id-${
    offer?.id ?? null
  }::coach_id-${offerCoachId ?? null}::establishment_id-${
    establishmentId ?? null
  }::activity_id-${metaActivityId ?? null}::offer_group_id-${
    offerGroup ?? null
  }`;
};
