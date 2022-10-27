import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Typography, Chip, Button, DialogActions } from '@material-ui/core';
import { Share, Add, InfoOutlined } from '@material-ui/icons';
import CompanyChip from '#components/franchise/CompanyChip.component';
import { FranchiseCompany } from '#libs/franchise/types';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type Props = {
  companies: FranchiseCompany[];
  emptyCompanyListText?: string;
  nbCompanyChips?: number;
  onCreateTemplateInstance: () => void;
  onDeleteTemplateInstance: (companyId: number) => void;
};

export const GenericTemplateCardCompanyList = (props: Props) => {
  const { t } = useTranslation('franchise');
  const classes = useStyles();
  const nbChips = props.nbCompanyChips || 3;
  const [openOtherCompaniesDialog, setOpenOtherCompaniesDialog] =
    React.useState(false);
  return (
    <div className={classes.detailInfo}>
      <Share className={classes.leftIcon} />
      <div className={classes.detailCategory}>
        <Typography variant="subtitle2">
          {t('genericProduct.templateCard.shareTemplate.categoryName')}
        </Typography>
        <div className={classes.chipsContainer}>
          {props.companies?.length > 0 ? (
            <>
              {props.companies
                .slice(0, nbChips)
                .filter((company) => !!company)
                .map((company) => (
                  <CompanyChip
                    key={company.id}
                    className={classes.chip}
                    company={company}
                    onDelete={() => props.onDeleteTemplateInstance(company.id)}
                  />
                ))}
              {props.companies.length > nbChips && (
                <Chip
                  variant="outlined"
                  color="primary"
                  label={t('genericProduct.templateCard.shareTemplate.seeAll')}
                  className={classes.chip}
                  onClick={() => setOpenOtherCompaniesDialog(true)}
                />
              )}
            </>
          ) : (
            <div className={classes.emptyCompanyList}>
              <InfoOutlined className={classes.infoIcon} />
              <Typography variant="body2" color="textSecondary">
                {props.emptyCompanyListText ||
                  t(
                    'genericProduct.templateCard.shareTemplate.emptyCompanyList',
                  )}
              </Typography>
            </div>
          )}
        </div>
        <GenericResponsiveDialog
          open={openOtherCompaniesDialog && props.companies?.length > nbChips}
          fullScreenBreakpoint="xs"
          onClose={() => setOpenOtherCompaniesDialog(false)}
          maxWidth="xs"
        >
          <div className={classes.chipsContainerInDialog}>
            {props.companies
              ?.slice(nbChips)
              .filter((company) => !!company)
              .map((company) => (
                <CompanyChip
                  key={company.id}
                  className={classes.chip}
                  company={company}
                  onDelete={() => props.onDeleteTemplateInstance(company.id)}
                />
              ))}
          </div>
          <DialogActions>
            <Button
              onClick={() => setOpenOtherCompaniesDialog(false)}
              className={classes.button}
            >
              {t('genericProduct.templateCard.shareTemplate.closeDialog')}
            </Button>
          </DialogActions>
        </GenericResponsiveDialog>
        <Button
          onClick={props.onCreateTemplateInstance}
          variant="outlined"
          color="primary"
          startIcon={<Add />}
          className={classes.button}
        >
          {t('genericProduct.templateCard.shareTemplate.addCompany')}
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    fontWeight: 'bold',
  },
  chip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  chipsContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  chipsContainerInDialog: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  detailInfo: {
    display: 'flex',
    flexDirection: 'row',
  },
  detailCategory: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  emptyCompanyList: {
    display: 'flex',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
}));

export default GenericTemplateCardCompanyList;
