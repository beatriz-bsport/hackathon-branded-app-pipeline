import {
  EMAIL_TYPE_INFORMATIONAL,
  EMAIL_TYPE_MARKETING,
  type EmailType,
} from "./constants";

export function isEmailTypeValid(emailType: string): emailType is EmailType {
  return (
    emailType === EMAIL_TYPE_MARKETING || emailType === EMAIL_TYPE_INFORMATIONAL
  );
}
