import React, { useMemo } from 'react';
import Layout from '#src/libs/marketplace/components/@Layout';
import { compose } from 'recompose';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { useUrlTabNavigation } from '#src/libs/marketplace/components/@Layout/hooks/useUrlTabNavigation';
import { useTranslation } from 'react-i18next';

export const Passes = () => {
  const { t } = useTranslation('marketplace');
  const tabs = useMemo(
    () => [
      { label: t('passes.tabs.passes'), urlPath: '/passes' },
      {
        label: t('passes.tabs.appointmentPasses'),
        urlPath: '/appointment-passes',
      },
    ],
    [t],
  );
  const { selectedTab } = useUrlTabNavigation(tabs);

  return (
    <Layout pageTabs={tabs} pageTitle={t('passes.title')}>
      {'Render:' + selectedTab.label}
    </Layout>
  );
};

export default compose(marketplaceCssHoc())(Passes);
