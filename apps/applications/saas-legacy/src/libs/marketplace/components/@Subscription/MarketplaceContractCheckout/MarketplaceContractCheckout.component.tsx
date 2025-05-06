import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import UpdateIcon from '@material-ui/icons/Update';

import clsx from 'clsx';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import Card, { CardSize } from '#src/components/css-only/Card';
import CardContent from '#src/components/css-only/Card/CardContent';
import Grid from '#src/components/css-only/Grid';
import GridItem, {
  Alignment,
  Justification,
} from '#src/components/css-only/Grid/GridItem';
import Price from '#src/components/css-only/Price';
import CircularProgress from '#src/components/css-only/CircularProgress';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { PaymentPack } from '#src/libs/payment-packs/types';
import { PrivatePass } from '#src/libs/private-service/types';
import { PaymentCombo } from '#src/libs/payment-combo/types';
import { Contract } from '#src/libs/subscription/types';
import Button, { ButtonColor } from '#src/components/css-only/Fabrique/Button';
import ShowMore from '#src/components/css-only/Fabrique/ShowMore';
import BillingInterval from '../MarketplaceBillingInterval';
import useIsTextExpandable from '../../../../../hooks/useIsTextExpandable';

import './styles.css';

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
      classes={{
        ...(isSelected && {
          '--expanded-card': '--expanded-card',
        }),
        'bs-contract-checkout': 'bs-contract-checkout',
      }}
      customRef={isSelected && customRef ? customRef : null}
      size={CardSize.AUTO}
    >
      <div
        className={clsx('bs-contract-checkout__header', {
          '--expanded-header': isExpanded,
        })}
      >
        <CardContent padding>
          <Grid
            classes={{
              'bs-contract-checkout__grid': 'bs-contract-checkout__grid',
            }}
          >
            <GridItem
              alignment={Alignment.FLEX_START}
              classes={{
                'bs-generic-card__content__grid__item--contract-checkout':
                  'bs-generic-card__content__grid__item--contract-checkout',
              }}
              columnEnd={1}
              columnStart={1}
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
                  classes={{
                    'bs-contract-checkout__price':
                      'bs-contract-checkout__price',
                  }}
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
              </div>
            </GridItem>
            <GridItem
              alignment={Alignment.FLEX_END}
              classes={{
                'bs-generic-card__content__grid__item--contract-checkout':
                  'bs-generic-card__content__grid__item--contract-checkout',
              }}
              columnEnd={2}
              columnStart={2}
              justification={Justification.SPACE_BETWEEN}
              rowStart={1}
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
                <Button
                  classes={{
                    root: 'bs-contract-checkout__right-button',
                  }}
                  color={ButtonColor.PRIMARY}
                  isDisabled={isExpanded}
                  onClick={handleChooseContract}
                >
                  {t('marketplace:contractCard.chooseButton')}
                </Button>
              )}
            </GridItem>
          </Grid>
        </CardContent>
      </div>
      <CardContent
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
          <GridItem
            classes={{
              'bs-contract-checkout__body__item':
                'bs-contract-checkout__body__item',
              'bs-generic-card__content__grid__item--contract-checkout':
                'bs-generic-card__content__grid__item--contract-checkout',
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
            <ShowMore collapsedHeight={45} isExpanded={showMoreDescription}>
              <div
                ref={descriptionText.ref}
                className={clsx('bs-contract-checkout__body__text', {
                  '--hide': !showMoreDescription,
                })}
              >
                {contract?.description}
              </div>
            </ShowMore>
            {descriptionText.isExpandable && (
              <Button
                disableRipple
                classes={{
                  root: 'bs-contract-checkout__body__button',
                }}
                onClick={handleShowMoreDescription}
              >
                {showMoreDescription ? (
                  <>
                    <KeyboardArrowUp />
                    {t('marketplace:contractCard.seeLess')}
                  </>
                ) : (
                  <>
                    <KeyboardArrowDown />
                    {t('marketplace:contractCard.seeMore')}
                  </>
                )}
              </Button>
            )}
            <div>
              <h4 className="bs-contract-checkout__subtitle --legal">
                {t('marketplace:contractCard.legalContract')}
              </h4>
              <ShowMore collapsedHeight={45} isExpanded={showMoreLegalContract}>
                <div
                  ref={legalContractText.ref}
                  className={clsx('bs-contract-checkout__body__text', {
                    '--hide': !showMoreLegalContract,
                  })}
                >
                  {contract?.contract}
                </div>
              </ShowMore>
            </div>
            {legalContractText.isExpandable && (
              <Button
                disableRipple
                classes={{
                  root: 'bs-contract-checkout__body__button',
                }}
                onClick={handleShowMoreLegal}
              >
                {showMoreLegalContract ? (
                  <>
                    <KeyboardArrowUp />
                    {t('marketplace:contractCard.seeLess')}
                  </>
                ) : (
                  <>
                    <KeyboardArrowDown />
                    {t('marketplace:contractCard.seeMore')}
                  </>
                )}
              </Button>
            )}
          </GridItem>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const MarketplaceContractCheckoutForStorybook = marketplaceCssHoc()(
  MarketplaceContractCheckout,
);

export default React.memo(MarketplaceContractCheckout);
