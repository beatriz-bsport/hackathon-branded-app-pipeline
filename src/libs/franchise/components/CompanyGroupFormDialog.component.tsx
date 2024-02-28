import React, { useState, useCallback, ChangeEvent, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import FranchiseCompaniesSelector from '#libs/franchise/components/FranchiseCompaniesSelector.component';

import type {
  CompanyGroup,
  CreateUpdateCompanyGroupData,
  FranchiseCompany,
} from '#libs/franchise/types';

type Props = {
  open: boolean;
  initial?: CompanyGroup;
  companyList: FranchiseCompany[];
  onClose: () => void;
  onSubmit: (data: CreateUpdateCompanyGroupData) => void;
};

const CompanyGroupFormDialog: React.FC<Props> = ({
  open,
  initial,
  companyList = [],
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation('franchise');
  const classes = useStyles();

  const [name, setName] = useState<string>(initial?.name ?? '');

  const [selectedCompanies, setSelectedCompanies] = useState<
    FranchiseCompany[]
  >(
    (companyList ?? []).filter((company) =>
      initial?.companies.includes(company.id),
    ),
  );

  const handleSelectCompanies = useCallback(
    (selectedCompanyListOptions: { label: string; value: string }[]) => {
      if (selectedCompanyListOptions.length === 0) {
        return setSelectedCompanies([]);
      }

      return setSelectedCompanies(
        selectedCompanyListOptions.map((option) =>
          (companyList ?? []).find(
            (company) => company.id === parseInt(option?.value, 10),
          ),
        ),
      );
    },
    [companyList],
  );

  const handleChangeTitle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event?.target?.value;
      !!value && setName(value);
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    onSubmit({
      id: initial?.id,
      name,
      companies: selectedCompanies.map((company) => company.id),
    });
  }, [initial?.id, name, onSubmit, selectedCompanies]);

  const franchiseCompanyListById = useMemo(
    () =>
      (companyList ?? [])?.reduce<Record<number, FranchiseCompany>>(
        (acc, company) => {
          acc[company.id] = company;
          return acc;
        },
        {},
      ),
    [companyList],
  );

  const selectorSelectedCompanies = useMemo(
    () =>
      selectedCompanies.map((company) => ({
        label: company.name,
        value: company.id.toString(),
      })),
    [selectedCompanies],
  );

  return (
    <Dialog open={open}>
      <DialogTitle>{t('companyGroup.actions.add')}</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          className={classes.input}
          label={t('companyGroup.name.label')}
          onChange={handleChangeTitle}
          value={name}
          variant="outlined"
        />
        <FranchiseCompaniesSelector
          companies={companyList ?? []}
          companyDic={franchiseCompanyListById}
          menuPortalTarget={document.querySelector('body')}
          onChange={handleSelectCompanies}
          selectedCompanies={selectorSelectedCompanies}
        />
        <div className={classes.explainContainer}>
          <InfoOutlineIcon className={classes.iconLeft} />
          <Typography>{t('companyGroup.explain')}</Typography>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('companyGroup.actions.cancel')}</Button>
        <Button color="primary" onClick={handleSubmit}>
          {t('companyGroup.actions.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  explainContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
}));

export default React.memo(CompanyGroupFormDialog);
