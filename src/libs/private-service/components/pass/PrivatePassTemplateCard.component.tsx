import React from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import classnames from 'classnames';
import { getValidityInfo } from '../../utils';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import CompanyChip from '#components/franchise/CompanyChip.component';

import { PrivatePassTemplate } from '../../types';

type Props = {
  privatePassTemplate: PrivatePassTemplate;
};

const PrivatePassTemplateCard = (props: Props) => {
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();
  const { privatePassTemplate: template } = props;

  return (
    <Paper
      className={classnames(
        classes.paper,
        template.disabled ? classes.disabled : null,
      )}
    >
      <div className={classes.horizontalBlock}>
        {template.disabled ? (
          <div className={classes.disabledLabel}>
            <Typography color="error" variant="h6">
              {t('disabled')}
            </Typography>
          </div>
        ) : null}
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
        >
          <Grid item xs={8}>
            <div>
              <Typography className={classes.title} variant="h6">
                {template.name}
              </Typography>
              <div className={classes.restrictionBlock}>
                <Typography>{getValidityInfo(template, t)}</Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={classes.columnLeft}>
              <Typography variant="h4" color="primary">
                {getCurrencyDisplayWithPrice(template.price)}
              </Typography>
              <Typography variant="caption">
                {getCurrencyDisplayWithPrice(
                  (
                    parseFloat(template.price) /
                    ((100 + parseInt(template.tax, 10)) / 100)
                  ).toFixed(2),
                )}{' '}
                {t('ht')}
              </Typography>
              <Typography variant="subtitle1">
                <div>
                  <b>{template.credits}</b>{' '}
                  {t('credits', { count: template.credits }).toLowerCase()}
                </div>
              </Typography>
            </div>
          </Grid>
        </Grid>
      </div>
      <div className={classes.horizontalBlock}>
        <Typography className={classes.companySectionTitle} variant="h6">
          {t('privatePassTemplate.specification.companySharedWithTitle')}
        </Typography>
        <div className={classes.companyInnerContainer}>
          {!template.companies.length && (
            <div className={classes.emptyExplain}>
              <InfoOutlinedIcon className={classes.iconLeft} />
              <Typography color="textSecondary">
                {t('privatePassTemplateInstance.companyEmpty')}
              </Typography>
            </div>
          )}
          <div className={classes.chipListContainer}>
            {template.companies.map((c) => (
              <div className={classes.chipContainer}>
                <CompanyChip
                  company={c}
                  key={c.id}
                  onDelete={
                    props.onDeleteCompany && (() => props.onDeleteCompany(c.id))
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <Button
          onClick={props.onCreatePrivatePassTemplateInstance}
          variant="outlined"
          color="primary"
        >
          <AddIcon className={classes.iconLeft} />
          {t('privatePassTemplateInstance.actions.addCompany')}
        </Button>
      </div>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  emptyExplain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1),
  },
  companySectionTitle: {
    marginBottom: theme.spacing(2),
  },
  title: {
    paddingBottom: theme.spacing(2),
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  disabled: {
    backgroundColor: '#F8F8F8',
  },
  horizontalBlock: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  columnLeft: {
    paddingLeft: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  restrictionBlock: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  disabledLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing(2),
  },
  companyContainer: {
    marginBottom: theme.spacing(3),
  },
  companyInnerContainer: {
    display: 'flex',
    flexDirection: 'row',
    '&>*': {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
  chipListContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipContainer: {
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export default PrivatePassTemplateCard;
