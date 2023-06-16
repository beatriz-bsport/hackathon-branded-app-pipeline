import React, { useImperativeHandle, forwardRef } from 'react';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import AddressForm from '../../../components/form/AddressForm.component';
import type { Basket, BasketAddress, PrepaidLine } from '../types';
import { CheckoutContext } from '../../../pages/checkout/basket/CheckoutContext';

type BasketDeliveryProps = {
  basket: Basket | Basket<string, PrepaidLine>;
  companyCountry: string;
  onSubmit: (data: BasketAddress) => void;
  loading?: boolean;
  onCancel?: () => void;
  ref?: React.Ref<any>;
};

const BasketDeliveryForm: React.FC<BasketDeliveryProps> = forwardRef(
  ({ basket, companyCountry, onSubmit, loading, onCancel }, ref) => {
    const classes = useStyles();
    const { t } = useTranslation('checkout');
    const isNewCheckoutFlow = React.useContext(CheckoutContext);

    const [basketAddress, setBasketAddress] = React.useState<BasketAddress>({
      first_name: basket.first_name,
      last_name: basket.last_name,
      address_line_1: basket.address_line_1,
      address_line_2: basket.address_line_2,
      zipcode: basket.zipcode,
      state: basket.state,
      city: basket.city,
      country: basket.country,
    });

    React.useEffect(() => {
      setBasketAddress({
        first_name: basket.first_name,
        last_name: basket.last_name,
        address_line_1: basket.address_line_1,
        address_line_2: basket.address_line_2,
        zipcode: basket.zipcode,
        state: basket.state,
        city: basket.city,
        country: basket.country,
      });
    }, [basket]);

    const onChange = React.useCallback(
      (key: string) => (ev: React.ChangeEvent<HTMLInputElement>) => {
        setBasketAddress({ ...basketAddress, [key]: ev.target.value });
      },
      [basketAddress],
    );

    const onAddressSubmit = React.useCallback(() => {
      onSubmit(basketAddress);
    }, [basketAddress, onSubmit]);

    useImperativeHandle(
      ref,
      () => {
        return {
          onAddressSubmit,
        };
      },
      [onAddressSubmit],
    );

    return (
      <div>
        <div className={classes.nameContainer}>
          <TextField
            value={basketAddress.first_name}
            placeholder={t('forms.delivery.first_name')}
            required
            onChange={onChange('first_name')}
            className={classes.firstNameField}
          />
          <TextField
            value={basketAddress.last_name}
            placeholder={t('forms.delivery.last_name')}
            required
            onChange={onChange('last_name')}
          />
        </div>
        <AddressForm
          companyCountry={companyCountry}
          address_line_1={basketAddress.address_line_1}
          address_line_2={basketAddress.address_line_2}
          zipcode={basketAddress.zipcode}
          country={basketAddress.country}
          state={basketAddress.state}
          city={basketAddress.city}
          onChange={onChange}
        />
        {!isNewCheckoutFlow && (
          <div className={classes.buttonContainer}>
            {loading ? (
              <CircularProgress />
            ) : (
              <React.Fragment>
                <Button onClick={onCancel}>
                  {t('forms.delivery.actions.cancel')}
                </Button>
                <Button
                  onClick={onAddressSubmit}
                  color="primary"
                  variant="contained"
                >
                  {t('forms.delivery.actions.submit')}
                </Button>
              </React.Fragment>
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

export default React.memo(BasketDeliveryForm);
