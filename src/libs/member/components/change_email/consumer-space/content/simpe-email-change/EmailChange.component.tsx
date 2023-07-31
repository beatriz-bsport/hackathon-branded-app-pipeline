import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChangeEmailRequest } from '#libs/member/types';
import { CompanyTheme } from '#libs/theme/types';
import {
  ContentTitle,
  SpacedText,
  EmailDetailContent,
  ContentActions,
} from '../../GenericFields.components';

type SimpleEmailChangeContentProps = {
  request: ChangeEmailRequest;
  companyTheme: CompanyTheme;
  onConfirm: () => void;
  onDenied: () => void;
};
export const SimpleEmailChangeContent = (
  props: SimpleEmailChangeContentProps,
) => {
  const { t } = useTranslation('member');
  const { request, companyTheme, onConfirm, onDenied } = props;
  return (
    <>
      <ContentTitle
        title={t('changeEmailRequest.memberPage.simpleEmailChange.title')}
      />
      <SpacedText
        text={t('changeEmailRequest.memberPage.requestingStudio', {
          company: companyTheme?.company_name,
        })}
      />
      <EmailDetailContent
        old_email={request?.old_email}
        new_email={request?.new_email}
      />
      <SpacedText
        text={t(
          'changeEmailRequest.memberPage.simpleEmailChange.acceptRequestHelper',
        )}
      />
      <SpacedText
        text={t(
          'changeEmailRequest.memberPage.simpleEmailChange.deniedRequestHelper',
        )}
      />
      <ContentActions
        onConfirm={onConfirm}
        onDenied={onDenied}
        confirmText={t('changeEmailRequest.memberPage.actions.confirm')}
        denyText={t('changeEmailRequest.memberPage.actions.cancel')}
      />
    </>
  );
};

export default SimpleEmailChangeContent;
