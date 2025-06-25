import { Result } from "typescript-result";

import { type Action, createErrorWithContext } from "@bsport/store-base";

import {
  fetchReferralProgramSettingsAPI,
  updateReferralProgramSettingsAPI,
} from "#src/api";
import type {
  ReferralSettings,
  UpdateReferralProgramSettingsPayload,
} from "#src/types";

import { setReferralSettings } from "./store";

/**
 * Fetches the company referral program settings.
 * @returns An object containing all the settings of the referral program.
 */
export const fetchReferralProgramSettingsAction: Action<
  void,
  ReferralSettings
> = async (fetch) => {
  const [uri, init] = fetchReferralProgramSettingsAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setReferralSettings(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch referral program settings",
      }),
  );
};

/**
 * Updates the company referral program settings.
 *
 * @param params - The new settings to update the referral program with.
 * @param params.id - The unique identifier of the referral program.
 * @param params.name - The name of the referral program.
 * @param params.company - The unique identifier of the company.
 * @param params.minimum_basket_amount - The minimum basket amount required to apply the referral (as a string representing a decimal value).
 * @param params.maximum_referral_uses - The maximum number of times the referral can be used (from 1 to 5).
 * @param params.amount_off_referred - The fixed discount amount for the referred user (as a string representing a decimal value).
 * @param params.percent_off_referred - The percentage discount for the referred user.
 * @param params.referred_voucher_type - The type of voucher for the referred user ("amount_off", "percent_off").
 * @param params.application_time_limit_intervals - The number of time intervals for which the referral bonus is valid.
 * @param params.application_time_limit_unit - The unit of time for the validity period for the referral bonus ("days", "weeks" or "months").
 * @param params.amount_reward_referring - The reward amount for the referring user (as a string representing a decimal value).
 * @param params.redirect_link - The URL to redirect the user after a successful referral.
 * @param params.tag_referred_member - An optional tag to assign to the referred member (unique identifier of the tag or nullable).
 * @returns An object containing the updated referral program settings.
 *
 * @example
 * const updatedProgram = updateReferralProgram({
 *   id: 1,
 *   name: "referral_program_2",
 *   company: 2,
 *   minimum_basket_amount: "50.03",
 *   maximum_referral_uses: 1,
 *   amount_off_referred: "100.00",
 *   percent_off_referred: 10,
 *   referred_voucher_type: "amount_off",
 *   application_time_limit_intervals: 1,
 *   application_time_limit_unit: "weeks",
 *   amount_reward_referring: "30.00",
 *   redirect_link: "https://backoffice.bsport.io",
 *   tag_referred_member: null
 * });
 */
export const updateReferralProgramSettingsAction: Action<
  UpdateReferralProgramSettingsPayload,
  ReferralSettings
> = async (fetch, params) => {
  const [uri, init] = updateReferralProgramSettingsAPI({ data: params });

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setReferralSettings(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to update referral program settings",
        context: {
          params,
        },
      }),
  );
};
