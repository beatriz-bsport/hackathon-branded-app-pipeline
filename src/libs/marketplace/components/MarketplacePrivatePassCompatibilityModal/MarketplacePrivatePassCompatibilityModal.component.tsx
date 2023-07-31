import React from 'react';
import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import ValidationIcon from '#components/icons/ValidationIcon.component';

import Card, { CardSize } from '#components/css-only/Card';
import Content from '#components/css-only/Card/CardContent';
import Grid from '#components/css-only/Grid';
import Item, { Alignment } from '#components/css-only/Grid/GridItem';

import './styles.css';

import type { PrivateServiceWithSlots } from '#libs/private-service/types';

export type Props = {
  compatiblePrivateServices: PrivateServiceWithSlots[];
  isOpen: boolean;
  onDialogClose: () => void;
};

const AvailableSlots: React.FC<{
  privateServiceWithSlots: PrivateServiceWithSlots;
}> = React.memo(({ privateServiceWithSlots }) => {
  const { t } = useTranslation('marketplace');

  const availablePrivateSlots =
    privateServiceWithSlots?.slots?.filter(
      (privateSlot) => privateSlot?.available,
    ) ?? [];

  const areAllSlotsAvailable =
    privateServiceWithSlots?.slots?.length === availablePrivateSlots?.length;

  return (
    <>
      {availablePrivateSlots?.length > 0 && (
        <div className="bs-pass-compatibility-dialog__compatibility">
          <div className="bs-pass-compatibility-dialog__compatibility__title">
            {privateServiceWithSlots.name}
          </div>
          <div className="bs-pass-compatibility-dialog__compatibility__itemList">
            {areAllSlotsAvailable ? (
              <div className="bs-pass-compatibility-dialog__compatibility__itemList__item --highlighted">
                {t(
                  'genericCardDetails.compatibility.allPrivateSlotsAvailables',
                )}
              </div>
            ) : (
              availablePrivateSlots.map((slotAvailable) => {
                return (
                  <div
                    className="bs-pass-compatibility-dialog__compatibility__itemList__item"
                    key={slotAvailable.id}
                  >
                    {slotAvailable.name}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
});

const MarketplacePrivatePassCompatibilityModal: React.FC<Props> = ({
  compatiblePrivateServices,
  isOpen,
  onDialogClose,
}) => {
  const { t } = useTranslation('marketplace');

  const validationIconStyles = {
    color: '#4CAF50',
    circle: {
      width: 64,
      height: 64,
    },
    checkIcon: {
      width: 56,
      height: 45,
    },
  };

  return (
    <>
      {isOpen && (
        <div className="bs-pass-compatibility-dialog__backdrop">
          <Card
            size={CardSize.L}
            classes={{
              'bs-pass-compatibility-dialog': 'bs-pass-compatibility-dialog',
            }}
          >
            <Content>
              <Grid>
                <Item rowStart={1} alignment={Alignment.CENTER}>
                  <div className="bs-pass-compatibility-dialog__header__check-icon --is-desktop">
                    <ValidationIcon
                      color={validationIconStyles.color}
                      widthCircle={validationIconStyles.circle.width}
                      heightCircle={validationIconStyles.circle.height}
                      widthIcon={validationIconStyles.checkIcon.width}
                      heightIcon={validationIconStyles.checkIcon.height}
                    />
                  </div>
                  <h3 className="bs-pass-compatibility-dialog__header__title --is-desktop">
                    {t('genericCardDetails.compatibility.compatible', {
                      count: compatiblePrivateServices?.length,
                    })}
                  </h3>
                  <h3 className="bs-pass-compatibility-dialog__header__title --is-mobile">
                    {t('genericCardDetails.compatibility.compatibilities')}
                  </h3>
                </Item>
                <Item rowStart={2}>
                  <div className="bs-pass-compatibility-dialog__body --is-desktop">
                    {compatiblePrivateServices?.map((privateService) => (
                      <AvailableSlots
                        privateServiceWithSlots={privateService}
                        key={privateService?.id}
                      />
                    ))}
                  </div>
                  <div className="bs-pass-compatibility-dialog__body --mobile-body">
                    <div className="--mobile-subitle">
                      {t('genericCardDetails.compatibility.compatible', {
                        count: compatiblePrivateServices?.length,
                      })}
                    </div>
                  </div>
                </Item>
                <Item
                  rowStart={3}
                  classes={{
                    'bs-pass-compatibility-dialog__footer':
                      'bs-pass-compatibility-dialog__footer',
                  }}
                >
                  <button
                    className="bs-pass-compatibility-dialog__footer__button"
                    type="button"
                    onClick={onDialogClose}
                  >
                    {t('genericCardDetails.compatibility.button.close')}
                  </button>
                </Item>
              </Grid>
            </Content>
          </Card>
        </div>
      )}
    </>
  );
};

export const MarketplacePrivatePassCompatibilityModalForStorybook =
  marketplaceCssHoc()(MarketplacePrivatePassCompatibilityModal);

export default React.memo(MarketplacePrivatePassCompatibilityModal);
