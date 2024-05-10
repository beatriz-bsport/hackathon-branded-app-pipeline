import { useTranslation } from 'react-i18next';
import {
  USER_STATUS_VALIDATION_WITH_MEMBER_OF_COMPANY,
  USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY,
} from '#src/libs/member/utils';

export const useCustomFormButtonLabel = ({
  buttonType,
  disconnectOnCancel,
  isEditionForm,
  isMulti,
  userStatus,
}: {
  buttonType: 'cancel' | 'submit';
  disconnectOnCancel?: boolean;
  isEditionForm?: boolean;
  isMulti?: boolean;
  userStatus?: number;
}) => {
  const { t } = useTranslation(['marketing', 'member']);
  switch (buttonType) {
    case 'submit':
      if (
        userStatus === USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY
      ) {
        return t('member:forms.needInformationValidation.button.notMemberYet');
      }
      if (userStatus === USER_STATUS_VALIDATION_WITH_MEMBER_OF_COMPANY) {
        return t(
          'member:forms.needInformationValidation.button.memberOfCompany',
        );
      }
      if (isEditionForm) {
        return t('marketing:customForm.clientForms.modify');
      }
      if (isMulti) {
        return t('marketing:customForm.next');
      }
      return t('marketing:customForm.send');
    case 'cancel':
      if (disconnectOnCancel) {
        return t('marketing:customForm.disconnect');
      }
      return t('marketing:customForm.previous');
    default:
      return t('marketing:customForm.send');
  }
};
