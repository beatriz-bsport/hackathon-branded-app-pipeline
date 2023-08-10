import React from 'react';
import { Divider, IconButton, Typography, makeStyles } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';

type Props = {
  referralLink: string;
  nbRemainingReferralUses: number;
  maxReferralUses: number;
};

const MemberReferralPanel: React.FC<Props> = ({
  referralLink,
  nbRemainingReferralUses,
  maxReferralUses,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('referral');
  return (
    <div>
      <Typography className={classes.title} component="h2" variant="h6">
        {t('memberInfo.referralLink')}
      </Typography>
      <Divider />
      <div className={classes.flexColumn}>
        <div className={classes.flexRow}>
          <Typography>{referralLink}</Typography>
          <CopyToClipboard text={referralLink}>
            <IconButton color="primary">
              <FileCopyIcon />
            </IconButton>
          </CopyToClipboard>
        </div>
        <div className={classes.nbRemainingUses}>
          <Typography color="textSecondary" variant="caption">
            {`${t(
              'memberInfo.nbRemainingUses',
            )} : ${nbRemainingReferralUses}/${maxReferralUses}`}
          </Typography>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: theme.spacing(1),
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
  },
  nbRemainingUses: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default React.memo(MemberReferralPanel);
