import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, ErrorMessage } from 'formik';
import {
  WithStyles,
  createStyles,
  withStyles,
  Typography,
} from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import * as Yup from 'yup';
import Radio from '@material-ui/core/Radio';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import {
  CUSTOM_FORM_DISPLAY_ON_CONNECTION,
  CUSTOM_FORM_DISPLAY_ON_SIGN_UP,
} from '@bsport/common/lib/master-data/custom-form';
import type { CustomFormDisplayRule } from '../../types';
import { IntegerField } from '../../../../components/forms';
import {
  withFormTrackingHOC,
  WithSegmentAnalyticsFormTrackerHandlers,
  SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM,
} from '#components/analytics/segment';
import { OptionCallback } from '../../../../state/types';

type InitialValues = { initial?: CustomFormDisplayRule };
type OwnProps = InitialValues & {
  onSubmit: (data: CustomFormDisplayRule, options?: OptionCallback) => void;
  isSubmitting: boolean;
  open: boolean;
  onClose: () => void;
  signUpRuleAlreadyExists: boolean;
} & WithSegmentAnalyticsFormTrackerHandlers;
type Props = OwnProps &
  WithTranslation &
  FormikProps<InitialValues> &
  WithStyles<typeof styles>;

const CustomFormDisplayRuleSchema = Yup.object().shape({
  id: Yup.number().nullable(true),
  custom_form_id: Yup.number().nullable(false),
  kind: Yup.number().nullable(false),
  timedelta_day_before_display: Yup.number()
    .nullable(false)
    .test(
      'gt_zero_if_connection',
      'marketing:customForm.displayRule.form.errors.timedeltaBeforeDisplayMustBeGraterThanZero',
      function checkZeroIfConnect(item) {
        return this.parent.kind === CUSTOM_FORM_DISPLAY_ON_SIGN_UP || item > 0;
      },
    ),
  force_display: Yup.boolean(),
  snoozable: Yup.boolean(),
  timedelta_after_snooze: Yup.number(),
});
export function CustomFormDisplayRuleFormDialog(props: Props) {
  const { t, isSubmitting, classes, open } = props;
  const [expandAdvancedOptions, setExpandAdvancedOptions] =
    React.useState(false);
  React.useEffect(() => {
    if (props.formAdd) {
      props.formAdd(
        props.initial?.id
          ? { custom_form_display_rule_id: props.initial.id }
          : {},
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (props.isSubmitting) {
    return <LinearProgress color="primary" />;
  }
  const disableSignUpRuleCreation = () => {
    return (
      props.initial?.kind !== CUSTOM_FORM_DISPLAY_ON_SIGN_UP &&
      props.signUpRuleAlreadyExists
    );
  };
  return (
    <Formik
      initialValues={
        props.initial
          ? {
              ...props.initial,
            }
          : {
              id: null,
              kind: props.signUpRuleAlreadyExists
                ? CUSTOM_FORM_DISPLAY_ON_CONNECTION
                : CUSTOM_FORM_DISPLAY_ON_SIGN_UP,
              timedelta_day_before_display: 30,
              force_display: false,
              snoozable: true,
              timedelta_after_snooze: 24,
            }
      }
      validationSchema={CustomFormDisplayRuleSchema}
      onSubmit={(values) => {
        return props.onSubmit(
          { ...values },
          {
            onSuccess: () =>
              props.formSuccess &&
              props.formSuccess(
                props.initial && props.initial.id
                  ? { custom_form_display_rule_id: props.initial.id }
                  : {},
              ),
          },
        );
      }}
    >
      {(formik) => (
        <form>
          <>
            <Dialog open={open} maxWidth="sm" fullWidth>
              <DialogTitle>
                {t('customForm.displayRule.form.dialog.title')}
              </DialogTitle>
              <DialogContent>
                <Typography variant="body1">
                  {t(
                    'customForm.displayRule.form.dialog.helperTextRegisteredMembers',
                  )}
                </Typography>
                <div className={classes.spaceDivider} />
                <FormControl component="div">
                  <Typography variant="h6">
                    {t('customForm.displayRule.form.dialog.subTitle')}
                  </Typography>

                  <RadioGroup
                    onChange={(_, value) =>
                      formik.setFieldValue('kind', parseInt(value))
                    }
                  >
                    <FormControlLabel
                      key={`kind${CUSTOM_FORM_DISPLAY_ON_SIGN_UP}`}
                      value={CUSTOM_FORM_DISPLAY_ON_SIGN_UP}
                      control={
                        <Radio
                          checked={
                            `${formik.values.kind}` ===
                            `${CUSTOM_FORM_DISPLAY_ON_SIGN_UP}`
                          }
                          disabled={disableSignUpRuleCreation()}
                        />
                      }
                      label={`${t('customForm.displayRule.kind.signUp')} ${
                        disableSignUpRuleCreation()
                          ? `(${t(
                              'customForm.displayRule.kind.signUpAlreadyExists',
                            )})`
                          : ''
                      }`}
                    />
                    <FormControlLabel
                      key={`kind${CUSTOM_FORM_DISPLAY_ON_CONNECTION}`}
                      value={CUSTOM_FORM_DISPLAY_ON_CONNECTION}
                      control={
                        <Radio
                          checked={
                            `${formik.values.kind}` ===
                            `${CUSTOM_FORM_DISPLAY_ON_CONNECTION}`
                          }
                        />
                      }
                      label={t('customForm.displayRule.kind.connection')}
                    />
                  </RadioGroup>
                </FormControl>

                <Collapse
                  in={formik.values.kind === CUSTOM_FORM_DISPLAY_ON_CONNECTION}
                >
                  <IntegerField
                    name="timedelta_day_before_display"
                    fullWidth
                    disabled={
                      formik.values.kind !== CUSTOM_FORM_DISPLAY_ON_CONNECTION
                    }
                    label={t('customForm.displayRule.kind.connectionLabel')}
                    helperText={
                      formik.errors.timedelta_day_before_display &&
                      formik.touched.timedelta_after_snooze ? (
                        <ErrorMessage name="timedelta_day_before_display">
                          {(error_msg) => {
                            return (
                              <Typography variant="caption" color="error">
                                {t(`${error_msg}`)}
                              </Typography>
                            );
                          }}
                        </ErrorMessage>
                      ) : (
                        t('customForm.displayRule.kind.connectionHelperText', {
                          count:
                            formik?.values?.timedelta_day_before_display || 0,
                        })
                      )
                    }
                  />
                </Collapse>
                <ButtonBase
                  onClick={() =>
                    setExpandAdvancedOptions(!expandAdvancedOptions)
                  }
                  className={classes.advancedOptions}
                >
                  <div className={classes.advancedOptions}>
                    <Typography variant="h6">
                      {t('customForm.displayRule.form.dialog.advancedOptions')}
                    </Typography>
                    {expandAdvancedOptions ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </div>
                </ButtonBase>
                <Collapse in={expandAdvancedOptions}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          id="checkbox_allow_force_display"
                          name="force_display"
                          checked={formik.values.force_display}
                          onClick={() => {
                            formik.setFieldValue(
                              'force_display',
                              !formik.values.force_display,
                            );
                          }}
                          disabled={
                            formik.values.kind ===
                            CUSTOM_FORM_DISPLAY_ON_SIGN_UP
                          }
                        />
                      }
                      classes={{ label: classes.smallLabel }}
                      label={t(
                        'customForm.displayRule.form.dialog.force_display',
                      )}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          id="checkbox_allow_snooze_option"
                          name="snoozable"
                          checked={formik.values.snoozable}
                          onClick={() => {
                            formik.setFieldValue(
                              'snoozable',
                              !formik.values.snoozable,
                            );
                          }}
                        />
                      }
                      classes={{ label: classes.smallLabel }}
                      label={t(
                        'customForm.displayRule.form.dialog.snoozeOption',
                      )}
                    />
                  </FormGroup>

                  <Collapse in={formik.values.snoozable}>
                    <IntegerField
                      name="timedelta_after_snooze"
                      fullWidth
                      disabled={!formik.values.snoozable}
                      label={t(
                        'customForm.displayRule.form.dialog.snoozeOptionLabel',
                      )}
                      helperText={t(
                        'customForm.displayRule.form.dialog.snoozeOptionHelperText',
                        {
                          count: formik?.values?.timedelta_after_snooze || 0,
                        },
                      )}
                    />
                  </Collapse>
                </Collapse>
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  variant="text"
                  onClick={() => {
                    if (props.formCancel) {
                      props.formCancel(
                        props.initial && props.initial.id
                          ? {
                              custom_form_display_rule_id: props.initial.id,
                            }
                          : {},
                      );
                    }
                    props.onClose();
                  }}
                >
                  {t('customForm.displayRule.form.dialog.cancel')}
                </Button>
                <Button
                  id="submit_custom_form_display_rule_creation"
                  disabled={isSubmitting}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (props.formSubmitIntent) {
                      props.formSubmitIntent(
                        props.initial && props.initial.id
                          ? {
                              custom_form_display_rule_id: props.initial.id,
                            }
                          : {},
                      );
                    }

                    formik.handleSubmit();
                  }}
                >
                  {props.initial
                    ? t('customForm.displayRule.form.dialog.modify')
                    : t('customForm.displayRule.form.dialog.create')}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        </form>
      )}
    </Formik>
  );
}
const styles = (theme: Theme) =>
  createStyles({
    radioGroupLabel: {},
    advancedOptions: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: theme.spacing(1),
    },
    helperTextContainer: {
      backgroundColor: '#e0e0e0',
      borderRadius: theme.spacing(0.5),
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
    },
    textAndIcon: {
      paddingBottom: theme.spacing(2),
      display: 'flex',
      alignItems: 'center',
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    smallLabel: {
      fontSize: '14px',
    },
    spaceDivider: {
      marginTop: theme.spacing(3),
    },
  });

export default compose<any, OwnProps>(
  withFormTrackingHOC({
    object_identifier:
      SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.CUSTOMFORM_DISPLAY_RULE,
  }),
  withStyles(styles),
  withTranslation('marketing'),
)(CustomFormDisplayRuleFormDialog);
