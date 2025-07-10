import React, { useEffect, useMemo } from 'react';
import Layout from '#src/libs/marketplace/components/@Layout';
import { compose } from 'recompose';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { useUrlTabNavigation } from '#src/libs/marketplace/components/@Layout/hooks/useUrlTabNavigation';
import { useTranslation } from 'react-i18next';
import { PassesPageTabNames } from '#src/libs/marketplace/types';
import PassDetailModal from '#src/pages/marketplace/passes/components/pass-detail-modal/PassDetailModal';
import PassCard from '#src/pages/marketplace/passes/components/pass-card/PassCard';
import Typography from '#src/components/css-only/Fabrique/Typography';
import AppointmentDetailModal from '#src/pages/marketplace/passes/components/appointment-detail-modal/AppointmentDetailModal';
import AppointmentPassCard from '#src/pages/marketplace/passes/components/appointment-pass-card/AppointmentPassCard';
import { useFetchPassesData } from '#src/pages/marketplace/passes/hooks/useFetchPassesData';
import { usePasses } from '#src/pages/marketplace/passes/hooks/usePasses';
import { PassesProvider } from '#src/pages/marketplace/passes/PassesContext';
import './style.css';

type PassesContentProps = {
  companyId: number;
};

const PassesContent: React.FC<PassesContentProps> = ({ companyId }) => {
  const { t } = useTranslation('marketplace');
  const tabs = useMemo(
    () => [
      { label: t('passes.tabs.all'), urlPath: PassesPageTabNames.ALL },
      { label: t('passes.tabs.passes'), urlPath: PassesPageTabNames.PASSES },
      {
        label: t('passes.tabs.appointmentPasses'),
        urlPath: PassesPageTabNames.APPOINTMENT_PASSES,
      },
    ],
    [t],
  );
  const { selectedTab } = useUrlTabNavigation(tabs);
  const { passCardsByCategories, appointmentPassCardsByCategories } =
    usePasses();
  const {
    handleFetchPaymentPacks,
    handleFetchAllPaymentPackCategory,
    handleFetchPrivatePasses,
    handleFetchPrivatePassCategory,
    handleFetchMarketplacePrivateServices,
    handleFetchMarketplacePrivateSlots,
  } = useFetchPassesData();

  useEffect(() => {
    if (companyId) {
      handleFetchPaymentPacks({
        company: companyId,
        manager_only: false,
        disabled: false,
        as_consumer: true,
        page_size: 300,
        include_expired: false,
      });
      handleFetchAllPaymentPackCategory(companyId);
      handleFetchPrivatePasses(companyId);
      handleFetchPrivatePassCategory(companyId);
      handleFetchMarketplacePrivateServices(companyId);
      handleFetchMarketplacePrivateSlots(companyId);
    }
  }, [
    companyId,
    handleFetchPaymentPacks,
    handleFetchAllPaymentPackCategory,
    handleFetchPrivatePasses,
    handleFetchPrivatePassCategory,
    handleFetchMarketplacePrivateServices,
    handleFetchMarketplacePrivateSlots,
  ]);

  const showPasses = [
    PassesPageTabNames.ALL,
    PassesPageTabNames.PASSES,
  ].includes(selectedTab.urlPath as PassesPageTabNames);
  const showAppointmentPasses = [
    PassesPageTabNames.ALL,
    PassesPageTabNames.APPOINTMENT_PASSES,
  ].includes(selectedTab.urlPath as PassesPageTabNames);

  return (
    <Layout pageTabs={tabs} pageTitle={t('passes.title')}>
      <div className="bs-marketplace-passes-page">
        {showPasses &&
          passCardsByCategories.map((category) => (
            <div key={category.id} className="bs-marketplace-card-list">
              <Typography
                className="bs-marketplace-card-list__title"
                variant="title-sm"
              >
                {category.name}
              </Typography>
              <div className="bs-marketplace-card-list__items">
                {category.cardsContent.map((content) => (
                  <PassCard key={content.id} content={content} />
                ))}
              </div>
            </div>
          ))}
        {showAppointmentPasses &&
          appointmentPassCardsByCategories.map((category) => (
            <div key={category.id} className="bs-marketplace-card-list">
              <Typography
                className="bs-marketplace-card-list__title"
                variant="title-sm"
              >
                {category.name}
              </Typography>
              <div className="bs-marketplace-card-list__items">
                {category.cardsContent.map((content) => (
                  <AppointmentPassCard key={content.id} content={content} />
                ))}
              </div>
            </div>
          ))}
        <PassDetailModal />
        <AppointmentDetailModal />
      </div>
    </Layout>
  );
};

type PassesProps = {
  requestSignUp?: () => void;
  companyId: number;
};

export const Passes: React.FC<PassesProps> = ({ requestSignUp, companyId }) => (
  <PassesProvider requestSignUp={requestSignUp}>
    <PassesContent companyId={companyId} />
  </PassesProvider>
);

export default compose<PassesProps, PassesProps>(marketplaceCssHoc())(Passes);
