import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';

import classNames from 'classnames';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import type { ReferralProgram } from '#src/libs/referral/types';
import { getReferredReduction } from '#src/libs/referral/utils';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { ReferredVoucherTypeChoices } from '#src/libs/referral/constants';

import Typography from '#Fabrique/Typography';
import Button from '#Fabrique/ButtonV2';
import Card from '#Fabrique/Card';
import { Copy06, InfoCircle, UserRight02 } from '#src/components/untitledui';
import LinearProgress from '#Fabrique/LinearProgress';
import Alert from '#Fabrique/Alert';
import ReferralConditionsModal from '#src/libs/referral/components/ReferralConditionsModal';

import './styles.css';

export type Props = {
  hasUnknownError: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  nbRemainingReferralUses: number;
  onLoginClick?: () => void;
  referralLink: string;
  referralProgram: ReferralProgram;
};

const ReferralLinkAndTerms: React.FC<Props> = ({
  hasUnknownError,
  isAuthenticated,
  isLoading,
  nbRemainingReferralUses,
  onLoginClick,
  referralLink,
  referralProgram,
}) => {
  const [showConditions, setShowConditions] = useState(false);
  const { t } = useTranslation(['member', 'referral']);

  const handleOpenConditionsDialog = useCallback(
    () => setShowConditions(true),
    [setShowConditions],
  );

  const handleCloseConditionsDialog = useCallback(
    () => setShowConditions(false),
    [setShowConditions],
  );

  if (isLoading) {
    return (
      <div className="bs-referral-loading">
        <Typography
          className={classNames('bs-referral-loading__title', 'loading')}
          variant="title-sm"
        >
          {t('referral:memberInfo.referralLink')}
        </Typography>
        <LinearProgress />
      </div>
    );
  }

  if (hasUnknownError) {
    return (
      <div className={classNames('bs-referral-error', 'unknown-error')}>
        <Typography
          align="left"
          className={classNames('bs-referral-error__title', 'unknown-error')}
          variant="title-sm"
        >
          {t('referral:referralErrors.somethingWentWrong')}
        </Typography>
      </div>
    );
  }

  if (
    !referralProgram ||
    (isAuthenticated &&
      (nbRemainingReferralUses === undefined || !referralLink))
  ) {
    return (
      <div className={classNames('bs-referral-error', 'no-program')}>
        <Typography
          align="left"
          className={classNames('bs-referral-error__title', 'no-program')}
          variant="title-sm"
        >
          {t('referral:referralErrors.noProgramAvailable')}
        </Typography>
      </div>
    );
  }

  const {
    minimum_basket_amount,
    maximum_referral_uses,
    amount_off_referred,
    percent_off_referred,
    referred_voucher_type,
    application_time_limit_intervals,
    application_time_limit_unit,
    amount_reward_referring,
  } = referralProgram;

  const { referredReduction, hideReferredReduction } = getReferredReduction({
    referred_voucher_type,
    amount_off_referred,
    percent_off_referred,
  });

  const hideReferringReduction = parseFloat(amount_reward_referring) === 0;

  const referredDiscountWithMinus = `${
    referred_voucher_type ===
    ReferredVoucherTypeChoices.REFERRED_VOUCHER_TYPE_PERCENT
      ? ' - '
      : ''
  }${referredReduction}`;

  return (
    <>
      <div className="bs-referral-details">
        <div className="bs-referral-details__title-section">
          <Typography className="bs-referral-details__title" variant="title-sm">
            {t('referral:memberInfo.referralLink')}
          </Typography>
          <Typography
            className="bs-referral-details__subtitle"
            variant="body-md"
          >
            {t('referral:memberInfo.inviteFriend')}
          </Typography>
        </div>
        <RewardsColumn
          hideReferredReduction={hideReferredReduction}
          hideReferringReduction={hideReferringReduction}
          referredReduction={referredDiscountWithMinus}
          referringReduction={getCurrencyDisplayWithPrice(
            amount_reward_referring,
          )}
        />
        <div
          className={classNames(
            'bs-referral-details__button-wrapper',
            'main-button',
            {
              login: !isAuthenticated,
              copy: isAuthenticated,
            },
          )}
        >
          {!isAuthenticated ? (
            <Button
              className="bs-referral-details__login-button"
              leftIcon={<UserRight02 />}
              onClick={onLoginClick}
              size="md"
            >
              {t('referral:memberInfo.loginToUseYourLink')}
            </Button>
          ) : (
            <CopyToClipboard text={referralLink}>
              <Button
                className="bs-referral-details__copy-link-button"
                isDisabled={!nbRemainingReferralUses}
                leftIcon={
                  <Copy06 className="bs-referral-details__copy-link-button-icon" />
                }
                size="md"
              >
                {t('referral:memberInfo.copyReferralLink')}
              </Button>
            </CopyToClipboard>
          )}
        </div>
        {nbRemainingReferralUses === 0 && (
          <Alert
            className="bs-referral-details__alert"
            color="warning"
            title={t('referral:memberInfo.warningMaxUsesReached')}
            variant="weak"
          >
            {t('referral:memberInfo.thanksForSharing')}
          </Alert>
        )}
        <div className="bs-referral-details__footer">
          {isAuthenticated && (
            <div
              className={classNames(
                'bs-referral-details__text-wrapper',
                'number-of-uses-wrapper',
              )}
            >
              <Typography
                className="bs-referral-details__weaker-text"
                variant="body-md"
              >
                {t('referral:memberInfo.nbUsesLeft')}
              </Typography>
              <Typography
                className="bs-referral-details__number-of-uses-text"
                variant="body-md"
              >
                {`${nbRemainingReferralUses}/${maximum_referral_uses}`}
              </Typography>
            </div>
          )}
          <div
            className={classNames(
              'bs-referral-details__button-wrapper',
              'program-info',
            )}
          >
            <Button
              className="bs-referral-details__program-info-button"
              color="grey"
              leftIcon={
                <InfoCircle className="bs-referral-details__program-info-button-icon" />
              }
              onClick={handleOpenConditionsDialog}
              size="sm"
              variant="outlined"
            >
              {t('referral:memberInfo.seeConditions')}
            </Button>
          </div>
        </div>
      </div>

      <ReferralConditionsModal
        applicationTimeLimitIntervals={application_time_limit_intervals}
        applicationTimeLimitUnit={application_time_limit_unit}
        closeConditionsModal={handleCloseConditionsDialog}
        hideReferredReduction={hideReferredReduction}
        hideReferringReward={hideReferringReduction}
        maxReferralUses={maximum_referral_uses}
        minBasketAmount={minimum_basket_amount}
        referredReduction={referredReduction}
        referringReward={amount_reward_referring}
        showConditions={showConditions}
      />
    </>
  );
};

