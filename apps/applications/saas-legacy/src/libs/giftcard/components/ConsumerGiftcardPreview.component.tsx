import React, { type FC } from 'react';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ConsumerGiftcardPersonnalizationElements, Giftcard } from '../types';
import TypographyMultiline from '../../../components/typo/TypographyMultiline.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { GIFTCARD_TYPES } from '../constants';

type Props = {
  consumerGiftcard: ConsumerGiftcardPersonnalizationElements & {
    price_bought?: number | string | null;
  };
  companyCover?: string;
  giftcard?: Giftcard | null;
  // Whether giftcard.price corresponds to a translation string instead of a value
  valueIsPlaceholderString?: boolean;
};

const ConsumerGiftcardPreview: FC<Props> = (props) => {
  const { t } = useTranslation(['giftcard', 'b2b_giftcard']);
  const classes = useStyles(props);
  const { consumerGiftcard, companyCover, giftcard, valueIsPlaceholderString } =
    props;
  const {
    name,
    message_is_from,
    message_is_for,
    message_content,
    price_bought,
  } = consumerGiftcard;

  let displayedPrice: string | number = '';
  if (price_bought) {
    displayedPrice = valueIsPlaceholderString
      ? price_bought
      : getCurrencyDisplayWithPrice(price_bought);
  } else if (giftcard) {
    if (giftcard.card_type === GIFTCARD_TYPES.CUSTOM || !giftcard.price) {
      const customMessage = t('customAmount.label', {
        ns: 'b2b_giftcard',
      });
      displayedPrice = customMessage;
    } else if (valueIsPlaceholderString) {
      // It means we have provided a string, such as [Amount of the giftcard]
      displayedPrice = giftcard.price;
    } else {
      displayedPrice = getCurrencyDisplayWithPrice(giftcard.price);
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.leftPanel} />

      <div className={classes.rightPanel}>
        <Typography variant="h4">{name || giftcard?.name || ''}</Typography>

        <div className={classes.section}>
          <Typography className={classes.subtitle} variant="caption">
            {t('consumerGiftcard.isFrom', { ns: 'giftcard' })}
          </Typography>
          <Typography>{message_is_from}</Typography>
        </div>

        <div className={classes.section}>
          <Typography className={classes.subtitle} variant="caption">
            {t('consumerGiftcard.isFor', { ns: 'giftcard' })}
          </Typography>
          <Typography>{message_is_for}</Typography>
        </div>

        <div className={classes.section}>
          <TypographyMultiline variant="body2" whiteSpace="pre-wrap">
            {message_content}
          </TypographyMultiline>
        </div>

        <div className={classes.rightPanelFooter}>
          <div>
            <div className={classes.subtitle}>
              {t('consumerGiftcard.value', { ns: 'giftcard' })}
            </div>
            {!!displayedPrice && (
              <Typography color="primary">{displayedPrice}</Typography>
            )}
          </div>
          <img
            alt="company-logo"
            className={classes.logoContainer}
            src={companyCover}
          />
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  subtitle: {
    padding: 0,
    marginTop: theme.spacing(1),
    display: 'flex',
    color: '#999999',
  },
  text: {
    display: 'flex',
  },
  container: {
    maxWidth: 700,
    background: 'white',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    borderRadius: theme.spacing(1),
  },
  leftPanel: (props: Props) => {
    return {
      width: props.consumerGiftcard.background_image ? '25%' : '0%',
      backgroundSize: 'cover',
      backgroundImage: `url(${props.consumerGiftcard.background_image})`,
      backgroundPosition: 'center',
      borderRadius: '8px 0px 0px 8px',
    };
  },
  rightPanel: (props: Props) => ({
    width: props.consumerGiftcard.background_image ? '75%' : '100%',
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderRadius: '8px 0px 0px 8px',
  }),
  section: {
    marginBottom: theme.spacing(1),
  },
  logoContainer: {
    maxHeight: 30,
  },
  rightPanelFooter: {
    display: 'flex',
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

export default ConsumerGiftcardPreview;
