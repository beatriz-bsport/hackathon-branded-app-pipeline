import React, { MouseEvent, useCallback } from 'react';

import DeleteIcon from '@material-ui/icons/Delete';
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';
import RadioButtonCheckedOutlinedIcon from '@material-ui/icons/RadioButtonCheckedOutlined';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import { MarketplacePaymentMethods } from '#src/libs/marketplace/types';
import CircularProgress from '#src/components/css-only/CircularProgress';
import { PaymentMethod } from '#src/libs/payment/types';

import Button, {
  ButtonVariant,
} from '#src/components/css-only/Fabrique/Button';

import './styles.css';

export type Props = {
  isContractLegalTermsAccepted: boolean;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: string;
  paymentMethodType: MarketplacePaymentMethods;
  onDetachPaymentMethod: (id: string) => void;
  onSelectPaymentMethod: (id: string) => void;
  paymentMethodLoading?: boolean;
};

type ContractPaymentMethodProps = {
  selectedPaymentMethod: string;
  isContractLegalTermsAccepted: boolean;
  paymentMethod: PaymentMethod;
  paymentMethodType: MarketplacePaymentMethods;
  onDetach: (id: string) => void;
  onSelect: (id: string) => void;
};

const ContractPaymentMethod: React.FC<ContractPaymentMethodProps> = React.memo(
  ({
    selectedPaymentMethod,
    isContractLegalTermsAccepted,
    paymentMethod,
    paymentMethodType,
    onDetach,
    onSelect,
  }) => {
    const handleDetachPaymentMethod = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onDetach(paymentMethod.id);
      },
      [onDetach, paymentMethod.id],
    );

    const handleSelectPaymentMethod = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onSelect(paymentMethod.id);
      },
      [onSelect, paymentMethod.id],
    );

    return (
      <button
        key={paymentMethod.id}
        className={classNames(
          'bs-marketplace-contract-payment-method-list__item',
          {
            'bs-marketplace-contract-payment-method-list__item--disabled':
              !isContractLegalTermsAccepted,
            'bs-marketplace-contract-payment-method-list__item--active':
              paymentMethod.id === selectedPaymentMethod,
          },
        )}
        disabled={!isContractLegalTermsAccepted}
        onClick={handleSelectPaymentMethod}
        type="button"
      >
        <div className="bs-marketplace-contract-payment-method-list__item__radio__container">
          <button
            className="bs-marketplace-contract-payment-method-list__item__radio"
            type="button"
          >
            {paymentMethod.id === selectedPaymentMethod ? (
              <RadioButtonCheckedOutlinedIcon />
            ) : (
              <RadioButtonUncheckedOutlinedIcon />
            )}
          </button>

          <div className="bs-marketplace-contract-payment-method-list__item__method__icon">
            {paymentMethodType === MarketplacePaymentMethods.card ? (
              <CreditCardIcon />
            ) : (
              <AccountBalanceIcon />
            )}
          </div>

          <div className="bs-marketplace-contract-payment-method-list__item__details">
            <span className="bs-marketplace-contract-payment-method-list__item__title">
              {`**** **** **** ${paymentMethod.readable_identifier}`}
            </span>
            {paymentMethodType === MarketplacePaymentMethods.card && (
              <span className="bs-marketplace-contract-payment-method-list__item__subtitle">
                {`${paymentMethod.additional_info || ' '} ${
                  paymentMethod.brand
                }`}
              </span>
            )}
          </div>
        </div>

        <Button
          classes={{
            root: 'bs-marketplace-contract-payment-method-list__item__delete',
          }}
          onClick={handleDetachPaymentMethod}
          variant={ButtonVariant.ICON}
        >
          <DeleteIcon />
        </Button>
      </button>
    );
  },
);

const MarketplaceContractPaymentMethodList: React.FC<Props> = React.memo(
  ({
    isContractLegalTermsAccepted,
    paymentMethods,
    selectedPaymentMethod,
    paymentMethodType,
    onDetachPaymentMethod,
    onSelectPaymentMethod,
    paymentMethodLoading,
  }) => {
    if (paymentMethodLoading) {
      return (
        <div className="bs-marketplace-contract-payment-method-list__item__loading">
          <CircularProgress />
        </div>
      );
    }

    return (
      <>
        {!!paymentMethods.length && (
          <div className="bs-marketplace-contract-payment-method-list__container">
            {paymentMethods.map((paymentMethod) => (
              <ContractPaymentMethod
                key={paymentMethod.id}
                isContractLegalTermsAccepted={isContractLegalTermsAccepted}
                onDetach={onDetachPaymentMethod}
                onSelect={onSelectPaymentMethod}
                paymentMethod={paymentMethod}
                paymentMethodType={paymentMethodType}
                selectedPaymentMethod={selectedPaymentMethod}
              />
            ))}
          </div>
        )}
      </>
    );
  },
);

export const MarketplaceContractPaymentMethodListForStorybook =
  marketplaceCssHoc()(MarketplaceContractPaymentMethodList);

export default MarketplaceContractPaymentMethodList;
