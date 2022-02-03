import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import FranchiseCompaniesSelector from './FranchiseCompaniesSelector.component';
import { CompanyGroup, FranchiseCompany } from '../types';

type Props = {
  open: boolean;
  initial?: CompanyGroup;
  onClose: () => void;
  onSubmit: (data: { name: string }) => void;
};

const CompanyGroupFormDialog = (props: Props) => {
  const { t } = useTranslation(['franchise']);
  const classes = useStyles();

  const [name, setName] = React.useState<string>(props.initial?.name || '');
  const [companiesSelected, setCompaniesSelected] = React.useState(
    (props.companyList || []).filter((c) =>
      (props.initial?.companies || []).includes(c.id),
    ),
  );

  const companyList = [...(props.companyList || [])];

  const companyDic = companyList?.reduce<Record<number, FranchiseCompany>>(
    (dic, company) => {
      // eslint-disable-next-line no-param-reassign
      dic[company.id] = company;
      return dic;
    },
    {},
  );

  const asSelectable = (companyList_) => [
    ...companyList_.map((c) => ({
      label: c.name,
      value: c.id,
    })),
  ];

  return (
    <Dialog open={props.open}>
      <DialogTitle>{t('companyGroup.actions.add')}</DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          value={name}
          fullWidth
          onChange={(ev) => setName(ev.target.value)}
          label={t('companyGroup.name.label')}
          className={classes.input}
        />
        <FranchiseCompaniesSelector
          onChange={(newValue) => {
            setCompaniesSelected(
              newValue.map((val) =>
                companyList.find((c) => c.id === parseInt(val?.value, 10)),
              ),
            );
          }}
          selectedCompanies={asSelectable(companiesSelected)}
          companyDic={companyDic}
          companies={companyList}
          menuPortalTarget={document.querySelector('body')}
        />
        <div className={classes.explainContainer}>
          <InfoOutlineIcon className={classes.iconLeft} />
          <Typography>{t('companyGroup.explain')}</Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t('companyGroup.actions.cancel')}
        </Button>
        <Button
          color="primary"
          onClick={() =>
            props.onSubmit({
              ...(props.initial || {}),
              name,
              companies: companiesSelected.map((c) => c.id),
            })
          }
        >
          {t('companyGroup.actions.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
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

export default CompanyGroupFormDialog;
