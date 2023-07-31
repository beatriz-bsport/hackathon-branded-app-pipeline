import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import { CompanyTheme } from '#libs/theme/types';
import { ChangeEmailRequest } from '#libs/member/types';
import {
  ContentTitle,
  SpacedText,
  EmailDetailContent,
  ContentActions,
} from '../../GenericFields.components';

type LinkAccountVetoContentProps = {
  request: ChangeEmailRequest;
  companyTheme: CompanyTheme;
  onDenied: () => void;
};

export const LinkAccountVetoContent = (props: LinkAccountVetoContentProps) => {
  const { t } = useTranslation('member');
  const { request, companyTheme, onDenied } = props;
  return (
    <>
      <ContentTitle
        title={t('changeEmailRequest.memberPage.linkAccount.title')}
      />
      <Typography variant="body1">
        {t('changeEmailRequest.memberPage.requestingStudio', {
          company: companyTheme?.company_name,
        })}
      </Typography>
      <EmailDetailContent
        old_email={request?.old_email}
        new_email={request?.new_email}
      />
      <SpacedText
        text={t(
          'changeEmailRequest.memberPage.linkAccount.veto.requestExplanation',
          {
            company: companyTheme.company_name,
            email: request?.new_email,
          },
        )}
      />
      <SpacedText
        text={t(
          'changeEmailRequest.memberPage.linkAccount.veto.acceptRequestHelper',
          {
            email: request?.new_email,
          },
        )}
      />
      <SpacedText
        text={t(
          'changeEmailRequest.memberPage.linkAccount.veto.deniedRequestHelper',
        )}
      />
      <ContentActions
        onDenied={onDenied}
        denyText={t('changeEmailRequest.memberPage.actions.deniedFusion')}
      />
    </>
  );
};

export default LinkAccountVetoContent;
