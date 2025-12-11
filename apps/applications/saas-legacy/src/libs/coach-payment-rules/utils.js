import {
  BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CONFIRMED_BOOKING,
  BONUS_COACH_PAYMENT_RULE_FIXED_VLAUE,
  BONUS_COACH_PAYMENT_RULE_EVERY_BOOKING,
  COACH_PERFORMANCE_FOR_SESSION,
  COACH_PERFORMANCE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule.js';
import axios from 'axios';

import type { ImmutableArray } from 'seamless-immutable';
import type { CoachwithPerformance } from '#src/libs/coach-payment-rules/types';
import type {
  Establishment,
  EstablishmentGroupAPI,
} from '#src/libs/establishment/types';

export const bonusCoachPaymentRuleConstructor = (
  coach_payment_rule_id: number | null,
  params: {
    applicability: number | null,
    kind: number | null,
    bonus: number | null,
    lower_interval: number | null,
    upper_interval: number | null,
  },
) => {
  return {
    ...params,
    coach_payment_rule: coach_payment_rule_id,
    applicability:
      params.applicability ||
      BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CONFIRMED_BOOKING,
    kind: params.kind || BONUS_COACH_PAYMENT_RULE_FIXED_VLAUE,
    bonus: params.bonus || 0,
    lower_interval: params.lower_interval || 1,
    upper_interval: params.upper_interval || null,
  };
};

export const TestBonusesIntervalConformity = (bonusesList) => {
  const bonuses_fixed_values = bonusesList.filter(
    (bonus) => bonus.kind === BONUS_COACH_PAYMENT_RULE_FIXED_VLAUE,
  );
  const bonues_for_every_bookings = bonusesList.filter(
    (bonus) => bonus.kind === BONUS_COACH_PAYMENT_RULE_EVERY_BOOKING,
  );
  const conformity1 = checkConformity(bonuses_fixed_values);
  const conformity2 = checkConformity(bonues_for_every_bookings);
  return conformity1 && conformity2;
};

export const checkConformity = (bonuses) => {
  for (let index = 0; index < bonuses.length - 1; index += 1) {
    if (bonuses[index].upper_interval >= bonuses[index + 1].lower_interval) {
      return false;
    }
  }
  return true;
};

export const openPdfDocument = (response) => {
  const filename = response.data.split('/').at(-1).split('?')[0];
  axios
    .get(response.data, {
      responseType: 'blob',
    })
    .then((res) => {
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    });
};

export const getFilteredAssociatedCoachWithPerformance = (
  selectedEstablishments: number[],
  coachWithPerformance: CoachwithPerformance,
) => {
  return {
    ...coachWithPerformance,
    performance: {
      [COACH_PERFORMANCE_FOR_SESSION]:
        coachWithPerformance?.performance[
          COACH_PERFORMANCE_FOR_SESSION
        ]?.filter((performance) =>
          selectedEstablishments?.includes(performance.establishment_id),
        ) || [],
      [COACH_PERFORMANCE_FOR_APPOINTMENT]:
        coachWithPerformance?.performance[
          COACH_PERFORMANCE_FOR_APPOINTMENT
        ]?.filter((performance) =>
          selectedEstablishments?.includes(performance.establishment_id),
        ) || [],
    },
  };
};

export const getEstablishmentIdsByEstablishmentGroupLocations = (
  selectedLocations: number[],
  establishmentGroupList: EstablishmentGroupAPI[],
) => {
  return (
    selectedLocations?.reduce((acc: number[], establishmentGroupId) => {
      const establishmentsFromGroup = establishmentGroupList?.find(
        (establishmentGroup) => establishmentGroup.id === establishmentGroupId,
      );
      return [
        ...new Set(acc.concat(establishmentsFromGroup?.establishment ?? [])),
      ];
    }, []) || []
  );
};

export const getFilteredEstablishments = (
  selectedEstablishments: number[],
  selectedLocations: number[],
  establishmentGroupList: EstablishmentGroupAPI[],
) => {
  if (selectedEstablishments && selectedEstablishments.length) {
    return selectedEstablishments;
  }
  if (selectedLocations && selectedLocations.length) {
    return getEstablishmentIdsByEstablishmentGroupLocations(
      selectedLocations,
      establishmentGroupList,
    );
  }
  return [];
};

export const getEstablishmentGroupNames = (
  establishmentGroupList: EstablishmentGroupAPI[],
  selectedLocations: number[],
) => {
  const establishmentsGroupsNames =
    establishmentGroupList
      ?.filter((establishmentGroup) =>
        selectedLocations?.includes(establishmentGroup.id),
      )
      ?.map((establishmentGroup) => establishmentGroup.name) || [];

  return establishmentsGroupsNames;
};

export const getEstablishmentNames = (
  establishments: ImmutableArray<Establishment>,
  selectedEstablishments: number[],
) => {
  const establishmentsNames = establishments
    ? [...establishments]
        .filter((establishment) =>
          selectedEstablishments?.includes(establishment.id),
        )
        .map((establishment) => establishment.title)
    : [];

  return establishmentsNames;
};
