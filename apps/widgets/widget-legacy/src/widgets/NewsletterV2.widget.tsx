import React from 'react';
import { useDispatch } from 'react-redux';

import { NewsletterFormBase } from '@bsport/saas-legacy/src/components/css-only/NewsletterFormV2';
import { NewsletterV2FieldsKind } from '@bsport/saas-legacy/src/libs/marketplace/constants';
import { createNewsletterMember } from '@bsport/saas-legacy/src/libs/marketing/api';
import {
  snackbarSuccess,
  snackbarError,
} from '@bsport/saas-legacy/src/libs/snackbar/actions';
import themify from '@bsport/saas-legacy/src/hocs/company-themifier.hoc';

import { MarketplaceNewsletterV2Data } from '@bsport/saas-legacy/src/libs/marketplace/types';
import { OptionCallback } from '@bsport/saas-legacy/src/state/types';
import { CompanyTheme } from '@bsport/saas-legacy/src/libs/theme/types';

const NewsletterFormV2Styled = themify(NewsletterFormBase);

type Props = {
  config?: MarketplaceNewsletterV2Data;
  companyId: number;
  theme: CompanyTheme;
};

type MemberParams = {
  email: string;
  first_name: string;
  last_name: string;
  recaptcha: string;
};

export const NewsletterWidget: React.FC<Props> = ({
  companyId,
  theme,
  config,
}) => {
  const dispatch = useDispatch();
  const onError = (options: OptionCallback) => {
    options?.onError?.();
    dispatch(snackbarError('marketing:newsletter.messages.error'));
  };
  const onSubmit = async (
    { email, first_name, last_name, recaptcha }: MemberParams,
    options: OptionCallback,
  ) => {
    try {
      const res = await createNewsletterMember({
        email,
        first_name,
        last_name,
        company: companyId,
        ...(config?.tag_id ? { tag_id: config?.tag_id } : {}),
        recaptcha: recaptcha,
      });

      if (res.status === 200) {
        options?.onSuccess?.();
        dispatch(snackbarSuccess('marketing:newsletter.messages.success'));
      } else {
        onError(options);
      }
    } catch (err) {
      onError(options);
    }
  };

  return (
    <NewsletterFormV2Styled
      fieldsType={
        config?.fieldsType || NewsletterV2FieldsKind.FULL_NAME_AND_EMAIL
      }
      title={config?.title}
      showTitle={config?.showTitle}
      subtitle={config?.subtitle}
      showSubtitle={config?.showSubtitle}
      onSubmit={onSubmit}
      showSuccessTitle={config?.showSuccessTitle}
      successTitle={config?.successTitle}
      showSuccessText={config?.showSuccessText}
      successText={config?.successText}
      theme={theme}
    />
  );
};

export default React.memo(NewsletterWidget);
