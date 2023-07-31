import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  DateRange,
  Star,
  Payment,
  OndemandVideo,
  Block,
  DoneAll,
  Visibility,
} from '@material-ui/icons';

export type ProductCardCategoryListSchema = {
  credits?: string;
  validity?: string;
  paymentMethods?: string;
  vod?: string;
  accessibility?: string;
  compatibility?: string;
  restrictions?: Array<string>;
};

/* Useful for PaymentPack, PrivatePass and Giftcard
Just need to provide the props 'categories' */
const ProductCardCategoryList = (props: {
  categories: ProductCardCategoryListSchema;
}) => {
  const classes = useStyles();
  const { categories } = props;
  const { t } = useTranslation('common');
  if (!categories || !Object.keys(categories).length) return null;
  const keys = Object.keys(categories);
  return (
    <>
      {keys.includes('credits') && (
        <div className={classes.detailInfo}>
          <Star className={classes.leftIcon} />
          <div className={classes.detailCategory}>
            <Typography variant="subtitle2">
              {t('card.categoryNames.credits')}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              className={classes.categoryContent}
            >
              {categories.credits}
            </Typography>
          </div>
        </div>
      )}
      {keys.includes('validity') && (
        <div className={classes.detailInfo}>
          <DateRange className={classes.leftIcon} />
          <div className={classes.detailCategory}>
            <Typography variant="subtitle2">
              {t('card.categoryNames.validity')}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              className={classes.categoryContent}
            >
              {categories.validity}
            </Typography>
          </div>
        </div>
      )}
      {keys.includes('compatibility') && (
        <div className={classes.detailInfo}>
          <DoneAll className={classes.leftIcon} />
          <div className={classes.detailCategory}>
            <Typography variant="subtitle2">
              {t('card.categoryNames.compatibility')}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              className={classes.categoryContent}
            >
              {categories.compatibility}
            </Typography>
          </div>
        </div>
      )}
      {keys.includes('accessibility') && (
        <div className={classes.detailInfo}>
          <Visibility className={classes.leftIcon} />
          <div className={classes.detailCategory}>
            <Typography variant="subtitle2">
              {t('card.categoryNames.accessibility')}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              className={classes.categoryContent}
            >
              {categories.accessibility}
            </Typography>
          </div>
        </div>
      )}
      {keys.includes('paymentMethods') && (
        <div className={classes.detailInfo}>
          <Payment className={classes.leftIcon} />
          <div className={classes.detailCategory}>
            <Typography variant="subtitle2">
              {t('card.categoryNames.paymentMethods')}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              className={classes.categoryContent}
            >
              {categories.paymentMethods}
            </Typography>
          </div>
        </div>
      )}
      {keys.includes('vod') && (
        <div className={classes.detailInfo}>
          <OndemandVideo className={classes.leftIcon} />
          <div className={classes.detailCategory}>
            <Typography variant="subtitle2">
              {t('card.categoryNames.vod')}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              className={classes.categoryContent}
            >
              {categories.vod}
            </Typography>
          </div>
        </div>
      )}
      {keys.includes('restrictions') && (
        <div className={classes.detailInfo}>
          <Block className={classes.leftIcon} />
          <div className={classes.detailCategory}>
            <Typography variant="subtitle2">
              {t('card.categoryNames.restrictions')}
            </Typography>
            {categories.restrictions.map((content: string) => (
              <Typography
                variant="caption"
                color="textSecondary"
                className={classes.categoryContent}
              >
                {content}
              </Typography>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  categoryContent: {
    marginTop: theme.spacing(0),
  },
  detailCategory: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  detailInfo: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
}));

export default ProductCardCategoryList;
