import React, { useMemo, useCallback, memo, useRef } from 'react';
import Immutable from 'seamless-immutable';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { APP_HEIGHT } from '../../pages/constants';

type TabData = {
  label: string;
  value: string;
  count?: number;
};

type Props = {
  tab: string;
  pageHeight: number;
  tabsData: Immutable.ImmutableArray<TabData>;
  onChange: (tab: string) => void;
  scrollToTopOnChange?: boolean;
  scrollOptions?: ScrollToOptions;
  customClasses?: { [className: string]: string };
  dense?: boolean;
  fullHeight?: boolean;
};

const TabsGenerator: React.FC<{
  tabsData: Immutable.ImmutableArray<TabData>;
  isTabIntoTabsDataValue: boolean;
  tab: string;
  defaultTab: string;
  handleChangeTab: (_: React.SyntheticEvent, newTab: string) => void;
  customClasses?: { [className: string]: string };
}> = memo(
  ({
    tabsData,
    isTabIntoTabsDataValue,
    tab,
    defaultTab,
    handleChangeTab,
    customClasses,
  }) => {
    const { t } = useTranslation('navigation');
    return (
      <Tabs
        className={customClasses?.tabs}
        onChange={handleChangeTab}
        scrollButtons="auto"
        value={isTabIntoTabsDataValue ? tab : defaultTab}
        variant="scrollable"
      >
        {tabsData?.map((tabValue) => (
          <Tab
            key={tabValue.value}
            className={customClasses?.tab}
            label={`${t(tabValue.label, {
              // we want to use the singular (i.e. 'count: 1') only when tabValue.count is falsy (=== 0, undefined or null)
              count: (tabValue.count || 0) + 1,
              number: tabValue.count,
            })}`}
            value={tabValue.value}
          />
        ))}
      </Tabs>
    );
  },
);

const ContentWithAppBar: React.FC<Props> = memo(
  ({
    pageHeight,
    tab,
    tabsData,
    onChange,
    children,
    scrollToTopOnChange,
    scrollOptions,
    customClasses,
    dense,
    fullHeight,
  }) => {
    const fieldRef = React.useRef<HTMLDivElement>(null);

    const classes = useStyles({ pageHeight, dense, fullHeight });

    const isTabsDataNullOrEmpty = !tabsData?.length;

    const previousTab = useRef(tab);

    /** Returns true if the tab props is one of the value of the tabsData props */
    const isTabIntoTabsDataValue = useMemo(() => {
      if (isTabsDataNullOrEmpty) {
        return false;
      }
      return tabsData.some((data: TabData) => data.value === tab);
    }, [tab, tabsData, isTabsDataNullOrEmpty]);

    const handleChangeTab = useCallback(
      (_: React.SyntheticEvent, newTab: string) => {
        /** Is scrolling to the top when the page is loaded or refreshed, after layout and paint */
        if (scrollToTopOnChange) {
          fieldRef?.current?.scrollTo(
            previousTab.current === newTab
              ? { ...scrollOptions, behavior: 'smooth' }
              : scrollOptions,
          );
        }
        previousTab.current = newTab;
        onChange(newTab);
      },
      [onChange, scrollToTopOnChange, scrollOptions],
    );

    /** If tabsData is null or empty, there will be no appbar */
    if (isTabsDataNullOrEmpty) {
      return (
        <div
          ref={fieldRef}
          className={clsx(classes.container, customClasses?.container)}
        >
          <div className={classes.insideContent}>{children}</div>
        </div>
      );
    }

    const defaultTab = tabsData[0].value;
    return (
      <div className={clsx(classes.container, customClasses?.container)}>
        <AppBar
          className={customClasses?.appBar}
          color="default"
          position="static"
        >
          <TabsGenerator
            customClasses={customClasses}
            defaultTab={defaultTab}
            handleChangeTab={handleChangeTab}
            isTabIntoTabsDataValue={isTabIntoTabsDataValue}
            tab={tab}
            tabsData={tabsData}
          />
        </AppBar>
        <div
          ref={fieldRef}
          className={clsx(classes.content, customClasses?.content)}
        >
          <div
            className={clsx(
              classes.insideContent,
              customClasses?.insideContent,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

const useStyles = makeStyles<
  Theme,
  { pageHeight: number; dense?: boolean; fullHeight?: boolean }
>((theme) => ({
  container: {
    marginTop: theme.spacing(-3),
    width: '100vw',
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(-3),
      width: 'auto',
      marginRight: theme.spacing(-3),
      marginTop: theme.spacing(-2),
    },
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    maxHeight: ({ pageHeight }) => pageHeight - APP_HEIGHT,
  },
  insideContent: ({ pageHeight, dense, fullHeight }) => ({
    ...(dense
      ? {}
      : {
          marginBottom: theme.spacing(8),
          [theme.breakpoints.up('md')]: {
            margin: theme.spacing(2),
            marginBottom: theme.spacing(8),
          },
          marginTop: theme.spacing(2),
        }),
    ...(fullHeight ? { '& > *': { height: pageHeight - APP_HEIGHT } } : {}),
  }),
}));

ContentWithAppBar.defaultProps = {
  scrollToTopOnChange: true,
  scrollOptions: { top: 0 },
};
export default ContentWithAppBar;
