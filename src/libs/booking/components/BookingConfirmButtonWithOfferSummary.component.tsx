// Temporary component reverting the logic between Offer Summary and BookingButton
// The entire logic must be reversed it should be the BookingButton that contains an OfferSummary
// and not the other way around. Current pattern make everythin hard to understand and
// way less maintainable.
// Moreover, responsive design cannot be handled.
import React from 'react';
import {
  Button,
  makeStyles,
  CircularProgress,
  Typography,
  Collapse,
  useMediaQuery,
  IconButton,
} from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useTranslation } from 'react-i18next';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import { getTaxPrice } from '#libs/theme/utils';

export type Props = {
  value: string;
  disabled: boolean;
  buttonLoading: boolean;
  onClick: () => void;
  OfferSummaryComponent?: () => React.ReactElement;
  price?: string;
  isBookable: boolean;
  displayTax: boolean;
  // To investigate, taxes are decimal therefore strings.
  tax?: number;
};

const DetailsContainer = ({
  isMobile,
  disableCollapse,
  children,
}: {
  isMobile: boolean;
  disableCollapse: boolean;
  children: any;
}) => {
  const [open, setOpen] = React.useState(false);
  const classes = useDetailsContainerStyle();
  const handleCollapse = () => setOpen(!open);
  if (isMobile) {
    return (
      <>
        <div className={classes.arrowContainer}>
          <IconButton
            color="inherit"
            disabled={disableCollapse}
            onClick={handleCollapse}
          >
            {open ? (
              <KeyboardArrowDownIcon fontSize="small" />
            ) : (
              <KeyboardArrowUpIcon fontSize="small" />
            )}
          </IconButton>
        </div>
        <Collapse in={open}>{children}</Collapse>
      </>
    );
  }

  return children;
};
const BookingConfirmButtonWithOfferSummary: React.FC<Props> = ({
  value,
  disabled,
  buttonLoading,
  onClick,
  OfferSummaryComponent,
  price,
  displayTax,
  tax,
}) => {
  const isMobile = useMediaQuery('@media (max-width:950px)');
  const classes = useStyles({ isMobile });
  // Very specific to be inline with css BoutiqueBookerModule.css
  const { t } = useTranslation(['datetime', 'booking', 'checkout']);

  return (
    <div className={classes.container}>
      <DetailsContainer
        disableCollapse={buttonLoading || disabled}
        isMobile={isMobile}
      >
        {OfferSummaryComponent?.()}
        <div className={classes.priceDetailContainer}>
          <Collapse in={!!price}>
            {displayTax && (
              <div className={classes.columnGap1}>
                <div className={classes.price}>
                  <Typography className={classes.grey} variant="body2">
                    {t(`checkout:payment.taxExcluded`)}
                  </Typography>
                  <Typography variant="body2">
                    {getCurrencyDisplayWithPrice(price ?? 0, true, tax ?? 0)}
                  </Typography>
                </div>
                <div className={classes.price}>
                  <Typography className={classes.grey} variant="body2">
                    {t(`checkout:payment.tax`)}
                  </Typography>
                  <Typography variant="body2">
                    {getCurrencyDisplayWithPrice(
                      getTaxPrice(price ?? 0, tax ?? 0),
                    )}
                  </Typography>
                </div>
              </div>
            )}
            {!isMobile && (
              <div className={classes.price}>
                <Typography variant="h6">
                  {t(`checkout:payment.globalTotal`)}
                </Typography>
                <Typography variant="h6">
                  {getCurrencyDisplayWithPrice(price ?? 0)}
                </Typography>
              </div>
            )}
          </Collapse>
        </div>
      </DetailsContainer>
      {isMobile && (
        <Collapse in={!!price}>
          <div className={classes.onlyPriceContainer}>
            <div className={classes.price}>
              <Typography variant="h6">
                {t(`checkout:payment.globalTotal`)}
              </Typography>
              <Typography variant="h6">
                {getCurrencyDisplayWithPrice(price ?? 0)}
              </Typography>
            </div>
          </div>
        </Collapse>
      )}
      <div className={classes.buttonContainer}>
        <Button
          className={classes.button}
          disabled={disabled || buttonLoading}
          onClick={onClick}
          variant="contained"
        >
          {buttonLoading && (
            <CircularProgress
              color="inherit"
              size={24}
              style={{ marginRight: 8 }}
            />
          )}
          {value}
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #F1F3F4',
    borderRadius: '0px',
    display: 'flex',
    flexDirection: 'column',
    '@media (max-width:950px)': {
      border: 'none',
      borderTop: '4px solid #F1F3F4',
    },
  },
  buttonContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  button: {
    width: '100%',
    borderRadius: 24,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  },
  columnGap1: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      gap: 0,
    },
  },
  priceDetailContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  onlyPriceContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  price: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  grey: {
    color: '#687586',
  },
}));

const useDetailsContainerStyle = makeStyles(() => ({
  arrowContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}));
export default BookingConfirmButtonWithOfferSummary;
