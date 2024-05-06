import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Form, FormikProps, withFormik } from 'formik';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { SwitchField } from '#libs/custom-form/components/GenericFormik.input';
import MemberProfileSettingsSchema from '#libs/theme/components/MemberProfileSettingsForm/MemberProfileSettingsSchema';
import type {
  MemberProfileSettingsPayload,
  CompanyTheme,
} from '#libs/theme/types';
import type { OptionCallback } from '#state/types';

type ComponentProps = {
  companyTheme: CompanyTheme;
  companyThemeProcessing: boolean;
};

type FormProps = {
  onSubmit: (
    companyId: number,
    data: MemberProfileSettingsPayload,
    options: OptionCallback,
  ) => void;
};

type Props = ComponentProps & FormikProps<MemberProfileSettingsPayload>;

const useStyles = makeStyles((theme) => ({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    alignItems: 'flex-start',
  },
  confirm: {
    marginTop: theme.spacing(2),
  },
}));

const MemberProfileSettingsForm: React.FC<Props> = React.memo(
  ({ isSubmitting, handleSubmit, companyThemeProcessing }) => {
    const { t } = useTranslation('theme');
    const classes = useStyles();

    return (
      <Form noValidate className={classes.section} onSubmit={handleSubmit}>
        <Typography variant="h6">
          {t('forms.themePersonalization.memberProfile.myProfile.title')}
        </Typography>
        <SwitchField
          label={t(
            'forms.themePersonalization.memberProfile.myProfile.showMemberAccountBalance',
          )}
          name="show_member_account_balance"
        />
        <SwitchField
          label={t(
            'forms.themePersonalization.memberProfile.myProfile.showBarcodeButton',
          )}
          name="show_barcode_button"
        />
        <SwitchField
          label={t(
            'forms.themePersonalization.memberProfile.myProfile.showMembershipNumber',
          )}
          name="show_membership_number"
        />
        <Button
          className={classes.confirm}
          color="primary"
          disabled={isSubmitting || companyThemeProcessing}
          type="submit"
          variant="contained"
        >
          {t('forms.submit')}
        </Button>
      </Form>
    );
  },
);

const formikWrapper = withFormik<
  ComponentProps & FormProps,
  MemberProfileSettingsPayload
>({
  enableReinitialize: true,
  mapPropsToValues: ({ companyTheme }) => {
    if (companyTheme) {
      return {
        show_member_account_balance: companyTheme.show_member_account_balance,
        show_barcode_button: companyTheme.show_barcode_button,
        show_membership_number: companyTheme.show_membership_number,
      };
    }
    return {
      show_member_account_balance: true,
      show_barcode_button: false,
      show_membership_number: false,
    };
  },
  validationSchema: MemberProfileSettingsSchema,
  handleSubmit: (
    values,
    { props: { onSubmit, companyTheme }, setSubmitting },
  ) => {
    const data = {
      show_member_account_balance: values.show_member_account_balance,
      show_barcode_button: values.show_barcode_button,
      show_membership_number: values.show_membership_number,
    };

    onSubmit(companyTheme.company, data, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default formikWrapper(MemberProfileSettingsForm);
