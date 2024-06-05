import React from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import CountDown from '#src/components/time/CountDown.component';
import Alert, { AlertSeverity } from '#src/components/css-only/Alert';

export type Props = {
  expirationDatetime: string;
  onFinish?: () => void;
  classes?: { [key: string]: boolean };
  additionalNode?: React.ReactNode;
};

const SavedSpotCountDown: React.FC<Props> = ({
  expirationDatetime,
  classes,
  onFinish,
  additionalNode,
}) => {
  const { t } = useTranslation('checkout');

  return (
    <div className={classNames(classes)}>
      <CountDown
        onFinish={onFinish}
        timestamp={DateTime.fromISO(expirationDatetime).toSeconds()}
      >
        {(countdown: string) => {
          return countdown ? (
            <>
              <Alert severity={AlertSeverity.WARNING}>
                {t('spotSavedFor', { countdown })}
              </Alert>
              {!!additionalNode && additionalNode}
            </>
          ) : null;
        }}
      </CountDown>
    </div>
  );
};

export default React.memo(SavedSpotCountDown);
