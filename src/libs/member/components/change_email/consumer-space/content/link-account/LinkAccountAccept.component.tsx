import React from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyTheme } from '#libs/theme/types';
import { ChangeEmailRequest } from '#libs/member/types';
import {
  ContentTitle,
  SpacedText,
  ContentActions,
} from '../../GenericFields.components';

type LinkAccountAcceptContentProps = {
  request: ChangeEmailRequest;
  companyTheme: CompanyTheme;
  onConfirm: () => void;
  onDenied: () => void;
};

export const LinkAccountAcceptContent = (
  props: LinkAccountAcceptContentProps,
) => {
  const { t } = useTranslation('member');
  const { request, companyTheme, onDenied, onConfirm } = props;
  return (
    <>
      <ContentTitle
        title={t('changeEmailRequest.memberPage.linkAccount.title')}
      />
      <SpacedText
        text={t(
          'changeEmailRequest.memberPage.linkAccount.dstUser.requestingStudio',
          {
            company: companyTheme.company_name,
            old_email: request.old_email,
            new_email: request.new_email,
          },
        )}
      />
      <SpacedText
        text={t(
          'changeEmailRequest.memberPage.linkAccount.dstUser.notMemberYet',
          {
            company: companyTheme.company_name,
            old_email: request.old_email,
            new_email: request.new_email,
          },
        )}
      />
      <SpacedText
        text={t(
          'changeEmailRequest.memberPage.linkAccount.dstUser.acceptRequestHelper',
        )}
      />
      <SpacedText
        text={t(
          'changeEmailRequest.memberPage.linkAccount.dstUser.deniedRequestHelper',
          {
            company: companyTheme.company_name,
          },
        )}
      />
      <ContentActions
        onConfirm={onConfirm}
        confirmText={t('changeEmailRequest.memberPage.actions.confirmFusion')}
        onDenied={onDenied}
        denyText={t('changeEmailRequest.memberPage.actions.deniedFusion')}
      />
    </>
  );
};

export default LinkAccountAcceptContent;
