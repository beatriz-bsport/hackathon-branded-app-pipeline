import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import { Trans, useTranslation } from 'react-i18next';
import ButtonBaseWithTypography from '#components/button/ButtonBaseWithTypography';

type Props = {
  referringMemberName: string;
  handleRedirectToReferringMember: () => void;
};

export const MemberSummaryCardReferralSection: React.FC<Props> = ({
  referringMemberName,
  handleRedirectToReferringMember,
}) => {
  const { t } = useTranslation('member');
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography color="textPrimary" component="div" variant="caption">
        <Trans i18nKey="signedUpWithReferral" t={t}>
          Member registered through
          <ButtonBaseWithTypography
            onClick={handleRedirectToReferringMember}
            typographyColor="secondary"
            typographyVariant="caption"
          >
            {{ name: referringMemberName }}
          </ButtonBaseWithTypography>
          referral link
        </Trans>
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
}));

export default React.memo(MemberSummaryCardReferralSection);
