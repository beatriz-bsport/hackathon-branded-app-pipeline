import React, { useCallback } from 'react';

import {
  LinearProgress,
  makeStyles,
  useMediaQuery,
  useTheme,
  Theme,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';

import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

type Props = {
  isLoading?: boolean;
  isDeleting?: boolean;
  cover?: string;
  name: string;
  subtitle?: string;
  description?: string;
  price?: string;
  lowestVariantPrice?: number;
  allVariantsHaveSamePrice?: boolean;
  productHasVariants?: boolean;
  hideCopyPaymentPageLink?: boolean;
  onEditShopItem: () => void;
  onDeleteShopItem: () => void;
};

const ShopItemDetailProductCardSkeleton: React.FC<{
  isMobile: boolean;
}> = ({ isMobile }) => {
  const classes = useStyles({ isMobile });

  const { t } = useTranslation('shop');

  return (
    <Card>
      <CardContent>
        <div className={classes.cardHeader}>
          <Typography variant="h6">{t('shopItemDetail.title')}</Typography>
          <div className={classes.cardHeaderActionsContainer}>
            <Skeleton height={36} variant="rect" width={90} />
            <Skeleton height={36} variant="rect" width={36} />
          </div>
        </div>

        <div className={classes.contentContainer}>
          <Skeleton
            className={classes.imageContainer}
            height={150}
            variant="rect"
            width={150}
          />
          <div className={classes.skeletonTextContainer}>
            <Skeleton height={32} variant="rect" width={90} />
            <Skeleton height={28} variant="rect" width={70} />
            <Skeleton height={60} variant="rect" width={300} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ShopItemDetailProductCard: React.FC<Props> = ({
  isLoading,
  isDeleting,
  cover,
  name,
  subtitle,
  description,
  price,
  lowestVariantPrice,
  allVariantsHaveSamePrice,
  productHasVariants,
  hideCopyPaymentPageLink,
  onEditShopItem,
  onDeleteShopItem,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles({ isMobile });
  const { t } = useTranslation(['shop', 'common']);

  const [menuAnchorElement, setMenuAnchorElement] =
    React.useState<null | HTMLElement>(null);

  const handleOpenExtraActionMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.currentTarget;
      setMenuAnchorElement(target);
    },
    [],
  );

  const handleCloseMenu = useCallback(() => {
    setMenuAnchorElement(null);
  }, []);

  const handleClickDeleteShopItem = useCallback(() => {
    onDeleteShopItem();
    handleCloseMenu();
  }, [handleCloseMenu, onDeleteShopItem]);

  const shopItemPrice = getCurrencyDisplayWithPrice(
    lowestVariantPrice ?? price,
  );

  if (isLoading) {
    return <ShopItemDetailProductCardSkeleton isMobile={isMobile} />;
  }

  return (
    <Card>
      {isDeleting && <LinearProgress />}

      <CardContent>
        <div className={classes.cardHeader}>
          <Typography variant="h6">{t('shop:shopItemDetail.title')}</Typography>
          <div>
            <Button
              color="primary"
              onClick={onEditShopItem}
              startIcon={<EditIcon />}
              variant="contained"
            >
              {t('shop:shopitem.action.edit')}
            </Button>
            <IconButton
              className={classes.cardHeaderMoreActionsButton}
              color="secondary"
              onClick={handleOpenExtraActionMenu}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              keepMounted
              anchorEl={menuAnchorElement}
              id="shop-item-details-extra-actions-menu"
              onClose={handleCloseMenu}
              open={!!menuAnchorElement}
            >
              {!productHasVariants && !hideCopyPaymentPageLink && (
                <MenuItem onClick={handleCloseMenu}>
                  {t('shop:shopItemDetail.copyPaymentPageLink')}
                </MenuItem>
              )}
              <MenuItem onClick={handleClickDeleteShopItem}>
                {t('common:delete')}
              </MenuItem>
            </Menu>
          </div>
        </div>

        <div className={classes.contentContainer}>
          {!!cover && (
            <CardMedia
              className={classes.imageContainer}
              component="img"
              image={cover}
            />
          )}
          <div className={classes.textContainer}>
            <div className={classes.nameAndPriceContainer}>
              <Typography variant="h6">{name}</Typography>

              <div className={classes.priceContainer}>
                {!!lowestVariantPrice && !allVariantsHaveSamePrice && (
                  <Typography variant="body2">
                    {t('shop:shopItemDetail.startingAt')}
                  </Typography>
                )}
                <Typography variant="h6">{shopItemPrice}</Typography>
              </div>
            </div>
            <Typography className={classes.subtitle} variant="subtitle1">
              {subtitle}
            </Typography>
            <Typography className={classes.description} variant="body2">
              {description}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles<Theme, { isMobile: boolean }>((theme) => ({
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
    flexWrap: 'wrap',
  },
  cardHeaderActionsContainer: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  cardHeaderMoreActionsButton: {
    marginLeft: theme.spacing(2),
  },
  contentContainer: ({ isMobile }) => ({
    display: 'flex',
    ...(isMobile && { flexDirection: 'column' }),
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  }),
  imageContainer: ({ isMobile }) => ({
    width: isMobile ? 150 : 120,
    'object-fit': 'contain',
    padding: theme.spacing(2),
    ...(isMobile && { alignSelf: 'center' }),
  }),
  skeletonTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  nameAndPriceContainer: ({ isMobile }) => ({
    display: 'flex',
    ...(isMobile && { flexDirection: 'column' }),
    ...(isMobile && { gap: theme.spacing(1) }),
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  }),
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  subtitle: {
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  description: {
    whiteSpace: 'pre-line',
  },
}));

export default React.memo(ShopItemDetailProductCard);
