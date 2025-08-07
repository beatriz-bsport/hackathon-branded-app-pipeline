import { useCallback, useEffect } from 'react';
import { useFormikContext } from 'formik';
import isEqual from 'lodash/isEqual';
import useDebouncedCallback from '#src/hooks/useDebouncedCallBack';
import { useLightSignUp } from '#src/pages/checkout/express-checkouts/hooks/useLightSignUp';
import { useLightSignupFormUtils } from '#src/pages/checkout/express-checkouts/hooks/useLightSignupFormUtils';
import { getItemInStorage } from '#src/utils/storage';
import { STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID } from '#src/actions/constants';
import { getAuthToken } from '#src/http';
import { DEBOUNCE_CALLBACK_DELAY } from '#src/pages/checkout/express-checkouts/constants';
import { LightSignupFormValues } from '#src/pages/checkout/express-checkouts/components/LightSignupForm';

export type LightSignupCreateResult = {
  memberId: number;
  userId: number;
  token: string;
  email: string;
};

export type LightSignupUpdateResult = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phone: string;
  acceptEmail: boolean;
  acceptSms: boolean;
  acceptTermsAndConditions: boolean;
};

type UseLightSignUpOperationsOptions<
  TDebouncedCreateReturn = void,
  TDebouncedUpdateReturn = void,
  TImmediateCreateReturn = void,
  TImmediateUpdateReturn = void,
> = {
  companyId: number;
  onDebouncedCreateSuccess?: (
    result?: LightSignupCreateResult,
    ...args: any[]
  ) => Promise<TDebouncedCreateReturn>;
  onDebouncedUpdateSuccess?: (
    result: LightSignupUpdateResult,
    ...args: any[]
  ) => Promise<TDebouncedUpdateReturn>;
  onImmediateCreateSuccess?: (
    result: LightSignupCreateResult,
    ...args: any[]
  ) => Promise<TImmediateCreateReturn>;
  onImmediateUpdateSuccess?: (
    result: LightSignupUpdateResult,
    ...args: any[]
  ) => Promise<TImmediateUpdateReturn>;
  shouldSkip?: boolean;
};

export const useLightSignUpOperations = <
  TDebouncedCreateReturn = void,
  TDebouncedUpdateReturn = void,
  TImmediateCreateReturn = void,
  TImmediateUpdateReturn = void,
>({
  companyId,
  onDebouncedCreateSuccess,
  onDebouncedUpdateSuccess,
  onImmediateCreateSuccess,
  onImmediateUpdateSuccess,
  shouldSkip = false,
}: UseLightSignUpOperationsOptions<
  TDebouncedCreateReturn,
  TDebouncedUpdateReturn,
  TImmediateCreateReturn,
  TImmediateUpdateReturn
>) => {
  const {
    values: lightSignupValues,
    submitForm: submitLightSignupForm,
    isValid,
  } = useFormikContext<LightSignupFormValues>();

  const { getIsFormInvalid, trimFormValues, getLighSignUpCustomErrors } =
    useLightSignupFormUtils();

  const {
    lightSignupCreate: [
      {
        loading: lightSignupCreateLoading,
        value: createdMember,
        error: lightSignupCreateError,
      },
      lightSignupCreate,
    ],
    lightSignUpUpdate: [{ value: updatedMember }, lightSignUpUpdate],
  } = useLightSignUp();

  const memberId =
    getItemInStorage('local', STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID) ?? '';
  const token = getAuthToken();
  const isTokenNull = !token || token === 'null';

  const canPerformLightSignUpCreate =
    !memberId && isTokenNull && !lightSignupCreateLoading;

  const canPerformLightSignupUpdate = (() => {
    if (!lightSignupValues) return false;
    const lightSignupValuesWithoutPassword = Object.fromEntries(
      Object.entries(lightSignupValues).filter(
        ([key]) => key !== 'passwordConfirm',
      ),
    ) as LightSignupFormValues;

    return (
      !!memberId &&
      !isTokenNull &&
      !!lightSignupValuesWithoutPassword &&
      !isEqual(updatedMember, trimFormValues(lightSignupValuesWithoutPassword))
    );
  })();

  const performSignup = useCallback(
    async (
      onCreateSuccess?:
        | typeof onImmediateCreateSuccess
        | typeof onDebouncedCreateSuccess,
      onUpdateSuccess?:
        | typeof onImmediateUpdateSuccess
        | typeof onDebouncedUpdateSuccess,
    ) => {
      if (shouldSkip) return;

      if (canPerformLightSignUpCreate) {
        if (!isValid || (await getIsFormInvalid())) {
          return;
        }
        await submitLightSignupForm();
        const result = await lightSignupCreate({
          companyId,
          password: lightSignupValues.password,
          firstName: lightSignupValues.firstName,
          lastName: lightSignupValues.lastName,
          email: lightSignupValues.email,
          phone: lightSignupValues.phone,
          acceptEmail: lightSignupValues.acceptEmail,
          acceptSms: lightSignupValues.acceptSms,
          accept_terms_and_conditions:
            lightSignupValues.acceptTermsAndConditions,
        });

        if (!!result && onCreateSuccess) {
          await onCreateSuccess(result);
        }
        return;
      }

      if (canPerformLightSignupUpdate) {
        if (!isValid || (await getIsFormInvalid())) {
          return;
        }
        await submitLightSignupForm();
        const updateResult = await lightSignUpUpdate({
          id: memberId,
          password: lightSignupValues.password,
          first_name: lightSignupValues.firstName,
          last_name: lightSignupValues.lastName,
          email: lightSignupValues.email,
          phone_number: lightSignupValues.phone,
          accept_email: lightSignupValues.acceptEmail,
          accept_sms: lightSignupValues.acceptSms,
          accept_terms_and_conditions:
            lightSignupValues.acceptTermsAndConditions,
        });

        if (!!updateResult && onUpdateSuccess) {
          await onUpdateSuccess(updateResult);
        }
      }
    },
    [
      companyId,
      lightSignupCreate,
      lightSignupValues,
      lightSignUpUpdate,
      memberId,
      shouldSkip,
      submitLightSignupForm,
      canPerformLightSignUpCreate,
      canPerformLightSignupUpdate,
      isValid,
      getIsFormInvalid,
    ],
  );

  const debouncedLightSignUp = useDebouncedCallback(
    async () =>
      await performSignup(onDebouncedCreateSuccess, onDebouncedUpdateSuccess),
    DEBOUNCE_CALLBACK_DELAY,
    [performSignup, onDebouncedCreateSuccess, onDebouncedUpdateSuccess],
  );

  const lightSignUpWithoutDebounce = useCallback(
    async () =>
      await performSignup(onImmediateCreateSuccess, onImmediateUpdateSuccess),
    [onImmediateCreateSuccess, onImmediateUpdateSuccess, performSignup],
  );

  useEffect(
    () => getLighSignUpCustomErrors(lightSignupCreateError),
    [lightSignupCreateError, getLighSignUpCustomErrors],
  );

  return {
    debouncedLightSignUp,
    lightSignUpWithoutDebounce,
    lightSignupCreateError,
    createdMember,
    updatedMember,
    memberId,
    isTokenNull,
  };
};
