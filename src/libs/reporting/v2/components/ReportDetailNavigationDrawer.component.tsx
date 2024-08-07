import React from 'react';
import classNames from 'classnames';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import MenuIcon from '@material-ui/icons/Menu';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { getItemInStorage } from '#src/utils/storage';

import type { Theme } from '@material-ui/core/styles';
import type { CallHistoryMethodAction } from 'connected-react-router';
import type { ReportMetadataValue } from '#src/libs/reporting/common/types';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';
import {
  drawerSmallWidth,
  drawerWidth,
} from '#src/libs/reporting/common/constants';
import { STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_TOKEN } from '#src/actions/constants';

type Props = {
  categoryName: ReportCategoryEnum;
  isNavigationDrawerExpanded: boolean;
  isFranchisor?: boolean;
  items: {
    title: string;
    categories: (ReportMetadataValue & {
      reportId: number;
    })[];
  }[];
  pushRouter: (
    selectedReportId: string,
  ) => CallHistoryMethodAction<[string, unknown?]>;
  reportCategoriesDisabled: boolean;
  setIsNavigationDrawerExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const ReportDetailNavigationDrawer: React.FC<Props> = ({
  items,
  isNavigationDrawerExpanded,
  isFranchisor,
  categoryName,
  pushRouter,
  reportCategoriesDisabled,
  setIsNavigationDrawerExpanded,
}) => {
  const { t } = useTranslation('reporting');

  const classes = useStyles({ isNavigationDrawerExpanded });
  const [isCategoryExpanded, setIsCategoryExpanded] = React.useState<{
    [title: string]: boolean;
  }>(
    items.reduce((acc: Record<string, boolean>, item) => {
      acc[item.title] = !!item.categories.find(
        (category) => category.category === categoryName,
      );
      return acc;
    }, {}),
  );

  const handleGlobalCategoryClick = React.useCallback(
    (globalCategory: string) => () => {
      setIsCategoryExpanded((prev) => ({
        ...prev,
        [globalCategory]: !prev[globalCategory],
      }));
    },
    [setIsCategoryExpanded],
  );

  const handleClickCategory = React.useCallback(
    (categoryNameSelected: ReportCategoryEnum, reportId: number) => () => {
      isFranchisor
        ? pushRouter(`/f/reporting/${categoryNameSelected}/${reportId}`)
        : pushRouter(`/reporting/${categoryNameSelected}/${reportId}`);

      setIsCategoryExpanded(
        items.reduce((acc: Record<string, boolean>, item) => {
          acc[item.title] = !!item.categories.find(
            (category) => category.category === categoryNameSelected,
          );
          return acc;
        }, {}),
      );
    },
    [pushRouter, isFranchisor, items],
  );

  const handleAllReportsClick = React.useCallback(() => {
    isFranchisor ? pushRouter('/f/reporting') : pushRouter('/reporting');
  }, [pushRouter, isFranchisor]);

  const handleDrawerExpanded = React.useCallback(() => {
    setIsNavigationDrawerExpanded((prevState) => !prevState);
  }, [setIsNavigationDrawerExpanded]);

  return (
    <Paper className={classes.navigationDrawerRoot}>
      <IconButton
        className={classes.menuIcon}
        onClick={handleDrawerExpanded}
        size="small"
      >
        {isNavigationDrawerExpanded ? <MenuOpenIcon /> : <MenuIcon />}
      </IconButton>
      {isNavigationDrawerExpanded && (
        <>
          <List className={classes.list}>
            <ListItem
              button
              className={classes.globalCategory}
              onClick={handleAllReportsClick}
            >
              <Typography color="textPrimary" variant="body1">
                {t('pageTitle')}
              </Typography>
            </ListItem>
          </List>
          <Divider className={classes.divider} />
          <List className={classes.list}>
            {items.map((globalCategory) => {
              return (
                <>
                  <ListItem
                    button
                    className={classes.globalCategory}
                    disabled={reportCategoriesDisabled}
                    onClick={handleGlobalCategoryClick(globalCategory.title)}
                    selected={
                      !!globalCategory.categories.find(
                        (category) => category.category === categoryName,
                      )
                    }
                  >
                    <ListItemText>
                      <strong>
                        {t(`globalCategories.${globalCategory.title}`)}
                      </strong>
                    </ListItemText>
                    {isCategoryExpanded[globalCategory.title] ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </ListItem>
                  <Collapse in={isCategoryExpanded[globalCategory.title]}>
                    <List
                      className={classNames(classes.categoryList, classes.list)}
                    >
                      {globalCategory.categories.map((category) => (
                        <ListItem
                          key={category.category}
                          button
                          className={classes.category}
                          disabled={reportCategoriesDisabled}
                          onClick={handleClickCategory(
                            category.category,
                            category.reportId,
                          )}
                          selected={category.category === categoryName}
                        >
                          <Typography
                            className={classes.categorySelectedTypography}
                            color="textPrimary"
                            variant="body2"
                          >
                            {t(`categories.${category.category}`)}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              );
            })}
          </List>
        </>
      )}
    </Paper>
  );
};

const useStyles = makeStyles<Theme, { isNavigationDrawerExpanded: boolean }>(
  (theme) => ({
    globalCategory: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(0.5, 1),
      borderRadius: theme.spacing(1),
    },
    divider: { margin: theme.spacing(1) },
    categorySelectedTypography: {
      fontWeight: 'inherit',
    },
    menuIcon: { alignSelf: 'flex-start', padding: theme.spacing(0.5) },
    navigationDrawerRoot: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2, 1),
      height: '100vh',
      gap: theme.spacing(1),
      scrollbarWidth: 'none',
      overflowY: 'auto',
      position: 'fixed',
      top: 0,
      // 64px being top banner, 24px being franchisor banner
      paddingTop: `calc(64px + ${theme.spacing(2)}px ${
        getItemInStorage(
          'session',
          STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_TOKEN,
        )
          ? `+ ${theme.spacing(3)}px`
          : ''
      })`,
      width: ({ isNavigationDrawerExpanded }) =>
        isNavigationDrawerExpanded ? drawerWidth : drawerSmallWidth,
      alignItems: ({ isNavigationDrawerExpanded }) =>
        isNavigationDrawerExpanded ? 'flexStart' : 'center',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    category: {
      padding: theme.spacing(0.5, 2.5),
      '&.Mui-selected': {
        backgroundColor: 'inherit',
        fontWeight: theme.typography.fontWeightBold,
      },
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      padding: 0,
    },
    categoryList: { gap: theme.spacing(0.5) },
  }),
);

export default React.memo(ReportDetailNavigationDrawer);
