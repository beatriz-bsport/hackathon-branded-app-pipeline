import React, { useImperativeHandle, forwardRef } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import AddressForm from '../../../components/form/AddressForm.component';
import type { Basket, BasketAddress, PrepaidLine } from '../types';

type BasketDeliveryProps = {
  basket: Basket | Basket<string, PrepaidLine>;
  companyCountry: string;
  onSubmit: (data: BasketAddress) => void;
  ref?: React.Ref<any>;
};

const BasketDeliveryForm: React.FC<BasketDeliveryProps> = forwardRef(
  ({ basket, companyCountry, onSubmit }, ref) => {
    const classes = useStyles();
    const { t } = useTranslation('checkout');

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
          address_line_1={basketAddress.address_line_1}
          address_line_2={basketAddress.address_line_2}
          city={basketAddress.city}
          companyCountry={companyCountry}
          country={basketAddress.country}
          onChange={onChange}
          state={basketAddress.state}
          zipcode={basketAddress.zipcode}
        />
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
