type PreferredCommunication = {
  id: number,
  text: string,
};
export const SMS: PreferredCommunication = {
  id: 0,
  text: 'SMS',
};

export const EMAIL: PreferredCommunication = {
  id: 1,
  text: 'EMAIL',
};
export const NOTIFICATION: PreferredCommunication = {
  id: 2,
  text: 'NOTIFICATION',
};
export const SMS_EMAIL: PreferredCommunication = {
  id: 4,
  text: 'SMS_EMAIL',
};
export const NONE: PreferredCommunication = {
  id: 3,
  text: 'NONE',
};
const PREFERRED_COMMUNICATION: Array<PreferredCommunication> = [
  SMS,
  EMAIL,
  SMS_EMAIL,
  NONE,
];

export default PREFERRED_COMMUNICATION;
