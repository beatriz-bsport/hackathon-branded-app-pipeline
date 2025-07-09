import { validateUnpaid } from '#src/libs/checkout/api';
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
import { removeItemInStorage, getItemInStorage } from '#src/utils/storage';
import {
  STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES,
  STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID,
} from '#src/actions/constants';
import { finalizeLightSignup } from '#src/libs/member/api';
import { handleUserRegistration } from './useHandleUserRegistration';
import { USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY } from '#src/libs/payment/constants';

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
      express_checkout: 'true',
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
};

type UseBookInOneClickParams = {
  companyId: number;
  selectedPaymentPackId: number;
  offer: OfferREST;
  email: string;
};

type OnBookingSuccessParams = {
  basketId?: string;
  offer?: OfferREST;
  userRegistrationResponse?: UserRegistrationResponse;
};

const useBookInOneClick = () => {
  const dispatch = useDispatch();
  const pushUrl = (url: string) => dispatch(push(url));

  const redirectOnBookingSuccess = async ({
    offer,
    userRegistrationResponse,
    basketId,
  }: OnBookingSuccessParams) => {
    const memberId = getItemInStorage(
      'local',
      STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID,
    );

    const rawUserRegistrationResponse = getItemInStorage(
      'local',
      USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
    );

    if (!!rawUserRegistrationResponse) {
      removeItemInStorage(
        'local',
        USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
      );
    }

    if (offer && basketId && userRegistrationResponse && memberId) {
      await finalizeLightSignup(parseInt(memberId));

      removeItemInStorage('local', STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES);

      removeItemInStorage('local', STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID);

      redirectToConfirmationPage(
        offer,
        userRegistrationResponse,
        basketId,
        pushUrl,
      );
    }
  };

  const bookInOneClick = async ({
    offer,
    companyId,
    selectedPaymentPackId,
    email,
  }: UseBookInOneClickParams) => {
    const { basket, userRegistrationResponse } = await handleUserRegistration({
      companyId,
      email,
      offerId: offer.id,
      paymentPackId: selectedPaymentPackId,
    });

    if (basket) {
      await validateBasket(basket);

      redirectOnBookingSuccess({
        basketId: basket.id,
        offer,
        userRegistrationResponse,
      });
    }
  };
  return {
    bookInOneClick: useAsyncFn(bookInOneClick),
    redirectOnBookingSuccess,
  };
};

export default useBookInOneClick;
