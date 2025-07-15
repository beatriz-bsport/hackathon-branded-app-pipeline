import { setAuthToken } from '#src/http';
import useAsyncFn from '#src/hooks/useAsyncFn';
import { fetchMember, lightSignup, updateMember } from '#src/libs/member/api';
import { setItemInStorage } from '#src/utils/storage';
import { STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID } from '#src/actions/constants';
import { updatePassword } from '#src/libs/login/api';

type LightSignupCreateData = {
  companyId: number;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  acceptEmail?: boolean;
  acceptSms?: boolean;
  accept_terms_and_conditions: boolean;
};

type LightSignupUpdateData = {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  accept_email?: boolean;
  accept_sms?: boolean;
  accept_terms_and_conditions: boolean;
};

export const useLightSignUp = () => {
  const lightSignupCreate = async ({
    companyId,
    password,
    firstName,
    lastName,
    email,
    phone,
    acceptEmail,
    acceptSms,
    accept_terms_and_conditions,
  }: LightSignupCreateData) => {
    const {
      data: { token, member_id, user_id },
    } = await lightSignup({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      phone_number: phone,
      company_id: companyId,
      accept_email: acceptEmail,
      accept_sms: acceptSms,
      accept_terms_and_conditions,
    });

    setAuthToken(token);

    setItemInStorage(
      'local',
      STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID,
      member_id.toString(),
    );

    return {
      memberId: member_id,
      userId: user_id,
      token,
      email,
    };
  };

  const lightSignupUpdate = async ({
    accept_terms_and_conditions,
    email,
    first_name,
    id,
    last_name,
    accept_email,
    accept_sms,
    phone_number,
    password,
  }: LightSignupUpdateData) => {
    await updateMember(id, {
      accept_terms_and_conditions,
      email,
      first_name,
      last_name,
      accept_email,
      accept_sms,
      ...(phone_number && { phone: { phone_number: phone_number } }),
    });

    await updatePassword(password);
    /* The update endpoint does not return a full Member object. 
     We need a Member object to build the returned object in order to compare
     the value returned by the backend with the light signup form value. 
     If they are the same, we do not call this function.
     This is done to avoid too many calls in the context of a debounced callback
     */
    const { data: updatedMember } = await fetchMember(parseInt(id));

    return {
      firstName: updatedMember.firstname,
      lastName: updatedMember.lastname,
      password,
      email: updatedMember.email,
      phone: updatedMember.phone_number ?? '',
      acceptEmail: updatedMember.accept_email,
      acceptSms: updatedMember.accept_sms,
      acceptTermsAndConditions: accept_terms_and_conditions,
    };
  };

  return {
    lightSignupCreate: useAsyncFn(lightSignupCreate),
    lightSignUpUpdate: useAsyncFn(lightSignupUpdate),
  };
};
