import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import StarIcon from '@material-ui/icons/Star';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ReplayIcon from '@material-ui/icons/Replay';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Card, { CardSize } from '#csscomponents/Card';
import Content from '#csscomponents/Card/CardContent';
import Grid from '#csscomponents/Grid';
import Item, { Justification } from '#csscomponents/Grid/GridItem';
import Price, { Color } from '#csscomponents/Price';
import CircularProgress from '#components/css-only/CircularProgress';


import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import { PaymentPack } from '#libs/payment-packs/types';
import { PrivatePass } from '#libs/private-service/types';
import { PaymentCombo } from '#libs/payment-combo/types';
import { Contract } from '#libs/subscription/types';
import BillingInterval from '../MarketplaceBillingInterval';

import './styles.css';

export type Props = {
  isExcludingTax?: boolean;
  isContractObjectLoading: boolean;
  contract: Contract;
  getPaymentPackSelected: (id: number) => PaymentPack;
  getPrivatePassSelected: (id: number) => PrivatePass;
  getPaymentComboSelected: (id: number) => PaymentCombo;
};

const ContractDetailList: React.FC<Props> = React.memo(
  ({
    isContractObjectLoading,
    contract,
    getPaymentPackSelected,
    getPrivatePassSelected,
    getPaymentComboSelected,
  }) => {
    const { t } = useTranslation('marketplace');

    const objectIncludedInContract = React.useMemo(() => {
      if (contract?.payment_pack && getPaymentPackSelected) {
        return getPaymentPackSelected(contract?.payment_pack);
      }
      if (contract?.private_pass && getPrivatePassSelected) {
        return getPrivatePassSelected(contract?.private_pass);
      }
      if (contract?.payment_combo && getPaymentComboSelected) {
        return getPaymentComboSelected(contract?.payment_combo);
      }
      return null;
    }, [
      contract?.payment_combo,
      contract?.payment_pack,
      contract?.private_pass,
      getPaymentComboSelected,
      getPaymentPackSelected,
      getPrivatePassSelected,
    ]);

    return (
      <ul className="bs-description-details__list">
        {isContractObjectLoading && <CircularProgress size="sm" />}
        {!!objectIncludedInContract && (
          <li className="bs-description-details__list__item">
            <span className="bs-description-details__list__item__icon">
              <StarIcon />
            </span>
            <span className="bs-description-details__list__item__text">
              {objectIncludedInContract.name}
            </span>
          </li>
        )}
        {!!contract?.nb_interval && (
          <li className="bs-description-details__list__item">
            <span className="bs-description-details__list__item__icon">
              <ReceiptIcon />
            </span>
            <span className="bs-description-details__list__item__text">
              {t('marketplace:contractCard.invoice', {
                count: contract.nb_interval,
              })}
            </span>
          </li>
        )}
        {contract?.auto_renewal && (
          <li className="bs-description-details__list__item">
            <span className="bs-description-details__list__item__icon">
              <ReplayIcon />
            </span>
            <span className="bs-description-details__list__item__text">
              {t(`marketplace:contractCard.autoRenewal`)}
            </span>
          </li>
        )}
      </ul>
    );
  },
);

const MarketplaceContractDetail: React.FC<Props> = React.memo(
  ({
    isContractObjectLoading,
    contract,
    isExcludingTax,
    getPaymentPackSelected,
    getPrivatePassSelected,
    getPaymentComboSelected,
  }) => {
    const { t } = useTranslation('marketplace');
    const flatFees = getCurrencyDisplayWithPrice(contract?.flat_fee);

    const shouldDisplayFlatFee =
      !!contract?.flat_fee && parseFloat(contract?.flat_fee) > 0;

    return (
      <Card
        classes={{
          'bs-contract-details__card': 'bs-contract-details__card',
        }}
        size={CardSize.AUTO}
      >
        <div className="bs-contract-details__container">
          <Content
            padding
            classes={{
              'bs-contract-details__header': 'bs-contract-details__header',
            }}
          >
            <Grid
              classes={{
                'bs-contract-details__header-grid':
                  'bs-contract-details__header-grid',
              }}
            >
              <Item
                columnEnd={1}
                columnStart={1}
                justification={Justification.FLEX_START}
                rowStart={1}
              >
                <div className="bs-contract-details__header__title-container">
                  <h3 className="bs-contract-details__header__title">
                    {contract?.name}
                  </h3>
                </div>
                <ContractDetailList
                  contract={contract}
                  getPaymentComboSelected={getPaymentComboSelected}
                  getPaymentPackSelected={getPaymentPackSelected}
                  getPrivatePassSelected={getPrivatePassSelected}
                  isContractObjectLoading={isContractObjectLoading}
                />
              </Item>
              <Item
                classes={{
                  'bs-contract__header__price-container--desktop':
                    'bs-contract__header__price-container--desktop',
                }}
                columnEnd={2}
                columnStart={2}
                justification={Justification.FLEX_START}
                rowEnd={1}
                rowStart={1}
              >
                <Price
                  amount={contract?.recurrent_price ?? 0}
                  classes={{
                    'bs-contract-card__header__price':
                      'bs-contract-card__header__price',
                  }}
                  color={Color.PRIMARY}
                  formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                  isExcludingTax={isExcludingTax}
                  tax={parseFloat(contract?.tax) || 0}
                >
                  <BillingInterval
                    flatFee={contract?.flat_fee}
                    interval={contract?.interval}
                    recurrenceBasis={contract?.recurrence_basis}
                  />
                </Price>
                {shouldDisplayFlatFee && (
                  <div className="bs-contract-card__subtitle">
                    {t('contractCard.fees', {
                      fees: flatFees,
                    })}
                  </div>
                )}
              </Item>
            </Grid>
          </Content>
          <Content>
            <Grid
              classes={{
                'bs-contract-details__grid': 'bs-contract-details__grid',
              }}
            >
              <Item
                classes={{
                  'bs-contract-details__item': 'bs-contract-details__item',
                }}
              >
                <div className="bs-contract__header__price-container--mobile">
                  <Price
                    amount={contract?.recurrent_price}
                    classes={{
                      'bs-contract-card__header__price':
                        'bs-contract-card__header__price',
                    }}
                    color={Color.PRIMARY}
                    formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                    isExcludingTax={isExcludingTax}
                    tax={parseFloat(contract?.tax) || 0}
                  >
                    <BillingInterval
                      flatFee={contract?.flat_fee}
                      interval={contract?.interval}
                      recurrenceBasis={contract?.recurrence_basis}
                    />
                  </Price>
                  {!!contract?.flat_fee && (
                    <div className="bs-contract-card__subtitle">
                      {t('contractCard.fees', {
                        fees: flatFees,
                      })}
                    </div>
                  )}
                </div>
                <div className={classNames('bs-contract-details__body__text')}>
                  {contract?.description}
                </div>
                <div>
                  <h4 className="bs-contract-card__subtitle --legal">
                    {t('contractCard.legalContract')}
                  </h4>
                  <div
                    className={classNames('bs-contract-details__body__text')}
                  >
                    {contract?.contract}
                  </div>
                </div>
              </Item>
            </Grid>
          </Content>
        </div>
      </Card>
    );
  },
);

export const MarketplaceContractDetailForStorybook = marketplaceCssHoc()(
  MarketplaceContractDetail,
);

export default MarketplaceContractDetail;
