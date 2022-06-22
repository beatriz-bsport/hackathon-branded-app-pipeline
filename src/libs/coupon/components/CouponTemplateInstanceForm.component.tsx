import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { withFormik, FormikProps } from 'formik';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
} from '@bsport/common/lib/master-data/buyable-items';
import * as Yup from 'yup';
import Typography from '@material-ui/core/Typography';

import { OptionCallback } from '../../../state/types';
import { PaymentPackTemplate } from '#libs/payment-packs/types';
import { PrivatePassTemplate } from '#libs/private-service/types';
import { CouponTemplate } from '#libs/coupon/types';
import FranchiseCompaniesSelector from '../../franchise/components/FranchiseCompaniesSelector.component';
import { FranchiseCompany } from '../../franchise/types';

type OwnProps = {
  companies: Array<FranchiseCompany>;
  paymentPackTemplateList: Array<PaymentPackTemplate>;
  privatePassTemplateList: Array<PrivatePassTemplate>;
  couponTemplate: CouponTemplate;
};

type InitialValues = {
  selectedCompanies: Array<number>;
};

type Props = OwnProps & FormikProps<InitialValues>;

const filterCompatibleCompanies = (
  couponTemplate: CouponTemplate,
  companies: Array<FranchiseCompany>,
  paymentPackTemplateList: Array<PaymentPackTemplate>,
  privatePassTemplateList: Array<PrivatePassTemplate>,
) => {
  if (
    ![BUYABLE_ITEM_PASS, BUYABLE_ITEM_PRIVATE_PASS].includes(
      couponTemplate.applies_to,
    ) ||
    !couponTemplate.only_on_objects?.length
  ) {
    return companies;
  }

  let compatibleCompanies;
  if (couponTemplate.applies_to === BUYABLE_ITEM_PASS) {
    compatibleCompanies = companies.filter((company) => {
      return couponTemplate.only_on_objects.some((paymentPackTemplateId) => {
        const template = paymentPackTemplateList.find(
          (ppt) => ppt.id === paymentPackTemplateId,
        );
        return template.payment_pack_template_instances.some(
          (ppti) => !ppti.disabled && ppti.company === company.id,
        );
      });
    });
  } else {
    compatibleCompanies = companies.filter((company) => {
      return couponTemplate.only_on_objects.some((privatePassTemplateId) => {
        const template = privatePassTemplateList.find(
          (ppt) => ppt.id === privatePassTemplateId,
        );
        return template.private_pass_template_instances.some(
          (ppti) => !ppti.disabled && ppti.company === company.id,
        );
      });
    });
  }
  return compatibleCompanies;
};

const CouponTemplateInstanceForm = (props: Props) => {
  const { t } = useTranslation('coupon');
  const classes = useStyles();
  const {
    values,
    companies,
    setFieldValue,
    couponTemplate,
    paymentPackTemplateList,
    privatePassTemplateList,
  } = props;

  const compatibleCompanies = useMemo(
    () =>
      filterCompatibleCompanies(
        couponTemplate,
        companies,
        paymentPackTemplateList,
        privatePassTemplateList,
      ),
    [
      couponTemplate,
      companies,
      paymentPackTemplateList,
      privatePassTemplateList,
    ],
  );

  const companyDic = compatibleCompanies?.reduce<
    Record<number, FranchiseCompany>
  >((dic, company) => {
    // eslint-disable-next-line no-param-reassign
    dic[company.id] = company;
    return dic;
  }, {});
  return (
    <div>
      <Typography className={classes.explainText} color="textSecondary">
        {t('couponTemplateInstance.create.explain1')}
      </Typography>
      <Typography className={classes.explainText} color="textSecondary">
        {t('couponTemplateInstance.create.explain2')}
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
        companies={compatibleCompanies}
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

const CouponTemplateInstanceSchema = Yup.object().shape({
  selectedCompanies: Yup.array().of(Yup.number()).required(),
});

export const CouponTemplateInstanceFormikHOC = withFormik<
  Props & {
    onSubmit: (
      { companies }: { companies: Array<number> },
      options: OptionCallback,
    ) => void;
  },
  any
>({
  mapPropsToValues: () => ({
    selectedCompanies: [],
  }),
  validationSchema: CouponTemplateInstanceSchema,
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

export default CouponTemplateInstanceForm;
