import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import type {
  QuicksaleCardInfo,
  QuicksaleSection,
} from '#src/libs/quicksale/types';
import QuicksaleItemCard from '#src/libs/quicksale/components/QuicksaleItemCard';
import QuicksaleItemList from '#src/libs/quicksale/components/QuicksaleItemList';
import QuicksaleSectionList from '#src/libs/quicksale/components/QuicksaleSectionList';
import type { ShopItem } from '#src/libs/shop/types';

import MuiIcon from '#src/components/MuiIcon.component';

import useStyles from './hooks/styles';

type Props = {
  currentSection?: QuicksaleSection;
  currentVariantItem: ShopItem | null;
  isExcludingTax?: boolean;
  itemCardInfoList?: QuicksaleCardInfo[];
  loading?: boolean;
  onItemClick: (item: QuicksaleCardInfo) => void;
  onSectionClick: (sectionId: string) => void;
  onVariantItemClick: (itemId: string) => void;
  searchResults?: QuicksaleCardInfo[];
  searchText?: string;
  sectionList?: QuicksaleSection[];
  showResults?: boolean;
};

const QuicksaleTileList: React.FC<Props> = ({
  currentSection,
  currentVariantItem,
  isExcludingTax,
  itemCardInfoList,
  loading,
  onItemClick,
  onSectionClick,
  onVariantItemClick,
  searchResults,
  searchText,
  sectionList,
  showResults,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('quicksale');

  if (showResults) {
    return (
      <div className={classes.searchResultsContainer}>
        <Typography variant="body1">
          {t('interface.resultsForString', {
            count: searchResults?.length,
            searchText,
          })}
        </Typography>

        {sectionList?.map((section) => {
          const resultsForThisSection = searchResults?.filter(
            (result) => result.sectionId === section.section_id,
          );

          if (!resultsForThisSection || resultsForThisSection.length === 0)
            return <></>;

          return (
            <div
              key={section.section_id}
              className={classes.resultSectionContainer}
            >
              <div className={classes.resultSectionInfo}>
                <MuiIcon icon={section.section_icon} />
                <Typography className={classes.resultSectionTitle} variant="h6">
                  {section.section_name}
                </Typography>
              </div>
              <Grid container className={classes.noMargin} spacing={2}>
                {resultsForThisSection.map((result) => (
                  <Grid
                    key={`${section.section_id}-${result.id}`}
                    item
                    className={classes.resultItem}
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <QuicksaleItemCard
                      addToBasket={onItemClick}
                      isExcludingTax={isExcludingTax}
                      item={result}
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

  // TODO POS: Implement the variant item view
  if (currentVariantItem) {
    return <></>;
  }

  if (currentSection) {
    return (
      <QuicksaleItemList
        isExcludingTax={isExcludingTax}
        itemList={itemCardInfoList}
        loading={loading}
        onItemClick={onItemClick}
        onVariantItemClick={onVariantItemClick}
      />
    );
  }

  return (
    <QuicksaleSectionList
      loading={loading}
      onSectionClick={onSectionClick}
      sectionList={sectionList}
    />
  );
};

export default React.memo(QuicksaleTileList);
