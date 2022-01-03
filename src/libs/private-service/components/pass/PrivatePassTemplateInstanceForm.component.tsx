import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import Typography from '@material-ui/core/Typography';

import FranchiseCompaniesSelector from '#libs/franchise/components/FranchiseCompaniesSelector.component';
import { FranchiseCompany } from '#libs/franchise/types';

type Props = {};

const PrivatePassTemplateInstanceForm = (props: Props) => {
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();
  const { values, companies, setFieldValue } = props;

  const companyDic = companies?.reduce<Record<number, FranchiseCompany>>(
    (dic, company) => {
      // eslint-disable-next-line no-param-reassign
      dic[company.id] = company;
      return dic;
    },
    {},
  );
  return (
    <div>
      <Typography className={classes.explainText} color="textSecondary">
        {t('privatePassTemplateInstance.form.explain1')}
      </Typography>
      <Typography className={classes.explainText} color="textSecondary">
        {t('privatePassTemplateInstance.form.explain2')}
      </Typography>
      <FranchiseCompaniesSelector
        onChange={(newValue) => {
          setFieldValue(
            'selectedCompanies',
            newValue.map((val) => parseInt(val?.value, 10)),
          );
        }}
        selectedCompanies={companies
          .filter((c) => values.selectedCompanies.includes(c.id))
          .map((c) => ({
            label: c.name,
            value: `${c.id}`,
          }))}
        companyDic={companyDic}
        companies={companies}
        menuPortalTarget={document.querySelector('body')}
      />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  explainText: {
    marginBottom: theme.spacing(2),
  },
}));

const PrivatePassTemplateInstanceSchema = Yup.object().shape({
  selectedCompanies: Yup.array().of(Yup.number()).required(),
});

export const PrivatePassTemplateInstanceFormikHOC = withFormik({
  mapPropsToValues: () => ({
    selectedCompanies: [],
  }),
  validationSchema: PrivatePassTemplateInstanceSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    const data = {
      companies: values.selectedCompanies,
    };
    onSubmit(data, {
      onSuccess: () => setSubmitting(false),
      onError: () => {
        setSubmitting(false);
      },
    });
  },
});

export default PrivatePassTemplateInstanceForm;
