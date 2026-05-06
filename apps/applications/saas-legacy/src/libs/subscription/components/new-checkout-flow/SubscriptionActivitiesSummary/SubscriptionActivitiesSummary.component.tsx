import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Theme, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import OfferSummary from '#src/libs/offer/OfferSummary';
import { OfferSummaryVariant, Offer } from '#src/libs/offer/types';
import { Establishment } from '#src/libs/establishment/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { CompanyTheme } from '#src/libs/theme/types';

type Props = {
  offers: Offer<number, Establishment, MetaActivity>[];
  companyTheme: CompanyTheme;
};

const SubscriptionActivitiesSummary: React.FC<Props> = React.memo(
  ({ offers = [], companyTheme }) => {
    const { t } = useTranslation('checkout');
    const classes = useStyles();

    if (offers.length === 0) return null;

    return (
      <div className={classes.container}>
        <Typography className={classes.activityTitle} variant="h6">
          {t(`checkout:payment.selectedSession`)}
        </Typography>
        {offers.map((offer, index) => (
          <React.Fragment key={offer.id}>
            <OfferSummary
              noStyledContainer
              establishment={offer?.establishment}
              metaActivity={offer?.meta_activity}
              offer={offer}
              theme={companyTheme}
              variant={OfferSummaryVariant.BASKET}
            />
            {index < offers.length - 1 && (
              <Divider className={classes.divider} variant="middle" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  },
);

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    background: 'white',
    display: 'flex',
    width: '100%',
    marginTop: theme.spacing(2),
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '12px',
    borderColor: theme.palette.grey[100],
    gap: theme.spacing(2),
  },
  activityTitle: {
    color: '#2D3748',
    fontSize: '20px',
  },
  divider: {
    borderColor: theme.palette.grey[100],
    borderWidth: '1px',
    margin: theme.spacing(2),
  },
}));

export default SubscriptionActivitiesSummary;
