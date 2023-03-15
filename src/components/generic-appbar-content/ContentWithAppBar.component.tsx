import React, { useMemo, useCallback, memo } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { APP_HEIGHT } from '../../pages/constants';

type TabCouple = {
  label: string;
  value: string;
};

type Props = {
  tab: string;
  pageHeight: number;
  tabsData: TabCouple[];
  onChange: (tab: string) => void;
  scrollToTopOnChange?: boolean;
  scrollOptions?: ScrollToOptions;
};

const TabsGenerator: React.FC<{
  tabsData: TabCouple[];
  isTabIntoTabsDataValue: boolean;
  tab: string;
  defaultTab: string;
  handleChangeTab: (_: React.SyntheticEvent, newTab: string) => void;
}> = memo(
  ({ tabsData, isTabIntoTabsDataValue, tab, defaultTab, handleChangeTab }) => {
    const { t } = useTranslation('navigation');
    return (
      <Tabs
        scrollButtons="off"
        variant="scrollable"
        value={isTabIntoTabsDataValue ? tab : defaultTab}
        onChange={handleChangeTab}
      >
        {tabsData?.map((tabValue) => (
          <Tab label={t(`${tabValue.label}`)} value={tabValue.value} />
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
  }) => {
    const fieldRef = React.useRef<HTMLDivElement>(null);

    const classes = useStyles({ pageHeight });

    const isTabsDataNullOrEmpty = !tabsData?.length;

    /** Returns true if the tab props is one of the value of the tabsData props */
    const isTabIntoTabsDataValue = useMemo(() => {
      if (isTabsDataNullOrEmpty) {
        return false;
      }
      return tabsData.some((data: TabCouple) => data.value === tab);
    }, [tab, tabsData, isTabsDataNullOrEmpty]);

    const handleChangeTab = useCallback(
      (_: React.SyntheticEvent, newTab: string) => {
        /** Is scrolling to the top when the page is loaded or refreshed, after layout and paint */
        if (scrollToTopOnChange) {
          fieldRef?.current?.scrollTo(scrollOptions);
        }
        onChange(newTab);
      },
      [onChange, scrollToTopOnChange, scrollOptions],
    );

    /** If tabsData is null or empty, there will be no appbar */
    if (isTabsDataNullOrEmpty) {
      return (
        <div className={classes.container} ref={fieldRef}>
          <div className={classes.content}>
            <div className={classes.insideContent}>{children}</div>
          </div>
        </div>
      );
    }

    const defaultTab = tabsData[0].value;
    return (
      <div className={classes.container}>
        <AppBar position="static" color="default">
          <TabsGenerator
            tabsData={tabsData}
            isTabIntoTabsDataValue={isTabIntoTabsDataValue}
            tab={tab}
            defaultTab={defaultTab}
            handleChangeTab={handleChangeTab}
          />
        </AppBar>
        <div className={classes.content} ref={fieldRef}>
          <div className={classes.insideContent}>{children}</div>
        </div>
      </div>
    );
  },
);

const useStyles = makeStyles<Theme, { pageHeight: number }>((theme) => ({
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
  insideContent: {
    marginBottom: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(2),
      marginBottom: theme.spacing(8),
    },
    marginTop: theme.spacing(2),
  },
}));

ContentWithAppBar.defaultProps = {
  scrollToTopOnChange: true,
  scrollOptions: { top: 0 },
};
export default ContentWithAppBar;
