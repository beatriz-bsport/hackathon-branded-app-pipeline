import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import {
  USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY,
  USER_STATUS_VALIDATION_WITH_MEMBER_OF_COMPANY,
  USER_STATUS_VALIDATION_COMPLETED,
} from '../../../member/utils';

import type { UserProfile } from '../../../member/types';

type OwnProps = {
  userStatus: number;
  userProfile: UserProfile;
};
type Props = WithTranslation & OwnProps;
export const MemberGreetingBanner = (props: Props) => {
  const { userStatus, t, userProfile } = props;
  if (userStatus === USER_STATUS_VALIDATION_COMPLETED) {
    return null;
  }
  if (userStatus === USER_STATUS_VALIDATION_WITH_MEMBER_OF_COMPANY) {
    return (
      <>
        <Typography variant="h5">
          {t('forms.needInformationValidation.welcome', {
            firstname: userProfile?.first_name,
          })}
        </Typography>
        <Typography variant="h6">
          {t('forms.needInformationValidation.subtitle.memberOfCompany')}
        </Typography>
        <Typography variant="body1">
          {t('forms.needInformationValidation.legend.memberOfCompany')}
        </Typography>
      </>
    );
  }
  if (userStatus === USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY) {
    return (
      <>
        <Typography variant="h5">
          {t('forms.needInformationValidation.welcome', {
            firstname: userProfile?.first_name,
          })}
        </Typography>
        <Typography variant="h6">
          {t('forms.needInformationValidation.subtitle.notMemberYet')}
        </Typography>
        <Typography variant="body1">
          {t('forms.needInformationValidation.legend.notMemberYet')}
        </Typography>
      </>
    );
  }
  return null;
};

export default compose<any, OwnProps>(withTranslation('member'))(
  MemberGreetingBanner,
);
