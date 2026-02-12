import React from 'react';
import { useTranslation } from 'react-i18next';

// Fabrique
import Typography from '#src/components/css-only/Fabrique/Typography';
import ButtonV2 from '#src/components/css-only/Fabrique/ButtonV2';
import { TypographyVariant } from '#src/components/css-only/Fabrique/Typography/constants';
import { ButtonColor } from '#src/components/css-only/Fabrique/ButtonV2/constants';
import { useRedirectToUrl } from '../hooks/useRedirectOnSuccess';

type AlreadyMemberSectionProps = {
  loginUrl: string;
};

export const AlreadyMemberSection: React.FC<AlreadyMemberSectionProps> = ({
  loginUrl,
}) => {
  const { t } = useTranslation('booking');
  const redirectToUrl = useRedirectToUrl();
  const redirectToLogin = () => redirectToUrl(loginUrl);

  return (
    <>
      <Typography variant={TypographyVariant.TITLE_SM}>
        {t('oneClickBooking.alreadyMember')}
      </Typography>
      <ButtonV2
        color={ButtonColor.PRIMARY}
        onClick={redirectToLogin}
        size="sm"
        variant="outlined"
      >
        {t('oneClickBooking.goToLogin')}
      </ButtonV2>
    </>
  );
};
