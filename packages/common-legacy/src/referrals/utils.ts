/* This function builds the referral link which is given to a member,
so they can send it to the people they want to refer.

BE CAREFUL if you want to change the shape of the link:
this same link is also created in the backend for transactional emails
-> if you change the shape of the link here you also have to change it in the backend

/!\ Think about app compatibility before applying any change to this function /!\ */
export const buildMemberReferralLink = (
  companyId: number,
  referral_uuid: string,
) => `/referral/${referral_uuid}?membership=${companyId}`;
