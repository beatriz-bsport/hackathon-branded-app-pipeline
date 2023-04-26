// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import CategoryIcon from '@material-ui/icons/Category';
import RoomIcon from '@material-ui/icons/Room';
import StarIcon from '@material-ui/icons/Star';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import ValidationIcon from '#components/icons/ValidationIcon.component';

import Card, { CardSize } from '#components/css-only/Card';
import Content from '#components/css-only/Card/CardContent';
import Grid from '#components/css-only/Grid';
import Item, { Alignment } from '#components/css-only/Grid/GridItem';

import './styles.css';

import type { MetaActivity } from '#libs/meta-activity/types';
import type { Establishment } from '#libs/establishment/types';
import type { SCT } from '#libs/category/types';

export type Props = {
  categories?: SCT[];
  metaActivities?: MetaActivity[];
  establishments?: Establishment[];
  isOpen: boolean;
  onDialogClose: () => void;
};

const MarketplacePaymentPackCompatibilityModal: React.FC<Props> = ({
  categories,
  metaActivities,
  establishments,
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
        <div className="bs-pack-compatibility-dialog__backdrop">
          <Card
            size={CardSize.L}
            classes={{
              'bs-pack-compatibility-dialog': 'bs-pack-compatibility-dialog',
            }}
          >
            <Content>
              <Grid>
                <Item
                  classes={{
                    'bs-pack-compatibility-dialog__header':
                      'bs-pack-compatibility-dialog__header',
                  }}
                  rowStart={1}
                  alignment={Alignment.CENTER}
                >
                  <div className="bs-pack-compatibility-dialog__header__check-icon --is-desktop">
                    <ValidationIcon
                      color={validationIconStyles.color}
                      widthCircle={validationIconStyles.circle.width}
                      heightCircle={validationIconStyles.circle.height}
                      widthIcon={validationIconStyles.checkIcon.width}
                      heightIcon={validationIconStyles.checkIcon.height}
                    />
                  </div>
                  <h3 className="bs-pack-compatibility-dialog__header__title">
                    {t('genericCardDetails.compatibility.compatibilities')}
                  </h3>
                </Item>
                <Item rowStart={2}>
                  <div className="bs-pack-compatibility-dialog__body">
                    {categories?.length > 0 && (
                      <div className="bs-pack-compatibility-body__compatibility">
                        <div className="bs-pack-compatibility-body__compatibility__titleWithIcon">
                          <CategoryIcon className="bs-pack-compatibility-body__compatibility__titleWithIcon__icon" />
                          <div className="bs-pack-compatibility-body__compatibility__titleWithIcon__title">
                            {t(
                              'genericCardDetails.compatibility.compatibilityModal.categories',
                            )}
                          </div>
                        </div>
                        <div className="bs-pack-compatibility-body__compatibility__itemList">
                          {categories?.map((category) => (
                            <div
                              className="bs-pack-compatibility-body__compatibility__itemList__item"
                              key={category.id}
                            >
                              {category.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {metaActivities?.length > 0 && (
                      <div className="bs-pack-compatibility-body__compatibility">
                        <div className="bs-pack-compatibility-body__compatibility__titleWithIcon">
                          <StarIcon className="bs-pack-compatibility-body__compatibility__titleWithIcon__icon" />
                          <div className="bs-pack-compatibility-body__compatibility__titleWithIcon__title">
                            {t(
                              'genericCardDetails.compatibility.compatibilityModal.activities',
                            )}
                          </div>
                        </div>
                        <div className="bs-pack-compatibility-body__compatibility__itemList">
                          {metaActivities?.map((metaActivity) => (
                            <div
                              className="bs-pack-compatibility-body__compatibility__itemList__item"
                              key={metaActivity.id}
                            >
                              {metaActivity.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {establishments?.length > 0 && (
                      <div className="bs-pack-compatibility-body__compatibility">
                        <div className="bs-pack-compatibility-body__compatibility__titleWithIcon">
                          <RoomIcon className="bs-pack-compatibility-body__compatibility__titleWithIcon__icon" />
                          <div className="bs-pack-compatibility-body__compatibility__titleWithIcon__title">
                            {t(
                              'genericCardDetails.compatibility.compatibilityModal.establishments',
                            )}
                          </div>
                        </div>
                        <div className="bs-pack-compatibility-body__compatibility__itemList">
                          {establishments?.map((establishment) => (
                            <div
                              className="bs-pack-compatibility-body__compatibility__itemList__item"
                              key={establishment.id}
                            >
                              {establishment.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Item>
                <Item
                  rowStart={3}
                  classes={{
                    'bs-pack-compatibility-dialog__footer':
                      'bs-pack-compatibility-dialog__footer',
                  }}
                >
                  <button
                    className="bs-pack-compatibility-dialog__footer__button"
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

export const MarketplacePaymentPackCompatibilityModalForStorybook =
  marketplaceCssHoc()(MarketplacePaymentPackCompatibilityModal);

export default React.memo(MarketplacePaymentPackCompatibilityModal);
