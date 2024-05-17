export const getSpecificIncompatibilitiesReasons = (
  allIncompatibilities: {
    // @ts-expect-error
    [offerAndCpp: [offer_id: number, cpp_id: string]]: number[];
  },
  offerId: number,
  cppId: number,
  // @ts-expect-error
) => (allIncompatibilities || {})[`[${offerId}, ${cppId}]`];
