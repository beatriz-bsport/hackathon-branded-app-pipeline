import React from 'react';
import { withFormik, Form, FormikProps } from 'formik';
import { Typography, makeStyles, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { OptionCallback } from '../../../../state/types';

import {
  ReferralTimeLimitUnits,
  ReferredVoucherTypeChoices,
} from '#libs/referral/constants';
import { Tag } from '#libs/tag/types';
// @ts-expect-error
import { SwitchField } from '#components/forms';
import type { CompanyTheme } from '#libs/theme/types';
import type { ReferralProgram } from '#libs/referral/types';
import EditReferralProgramFormValidationSchema from './EditReferralProgramSettingsFormValidationSchema';
import EditReferralProgramSettingsFormGeneral from './sections/EditReferralProgramSettingsFormGeneral.component';
import EditReferralProgramSettingsFormReferredReduction from './sections/EditReferralProgramSettingsFormReferredReduction.component';
import EditReferralProgramSettingsFormReferringReward from './sections/EditReferralProgramSettingsFormReferringReward.component';
import EditReferralProgramSettingsFormTag from './sections/EditReferralProgramSettingsFormTag.component';
import EditReferralProgramSettingsFormRedirectLink from './sections/EditReferralProgramSettingsFormRedirectLink.component';

export interface FormikValues {
  id: number;
  name: string;
  is_referral_program_activated: boolean;
  minimum_basket_amount: number;
  maximum_referral_uses: number;
  amount_off_referred: number;
  percent_off_referred: number;
  referred_voucher_type: ReferredVoucherTypeChoices;
  application_time_limit_intervals: number;
  application_time_limit_unit: ReferralTimeLimitUnits;
  amount_reward_referring: number;
  redirect_link?: string;
  tag_referred_member?: Tag;
}

type OwnProps = {
  tagList: Tag[];
};

type FormProps = {
  companyTheme: CompanyTheme;
  referralProgram?: ReferralProgram;
  onSubmit: (
    newReferralProgram: ReferralProgram,
    newDataCompanyTheme: { [key: string]: any },
    options: OptionCallback<ReferralProgram>,
  ) => void;
};

type Props = OwnProps & FormProps;

export const EditReferralProgramSettingsForm: React.FC<
  FormikProps<FormikValues> & OwnProps
> = ({ tagList, handleSubmit, isSubmitting, isValid, values }) => {
  const { t } = useTranslation('referral');
  const classes = useStyles();

  return (
    <Form onSubmit={handleSubmit}>
      <div className={classes.main}>
        <Typography className={classes.header}>{t('form.title')}</Typography>
        <div className={classes.flexColumn}>
          <SwitchField
            id="is-referral-program-activated"
            label={t('form.activateReferral.label')}
            name="is_referral_program_activated"
          />
          <Typography color="textSecondary" variant="caption">
            {t('form.activateReferral.description')}
          </Typography>
        </div>
        {values?.is_referral_program_activated && (
          <>
            <EditReferralProgramSettingsFormGeneral />
            <EditReferralProgramSettingsFormReferredReduction />
            <EditReferralProgramSettingsFormReferringReward />
            <EditReferralProgramSettingsFormTag tagList={tagList} />
            <EditReferralProgramSettingsFormRedirectLink />
          </>
        )}
        <Button
          className={classes.submit}
          color="primary"
          disabled={isSubmitting || !isValid}
          id="submit-btn"
          type="submit"
          variant="contained"
        >
          {t('form.submit')}
        </Button>
      </div>
    </Form>
  );
};

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    maxWidth: '800px',
    width: '100%',
  },
  header: {
    fontSize: theme.spacing(3),
    fontWeight: 500,
    marginRight: 0,
    marginLeft: 0,
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  submit: {
    minWidth: '134px',
    width: '20%',
  },
}));

const EditReferralProgramSettingsFormHOC = withFormik<Props, FormikValues>({
  mapPropsToValues: ({ referralProgram, companyTheme }) => {
    const company_has_referral_program_activated =
      !!companyTheme?.is_referral_program_activated;
    /* since the backend does a get_or_create of the referral program on fetch,
    and we wait until it's fetched to display this form,
    the referralProgram always exists here */
    return {
      id: referralProgram.id,
      name: referralProgram.name,
      is_referral_program_activated: company_has_referral_program_activated,
      minimum_basket_amount: referralProgram.minimum_basket_amount,
      maximum_referral_uses: referralProgram.maximum_referral_uses,
      amount_off_referred: referralProgram.amount_off_referred,
      percent_off_referred: referralProgram.percent_off_referred,
      referred_voucher_type: referralProgram.referred_voucher_type,
      application_time_limit_intervals:
        referralProgram.application_time_limit_intervals,
      application_time_limit_unit: referralProgram.application_time_limit_unit,
      amount_reward_referring: referralProgram.amount_reward_referring,
      redirect_link: referralProgram.redirect_link,
      tag_referred_member: referralProgram.tag_referred_member,
    };
  },
  validationSchema: EditReferralProgramFormValidationSchema,
  handleSubmit: (
    values,
    { props: { onSubmit, companyTheme }, setSubmitting },
  ) => {
    const newReferralProgram: ReferralProgram = {
      id: values.id,
      name: `referral_program_${companyTheme.company}`,
      company: companyTheme.company,
      is_referral_program_activated: values.is_referral_program_activated,
      minimum_basket_amount: values.minimum_basket_amount,
      maximum_referral_uses: values.maximum_referral_uses,
      amount_off_referred: values.amount_off_referred,
      percent_off_referred: values.percent_off_referred,
      referred_voucher_type: values.referred_voucher_type,
      application_time_limit_intervals: values.application_time_limit_intervals,
      application_time_limit_unit: values.application_time_limit_unit,
      amount_reward_referring: values.amount_reward_referring,
      redirect_link: values.redirect_link ?? '',
      tag_referred_member: values.tag_referred_member,
    };
    const newDataCompanyTheme = {
      is_referral_program_activated: values.is_referral_program_activated,
    };
    onSubmit(newReferralProgram, newDataCompanyTheme, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default React.memo(
  EditReferralProgramSettingsFormHOC(EditReferralProgramSettingsForm),
);
