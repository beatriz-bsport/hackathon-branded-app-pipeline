import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import UpdateIcon from '@material-ui/icons/Update';

import classNames from 'classnames';
import useIsTextExpandable from '../../../../hooks/useIsTextExpandable';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Card, { CardSize } from '#components/css-only/Card';
import Content from '#components/css-only/Card/CardContent';
import Grid from '#components/css-only/Grid';
import Item, {
  Alignment,
  Justification,
} from '#components/css-only/Grid/GridItem';
import Price from '#components/css-only/Price';
import CircularProgress from '#components/css-only/CircularProgress';
import BillingInterval from '../MarketplaceBillingInterval';

import './styles.css';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import { PaymentPack } from '#libs/payment-packs/types';
import { PrivatePass } from '#libs/private-service/types';
import { PaymentCombo } from '#libs/payment-combo/types';
import { Contract } from '#libs/subscription/types';

export type Props = {
  hideChooseButton?: boolean;
  contract: Contract;
  isExcludingTax?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  isContractObjectLoading: boolean;
  customRef?: React.RefObject<HTMLDivElement>;
  onSelect: (contract: Contract) => void;
  getPaymentPackSelected: (id: number) => PaymentPack;
  getPrivatePassSelected: (id: number) => PrivatePass;
  getPaymentComboSelected: (id: number) => PaymentCombo;
};

const MarketplaceContractCheckout: React.FC<Props> = ({
  contract,
  isExcludingTax,
  isExpanded,
  isSelected,
  hideChooseButton,
  customRef,
  isContractObjectLoading,
  onSelect,
  getPaymentPackSelected,
  getPrivatePassSelected,
  getPaymentComboSelected,
}) => {
  const { t } = useTranslation('marketplace');

  const [showMoreDescription, setShowMoreDescription] = React.useState(false);
  const [showMoreLegalContract, setShowMoreLegalContract] =
    React.useState(false);

  const descriptionText = useIsTextExpandable(showMoreDescription);
  const legalContractText = useIsTextExpandable(showMoreLegalContract);

  const handleShowMoreDescription = useCallback(
    () =>
      setShowMoreDescription(
        (previousShowMoreDescription) => !previousShowMoreDescription,
      ),
    [setShowMoreDescription],
  );

  const handleShowMoreLegal = useCallback(
    () =>
      setShowMoreLegalContract(
        (previousShowMoreLegalContract) => !previousShowMoreLegalContract,
      ),
    [setShowMoreLegalContract],
  );

  const handleChooseContract = useCallback(() => {
    onSelect && onSelect(contract);
  }, [contract, onSelect]);

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

  const shouldDisplayFlatFee =
    !!contract?.flat_fee && parseFloat(contract?.flat_fee) > 0;

  return (
    <Card
      size={CardSize.AUTO}
      classes={{
        ...(isSelected && {
          '--expanded-card': '--expanded-card',
        }),
        'bs-contract-checkout': 'bs-contract-checkout',
      }}
      customRef={isSelected && customRef ? customRef : null}
    >
      <div
        className={classNames('bs-contract-checkout__header', {
          '--expanded-header': isExpanded,
        })}
      >
        <Content padding>
          <Grid
            classes={{
              'bs-contract-checkout__grid': 'bs-contract-checkout__grid',
            }}
          >
            <Item
              alignment={Alignment.FLEX_START}
              columnStart={1}
              columnEnd={1}
              justification={Justification.SPACE_BETWEEN}
            >
              <div className="bs-contract-checkout__title">
                <UpdateIcon className="bs-contract-card__title__icon" />
                {contract?.name}
              </div>
              {shouldDisplayFlatFee && (
                <div className="bs-contract-checkout__subtitle">
                  {t('marketplace:contractCard.fees', {
                    fees: getCurrencyDisplayWithPrice(contract.flat_fee),
                  })}
                </div>
              )}
              <div className="bs-contract-checkout__price-container">
                <Price
                  amount={contract?.recurrent_price}
                  formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                  classes={{
                    'bs-contract-checkout__price':
                      'bs-contract-checkout__price',
                  }}
                  isExcludingTax={isExcludingTax}
                >
                  <BillingInterval contract={contract} />
                </Price>
              </div>
            </Item>
            <Item
              alignment={Alignment.FLEX_END}
              justification={Justification.SPACE_BETWEEN}
              rowStart={1}
              columnStart={2}
              columnEnd={2}
            >
              <div className="bs-contract-checkout__planned-invoices">
                {!!contract?.nb_interval && (
                  <div className="bs-contract-checkout__planned-invoices__content">
                    {t('marketplace:contractCard.invoice', {
                      count: contract.nb_interval,
                    })}
                  </div>
                )}
              </div>
              {!hideChooseButton && (
                <button
                  type="button"
                  className="bs-contract-checkout__right-button"
                  disabled={isExpanded}
                  onClick={handleChooseContract}
                >
                  {t('marketplace:contractCard.chooseButton')}
                </button>
              )}
            </Item>
          </Grid>
        </Content>
      </div>
      <Content
        classes={{
          'bs-contract-checkout__body': 'bs-contract-checkout__body',
          ...(isExpanded && {
            '--expanded-body': '--expanded-body',
          }),
        }}
      >
        <Grid
          classes={{
            'bs-contract-checkout__body__grid':
              'bs-contract-checkout__body__grid',
          }}
        >
          <Item
            classes={{
              'bs-contract-checkout__body__item':
                'bs-contract-checkout__body__item',
            }}
          >
            {(isContractObjectLoading || objectIncludedInContract?.name) && (
              <div className="bs-contract-checkout__body__title">
                <div className="bs-contract-checkout__body__title__rectangle" />
                {isContractObjectLoading && !objectIncludedInContract?.name && (
                  <CircularProgress size="sm" />
                )}
                {objectIncludedInContract?.name && (
                  <h4>{objectIncludedInContract?.name}</h4>
                )}
              </div>
            )}
            <div
              ref={descriptionText.ref}
              className={classNames('bs-contract-checkout__body__text', {
                '--hide': !showMoreDescription,
              })}
            >
              {contract?.description}
            </div>
            {descriptionText.isExpandable && (
              <button
                type="button"
                onClick={handleShowMoreDescription}
                className="bs-contract-checkout__body__button"
              >
                {showMoreDescription
                  ? t('marketplace:contractCard.seeLess')
                  : t('marketplace:contractCard.seeMore')}
              </button>
            )}
            <div>
              <h4 className="bs-contract-checkout__subtitle --legal">
                {t('marketplace:contractCard.legalContract')}
              </h4>
              <div
                ref={legalContractText.ref}
                className={classNames('bs-contract-checkout__body__text', {
                  '--hide': !showMoreLegalContract,
                })}
              >
                {contract?.contract}
              </div>
            </div>
            {legalContractText.isExpandable && (
              <button
                type="button"
                onClick={handleShowMoreLegal}
                className="bs-contract-checkout__body__button"
              >
                {showMoreLegalContract
                  ? t('marketplace:contractCard.seeLess')
                  : t('marketplace:contractCard.seeMore')}
              </button>
            )}
          </Item>
        </Grid>
      </Content>
    </Card>
  );
};

export const MarketplaceContractCheckoutForStorybook = marketplaceCssHoc()(
  MarketplaceContractCheckout,
);

export default React.memo(MarketplaceContractCheckout);
