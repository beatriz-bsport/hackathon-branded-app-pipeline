import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import ButtonBase from '@material-ui/core/ButtonBase';
import LinkIcon from '@material-ui/icons/Link';
import ProductCardCategoryList, {
  ProductCardCategoryListSchema,
} from '#components/card/ProductCardCategoryList.component';
import RedButtonComponent from '#components/button/RedButton.component';

export type Props = {
  // to custom header of the card
  headerLeftPrimary?: string | React.ReactNode;
  headerLeftSecondary?: string | React.ReactNode;
  headerRightPrimary?: string | React.ReactNode;
  headerRightSecondary?: string | React.ReactNode;
  // to custom center of the card
  activationLink?: string;
  activationLinkLabel?: string;
  buttons?: Array<{
    onClick: () => void;
    label: string;
    className?: string;
    redButton?: boolean;
  }>;
  categories?: ProductCardCategoryListSchema;
  description?: string | React.ReactNode;
  snackbarSuccess?: (message: string) => void;
  // to custom bottom of the card
  children?: any;
};

export const ProductCard = (props: Props) => {
  const { t } = useTranslation('common');
  const classes = useStyles();
  const {
    headerLeftPrimary,
    headerLeftSecondary,
    headerRightPrimary,
    headerRightSecondary,
    activationLink,
    activationLinkLabel,
    buttons,
    categories,
    description,
  } = props;
  return (
    <Paper className={classes.paper}>
      <div className={classes.gridBlock}>
        <Grid
          container
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Grid item xs={8}>
            {typeof headerLeftPrimary === 'string' ? (
              <Typography className={classes.headerLeft} variant="h4">
                {headerLeftPrimary}
              </Typography>
            ) : (
              headerLeftPrimary
            )}
            {typeof headerLeftSecondary === 'string' ? (
              <Typography className={classes.headerLeft} variant="h5">
                {headerLeftSecondary}
              </Typography>
            ) : (
              headerLeftSecondary
            )}
          </Grid>
          <Grid item xs={4}>
            {typeof headerRightPrimary === 'string' ? (
              <Typography
                className={classes.headerRight}
                variant="h3"
                color="primary"
              >
                {headerRightPrimary}
              </Typography>
            ) : (
              headerRightPrimary
            )}
            {typeof headerRightSecondary === 'string' ? (
              <Typography
                className={classes.headerRight}
                variant="caption"
                color="textSecondary"
              >
                {headerRightSecondary}
              </Typography>
            ) : (
              headerRightSecondary
            )}
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Grid item xs={8}>
            <div className={classes.columnLeft}>
              {activationLink && (
                <div className={classes.linkContainer}>
                  <CopyToClipboard text={activationLink}>
                    <ButtonBase
                      id="button_pass_copy"
                      className={classes.link}
                      onClick={() =>
                        props.snackbarSuccess &&
                        props.snackbarSuccess('link.copied')
                      }
                    >
                      <LinkIcon className={classes.iconLeft} />
                      <Typography>
                        {activationLinkLabel ?? t('card.copyLink')}
                      </Typography>
                    </ButtonBase>
                  </CopyToClipboard>{' '}
                </div>
              )}
              {typeof description === 'string' ? (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  className={classes.description}
                >
                  {description}
                </Typography>
              ) : (
                description
              )}
              <ProductCardCategoryList categories={categories} />
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={classes.columnRight}>
              {(buttons || []).map(
                (button: {
                  onClick: () => void;
                  label: string;
                  className?: string;
                  redButton?: boolean;
                }) => {
                  return button?.redButton ? (
                    <RedButtonComponent
                      onClick={button.onClick}
                      className={button.className ?? classes.button}
                      disabled={!button.onClick}
                    >
                      {button.label}
                    </RedButtonComponent>
                  ) : (
                    <Button
                      color="primary"
                      onClick={button.onClick}
                      className={button.className ?? classes.button}
                      disabled={!button.onClick}
                    >
                      {button.label}
                    </Button>
                  );
                },
              )}
            </div>
          </Grid>
        </Grid>
      </div>
      {props.children}
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    fontWeight: 'bold',
  },
  columnLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  columnRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  description: {
    marginBottom: theme.spacing(2),
  },
  gridBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  headerLeft: {
    textAlign: 'left',
  },
  headerRight: {
    textAlign: 'right',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  iconLeft: {
    marginRight: theme.spacing(2),
  },
  link: {
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: theme.spacing(0.5),
    },
  },
  linkContainer: {
    marginLeft: theme.spacing(-1), // for prettier alignment
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(3),
  },
}));

export default ProductCard;
