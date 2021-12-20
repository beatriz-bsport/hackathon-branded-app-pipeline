import React from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyTheme } from '#libs/theme/types';
import { ContentTitle, SpacedText } from '../../GenericFields.components';

type UnAuthorizedContentProps = {
  companyTheme: CompanyTheme;
};

export const UnAuthorizedContent = (props: UnAuthorizedContentProps) => {
  const { t } = useTranslation('member');
  const { companyTheme } = props;
  return (
    <>
      <ContentTitle
        title={t('changeEmailRequest.memberPage.unAuthorizedAccess.title')}
        iconType="blocked"
      />
      <SpacedText
        text={t('changeEmailRequest.memberPage.unAuthorizedAccess.helper', {
          company: companyTheme?.company_name,
        })}
      />
      <SpacedText
        text={t(
          'changeEmailRequest.memberPage.unAuthorizedAccess.contactCompany',
          { company: companyTheme?.company_name },
        )}
      />
    </>
  );
};

export default UnAuthorizedContent;
