import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import chroma from 'chroma-js';
import type { Theme as CompanyTheme } from '#libs/theme/types';

type Props = {
  credits: number;
  creditsOverride: number;
  companyTheme: CompanyTheme;
  size?: string;
};

const FreeOfferChip: React.FC<Props> = ({
  credits,
  creditsOverride,
  companyTheme,
  size,
}) => {
  const { t } = useTranslation('offer');
  const classes = useStyles();

  if (
    companyTheme?.show_free_session_label &&
    (creditsOverride === 0 || (!creditsOverride && credits === 0))
  ) {
    return (
      <Typography
        className={classNames(classes.chip, {
          [classes.largeChip]: size === 'large',
          [classes.smallChip]: size === 'small',
        })}
      >
        {t('isFree')}
      </Typography>
    );
  }
  return null;
};

const useStyles = makeStyles((theme: Theme) => {
  return {
    chip: {
      display: 'flex',
      padding: theme.spacing(1),
      paddingTop: 0,
      paddingBottom: 0,
      borderRadius: 5,
      color: theme.palette.success.main,
      backgroundColor: chroma(theme.palette.success.main).alpha(0.1).hex(),
      fontSize: '13px',
      fontWeight: theme.typography.body2.fontWeight,
      alignItems: 'center',
      minHeight: theme.spacing(3),
    },
    largeChip: {
      padding: theme.spacing(2),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.body1.fontWeight,
      marginRight: theme.spacing(1),
    },
    smallChip: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(2),
    },
  };
});

export default React.memo(FreeOfferChip);
