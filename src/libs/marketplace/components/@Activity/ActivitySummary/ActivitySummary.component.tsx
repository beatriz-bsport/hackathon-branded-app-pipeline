import React from 'react';
import RoomIcon from '@material-ui/icons/Room';
import AdjustIcon from '@material-ui/icons/Adjust';

import { CreditCard } from '@material-ui/icons';
import type { Coach } from '#libs/associated-coach/types';
import type { Establishment } from '#libs/establishment/types';
import CardContent from '#components/css-only/Card/CardContent';
import Grid from '#components/css-only/Grid';
import GridItem, {
  Direction,
  Justification,
} from '#components/css-only/Grid/GridItem';
import MarketplaceEstablishmentTitle from '#marketplacecomponents/@Establishment/MarketplaceEstablishmentTitle';
import './styles.css';
import { CompanyTheme } from '#libs/theme/types';
import MarketplaceCoachInfos from '#marketplacecomponents/@Coach/MarketplaceCoachInfos';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

export type Props = {
  title?: string;
  establishment?: Establishment;
  coach?: Coach;
  hideCoach: boolean;
  companyTheme: CompanyTheme;
  spotName?: string;
  credits?: string;
  showEstablishmentAddress?: boolean;
};

const ActivitySummary: React.FC<Props> = ({
  title,
  establishment,
  coach,
  hideCoach,
  companyTheme,
  spotName,
  credits,
  showEstablishmentAddress,
}) => {
  return (
    <CardContent
      classes={{
        'bs-booking-item-details__content': 'bs-booking-item-details__content',
      }}
    >
      <Grid
        classes={{
          'bs-booking-item-details__grid': 'bs-booking-item-details__grid',
        }}
      >
        <GridItem
          classes={{
            'bs-booking-item-details-title': true,
            'bs-booking-item-details-title--hidden': !title,
          }}
          direction={Direction.ROW}
          justification={Justification.FLEX_START}
          rowStart={1}
        >
          {title}
        </GridItem>
        <GridItem
          classes={{
            'bs-booking-item-details__element-with-icon': true,
            'bs-booking-item-details__element-with-icon--hidden':
              !establishment,
          }}
          direction={Direction.ROW}
          justification={Justification.FLEX_START}
          rowStart={2}
        >
          <MarketplaceEstablishmentTitle
            classes={{
              'bs-booking-item-details-establishment':
                'bs-booking-item-details-establishment',
            }}
            establishment={establishment}
            icon={
              <RoomIcon className="bs-booking-item-details-establishment__icon" />
            }
            showEstablishmentAddress={showEstablishmentAddress}
          />
        </GridItem>
        <GridItem
          classes={{
            'bs-booking-item-details__element-with-icon': true,
            'bs-booking-item-details__element-with-icon--hidden':
              !coach || hideCoach,
          }}
          direction={Direction.ROW}
          justification={Justification.FLEX_START}
          rowStart={3}
        >
          <MarketplaceCoachInfos
            classes={{
              'bs-booking-item-details-coach': 'bs-booking-item-details-coach',
            }}
            coach={coach}
            coachPictureClasses={{
              'bs-booking-item-details-coach__icon':
                'bs-booking-item-details-coach__icon',
            }}
            hideCoach={hideCoach}
            theme={companyTheme}
          />
        </GridItem>
        <GridItem
          classes={{
            'bs-booking-item-details__element-with-icon': true,
            'bs-booking-item-details__element-with-icon--hidden': !spotName,
          }}
          direction={Direction.ROW}
          justification={Justification.FLEX_START}
          rowStart={4}
        >
          <div className="bs-booking-item-details-spot">
            <AdjustIcon className="bs-booking-item-details-spot__icon" />
            <p className="bs-booking-item-details-spot__text">{spotName}</p>
          </div>
        </GridItem>
        <GridItem
          classes={{
            'bs-booking-item-details__element-with-icon': true,
            'bs-booking-item-details__element-with-icon--hidden': !credits,
          }}
          direction={Direction.ROW}
          justification={Justification.FLEX_START}
          rowStart={5}
        >
          <div className="bs-booking-item-details-credits">
            <CreditCard className="bs-booking-item-details-credits__icon" />
            <p className="bs-booking-item-details-credits__text">{credits}</p>
          </div>
        </GridItem>
      </Grid>
    </CardContent>
  );
};

export const ActivitySummaryForStorybook = marketplaceCssHoc()(ActivitySummary);

export default React.memo(ActivitySummary);
