import React from 'react';
import { useTranslation } from 'react-i18next';

import Card from '#Fabrique/Card';
import { PasscodeLock } from '#src/components/untitledui';
import Button from '#Fabrique/ButtonV2';
import Typography from '#Fabrique/Typography';

import './styles.css';

type Props = {
  loginTitle: string;
  loginSubtitle: string;
  onSignupClick: () => void;
  onLoginClick: () => void;
  showSubtitle: boolean;
  showTitle: boolean;
};

const DisconnectedStatus: React.FC<Props> = ({
  loginTitle,
  loginSubtitle,
  onSignupClick,
  onLoginClick,
  showSubtitle,
  showTitle,
}) => {
  const { t } = useTranslation('login');
  return (
    <Card className="bs-disconnected-status__root">
      <PasscodeLock className="bs-disconnected-status__icon" size="96" />
      <div className="bs-disconnected-status__content-with-button">
        {(showTitle || showSubtitle) && (
          <div className="bs-disconnected-status__content">
            {showTitle && (
              <Typography align="center" variant="title-lg">
                {loginTitle || t('disconnectedStatus.title')}
              </Typography>
            )}
            {showSubtitle && (
              <Typography align="center" variant="body-lg">
                {loginSubtitle || t('disconnectedStatus.subtitle')}
              </Typography>
            )}
          </div>
        )}
        <div className="bs-disconnected-status__bottom-buttons">
          <Button onClick={onSignupClick} size="md" variant="outlined">
            {t('actions.signup.register')}
          </Button>
          <Button onClick={onLoginClick} size="md" variant="contained">
            {t('actions.signin')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(DisconnectedStatus);
