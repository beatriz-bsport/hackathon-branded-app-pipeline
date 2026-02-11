import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { getItemInStorage, removeItemInStorage } from '#src/utils/storage';
import { STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID } from '#src/actions/constants';
import { USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY } from '#src/libs/payment/constants';

type CleanLocalStorageAndRedirectParams<
  T extends (...args: unknown[]) => unknown,
> = {
  canPerformRedirection: boolean;
  url: string;
  onSuccess?: T;
};

export const useRedirectOnSuccess = () => {
  const dispatch = useDispatch();
  const pushUrl = (redirectUrl: string) => dispatch(push(redirectUrl));

  const cleanLocalStorageAndRedirect = <
    T extends (...args: unknown[]) => unknown,
  >({
    canPerformRedirection,
    url,
    onSuccess,
  }: CleanLocalStorageAndRedirectParams<T>) => {
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

    if (canPerformRedirection && memberId) {
      onSuccess?.();
      removeItemInStorage('local', STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID);
      pushUrl(url);
    }
  };
  return { cleanLocalStorageAndRedirect };
};
