import React from 'react';

import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import TriggerForm, { Values } from '../Trigger/components';

import useConnectedTriggerFormStyles from './styles.hook';

import type { BaseFormComponentProps } from './types';
import type { OptionCallback } from '../../../../../state/types';

type MarketingActionsProps = BaseFormComponentProps & {
  onSubmit: (data: Values, options?: OptionCallback) => void;
};
export const StepMarketingActionsForm: React.FC<MarketingActionsProps> = ({
  smartlists,
  tagList,
  emailListLoading,
  emails,
  emailDetailLoading,
  emailDetails,
  getEmails,
  getEmailDetail,
  onSubmit,
  viewMode,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useConnectedTriggerFormStyles();

  const handleSubmitForm = (data: Values, options: OptionCallback) => {
    onSubmit(data, options);
  };

  return (
    <div>
      <div className={classes.title}>
        <Typography variant="h6">{t('cadence.marketingElement')}</Typography>
      </div>
      <Divider />
      <TriggerForm
        onlyMarketingActions
        withMarketingActions
        smartlists={smartlists}
        tagList={tagList}
        onSubmit={handleSubmitForm}
        emailListLoading={emailListLoading}
        emails={emails}
        emailDetailLoading={emailDetailLoading}
        emailDetails={emailDetails}
        getEmails={getEmails}
        getEmailDetail={getEmailDetail}
        viewMode={viewMode}
      />
    </div>
  );
};

export default StepMarketingActionsForm;
