import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import './styles.css';

import StarIcon from '@material-ui/icons/Star';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ReplayIcon from '@material-ui/icons/Replay';

import { compose } from 'recompose';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Card, { CardSize } from '#csscomponents/Card';
import Content from '#csscomponents/Card/CardContent';
import Grid from '#csscomponents/Grid';
import Item, {
  Alignment,
  Direction,
  Justification,
} from '#csscomponents/Grid/GridItem';
import Price, { Color } from '#csscomponents/Price';

import BillingInterval from '../MarketplaceContractCard/BillingInterval';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import type { ContractWithPaymentPack } from '#libs/subscription/types';

export type Props = {
  contract: ContractWithPaymentPack;
  isOpen: boolean;
  onAddToCart: () => void;
  onDialogClose: () => void;
};

const ContractDetailList: React.FC<{
  contract: ContractWithPaymentPack;
}> = React.memo(({ contract }) => {
  const { t } = useTranslation('marketplace');

  const objectIncludedInContract = React.useMemo(
    () =>
      contract?.private_pass ||
      contract?.payment_combo ||
      contract?.payment_pack,
    [contract],
  );

  return (
    <ul className="bs-description-details-dialog__list">
      {!!objectIncludedInContract && (
        <li className="bs-description-details-dialog__list__item">
          <span className="bs-description-details-dialog__list__item__icon">
            <StarIcon />
          </span>
          <span className="bs-description-details-dialog__list__item__text">
            {objectIncludedInContract.name}
          </span>
        </li>
      )}
      {!!contract?.nb_interval && (
        <li className="bs-description-details-dialog__list__item">
          <span className="bs-description-details-dialog__list__item__icon">
            <ReceiptIcon />
          </span>
          <span className="bs-description-details-dialog__list__item__text">
            {t('contractCard.invoice', {
              count: contract.nb_interval,
            })}
          </span>
        </li>
      )}
      {contract?.auto_renewal && (
        <li className="bs-description-details-dialog__list__item">
          <span className="bs-description-details-dialog__list__item__icon">
            <ReplayIcon />
          </span>
          <span className="bs-description-details-dialog__list__item__text">
            {t(`contractCard.autoRenewal`)}
          </span>
        </li>
      )}
    </ul>
  );
});

const MarketplaceContractDetailModal: React.FC<Props> = ({
  contract,
  isOpen,
  onAddToCart,
  onDialogClose,
}) => {
  const { t } = useTranslation('marketplace');

  const [showMoreDescription, setShowMoreDescription] =
    React.useState<boolean>(false);
  const [showMoreLegalContract, setShowMoreLegalContract] =
    React.useState<boolean>(false);

  const handleShowMoreDescription = React.useCallback(
    () => setShowMoreDescription((previousShowMore) => !previousShowMore),
    [setShowMoreDescription],
  );

  const handleShowMoreLegalContract = React.useCallback(
    () => setShowMoreLegalContract((previousShowMore) => !previousShowMore),
    [setShowMoreLegalContract],
  );

  const flatFees = getCurrencyDisplayWithPrice(contract?.flat_fee);

  return (
    <>
      {isOpen && !!contract && (
        <div className="bs-contract-details-dialog">
          <Card
            size={CardSize.L}
            classes={{
              'bs-contract-details-dialog__card':
                'bs-contract-details-dialog__card',
            }}
          >
            <div className="bs-contract-details-dialog__container">
              <Content
                padding
                classes={{
                  'bs-contract-details-dialog__header':
                    'bs-contract-details-dialog__header',
                }}
              >
                <Grid
                  classes={{
                    'bs-contract-details-dialog__header-grid':
                      'bs-contract-details-dialog__header-grid',
                  }}
                >
                  <Item
                    rowStart={1}
                    columnStart={1}
                    columnEnd={1}
                    justification={Justification.FLEX_START}
                  >
                    <div className="bs-contract-details-dialog__header__title-container">
                      <h3 className="bs-contract-details-dialog__header__title">
                        {contract?.name}
                      </h3>
                    </div>
                    <div className="bs-contract-dialog__header__price-container--mobile">
                      <Price
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
                    <ContractDetailList contract={contract} />
                  </Item>
                  <Item
                    rowStart={1}
                    rowEnd={1}
                    columnStart={2}
                    columnEnd={2}
                    justification={Justification.FLEX_START}
                    classes={{
                      'bs-contract-dialog__header__price-container--desktop':
                        'bs-contract-dialog__header__price-container--desktop',
                    }}
                  >
                    <Price
                      amount={contract?.recurrent_price}
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
              <Content
                classes={{
                  'bs-contract-details-dialog__body':
                    'bs-contract-details-dialog__body',
                }}
              >
                <Grid
                  classes={{
                    'bs-contract-details-dialog__grid':
                      'bs-contract-details-dialog__grid',
                  }}
                >
                  <Item
                    classes={{
                      'bs-contract-details-dialog__item':
                        'bs-contract-details-dialog__item',
                    }}
                  >
                    <div
                      className={classNames(
                        'bs-contract-details-dialog__body__text',
                        { '--hide': !showMoreDescription },
                      )}
                    >
                      {contract?.description}
                    </div>
                    <button
                      type="button"
                      onClick={handleShowMoreDescription}
                      className="bs-contract-details-dialog__body__button"
                    >
                      {showMoreDescription
                        ? t('contractCard.seeLess')
                        : t('contractCard.seeMore')}
                    </button>
                    <div>
                      <h4 className="bs-contract-card__subtitle --legal">
                        {t('contractCard.legalContract')}
                      </h4>
                      <div
                        className={classNames(
                          'bs-contract-details-dialog__body__text',
                          { '--hide': !showMoreLegalContract },
                        )}
                      >
                        {contract?.contract}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleShowMoreLegalContract}
                      className="bs-contract-details-dialog__body__button"
                    >
                      {showMoreLegalContract
                        ? t('contractCard.seeLess')
                        : t('contractCard.seeMore')}
                    </button>
                  </Item>
                </Grid>
              </Content>
            </div>
            <Content
              classes={{
                'bs-contract-details-dialog__footer':
                  'bs-contract-details-dialog__footer',
              }}
            >
              <Grid
                classes={{
                  'bs-contract-details-dialog__grid':
                    'bs-contract-details-dialog__grid',
                  '--footer': '--footer',
                }}
              >
                <Item
                  rowStart={4}
                  direction={Direction.ROW}
                  alignment={Alignment.CENTER}
                  justification={Justification.FLEX_END}
                  classes={{
                    'bs-contract-details-dialog__item':
                      'bs-contract-details-dialog__item',
                  }}
                >
                  <div className="bs-contract-details-dialog__footer__buttons">
                    <button
                      className="bs-contract-details-dialog__buttons__cancel"
                      type="button"
                      onClick={onDialogClose}
                    >
                      {t('common:cancel')}
                    </button>
                    <button
                      className="bs-contract-details-dialog__buttons__add-to-cart"
                      type="button"
                      onClick={onAddToCart}
                    >
                      {t('paymentCombo.addToCart')}
                    </button>
                  </div>
                </Item>
              </Grid>
            </Content>
          </Card>
        </div>
      )}
    </>
  );
};

export default compose(marketplaceCssHoc())(MarketplaceContractDetailModal);
