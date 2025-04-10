import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import type {
  AutomatedCampaign,
  CreateAutomatedCampaign,
  EditAutomatedCampaign,
} from '#src/libs/smart-list/types';
import type { OptionCallback } from '#src/state/types';
import {
  createSmartListAutomatedCampaign as createSmartListAutomatedCampaignAction,
  updateSmartListAutomatedCampaign as updateSmartListAutomatedCampaignAction,
} from '#src/libs/smart-list/actions';

export type AutomatedCampaignParams = {
  data: CreateAutomatedCampaign;
  options?: OptionCallback<AutomatedCampaign>;
};

export type UpdateAutomatedCampaignParams = {
  automatedCampaignId: number;
  data: EditAutomatedCampaign;
  options?: OptionCallback<AutomatedCampaign>;
};

export const useAutomatedCampaigns = () => {
  const dispatch = useDispatch();

  const createAutomatedCampaignCommunication = useCallback(
    ({ data, options }: AutomatedCampaignParams) => {
      dispatch(
        createSmartListAutomatedCampaignAction(data, {
          ...options,
          onSuccess: () => {
            options?.onSuccess?.();
          },
        }),
      );
    },
    [dispatch],
  );

  const editAutomatedCampaignCommunication = useCallback(
    ({ automatedCampaignId, data, options }: UpdateAutomatedCampaignParams) => {
      dispatch(
        updateSmartListAutomatedCampaignAction(automatedCampaignId, data, {
          ...options,
          onSuccess: () => {
            options?.onSuccess?.();
          },
        }),
      );
    },
    [dispatch],
  );

  return {
    createAutomatedCampaignCommunication,
    editAutomatedCampaignCommunication,
  };
};
