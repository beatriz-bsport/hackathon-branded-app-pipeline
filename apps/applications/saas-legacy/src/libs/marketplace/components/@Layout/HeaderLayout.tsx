import React from 'react';

import Typography from '#src/components/css-only/Fabrique/Typography';
import TextField from '#src/components/css-only/Fabrique/TextFieldV2';
import { SearchRefraction, Settings04 } from '#src/components/untitledui';
import Button from '#src/components/css-only/Fabrique/ButtonV2';
import { useUrlTabNavigation } from '#src/libs/marketplace/components/@Layout/hooks/useUrlTabNavigation';
import Tab from '#src/components/css-only/Fabrique/Tab';
import { useTranslation } from 'react-i18next';

export type HeaderLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  pageTabs: PageTabs;
  pageTitle: string;
};

export type TabData = {
  label: string;
  urlPath: string;
};

export type PageTabs = TabData[];

/**
 * HeaderLayout Component
 *
 * A reusable header component for the marketplace that includes title, search bar, tabs for navigation,
 * and a filter button. The component is responsive and adapts its layout based on the viewport width.
 * On mobile devices, the tabs are replaced with a selector dropdown, and the filter button is displayed as an icon.
 *
 * @component
 * @param {PageTabs} props.pageTabs - An object containing the tabs data for navigation.
 * @param {string} props.pageTitle - The title to be displayed in the header.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props...] - Additional HTML attributes to be applied to the root div element.
 *
 * @returns {React.ReactElement} The rendered HeaderLayout component.
 */

const HeaderLayout: React.FC<HeaderLayoutProps> = ({
  pageTabs,
  pageTitle,
  ...props
}) => {
  const { handleTabClick, selectedTab } = useUrlTabNavigation(pageTabs);
  const { t } = useTranslation(['marketplace', 'common']);

  return (
    <div className="bs-marketplace-header-layout__root" {...props}>
      <div className="bs-marketplace-header-layout__top">
        <Typography
          className="bs-marketplace-header-layout__title"
          variant="title-lg"
        >
          {pageTitle}
        </Typography>
        <div className="bs-marketplace-header-layout__search">
          {/* Search input: the logic to handle search will be implemented in a future MR */}
          <TextField
            inputId="search-input"
            leftIcon={<SearchRefraction />}
            onChange={() => {}}
            placeholder={t('marketplace:passes.search')}
            size="sm"
            type="text"
            value=""
          />
        </div>
      </div>
      <div className="bs-marketplace-header-layout__bottom">
        <div className="bs-marketplace-header-layout__tabs">
          {pageTabs.map(({ label, urlPath }) => {
            return (
              <Tab
                key={label}
                className="bs-marketplace-header-layout__tab"
                color="grey"
                isSelected={selectedTab.urlPath === urlPath}
                onClick={handleTabClick(urlPath)}
              >
                {label}
              </Tab>
            );
          })}
        </div>
        <div className="bs-marketplace-header-layout__filters">
          {/* Filters button: the logic to handle filtering will be implemented in a future MR */}
          <Button
            key="Filters"
            color="grey"
            leftIcon={<Settings04 />}
            onClick={() => {}}
            size="md"
            variant="outlined"
          >
            {t('marketplace:passes.filters')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeaderLayout;
