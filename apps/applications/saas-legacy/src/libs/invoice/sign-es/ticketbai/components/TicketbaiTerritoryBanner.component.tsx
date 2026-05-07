import React from 'react';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { SIGN_ES_TERRITORY } from '#src/libs/invoice/types';
import type { PlatformCustomerEntity } from '#src/libs/platform-billing/type';
import type { TicketbaiTerritory } from '#src/libs/invoice/sign-es/ticketbai/types';

type Props = {
  territory: TicketbaiTerritory;
  platformCustomerEntity: PlatformCustomerEntity | null | undefined;
};

function territoryLabelKey(t: TicketbaiTerritory): string {
  switch (t) {
    case SIGN_ES_TERRITORY.ARABA:
      return 'configuration.ticketbai.territory.araba';
    case SIGN_ES_TERRITORY.BIZKAIA:
      return 'configuration.ticketbai.territory.bizkaia';
    case SIGN_ES_TERRITORY.GIPUZKOA:
      return 'configuration.ticketbai.territory.gipuzkoa';
    default:
      throw new Error(`Unsupported Ticketbai territory: ${String(t)}`);
  }
}

const TicketbaiTerritoryBanner: React.FC<Props> = ({
  territory,
  platformCustomerEntity: _platformCustomerEntity,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('b2b_invoice');

  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="h6">
        {t('configuration.ticketbai.territory.title')}
      </Typography>
      <Typography className={classes.subtitle} variant="subtitle1">
        {t('configuration.ticketbai.territory.subtitle')}
      </Typography>
      <div className={classes.row}>
        <Typography className={classes.detectedProvinceLabel} variant="body2">
          {t('configuration.ticketbai.territory.detected_province')}
        </Typography>
        <Typography variant="body2">
          {t(territoryLabelKey(territory))}
        </Typography>
      </div>
      <Typography className={classes.helperText} variant="caption">
        <Trans
          components={[
            <Link
              key="company-onboarding-link"
              className={classes.link}
              to="/settings/company_onboarding"
            />,
          ]}
          i18nKey="configuration.ticketbai.territory.helper"
          ns="b2b_invoice"
        />
      </Typography>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.grey[50],
  },
  title: {
    fontWeight: 590,
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    fontWeight: 590,
    marginBottom: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  detectedProvinceLabel: {
    fontWeight: 590,
    color: theme.palette.text.secondary,
  },
  helperText: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    color: theme.palette.text.secondary,
  },
  link: {
    display: 'inline-flex',
    fontWeight: 700,
    color: '#611a15',
    textDecoration: 'none',
    '&:hover': {
      color: '#611a15',
      textDecoration: 'underline',
    },
  },
}));

export default TicketbaiTerritoryBanner;
