import { Offer } from '#libs/offer/types';

/**
 * Generates a unique identifier for the provided offer.
 *
 * @param {Offer} offer - The offer for which the identifier is generated.
 * @returns {string} - The generated offer identifier.
 */
export const generateUniqueOfferIdentifier = (
  offer: Offer,
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
  const offerCoachId = offer?.coach_override
    ? offer?.coach_override
    : offer?.coach;

  // Construct the offer identifier with the relevant information
  return `bs-card-offer::offer_id-${offer?.id ?? null}::coach_id-${
    offerCoachId ?? null
  }::establishment_id-${offer?.establishment ?? null}::activity_id-${
    offer?.meta_activity ?? null
  }::offer_group_id-${offer?.group ?? null}`;
};
