// @ts-nocheck
// @flow
import React, { useRef } from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import { Button, CircularProgress } from '@material-ui/core';

import { CompanyTheme } from '#libs/theme/types';
import MarketPlaceWorkshopCard from '../MarketplaceWorkshopCard.component';
import { MetaActivity } from '#libs/meta-activity/types';
import { OffersGroup } from '#libs/group-offer/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { Offer } from '#libs/offer/types';
import useIsVisibleOnScreen from '../../../../hooks/useIsVisibleOnScreen';
import { Level } from '#libs/level/types';

import './MarketplaceWorkshop.css';

type Props = {
  metaActivities: Array<MetaActivity>;
  theme: CompanyTheme;
  hideCoach: boolean;
  metaActivityloading: boolean;
  offerDetailsloading: boolean;
  showOfferFilling: boolean;
  showOfferGender: boolean;
  hasMoreToLoad: boolean;
  bookedOffers: number[];
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

const MarketplaceWorkshop: React.FC<Props> = ({
  metaActivities,
  theme,
  hideCoach,
  metaActivityloading,
  offerDetailsloading,
  showOfferFilling,
  showOfferGender,
  hasMoreToLoad,
  bookedOffers,
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
  const { t } = useTranslation(['marketplace']);
  const refContainer = useRef<HTMLDivElement>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, currentElement] = useIsVisibleOnScreen<HTMLDivElement>(
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
      <div className="bs-worshop-page__empty-state">
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
      <div className="bs-worshop-page__loading">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div ref={refContainer} className="bs-workshop-page__workshops">
      <div
        className={classnames('bs-workshop-page__workshops__lists', {
          'bs-workshop-page__workshops__lists--column':
            refContainer?.current?.clientWidth < 600,
          'bs-workshop-page__workshops__lists--only-one':
            filteredMetaActivities.length === 1,
          'bs-workshop-page__workshops__lists--medium':
            refContainer?.current?.clientWidth < 1200,
        })}
      >
        {filteredMetaActivities.map((m) => {
          const offers = getOffersListByMetaActivity(m.id);

          return (
            <div key={m.id}>
              <MarketPlaceWorkshopCard
                bookedOffers={bookedOffers}
                getCoach={getCoach}
                getEstablishment={getEstablishment}
                getGroup={getGroup}
                getLevel={getLevel}
                getOffersListByGroup={getOffersListByGroup}
                hideCoach={hideCoach}
                loading={false}
                metaActivity={m}
                offerDetailsloading={offerDetailsloading}
                offers={offers}
                onBook={onBook}
                onBookOption={onBookOption}
                onLoadMoreOffer={onLoadMoreOffer(m.id)}
                showOfferFilling={showOfferFilling}
                showOfferGender={showOfferGender}
                theme={theme}
              />
            </div>
          );
        })}
        {/* Should be automatic but better safe than sorry */}
        {!offersLoading && hasMoreToLoad && filteredMetaActivities.length > 0 && (
          <div
            ref={currentElement}
            className="bs-workshop-page__workshops__lists__load-more"
          >
            <Button onClick={onEndReach}> {t('workshop.loadMore')}</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MarketplaceWorkshop);
