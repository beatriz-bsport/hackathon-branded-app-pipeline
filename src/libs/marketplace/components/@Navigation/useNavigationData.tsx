import React from 'react';
import { useTranslation } from 'react-i18next';

import { UserCircle } from '#src/components/untitledui';

import type { SubmenuItem } from '#src/components/css-only/Fabrique/Submenu/types';
import type { AppBarTab } from '#src/components/css-only/Navigation/NavigationAppBar/types';

const useNavigationData = ({
  companyId,
  linksList,
  handleCloseSideDrawer,
}: {
  companyId: number;
  linksList: AppBarTab[];
  handleCloseSideDrawer: () => void;
}) => {
  const { t } = useTranslation('consumerSpace');

  const navigationData: SubmenuItem[] = React.useMemo(
    () => [
      ...(linksList ?? []).map((link) => ({
        title: link.label,
        isSelected: link.isSelected,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          link.onClick?.(event);
          handleCloseSideDrawer();
        },
      })),
      { isDivider: true },
      {
        title: t('reworked.appbar.myAccount'),
        leftIcon: <UserCircle />,
        to: `/c/${companyId}/booking/`,
        onClick: handleCloseSideDrawer,
      },
    ],
    [companyId, handleCloseSideDrawer, linksList, t],
  );

  return navigationData;
};

export default useNavigationData;
