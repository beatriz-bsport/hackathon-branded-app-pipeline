import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CHANGE_MEMBER_EMAIL_BLOCKED_BY_DELAY_EXCEEDED,
  CHANGE_EMAIL_CANCELLED_AND_RENEWED_BY_MANAGER,
  CHANGE_EMAIL_BLOCKED_BY_DST_MEMBER,
  CHANGE_EMAIL_BLOCKED_BY_SRC_MEMBER,
  CHANGE_EMAIL_BLOCKED_BY_NEW_USER_WITH_SAME_EMAIL,
  CHANGE_EMAIL_REQUEST_ACCEPTED,
} from '@bsport/common/lib/master-data/change-email-request';
import { CompanyTheme } from '#libs/theme/types';
import { ChangeEmailRequest } from '#libs/member/types';
import { Membership } from '#libs/membership/types';
import {
  ContentTitle,
  SpacedText,
  EmailDetailContent,
} from '../../GenericFields.components';

type ErrorContentProps = {
  request: ChangeEmailRequest;
  companyTheme: CompanyTheme;
  membership: Membership;
};
export const ErrorContent = (props: ErrorContentProps) => {
  const { t } = useTranslation('member');
  const { request, companyTheme, membership } = props;
  if (
    request?.status === CHANGE_EMAIL_REQUEST_ACCEPTED &&
    request?.src_company_member === membership?.id
  ) {
    return (
      <>
        <ContentTitle
          title={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.alreadyAccepted.title',
          )}
        />
        <SpacedText
          text={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.alreadyAccepted.helper',
            { company: companyTheme?.company_name },
          )}
        />
        <SpacedText
          text={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.alreadyAccepted.contactCompany',
          )}
        />
        <SpacedText
          text={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.alreadyAccepted.currentEmail',
            {
              email: request?.new_email,
            },
          )}
        />
      </>
    );
  }
  if (
    request?.status === CHANGE_EMAIL_BLOCKED_BY_SRC_MEMBER &&
    request?.src_company_member === membership?.id
  ) {
    return (
      <>
        <ContentTitle
          title={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.alreadyDenied.title',
          )}
        />
        <SpacedText
          text={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.alreadyDenied.helper',
            { company: companyTheme?.company_name },
          )}
        />
        <SpacedText
          text={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.alreadyDenied.contactCompany',
          )}
        />
        <SpacedText
          text={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.alreadyDenied.currentEmail',
            {
              email: request?.old_email,
            },
          )}
        />
      </>
    );
  }
  if (
    request?.status === CHANGE_EMAIL_CANCELLED_AND_RENEWED_BY_MANAGER &&
    request?.src_company_member === membership?.id
  ) {
    return (
      <>
        <ContentTitle
          title={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.renewed.title',
          )}
        />
        <SpacedText
          text={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.renewed.helper',
            { company: companyTheme?.company_name },
          )}
        />
        <SpacedText
          text={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.renewed.contactCompany',
          )}
        />
      </>
    );
  }
  if (
    request?.status === CHANGE_MEMBER_EMAIL_BLOCKED_BY_DELAY_EXCEEDED &&
    request?.src_company_member === membership?.id
  ) {
    return (
      <>
        <ContentTitle
          title={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.delayExceeded.title',
          )}
        />
        <SpacedText
          text={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.delayExceeded.helper',
            { company: companyTheme?.company_name },
          )}
        />
        <SpacedText
          text={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.delayExceeded.contactCompany',
          )}
        />
      </>
    );
  }
  if (
    request?.status === CHANGE_EMAIL_BLOCKED_BY_NEW_USER_WITH_SAME_EMAIL &&
    request?.src_company_member === membership?.id
  ) {
    return (
      <>
        <ContentTitle
          title={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.emailTaken.title',
          )}
        />
        <SpacedText
          text={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.emailTaken.helper',
            { company: companyTheme?.company_name },
          )}
        />
        <EmailDetailContent
          old_email={request?.old_email}
          new_email={request?.new_email}
        />
        <SpacedText
          text={t(
            'changeEmailRequest.memberPage.simpleEmailChange.error.emailTaken.contactCompany',
            { email: request?.new_email },
          )}
        />
      </>
    );
  }
  if (
    request?.status === CHANGE_EMAIL_BLOCKED_BY_SRC_MEMBER ||
    request?.status === CHANGE_EMAIL_BLOCKED_BY_DST_MEMBER
  ) {
    return (
      <>
        <ContentTitle
          title={t(
            'changeEmailRequest.memberPage.linkAccount.error.denied.title',
          )}
        />
        <SpacedText
          text={t(
            'changeEmailRequest.memberPage.linkAccount.error.denied.helper',
            { company: companyTheme?.company_name },
          )}
        />
        <EmailDetailContent
          old_email={request?.old_email}
          new_email={request?.new_email}
        />
        <SpacedText
          text={t(
            'changeEmailRequest.memberPage.linkAccount.error.denied.contactCompany',
            { email: request?.new_email },
          )}
        />
      </>
    );
  }
  return (
    <>
      <ContentTitle
        title={t('changeEmailRequest.memberPage.generalError.title')}
      />
      <SpacedText
        text={t('changeEmailRequest.memberPage.generalError.helper', {
          company: companyTheme?.company_name,
        })}
      />
      <EmailDetailContent
        old_email={request?.old_email}
        new_email={request?.new_email}
      />
      <SpacedText
        text={t('changeEmailRequest.memberPage.generalError.contactCompany', {
          email: request?.new_email,
        })}
      />
    </>
  );
};

export default ErrorContent;
