import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import './styles.css';

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

import BillingInterval from '../MarketplaceBillingInterval';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import { PaymentPack } from '#libs/payment-packs/types';
import { PrivatePass } from '#libs/private-service/types';
import { PaymentCombo } from '#libs/payment-combo/types';
import { Contract } from '#libs/subscription/types';

export type Props = {
  isExcludingTax?: boolean;
  contract: Contract;
  getPaymentPackSelected: (id: number) => PaymentPack;
  getPrivatePassSelected: (id: number) => PrivatePass;
  getPaymentComboSelected: (id: number) => PaymentCombo;
};

const ContractDetailList: React.FC<Props> = React.memo(
  ({
    contract,
    getPaymentPackSelected,
    getPrivatePassSelected,
    getPaymentComboSelected,
  }) => {
    const { t } = useTranslation('marketplace');

    const objectIncludedInContract = React.useMemo(() => {
      if (contract?.payment_pack) {
        return getPaymentPackSelected(contract?.payment_pack);
      }
      if (contract?.private_pass) {
        return getPrivatePassSelected(contract?.private_pass);
      }
      if (contract?.payment_combo) {
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
        {objectIncludedInContract ? (
          <li className="bs-description-details__list__item">
            <span className="bs-description-details__list__item__icon">
              <StarIcon />
            </span>
            <span className="bs-description-details__list__item__text">
              {objectIncludedInContract.name}
            </span>
          </li>
        ) : (
          <CircularProgress size="sm" />
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

const MarketplaceContractDetail: React.FC<Props> = ({
  contract,
  isExcludingTax,
  getPaymentPackSelected,
  getPrivatePassSelected,
  getPaymentComboSelected,
}) => {
  const { t } = useTranslation('marketplace');
  const flatFees = getCurrencyDisplayWithPrice(contract?.flat_fee);

  return (
    <Card
      size={CardSize.AUTO}
      classes={{
        'bs-contract-details__card': 'bs-contract-details__card',
      }}
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
              rowStart={1}
              columnStart={1}
              columnEnd={1}
              justification={Justification.FLEX_START}
            >
              <div className="bs-contract-details__header__title-container">
                <h3 className="bs-contract-details__header__title">
                  {contract?.name}
                </h3>
              </div>
              <ContractDetailList
                contract={contract}
                getPaymentPackSelected={getPaymentPackSelected}
                getPrivatePassSelected={getPrivatePassSelected}
                getPaymentComboSelected={getPaymentComboSelected}
              />
            </Item>
            <Item
              rowStart={1}
              rowEnd={1}
              columnStart={2}
              columnEnd={2}
              justification={Justification.FLEX_START}
              classes={{
                'bs-contract__header__price-container--desktop':
                  'bs-contract__header__price-container--desktop',
              }}
            >
              <Price
                isExcludingTax={isExcludingTax}
                amount={contract?.recurrent_price ?? 0}
                color={Color.PRIMARY}
                formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                classes={{
                  'bs-contract-card__header__price':
                    'bs-contract-card__header__price',
                }}
              >
                <BillingInterval contract={contract} />
              </Price>
              {!!contract?.flat_fee && (
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
                  isExcludingTax={isExcludingTax}
                  amount={contract?.recurrent_price}
                  formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                  color={Color.PRIMARY}
                  classes={{
                    'bs-contract-card__header__price':
                      'bs-contract-card__header__price',
                  }}
                >
                  <BillingInterval contract={contract} />
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
                <div className={classNames('bs-contract-details__body__text')}>
                  {contract?.contract}
                </div>
              </div>
            </Item>
          </Grid>
        </Content>
      </div>
    </Card>
  );
};

export const MarketplaceContractDetailForStorybook = marketplaceCssHoc()(
  MarketplaceContractDetail,
);

export default MarketplaceContractDetail;
