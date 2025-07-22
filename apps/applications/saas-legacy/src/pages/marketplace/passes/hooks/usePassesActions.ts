import { useCallback } from 'react';
import { usePassesContext } from '#src/pages/marketplace/passes/PassesContext';
import { addItemToBasket } from '#src/libs/checkout/actions';
import { RootState } from '#src/reducers';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentBasket,
  getCurrentBasketLoadingStatus,
} from '#src/libs/checkout/selectors';

/**
 * Custom React hook that declares handlers for card actions on the passes page.
 *
 */
export const usePassesActions = () => {
  const dispatch = useDispatch();
  const { setSelectedCardId, setSelectedAppointmentCardId, requestSignUp } =
    usePassesContext();

  const currentBasket = useSelector((state: RootState) =>
    getCurrentBasket(state),
  );

  const basketLoadingStatus = useSelector((state: RootState) =>
    getCurrentBasketLoadingStatus(state),
  );

  const authenticated = useSelector(
    (state: RootState) => state.auth.authenticated,
  );

  const handleClosePassModal = useCallback(
    () => setSelectedCardId(null),
    [setSelectedCardId],
  );
  const handleCloseAppointmentPassModal = useCallback(
    () => setSelectedAppointmentCardId(null),
    [setSelectedAppointmentCardId],
  );

  const handleAddToCart = useCallback(
    (passId: number, buyableItemIdentifier: number) => () => {
      if (authenticated) {
        if (currentBasket) {
          dispatch(
            addItemToBasket(currentBasket.id, {
              buyable_item_identifier: buyableItemIdentifier,
              quantity: 1,
              buyable_item_id: passId,
              extra_data: {},
            }),
          );
        }
      } else {
        if (requestSignUp) {
          requestSignUp();
          handleClosePassModal();
        }
      }
    },
    [
      authenticated,
      currentBasket,
      dispatch,
      requestSignUp,
      handleClosePassModal,
    ],
  );

  const handleDetailsClick = useCallback(
    (passId: number) => () => {
      setSelectedCardId(passId);
    },
    [setSelectedCardId],
  );
  const handleAppointmentDetailsClick = useCallback(
    (passId: number) => () => {
      setSelectedAppointmentCardId(passId);
    },
    [setSelectedAppointmentCardId],
  );

  return {
    handleAddToCart,
    handleDetailsClick,
    handleAppointmentDetailsClick,
    handleClosePassModal,
    handleCloseAppointmentPassModal,
    basketLoadingStatus,
  };
};
