import type { TFunction } from 'i18next';

import DESIGN_WORKFLOW from '#src/libs/sequential_marketing/images/template-covers/design-workflow.jpg';

import type { CadenceConfigData, CadenceTemplate } from '../types';

const getAbandonedCheckoutConfig = (t: TFunction): CadenceConfigData => {
  return {
    name: t('audience.template.configs.abandonedCartRecovery.name'),
    is_multiple_visit_allowed: false,
    initial_config: {
      entry_list: [],
      win_exit_list: [],
      lose_exit_list: [],
    },
    steps: [],
  };
};

export const AbandonedCheckoutRecovery: CadenceTemplate = {
  description: 'audience.template.configs.abandonedCartRecovery.description',
  cover: DESIGN_WORKFLOW,
  getConfig: getAbandonedCheckoutConfig,
};
