export const getSpecificIncompatibilitiesReasons = (
  allIncompatibilities: {
    [offerAndCpp: [offer_id: number, cpp_id: string]]: number[];
  },
  offerId: number,
  cppId: number,
) => (allIncompatibilities || {})[`[${offerId}, ${cppId}]`];
