import React from 'react';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import PersonAdd from '@material-ui/icons/PersonAdd';
import { useTranslation } from 'react-i18next';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { Establishment } from '#libs/establishment/types';
import { Coach } from '#libs/associated-coach/types';
import { Level } from '#libs/level/types';
import Card, { CardSize } from '#components/css-only/Card';
import CardContent from '#components/css-only/Card/CardContent';
import Grid from '#components/css-only/Grid';
import GridItem, {
  Alignment,
  Direction,
  Justification,
} from '#components/css-only/Grid/GridItem';
import ActivitySummary from '#marketplacecomponents/@Activity/ActivitySummary';
import { CompanyTheme } from '#libs/theme/types';
import Chip from '#components/css-only/Chip';
import MarketplaceLevelCSSOnly from '#marketplacecomponents/@Offer/MarketplaceLevelCSSOnly';
import Button, { ButtonVariant } from '#Fabrique/Button';
import Tooltip from '#Fabrique/Tooltip';

import './styles.css';

export type Props = {
  date: string;
  title: string;
  establishment?: Establishment;
  coach?: Coach;
  hideCoach: boolean;
  level?: Level;
  isWaitingList?: boolean;
  spotName?: string;
  companyTheme: CompanyTheme;
  shouldDisplayAddGuestButton?: boolean;
  addGuestTooltipText?: string;
  isAddGuestDisabled?: boolean;
  guestName?: string;
  onOpenAddGuestModal?: () => void;
  onAddGuestModalCancel?: () => void;
};

const MarketplaceBookingItem: React.FC<Props> = ({
  date,
  title,
  establishment,
  coach,
  hideCoach,
  level,
  isWaitingList,
  spotName,
  companyTheme,
  shouldDisplayAddGuestButton,
  addGuestTooltipText,
  isAddGuestDisabled,
  guestName,
  onOpenAddGuestModal,
}) => {
  const { t } = useTranslation(['checkout', 'booking']);
  const hasStatusChip = isWaitingList;
  return (
    <Card
      classes={{
        'bs-booking-item': 'bs-booking-item',
      }}
      size={CardSize.XL}
    >
      <CardContent
        padding
        classes={{ 'bs-booking-item-content': 'bs-booking-item-content' }}
      >
        <Grid
          classes={{
            'bs-booking-item-grid': 'bs-booking-item-grid',
            'bs-booking-item-grid--with-guest': guestName,
          }}
        >
          {!!guestName && (
            <GridItem
              classes={{
                'bs-booking-item-guest-name': 'bs-booking-item-guest-name',
              }}
              columnStart={1}
              direction={Direction.ROW}
              justification={Justification.FLEX_START}
              rowStart={1}
            >
              <p className="bs-booking-item-guest-name__text">
                {t('booking:offer.bookingFor')}
                <i>{` ${guestName}`}</i>
              </p>
            </GridItem>
          )}
          <GridItem
            classes={{
              'bs-booking-item-details-date': 'bs-booking-item-details-date',
            }}
            columnStart={1}
            direction={Direction.ROW}
            justification={Justification.FLEX_START}
            rowStart={2}
          >
            {date}
          </GridItem>
          <GridItem
            classes={{
              'bs-booking-item-details': 'bs-booking-item-details',
            }}
            columnStart={1}
            rowStart={3}
          >
            <ActivitySummary
              coach={coach}
              companyTheme={companyTheme}
              establishment={establishment}
              hideCoach={hideCoach}
              spotName={spotName}
              title={title}
            />
          </GridItem>
          <GridItem
            classes={{
              'bs-booking-item-chip': 'bs-booking-item-chip',
              'bs-booking-item-chip--status': 'bs-booking-item-chip--status',
              'bs-booking-item-chip--status-chip-mobile':
                'bs-booking-item-chip--status-chip-mobile',
              ...(hasStatusChip
                ? {}
                : {
                    'bs-booking-item-chip--hidden':
                      'bs-booking-item-chip--hidden',
                  }),
            }}
            columnEnd={2}
            columnStart={2}
            direction={Direction.ROW}
            rowStart={2}
          >
            <Chip
              classes={{
                'bs-booking-item-status-chip__waiting-list':
                  'bs-booking-item-status-chip__waiting-list',
              }}
              icon={<HourglassFullIcon />}
              label={t('validation.bookingItem.bookingItemStatus.waitingList')}
            />
          </GridItem>
          <GridItem
            classes={{
              'bs-booking-item-chip': 'bs-booking-item-chip',
              'bs-booking-item-chip--level': 'bs-booking-item-chip--level',
              'bs-booking-item-chip--level-mobile':
                'bs-booking-item-chip--level-mobile',
              ...(level
                ? {}
                : {
                    'bs-booking-item-chip--hidden':
                      'bs-booking-item-chip--hidden',
                  }),
            }}
            columnEnd={3}
            columnStart={3}
            direction={Direction.ROW}
            rowStart={2}
          >
            <MarketplaceLevelCSSOnly
              className="bs-booking-item-level"
              customLevel={level}
            />
          </GridItem>
          {shouldDisplayAddGuestButton && (
            <GridItem
              alignment={Alignment.FLEX_END}
              classes={{
                'bs-booking-item-add-guest': true,
              }}
              columnEnd={3}
              columnStart={3}
              direction={Direction.ROW}
              justification={Justification.FLEX_END}
              rowStart={3}
            >
              <Tooltip
                id="bs-booking-item-add-guest-tooltip"
                text={addGuestTooltipText}
              >
                <Button
                  classes={{
                    root: 'bs-booking-item-add-guest__button__container',
                    text: 'bs-booking-item-add-guest__button__text',
                  }}
                  isDisabled={isAddGuestDisabled}
                  onClick={onOpenAddGuestModal}
                  variant={ButtonVariant.ICON}
                >
                  <PersonAdd />
                </Button>
              </Tooltip>
            </GridItem>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export const MarketplaceBookingItemForStorybook = marketplaceCssHoc()(
  MarketplaceBookingItem,
);
export default React.memo(MarketplaceBookingItem);
