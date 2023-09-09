import React from 'react';
import { useTranslation } from 'react-i18next';

import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import StarIcon from '@material-ui/icons/Star';
import RoomIcon from '@material-ui/icons/Room';
import DateRangeIcon from '@material-ui/icons/DateRange';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DoneIcon from '@material-ui/icons/Done';
import StyleIcon from '@material-ui/icons/Style';
import PeopleIcon from '@material-ui/icons/People';
import BlockIcon from '@material-ui/icons/Block';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import {
  getCreditFactor,
  getCurrencyDisplayWithPrice,
} from '#libs/theme/selectors';

import {
  useCompatibilityInfoForPaymentPackDetailCard,
  useValidityInfoForPaymentPackCard,
  formatOffPeakScheduleOnDisplay,
} from '#libs/marketplace/utils/payment-pack';

import './styles.css';

import { PaymentPack } from '#libs/payment-packs/types';

import {
  PENALTY_KIND_BLOCK_CPP,
  PENALTY_KIND_NEGATIVE_ACCOUNT,
} from '#libs/payment-packs/constants';

type Props = {
  paymentPack: PaymentPack;
  isCompatibleWithAll: boolean;
  onShowCompatibilityDialog: () => void;
  onShowRestrictionDialog: () => void;
  hideCredits?: boolean;
  onShowOffPeakRestrictionDialog: () => void;
};

