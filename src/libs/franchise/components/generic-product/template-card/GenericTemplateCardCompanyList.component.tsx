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
                  className={classes.chip}
                  color="primary"
                  label={t('genericProduct.templateCard.shareTemplate.seeAll')}
                  onClick={() => setOpenOtherCompaniesDialog(true)}
                  variant="outlined"
                />
              )}
            </>
          ) : (
            <div className={classes.emptyCompanyList}>
              <InfoOutlined className={classes.infoIcon} />
              <Typography color="textSecondary" variant="body2">
                {props.emptyCompanyListText ||
                  t(
                    'genericProduct.templateCard.shareTemplate.emptyCompanyList',
                  )}
              </Typography>
            </div>
          )}
        </div>
        <GenericResponsiveDialog
          fullScreenBreakpoint="xs"
          maxWidth="xs"
          onClose={() => setOpenOtherCompaniesDialog(false)}
          open={openOtherCompaniesDialog && props.companies?.length > nbChips}
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
              className={classes.button}
              onClick={() => setOpenOtherCompaniesDialog(false)}
            >
              {t('genericProduct.templateCard.shareTemplate.closeDialog')}
            </Button>
          </DialogActions>
        </GenericResponsiveDialog>
        <Button
          className={classes.button}
          color="primary"
          onClick={props.onCreateTemplateInstance}
          startIcon={<Add />}
          variant="outlined"
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
