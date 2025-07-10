import {
  urlToMarketplace,
  urlToMarketplaceTab,
} from '#src/libs/marketplace/utils';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { replace as replaceRouter } from 'connected-react-router';
import themeSelectors from '#src/libs/theme/selectors';
import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

export const useNavigation = (companyId: number) => {
  const dispatch = useDispatch();

  const theme = useSelector((state: any) => themeSelectors.getTheme(state));

  const replace = useCallback(
    (url: string) => dispatch(replaceRouter(url)),
    [dispatch],
  );

  const goBackToCalendar = () => {
    if (WidgetUtils.isWidget()) {
      WidgetUtils.handleGoBackNavigation();
    }
    replace(urlToMarketplace(theme?.company_name, companyId?.toString()));
  };

  const goToPassesPage = () => {
    if (WidgetUtils.isWidget()) {
      WidgetUtils.handleGoBackNavigation();
    }
    replace(
      urlToMarketplaceTab(theme?.company_name, companyId?.toString(), 'pass'),
    );
  };

  return { goBackToCalendar, goToPassesPage };
};