const RewardsColumn = React.memo(
  ({
    referringReduction,
    referredReduction,
    hideReferredReduction,
    hideReferringReduction,
  }: {
    referringReduction: string;
    referredReduction: string;
    hideReferredReduction: boolean;
    hideReferringReduction: boolean;
  }) => {
    const { t } = useTranslation(['member', 'referral']);

    if (hideReferredReduction && hideReferringReduction) {
      return null;
    }

    return (
      <div className="bs-money-section">
        {!hideReferringReduction && (
          <Card
            className={classNames('bs-money-section__card', 'referring')}
            variant="elevated"
          >
            <div
              className={classNames(
                'bs-money-section__card-content',
                'referring',
              )}
            >
              <Typography
                className={classNames(
                  'bs-money-section__weaker-text',
                  'referring',
                )}
                variant="body-md"
              >
                {t('referral:memberInfo.youGet')}
              </Typography>
              <Typography
                className={classNames(
                  'bs-money-section__amount-text',
                  'referring',
                )}
                variant="title-sm"
              >
                {`${referringReduction}`}
              </Typography>
            </div>
          </Card>
        )}
        {!hideReferredReduction && (
          <Card
            className={classNames('bs-money-section__card', 'referred')}
            variant="elevated"
          >
            <div
              className={classNames(
                'bs-money-section__card-content',
                'referred',
              )}
            >
              <Typography
                className={classNames(
                  'bs-money-section__weaker-text',
                  'referred',
                )}
                variant="body-md"
              >
                {t('referral:memberInfo.yourFriendGets')}
              </Typography>
              <Typography
                className={classNames(
                  'bs-money-section__amount-text',
                  'referring',
                )}
                variant="title-sm"
              >
                {`${referredReduction}`}
              </Typography>
            </div>
          </Card>
        )}
      </div>
    );
  },
);

export const ReferralLinkAndTermsForStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ReferralLinkAndTerms>>()(
    ReferralLinkAndTerms,
  );

export default React.memo(ReferralLinkAndTerms);
