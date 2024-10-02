import React from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { FranchisrEmailDesignTabs } from '#src/pages/franchise/email-template/constants';
type Props = {
  context: FranchisrEmailDesignTabs;
};
export const FranchiseEmailTemplatePageInfo: React.FC<Props> = ({
  context,
}) => {
  const { t } = useTranslation('emailTemplate');

  const { title, description } = React.useMemo(() => {
    switch (context) {
      case FranchisrEmailDesignTabs.OWNED_BY_FRANCHISOR:
        return {
          title: t('franchiseEmailsPage.tabs.ownByFranchisor'),
          description: t(
            'franchiseEmailsPage.informativeAlert.ownedByFranchisor.description',
          ),
        };
      case FranchisrEmailDesignTabs.OWNED_BY_FRANCHISEE:
        return {
          title: t('franchiseEmailsPage.tabs.ownByFranchisee'),
          description: t(
            'franchiseEmailsPage.informativeAlert.ownedByFranchisee.description',
          ),
        };
      case FranchisrEmailDesignTabs.BSPORT_DEFAULT:
        return {
          title: t('bsportTemplateEmails'),
          description: t(
            'franchiseEmailsPage.informativeAlert.bsportDefault.description',
            {
              masterAccountTabName: t(
                'franchiseEmailsPage.tabs.ownByFranchisor',
              ),
            },
          ),
        };
      default:
        return null;
    }
  }, [context, t]);

  if (description && title) {
    return (
      <Alert severity="info" style={{ alignItems: 'center' }}>
        <AlertTitle>{title}</AlertTitle>
        {description}
      </Alert>
    );
  }
  return null;
};

export default React.memo(FranchiseEmailTemplatePageInfo);