const PaymentPackDetailList: React.FC<Props> = ({
  paymentPack,
  isCompatibleWithAll,
  onShowCompatibilityDialog,
  onShowRestrictionDialog,
  hideCredits,
  onShowOffPeakRestrictionDialog,
}) => {
  const { t } = useTranslation('marketplace');
  const [isMenuExpanded, setMenuExpanded] = React.useState<Boolean>(false);

  const penaltyThresholdMessage = t(
    'genericCardDetails.includedElements.penaltyNoShow.threshold',
    {
      count: paymentPack.no_show_penalty_threshold,
    },
  );

  const penaltyTimeWindowMessage = t(
    'genericCardDetails.includedElements.penaltyNoShow.penaltyDay',
    {
      count: paymentPack.no_show_penalty_time_window_days,
    },
  );

  const penaltyDaysBlockedMessage =
    paymentPack.no_show_penalty_days_blocked &&
    t('genericCardDetails.includedElements.penaltyNoShow.penaltyDay', {
      count: paymentPack.no_show_penalty_days_blocked,
    });

  const penaltyAmountMessage =
    paymentPack.no_show_penalty_amount &&
    getCurrencyDisplayWithPrice(paymentPack.no_show_penalty_amount);

  const hasRestriction =
    !!paymentPack.max_bookings_per_day ||
    !!paymentPack.max_bookings_per_week ||
    !!paymentPack.max_bookings_per_month;

  const compatibilityInformation =
    useCompatibilityInfoForPaymentPackDetailCard(paymentPack);

  const validityInformation = useValidityInfoForPaymentPackCard(paymentPack);

  const offPeakSchedule = formatOffPeakScheduleOnDisplay(
    paymentPack.off_peak_schedule,
  );

  return (
    <ul className="bs-pack-details-dialog__list">
      {!hideCredits &&
        (paymentPack.unlimited ? (
          <li className="bs-pack-details-dialog__list__item">
            <span className="bs-pack-details-dialog__list__item__icon">
              <AllInclusiveIcon />
            </span>
            {t('genericCardDetails.credits.unlimited')}
          </li>
        ) : (
          <li className="bs-pack-details-dialog__list__item">
            <span className="bs-pack-details-dialog__list__item__icon">
              <StarIcon />
            </span>
            {t('genericCardDetails.credits.availableCredit', {
              count: paymentPack.credits / getCreditFactor(),
            })}
          </li>
        ))}
      {validityInformation && (
        <li className="bs-pack-details-dialog__list__item">
          <span className="bs-pack-details-dialog__list__item__icon">
            <DateRangeIcon />
          </span>
          {validityInformation}
        </li>
      )}
      {isCompatibleWithAll && (
        <li className="bs-pack-details-dialog__list__item">
          <span className="bs-pack-details-dialog__list__item__icon">
            <DoneAllIcon />
          </span>
          <span>{t('genericCardDetails.compatibility.packs.all')}</span>
        </li>
      )}
      {!isCompatibleWithAll && compatibilityInformation && (
        <li className="bs-pack-details-dialog__list__item">
          <span className="bs-pack-details-dialog__list__item__icon">
            <DoneIcon />
          </span>
          <span>
            {compatibilityInformation}
            <button
              className="bs-pack-details-dialog__list__item__link"
              onClick={onShowCompatibilityDialog}
              type="button"
            >
              {t('genericCardDetails.includedElements.see')}
            </button>
          </span>
        </li>
      )}
      {paymentPack.onsite_payment_available && (
        <li className="bs-pack-details-dialog__list__item">
          <span className="bs-pack-details-dialog__list__item__icon">
            <RoomIcon />
          </span>
          {t(`genericCardDetails.includedElements.onsitePaymentAvailable`)}
        </li>
      )}
      {!!paymentPack.linked_private_pass && (
        <li className="bs-pack-details-dialog__list__item">
          <span className="bs-pack-details-dialog__list__item__icon">
            <StyleIcon />
          </span>
          {t(`genericCardDetails.includedElements.isUniversalPass`)}
        </li>
      )}
      {paymentPack.full_vod_access && (
        <li className="bs-pack-details-dialog__list__item">
          <span className="bs-pack-details-dialog__list__item__icon">
            <OndemandVideoIcon />
          </span>
          {t(`genericCardDetails.includedElements.fullVodAccess`)}
        </li>
      )}
      {paymentPack.only_vod_access && (
        <li className="bs-pack-details-dialog__list__item">
          <span className="bs-pack-details-dialog__list__item__icon">
            <OndemandVideoIcon />
          </span>
          {t(`genericCardDetails.includedElements.onlyVodAccess`)}
        </li>
      )}
      {paymentPack.new_member_only && (
        <li className="bs-pack-details-dialog__list__item">
          <span className="bs-pack-details-dialog__list__item__icon">
            <PeopleIcon />
          </span>
          {t(`genericCardDetails.includedElements.newMemberOnly`)}
        </li>
      )}
      {hasRestriction && (
        <li className="bs-pack-details-dialog__list__item sublist">
          <button
            className="bs-pack-details-dialog__list__item__button mobile"
            onClick={onShowRestrictionDialog}
            type="button"
          >
            <div className="bs-pack-details-dialog__list__item__button__content">
              <span className="bs-pack-details-dialog__list__item__icon">
                <BlockIcon />
              </span>
              <span>
                {t('genericCardDetails.includedElements.restrictions.title')}
              </span>
              <span className="bs-pack-details-dialog__list__item__link">
                {t('genericCardDetails.includedElements.see')}
              </span>
            </div>
          </button>
          <button
            className="bs-pack-details-dialog__list__item__button desktop"
            onClick={() => setMenuExpanded(!isMenuExpanded)}
            type="button"
          >
            <div className="bs-pack-details-dialog__list__item__button__content">
              <span className="bs-pack-details-dialog__list__item__icon">
                <BlockIcon />
              </span>
              {t('genericCardDetails.includedElements.restrictions.title')}
            </div>

            {isMenuExpanded ? (
              <ExpandLessIcon className="bs-pack-details-dialog__list__item__button__expand-icon" />
            ) : (
              <ExpandMoreIcon className="bs-pack-details-dialog__list__item__button__expand-icon" />
            )}
          </button>
          {isMenuExpanded && (
            <ul className="bs-pack-details-dialog__list__item__sublist">
              {!!paymentPack.max_bookings_per_day && (
                <li className="bs-pack-details-dialog__list__item__sublist__item">
                  {t(
                    'genericCardDetails.includedElements.restrictions.perDay',
                    { count: paymentPack.max_bookings_per_day },
                  )}
                </li>
              )}
              {!!paymentPack.max_bookings_per_week && (
                <li className="bs-pack-details-dialog__list__item__sublist__item">
                  {t(
                    'genericCardDetails.includedElements.restrictions.perWeek',
                    {
                      count: paymentPack.max_bookings_per_week,
                    },
                  )}
                </li>
              )}
              {!!paymentPack.max_bookings_per_month && (
                <li className="bs-pack-details-dialog__list__item__sublist__item">
                  {t(
                    'genericCardDetails.includedElements.restrictions.perMonth',
                    {
                      count: paymentPack.max_bookings_per_month,
                    },
                  )}
                </li>
              )}
            </ul>
          )}
        </li>
      )}
      {!!paymentPack.max_purchase_per_member && (
        <li className="bs-pack-details-dialog__list__item">
          <span className="bs-pack-details-dialog__list__item__icon">
            <ShoppingCartIcon />
          </span>
          {t('genericCardDetails.includedElements.maxPurchasePerMember', {
            count: paymentPack.max_purchase_per_member,
          })}
        </li>
      )}
      {paymentPack.penalty_active && (
        <li className="bs-pack-details-dialog__list__item">
          <span className="bs-pack-details-dialog__list__item__icon">
            <BlockIcon />
          </span>
          {paymentPack.penalty_kind === PENALTY_KIND_BLOCK_CPP &&
            t('genericCardDetails.includedElements.penalty.days', {
              penalty_days: t(
                'genericCardDetails.includedElements.penalty.penaltyDay',
                {
                  count: paymentPack.penalty_days_blocked,
                },
              ),
              penalty_cancellations: t(
                'genericCardDetails.includedElements.cancellation',
                {
                  count: paymentPack.penalty_nb_late_cancellations,
                },
              ),
              penalty_days_period: t(
                'genericCardDetails.includedElements.penalty.penaltyDay',
                {
                  count: paymentPack.penalty_nb_days,
                },
              ),
            })}
          {paymentPack.penalty_kind === PENALTY_KIND_NEGATIVE_ACCOUNT &&
            t('genericCardDetails.includedElements.penalty.amount', {
              penalty_amount: getCurrencyDisplayWithPrice(
                paymentPack.penalty_account_value,
              ),
              penalty_cancellations: t(
                'genericCardDetails.includedElements.cancellation',
                { count: paymentPack.penalty_nb_late_cancellations },
              ),
              penalty_days_period: t(
                'genericCardDetails.includedElements.penalty.penaltyDay',
                { count: paymentPack.penalty_nb_days },
              ),
            })}
        </li>
      )}
      {paymentPack.no_show_penalty_active && (
        <li className="bs-pack-details-dialog__list__item">
          <span className="bs-pack-details-dialog__list__item__icon">
            <BlockIcon />
          </span>
          {paymentPack.no_show_penalty_kind === PENALTY_KIND_BLOCK_CPP &&
            t('genericCardDetails.includedElements.penaltyNoShow.block', {
              days_blocked: penaltyDaysBlockedMessage,
              threshold: penaltyThresholdMessage,
              time_window_days: penaltyTimeWindowMessage,
            })}
          {paymentPack.no_show_penalty_kind === PENALTY_KIND_NEGATIVE_ACCOUNT &&
            t('genericCardDetails.includedElements.penaltyNoShow.account', {
              amount: penaltyAmountMessage,
              threshold: penaltyThresholdMessage,
              time_window_days: penaltyTimeWindowMessage,
            })}
        </li>
      )}
      {!!Object.keys(offPeakSchedule).length && (
        <li className="bs-pack-details-dialog__list__item">
          <span className="bs-pack-details-dialog__list__item__icon">
            <AccessTimeIcon />
          </span>
          <span>
            {t('genericCardDetails.includedElements.offPeakRestrictions.title')}
            <button
              className="bs-pack-details-dialog__list__item__link"
              onClick={onShowOffPeakRestrictionDialog}
              type="button"
            >
              {t('genericCardDetails.includedElements.see')}
            </button>
          </span>
        </li>
      )}
    </ul>
  );
};
export default PaymentPackDetailList;
