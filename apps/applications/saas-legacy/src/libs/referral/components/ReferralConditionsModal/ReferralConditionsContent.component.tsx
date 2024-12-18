import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import Typography from '#src/components/css-only/Fabrique/Typography';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import type { ReferralConditionsContentProps } from '#src/libs/referral/components/ReferralConditionsModal/types';

import './styles.css';

const ReferralConditionsContent: React.FC<ReferralConditionsContentProps> = ({
  maxReferralUses,
  referredReduction,
  minBasketAmount,
  applicationTimeLimitIntervals,
  applicationTimeLimitUnit,
  referringReward,
  hideReferredReduction,
  hideReferringReward,
}) => {
  const { t } = useTranslation('referral');
  return (
    <div className="bs-referral-conditions-content__root">
      <Typography>
        <Trans i18nKey="conditions.description.maxUses" t={t}>
          Each member has a referral link
          <strong>
            The referring reward can be won {{ maxReferralUses }} times
          </strong>
        </Trans>
      </Typography>
      <Typography className="bs-referral-conditions-content__bulletList">
        {hideReferredReduction ? (
          <Trans i18nKey="conditions.description.signUp.noReduction" t={t}>
            The referred member can sign up and must make their first basket
            according to the following conditions:
            <ul>
              <li>
                minimum basket amount{' '}
                {{
                  minBasketAmount: getCurrencyDisplayWithPrice(minBasketAmount),
                }}
              </li>
              <li>
                application time limit{' '}
                {{
                  applicationTimeLimitIntervals,
                  applicationTimeLimitUnit: t(
                    `conditions.description.applicationTimeLimit.units.${applicationTimeLimitUnit}`,
                    { count: applicationTimeLimitIntervals },
                  ),
                }}
              </li>
            </ul>
          </Trans>
        ) : (
          <Trans i18nKey="conditions.description.signUp.reduction" t={t}>
            The referred member can sign up
            <strong>and receive a reduction of {{ referredReduction }}</strong>
            if the following conditions are met:
            <ul>
              <li>
                minimum basket amount{' '}
                {{
                  minBasketAmount: getCurrencyDisplayWithPrice(minBasketAmount),
                }}
              </li>
              <li>
                application time limit{' '}
                {{
                  applicationTimeLimitIntervals,
                  applicationTimeLimitUnit: t(
                    `conditions.description.applicationTimeLimit.units.${applicationTimeLimitUnit}`,
                    { count: applicationTimeLimitIntervals },
                  ),
                }}
              </li>
            </ul>
          </Trans>
        )}
      </Typography>
      {!hideReferringReward && (
        <div>
          <Typography>
            <Trans i18nKey="conditions.description.reward1" t={t}>
              If the first basket meets the conditions,
              <strong>
                {' '}
                a referring reward of{' '}
                {{
                  referringReward: getCurrencyDisplayWithPrice(referringReward),
                }}{' '}
              </strong>
              can be obtained {{ maxReferralUses }} times
            </Trans>
          </Typography>
          <Typography>{t('conditions.description.reward2')}</Typography>
        </div>
      )}
      <Typography className="bs-referral-conditions-content__italic">
        {t('conditions.description.warning')}
      </Typography>
    </div>
  );
};

export const ReferralConditionsContentStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof ReferralConditionsContent>
>()(ReferralConditionsContent);

export default React.memo(ReferralConditionsContent);
