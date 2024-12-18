import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { DIALOG_MODE_DEACTIVATED } from '@bsport/common/lib/master-data/widget-dialog-mode';

import NavigationAppBar from '#src/components/css-only/Navigation/NavigationAppBar';
import { Logout01 } from '#src/components/untitledui';

import type {
  AppBarButton,
  AppBarTab,
} from '#src/components/css-only/Navigation/NavigationAppBar/types';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

type Props = {
  authenticated: boolean;
  disconnect: () => void;
};

const MinimalAppBar: React.FC<Props> = ({ authenticated, disconnect }) => {
  const { t } = useTranslation('consumerSpace');

  /**
   * TODO: make NavigationAppBar props links truly optional.
   * Right now the props is optional but it breaks everything when undefined.
   * Jira ticket : https://bsporttest.atlassian.net/browse/BS-5199
   */
  const linksList = useMemo(() => [] as AppBarTab[], []);
  const actionsList: AppBarButton[] = useMemo(
    () =>
      authenticated
        ? [
            {
              label: t('reworked.navigation.logOut'),
              color: 'grey',
              leftIcon: <Logout01 />,
              onClick: disconnect,
              variant: 'outlined',
            },
          ]
        : [],
    [authenticated, disconnect, t],
  );

  const handleWidgetGoBackNavigation = useCallback(() => {
    WidgetUtils.handleGoBackNavigation();
  }, []);

  const isWidgetNoPopUp =
    WidgetUtils.getDialogMode() === DIALOG_MODE_DEACTIVATED;

  return (
    <NavigationAppBar
      actions={actionsList}
      goBackNavigation={handleWidgetGoBackNavigation}
      links={linksList}
      showGoBackButton={isWidgetNoPopUp}
    />
  );
};

export const MinimalAppBarStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof MinimalAppBar>>()(
    MinimalAppBar,
  );

export default React.memo(MinimalAppBar);
