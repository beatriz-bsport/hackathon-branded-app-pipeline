import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import { makeStyles, useTheme } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { CompanyTheme } from '#libs/theme/types';
import { ChangeEmailRequest } from '#libs/member/types';
import { Membership } from '#libs/membership/types';
import {
  ContentTitle,
  SpacedText,
  EmailDetailContent,
  ContentActions,
} from '../../GenericFields.components';

type SimpleEmailChangeContentMultipleCompaniesProps = {
  request: ChangeEmailRequest;
  companyTheme: CompanyTheme;
  membershipList: Array<Membership>;
  onConfirm: () => void;
  onDenied: () => void;
};

export const SimpleEmailChangeContentMultipleCompanies = (
  props: SimpleEmailChangeContentMultipleCompaniesProps,
) => {
  const theme: Theme = useTheme();
  const classes = useStyles(theme);
  const { t } = useTranslation('member');
  const { request, companyTheme, onConfirm, onDenied, membershipList } = props;
  return (
    <>
      <ContentTitle
        title={t('changeEmailRequest.memberPage.simpleEmailChange.title')}
      />
      <SpacedText
        text={t('changeEmailRequest.memberPage.requestingStudio', {
          company: companyTheme?.company_name,
        })}
      />
      <EmailDetailContent
        old_email={request?.old_email}
        new_email={request?.new_email}
      />
      <SpacedText
        text={t(
          'changeEmailRequest.memberPage.simpleEmailChange.multipleCompanyHelper',
        )}
      />
      <div className={classes.avatarOutterContainer}>
        {membershipList?.map((m) => (
          <div className={classes.avatarInnerContainer}>
            <Avatar
              alt={m.company_name}
              src={m.company_cover}
              style={{ height: '70px', width: '70px' }}
            />
            <div className={classes.companyName}>
              <Typography variant="caption">{m.company_name}</Typography>
            </div>
          </div>
        ))}
      </div>
      <SpacedText
        text={t(
          'changeEmailRequest.memberPage.simpleEmailChange.acceptRequestHelper',
        )}
      />
      <SpacedText
        text={t(
          'changeEmailRequest.memberPage.simpleEmailChange.deniedRequestHelper',
        )}
      />
      <ContentActions
        onConfirm={onConfirm}
        onDenied={onDenied}
        confirmText={t('changeEmailRequest.memberPage.actions.confirm')}
        denyText={t('changeEmailRequest.memberPage.actions.cancel')}
      />
    </>
  );
};

export default SimpleEmailChangeContentMultipleCompanies;
const useStyles = makeStyles((theme: Theme) => ({
  avatarOutterContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyItems: 'stretch',
  },
  avatarInnerContainer: {
    display: 'flex',
    alignItems: 'start',
    flexDirection: 'column',
    marginRight: theme.spacing(2),
  },
  companyName: {
    width: '70px',
    textAlign: 'center',
  },
}));
