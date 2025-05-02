import React, { useMemo, useState } from 'react';
import Layout from '#src/libs/marketplace/components/@Layout';
import { compose } from 'recompose';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { useTranslation } from 'react-i18next';
import { PassesPageTabNames } from '#src/libs/marketplace/types';
import Typography from '#src/components/css-only/Fabrique/Typography';
import PassCard from './components/pass-card/PassCard';
import { CardContent } from './types';
import PassDetailModal from './components/pass-detail-modal/PassDetailModal';

export const Passes = () => {
  const { t } = useTranslation('marketplace');
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const tabs = useMemo(
    () => [
      { label: t('passes.tabs.passes'), urlPath: PassesPageTabNames.PASSES },
      {
        label: t('passes.tabs.appointmentPasses'),
        urlPath: PassesPageTabNames.APPOINTMENT_PASSES,
      },
    ],
    [t],
  );

  const mockPasses: CardContent[] = [
    {
      id: '1',
      title: 'Pass test',
      validityInfo: {
        durationYears: 0,
        durationMonths: 1,
        durationDays: 0,
        startDateMethod: 2,
      },
      price: 20,
      credits: 1,
      tax: 0,
      isUnlimited: false,
      isUniversal: false,
      onClickDetails: () => setSelectedCardId(1),
      onAddToCart: () => {},
    },
  ];

  return (
    <Layout pageTabs={tabs} pageTitle={t('passes.title')}>
      <div className="bs-marketplace-passes-page">
        <div className="bs-marketplace-card-list">
          <Typography
            className="bs-marketplace-card-list__title"
            variant="title-sm"
          >
            Passes
          </Typography>
          <div className="bs-marketplace-card-list__items">
            {mockPasses.map((content) => (
              <PassCard key={content.id} content={content} />
            ))}
          </div>
        </div>
        {selectedCardId && (
          <PassDetailModal
            cardDetailId={selectedCardId}
            closeModal={() => setSelectedCardId(null)}
            isSubmitLoading={false}
            onConfirm={() => {}}
          />
        )}
      </div>
    </Layout>
  );
};

export default compose(marketplaceCssHoc())(Passes);
