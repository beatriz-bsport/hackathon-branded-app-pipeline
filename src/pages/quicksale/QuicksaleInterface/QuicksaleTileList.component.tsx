import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import type {
  QuicksaleCardInfo,
  QuicksaleSection,
} from '#libs/quicksale/types';
import QuicksaleItemCard from '#libs/quicksale/components/QuicksaleItemCard';
import QuicksaleConfigurationItemList from '#libs/quicksale/components/QuicksaleConfigurationItemList';
import QuicksaleConfigurationSectionList from '#libs/quicksale/components/QuicksaleConfigurationSectionList';

import MuiIcon from '#components/MuiIcon.component';

import useStyles from './hooks/styles';

type Props = {
  sectionList?: QuicksaleSection[];
  itemCardInfoList?: QuicksaleCardInfo[];
  searchResults?: QuicksaleCardInfo[];
  showResults?: boolean;
  currentSection?: QuicksaleSection;
  searchText?: string;
  onSectionClick: (sectionId: string) => void;
  onItemClick?: (item: QuicksaleCardInfo) => void;
  loading?: boolean;
};

const QuicksaleTileList: React.FC<Props> = ({
  sectionList,
  itemCardInfoList,
  searchResults,
  showResults,
  currentSection,
  searchText,
  onSectionClick,
  onItemClick,
  loading,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('quicksale');

  if (showResults) {
    return (
      <div className={classes.searchResultsContainer}>
        <Typography variant="body1">
          {t('interface.resultsForString', {
            count: searchResults.length,
            searchText,
          })}
        </Typography>

        {sectionList?.map((section) => {
          const resultsForThisSection = searchResults?.filter(
            (result) => result.sectionId === section.section_id,
          );
          if (resultsForThisSection.length === 0) return <></>;
          return (
            <div
              key={section.section_id}
              className={classes.resultSectionContainer}
            >
              <div className={classes.resultSectionInfo}>
                <MuiIcon icon={section.section_icon} />
                <Typography variant="h6" className={classes.resultSectionTitle}>
                  {section.section_name}
                </Typography>
              </div>
              <Grid container spacing={2} className={classes.noMargin}>
                {resultsForThisSection.map((result) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={`${section.section_id}-${result.id}`}
                    className={classes.resultItem}
                  >
                    <QuicksaleItemCard
                      item={result}
                      addToBasket={onItemClick}
                      outOfStock={result.outOfStock}
                      restrictedPurchase={result.restricted}
                    />
                  </Grid>
                ))}
              </Grid>
            </div>
          );
        })}
      </div>
    );
  }

  if (currentSection) {
    return (
      <QuicksaleConfigurationItemList
        itemList={itemCardInfoList}
        isQuicksaleInterfaceView
        onItemClick={onItemClick}
        loading={loading}
      />
    );
  }

  return (
    <QuicksaleConfigurationSectionList
      sectionList={sectionList}
      loading={loading}
      onSectionClick={onSectionClick}
      isQuicksaleInterfaceView
    />
  );
};

export default React.memo(QuicksaleTileList);
