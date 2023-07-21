import React from 'react';
import { useMediaQuery, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AddCircle from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { useTranslation } from 'react-i18next';
import AutoSizer from 'react-virtualized-auto-sizer';
import { QuicksaleCardInfo } from '../../types';
import QuicksaleItemCard from '../QuicksaleItemCard/QuicksaleItemCard.component';
import MuiIcon from '#components/MuiIcon.component';
import useStyle from './styles';
import QuicksaleItemCardSkeleton from './QuicksaleItemCardSkeleton';

const stopPropagation = (e: React.KeyboardEvent) => e.stopPropagation();

type Props = {
  sectionName: string;
  sectionIcon: string;
  openColorModal: (itemId: string) => void;
  deleteItem: (itemId: string) => void;
  openAddItemDrawer: () => void;
  itemList?: Array<QuicksaleCardInfo>;
  goBack: () => void;
  loading?: boolean;
};

const QuicksaleConfigurationItemList: React.FC<Props> = (props) => {
  const {
    sectionName,
    sectionIcon,
    openColorModal,
    deleteItem,
    openAddItemDrawer,
    itemList,
    goBack,
    loading,
  } = props;

  const classes = useStyle();

  const { t } = useTranslation(['quicksale']);

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs'),
  );

  return (
    <div className={classes.itemListContainer}>
      <div className={classes.itemListHeader}>
        <Button
          color="default"
          variant="outlined"
          startIcon={<ArrowBack />}
          className={classes.goBackButton}
          onClick={goBack}
        >
          <Typography variant="subtitle2">{t('itemList.goBack')}</Typography>
        </Button>
        <div className={classes.sectionInfo}>
          <MuiIcon icon={sectionIcon} />
          <Typography variant="h6" className={classes.sectionTitle}>
            {sectionName}
          </Typography>
        </div>
      </div>

      <div className={classes.autoSizerContainer}>
        <AutoSizer>
          {(autoSizerProps: { height: number; width: number }) => (
            <Grid
              container
              spacing={isMobile ? 2 : 3}
              className={classes.itemContainer}
              style={{
                maxHeight: autoSizerProps.height,
                width: autoSizerProps.width,
                overflow: 'auto',
              }}
            >
              {loading ? (
                <>
                  {[...Array(16).keys()].map((index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <QuicksaleItemCardSkeleton />
                    </Grid>
                  ))}
                </>
              ) : (
                <>
                  {(itemList ?? []).map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={item.id}
                      className={classes.item}
                    >
                      <QuicksaleItemCard
                        item={item}
                        deleteItem={deleteItem}
                        openColorModal={openColorModal}
                        adminView
                      />
                    </Grid>
                  ))}
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div
                      onClick={openAddItemDrawer}
                      className={classes.addSectionIconButton}
                      role="button"
                      tabIndex={0}
                      onKeyDown={stopPropagation}
                    >
                      <AddCircle className={classes.addSectionIcon} />
                    </div>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default React.memo(QuicksaleConfigurationItemList);
