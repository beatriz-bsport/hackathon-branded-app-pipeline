import { fetchCurrentBasket, validateUnpaid } from '#src/libs/checkout/api';
import { OfferREST } from '#src/libs/offer/types';
import { OfferBookingValidation } from '#src/components/analytics/types';
import {
  getSessionCoachId,
  getSessionEstablishmentId,
  getSessionMetaActivityId,
} from '#src/components/analytics/utils';
import analyticsUtils from '#src/components/analytics/analytics';
import { UserRegistrationResponse } from '#src/libs/booker-module/types';
import { getCheckoutValidationUrl } from '#src/libs/marketplace/routing-utils';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import useAsyncFn from '#src/hooks/useAsyncFn';
import { Basket } from '#src/libs/checkout/types';
import { removeItemInStorage } from '#src/utils/storage';
import { STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES } from '#src/actions/constants';
import { postUserRegistration } from '#src/libs/offer/api';

const redirectToConfirmationPage = (
  offer: OfferREST,
  userRegistrationResponse: UserRegistrationResponse,
  basketId: string,
  pushUrl: (url: string) => void,
) => {
  const mappedOffer: OfferBookingValidation = {
    id: offer.id,
    isNewPass: false,
    metaActivityId: getSessionMetaActivityId(offer),
    coachId: getSessionCoachId(offer),
    establishmentId: getSessionEstablishmentId(offer),
    date: offer.date_start,
  };
  analyticsUtils.onSessionBookingSuccess({
    offersBooked: [mappedOffer],
  });
  pushUrl(
    getCheckoutValidationUrl(offer.company, {
      basket: basketId,
      one_click_checkout: 'true',
      user_registration_response: encodeURIComponent(
        JSON.stringify(userRegistrationResponse),
      ),
    }),
  );
};

const validateBasket = async (basket: Basket) => {
  const basketTotalPrice = basket.checkout_items.reduce(
    (acc, item) => acc + item.unit_price,
    0,
  );
  if (basketTotalPrice <= 0) {
    await validateUnpaid(basket.id);
    return;
  }
  throw new Error('Payment not implemented yet');
};

type UseBookInOneClickParams = {
  companyId: number;
  selectedPaymentPackId: number;
  offer: OfferREST;
  email: string;
};

const useBookInOneClick = () => {
  const dispatch = useDispatch();

  const bookInOneClick =
    (pushUrl: (url: string) => void) =>
    async ({
      offer,
      companyId,
      selectedPaymentPackId,
      email,
    }: UseBookInOneClickParams) => {
      const { data: userRegistrationResponse } = await postUserRegistration({
        one_click_checkout: true,
        payment_pack: selectedPaymentPackId,
        offers: [{ offer_id: offer.id, extra_data: {} }],
        email,
      });

      if (userRegistrationResponse.error_codes.length > 0) {
        // TODO: Add a better error handling here
        throw new Error('Error during user registration');
      }

      const { data: basket } = await fetchCurrentBasket(companyId);

      await validateBasket(basket);

      removeItemInStorage('local', STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES);

      redirectToConfirmationPage(
        offer,
        userRegistrationResponse,
        basket.id,
        pushUrl,
      );
    };

  return useAsyncFn(bookInOneClick((url) => dispatch(push(url))));
};

export default useBookInOneClick;
