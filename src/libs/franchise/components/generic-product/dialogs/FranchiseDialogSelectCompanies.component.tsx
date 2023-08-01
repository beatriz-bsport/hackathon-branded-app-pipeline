// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Typography, Theme } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CustomMuiDialog from '#components/genericDialog/CustomMuiDialog.component';
import FranchiseCompaniesSelector from '../../FranchiseCompaniesSelector.component';
import { FranchiseCompany } from '#libs/franchise/types';

type Props = {
  companyWithoutInstanceList: FranchiseCompany[];
  content1?: string;
  content2?: string;
  onCancel: () => void;
  onCreateTemplateInstances: (ids: number[]) => void;
  open: boolean;
  overrideTitle?: string;
};

export const FranchiseDialogSelectCompanies = (props: Props) => {
  const { t } = useTranslation('franchise');
  const classes = useStyles();
  const {
    companyWithoutInstanceList,
    content1,
    content2,
    onCancel,
    onCreateTemplateInstances,
    open,
    overrideTitle,
  } = props;

  const [selectedCompanies, setSelectedCompanies] = React.useState<number[]>(
    [],
  );

  const companyDic = React.useMemo(
    () =>
      [...(companyWithoutInstanceList || [])].reduce<
        Record<number, FranchiseCompany>
      >((dic, company) => {
        // eslint-disable-next-line no-param-reassign
        dic[company.id] = company;
        return dic;
      }, {}),
    [companyWithoutInstanceList],
  );

  const buttons = [
    {
      variant: 'text',
      commonLabel: 'close',
      onClick: onCancel,
      className: classes.button,
    },
    {
      variant: 'contained',
      commonLabel: 'saveRecord',
      color: 'primary',
      onClick: () => {
        onCreateTemplateInstances(selectedCompanies);
        setSelectedCompanies([]);
      },
      className: classes.button,
      disabled: !companyWithoutInstanceList?.length,
    },
  ];
  return (
    <CustomMuiDialog
      buttons={buttons}
      fullScreenBreakpoint="xs"
      open={open}
      title={overrideTitle || t('genericProduct.dialogs.selectCompanies.title')}
    >
      <Typography
        className={classes.typography}
        color="textSecondary"
        variant="body1"
      >
        {content1 || t('genericProduct.dialogs.selectCompanies.content1')}
      </Typography>
      <Typography
        className={classes.typography}
        color="textSecondary"
        variant="body1"
      >
        {content2 || t('genericProduct.dialogs.selectCompanies.content2')}
      </Typography>
      {companyWithoutInstanceList?.length ? (
        <FranchiseCompaniesSelector
          companies={companyWithoutInstanceList}
          companyDic={companyDic}
          menuPortalTarget={document.querySelector('body')}
          onChange={(newValue) => {
            setSelectedCompanies(
              newValue.map((val) => parseInt(val?.value, 10)),
            );
          }}
          selectedCompanies={companyWithoutInstanceList
            .filter((c) => selectedCompanies.includes(c.id))
            .map((c) => ({ label: c.name, value: `${c.id}` }))}
        />
      ) : (
        <Alert classes={{ root: classes.alertOverride }} severity="info">
          {t('genericProduct.dialogs.selectCompanies.allCompaniesShared')}
        </Alert>
      )}
    </CustomMuiDialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  alertOverride: {
    alignItems: 'center',
  },
  button: {
    fontWeight: 'bold',
  },
  typography: {
    marginBottom: theme.spacing(2),
  },
}));

export default FranchiseDialogSelectCompanies;
