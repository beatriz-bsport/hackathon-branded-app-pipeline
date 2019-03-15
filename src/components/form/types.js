// @flow
export type BonusRule = {
  threshold: number,
  fixedBonus: number,
  variableBonus: number,
  id: number,
};

export type PerformanceCalculationRule = {
  pricePerOffer: number,
  dateStart: Object,
  dateEnd: Object,
  bonusRules: Array<BonusRule>,
};
