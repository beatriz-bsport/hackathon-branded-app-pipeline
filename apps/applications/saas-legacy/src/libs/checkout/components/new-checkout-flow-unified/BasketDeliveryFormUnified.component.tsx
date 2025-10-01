import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import AddressForm from '#src/components/form/AddressForm.component';
import CheckoutContext from '#src/pages/checkout/basket/CheckoutContext';

import type {
  Basket,
  BasketAddress,
  PrepaidLine,
} from '#src/libs/checkout/types';
import type { OptionCallback } from '#src/state/types';
import { BasketDeliveryFormRef } from './types';

type BasketDeliveryProps = {
  basket: Basket | Basket<string, PrepaidLine>;
  companyCountry: string;
  onSubmit: (data: BasketAddress, options?: OptionCallback) => void;
  loading?: boolean;
  onCancel?: () => void;
  ref?: React.Ref<BasketDeliveryFormRef>;
};

const BasketDeliveryFormUnified: React.FC<BasketDeliveryProps> = forwardRef(
  ({ basket, companyCountry, onSubmit, loading, onCancel }, ref) => {
    const classes = useStyles();
    const { t } = useTranslation('checkout');
    const isCheckoutContext = useContext(CheckoutContext);

    const [basketAddress, setBasketAddress] = useState<BasketAddress>({
      first_name: basket.first_name ?? '',
      last_name: basket.last_name ?? '',
      address_line_1: basket.address_line_1 ?? '',
      address_line_2: basket.address_line_2 ?? '',
      zipcode: basket.zipcode ?? '',
      state: basket.state ?? '',
      city: basket.city ?? '',
      country: basket.country ?? '',
    });

    useEffect(() => {
      setBasketAddress({
        first_name: basket.first_name ?? '',
        last_name: basket.last_name ?? '',
        address_line_1: basket.address_line_1 ?? '',
        address_line_2: basket.address_line_2 ?? '',
        zipcode: basket.zipcode ?? '',
        state: basket.state ?? '',
        city: basket.city ?? '',
        country: basket.country ?? '',
      });
    }, [basket]);

    const onChange = useCallback(
      (key: string) => (ev: React.ChangeEvent<HTMLInputElement>) => {
        setBasketAddress((prev) => ({ ...prev, [key]: ev.target.value }));
      },
      [],
    );

    const onAddressSubmit = useCallback(
      (options?: OptionCallback) => onSubmit(basketAddress, options),
      [basketAddress, onSubmit],
    );

    useImperativeHandle(ref, () => ({ onAddressSubmit }), [onAddressSubmit]);

    return (
      <div>
        <div className={classes.nameContainer}>
          <TextField
            required
            className={classes.firstNameField}
            onChange={onChange('first_name')}
            placeholder={t('forms.delivery.first_name')}
            value={basketAddress.first_name}
          />
          <TextField
            required
            onChange={onChange('last_name')}
            placeholder={t('forms.delivery.last_name')}
            value={basketAddress.last_name}
          />
        </div>
        <AddressForm
          {...basketAddress}
          companyCountry={companyCountry}
          onChange={onChange}
        />
        {!isCheckoutContext && (
          <div className={classes.buttonContainer}>
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <Button onClick={onCancel}>
                  {t('forms.delivery.actions.cancel')}
                </Button>
                <Button
                  color="primary"
                  onClick={() => onAddressSubmit()}
                  variant="contained"
                >
                  {t('forms.delivery.actions.submit')}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  nameContainer: {
    paddingBottom: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  firstNameField: { marginRight: theme.spacing(2) },
}));

export default React.memo(BasketDeliveryFormUnified);
