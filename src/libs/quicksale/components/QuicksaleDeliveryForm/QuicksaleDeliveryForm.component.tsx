import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Place from '@material-ui/icons/Place';
import LocalShipping from '@material-ui/icons/LocalShipping';
import TextField from '@material-ui/core/TextField';

import AddressForm from '#components/form/AddressForm.component';
import { getCompanyCountry } from '#libs/theme/selectors';
import { QuicksaleDeliveryType } from '#libs/quicksale/constants';
import type { BasketAddress } from '#libs/checkout/types';

type Props = {
  basketAddress?: BasketAddress;
  setBasketAddress: (basketAddress?: BasketAddress) => void;
  deliveryType: QuicksaleDeliveryType;
  setDeliveryType: (deliveryType: QuicksaleDeliveryType) => void;
};

const QuicksaleDeliveryForm: React.FC<Props> = ({
  basketAddress,
  setBasketAddress,
  deliveryType,
  setDeliveryType,
}) => {
  const setDeliveryTypeToOnSpot = React.useCallback(() => {
    setDeliveryType(QuicksaleDeliveryType.OnSpot);
  }, [setDeliveryType]);

  const setDeliveryTypeToHomeDelivery = React.useCallback(() => {
    setDeliveryType(QuicksaleDeliveryType.HomeDelivery);
  }, [setDeliveryType]);

  const stopPropagation = React.useCallback((ev: React.KeyboardEvent) => {
    ev.stopPropagation();
  }, []);

  const companyCountry = getCompanyCountry();

  const onChange = React.useCallback(
    (key: string) => (ev: React.ChangeEvent<HTMLInputElement>) => {
      setBasketAddress({ ...basketAddress, [key]: ev.target.value });
    },
    [basketAddress, setBasketAddress],
  );

  const onFirstNameChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setBasketAddress({ ...basketAddress, first_name: ev.target.value });
    },
    [basketAddress, setBasketAddress],
  );

  const onLastNameChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setBasketAddress({ ...basketAddress, last_name: ev.target.value });
    },
    [basketAddress, setBasketAddress],
  );

  const { t } = useTranslation('quicksale');

  const classes = useStyles();

  // For now, the delivery selector is hidden because the backend doesn't
  // support baskets with deliverable shop items but no delivery fee (which
  // would be the case if the staff selects "On spot")
  const showDeliverySelector = false;

  return (
    <>
      {showDeliverySelector && (
        <div className={classes.deliverySelector}>
          <div
            className={classNames(classes.selectorButton, {
              [classes.selectorButtonSelected]:
                deliveryType === QuicksaleDeliveryType.OnSpot,
            })}
            tabIndex={0}
            role="button"
            onClick={setDeliveryTypeToOnSpot}
            onKeyDown={stopPropagation}
          >
            <Place className={classes.icon} />
            <Typography variant="body1">{t('checkout.onSpot')}</Typography>
          </div>

          <div
            className={classNames(classes.selectorButton, {
              [classes.selectorButtonSelected]:
                deliveryType === QuicksaleDeliveryType.HomeDelivery,
            })}
            tabIndex={0}
            role="button"
            onClick={setDeliveryTypeToHomeDelivery}
            onKeyDown={stopPropagation}
          >
            <LocalShipping className={classes.icon} />
            <Typography variant="body1">
              {t('checkout.homeDelivery')}
            </Typography>
          </div>
        </div>
      )}

      {deliveryType === QuicksaleDeliveryType.HomeDelivery && (
        <>
          <div className={classes.fullName}>
            <TextField
              value={basketAddress?.first_name}
              onChange={onFirstNameChange}
              label={t('checkout.firstName')}
            />

            <TextField
              value={basketAddress?.last_name}
              onChange={onLastNameChange}
              label={t('checkout.lastName')}
            />
          </div>

          <AddressForm
            companyCountry={companyCountry}
            address_line_1={basketAddress?.address_line_1}
            address_line_2={basketAddress?.address_line_2}
            zipcode={basketAddress?.zipcode}
            city={basketAddress?.city}
            state={basketAddress?.state}
            country={basketAddress?.country}
            onChange={onChange}
          />
        </>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  deliverySelector: {
    display: 'flex',
    gap: theme.spacing(3),
  },
  selectorButton: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
    borderRadius: theme.spacing(1),
    border: `2px solid ${theme.palette.grey[300]}`,
    padding: theme.spacing(1),
    cursor: 'pointer',
  },
  selectorButtonSelected: {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  fullName: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  icon: {
    height: 35,
    width: 35,
  },
}));

export default React.memo(QuicksaleDeliveryForm);
