import React from 'react';
import RoomIcon from '@material-ui/icons/Room';
import AdjustIcon from '@material-ui/icons/Adjust';

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
  title: string;
  establishment?: Establishment;
  coach?: Coach;
  hideCoach: boolean;
  companyTheme: CompanyTheme;
  spotName?: string;
};

const ActivitySummary: React.FC<Props> = ({
  title,
  establishment,
  coach,
  hideCoach,
  companyTheme,
  spotName,
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
            'bs-booking-item-details-title': 'bs-booking-item-details-title',
          }}
          direction={Direction.ROW}
          justification={Justification.FLEX_START}
          rowStart={1}
        >
          {title}
        </GridItem>
        <GridItem
          classes={{
            'bs-booking-item-details__element-with-icon':
              'bs-booking-item-details__element-with-icon',
            ...(establishment
              ? {}
              : {
                  'bs-booking-item-details__element-with-icon--hidden':
                    'bs-booking-item-details__element-with-icon--hidden',
                }),
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
          />
        </GridItem>
        <GridItem
          classes={{
            'bs-booking-item-details__element-with-icon':
              'bs-booking-item-details__element-with-icon',
            ...(coach && !hideCoach
              ? {}
              : {
                  'bs-booking-item-details__element-with-icon--hidden':
                    'bs-booking-item-details__element-with-icon--hidden',
                }),
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
            'bs-booking-item-details__element-with-icon':
              'bs-booking-item-details__element-with-icon',
            ...(spotName
              ? {}
              : {
                  'bs-booking-item-details__element-with-icon--hidden':
                    'bs-booking-item-details__element-with-icon--hidden',
                }),
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
      </Grid>
    </CardContent>
  );
};

export const ActivitySummaryForStorybook = marketplaceCssHoc()(ActivitySummary);

export default React.memo(ActivitySummary);
