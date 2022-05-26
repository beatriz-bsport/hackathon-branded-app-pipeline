// @flow
import React, { useRef } from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { Button, CircularProgress, Theme } from '@material-ui/core';

import { CompanyTheme } from '#libs/theme/types';
import MarketPlaceWorkshopCard from './MarketPlaceWorkshopCard.component';
import { MetaActivity, OffersGroup } from '#libs/meta-activity/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { Offer } from '#libs/offer/types';
import useVisibility from '../../../hooks/useIsVisibleOnScreen';
import { Level } from '#libs/level/types';

type Props = {
  metaActivities: Array<MetaActivity>;
  theme: CompanyTheme;
  hideCoach: boolean;
  metaActivityloading: boolean;
  offerDetailsloading: boolean;
  showOfferFilling: boolean;
  hasMoreToLoad: boolean;
  getOffersListByMetaActivity: (id: number) => any;
  onBook: (offer: Offer) => void;
  onBookOption: (offer: Offer) => void;
  onLoadMoreOffer: (metaActivityId: number) => (page: number) => void;
  onEndReach: () => void;
  getCoach: (id: number) => Coach;
  getEstablishment: (id: number) => Establishment;
  getLevel: (id: number) => Level;
  getGroup: (id: number) => OffersGroup;
  getOffersListByGroup: (id: number) => Offer[];
};

export const MarketplaceWorkshop: React.FC<Props> = ({
  metaActivities,
  theme,
  hideCoach,
  metaActivityloading,
  offerDetailsloading,
  showOfferFilling,
  hasMoreToLoad,
  getOffersListByMetaActivity,
  onBook,
  onBookOption,
  onLoadMoreOffer,
  onEndReach,
  getCoach,
  getEstablishment,
  getLevel,
  getGroup,
  getOffersListByGroup,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['marketplace']);
  const refContainer = useRef<HTMLDivElement>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, currentElement] = useVisibility<HTMLDivElement>(
    1000,
    500,
    onEndReach,
  );

  const filteredMetaActivities =
    metaActivities?.filter((m) => {
      const offers = getOffersListByMetaActivity(m.id);
      return (offers?.items ?? []).length > 0;
    }) ?? [];

  const offersLoading = metaActivities?.some((m) => {
    const offers = getOffersListByMetaActivity(m.id);
    return offers?.loading ?? true;
  });

  if (
    filteredMetaActivities.length === 0 &&
    !metaActivityloading &&
    !offersLoading &&
    !hasMoreToLoad
  ) {
    return (
      <div className={classes.centeredText}>
        <Typography color="textSecondary">
          {t('workshop.noWorkshopAvailable')}
        </Typography>
      </div>
    );
  }

  if (
    filteredMetaActivities.length === 0 &&
    (metaActivityloading || offersLoading)
  ) {
    return (
      <div className={classes.centeredText}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={classes.fullWidth} ref={refContainer}>
      <div
        className={classnames(classes.offersWrapper, {
          [classes.forceFlex]: refContainer?.current?.clientWidth < 600,
        })}
      >
        {filteredMetaActivities.map((m) => {
          const offers = getOffersListByMetaActivity(m.id);

          return (
            <div key={m.id}>
              <MarketPlaceWorkshopCard
                theme={theme}
                offers={offers}
                getCoach={getCoach}
                getEstablishment={getEstablishment}
                getLevel={getLevel}
                getGroup={getGroup}
                metaActivity={m}
                showOfferFilling={showOfferFilling}
                loading={false}
                hideCoach={hideCoach}
                onBook={onBook}
                onBookOption={onBookOption}
                offerDetailsloading={offerDetailsloading}
                onLoadMoreOffer={onLoadMoreOffer(m.id)}
                getOffersListByGroup={getOffersListByGroup}
              />
            </div>
          );
        })}
        {/* on reachEnd dom listener */}
        {filteredMetaActivities.length > 0 &&
          !metaActivityloading &&
          hasMoreToLoad && (
            <div ref={currentElement}>
              <MarketPlaceWorkshopCard
                theme={theme}
                metaActivity={null}
                showOfferFilling={false}
                loading
                getLevel={getLevel}
                getOffersListByGroup={getOffersListByGroup}
                hideCoach={false}
                offers={null}
                onBook={null}
                onBookOption={null}
                onLoadMoreOffer={null}
                offerDetailsloading
              />
            </div>
          )}
        {/* Should be automatic but better safe than sorry */}
        {!offersLoading && hasMoreToLoad && (
          <div className={classes.flex}>
            <Button onClick={onEndReach}> {t('workshop.loadMore')}</Button>
          </div>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  fullWidth: {
    width: '100%',
  },
  offersWrapper: {
    display: 'grid',
    marginTop: theme.spacing(2),
    gap: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    gridTemplateColumns: 'repeat(auto-fit, minmax(560px, 1fr) ) ',
  },
  forceFlex: {
    display: 'flex',
    flexDirection: 'column',
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: theme.spacing(3),
  },
}));

export default React.memo(MarketplaceWorkshop);
