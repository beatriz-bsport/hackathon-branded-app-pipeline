import React from 'react';
import * as Yup from 'yup';

import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';

import {
  WAITING_LIST_DYNAMIC_UNORDERED,
  WAITING_LIST_DYNAMIC_ORDERED,
} from '@bsport/common/lib/master-data/waiting-list-dynamic.js';
import { withFormik, FormikProps, Form } from 'formik';
import {
  SwitchField,
  CheckboxField,
  RadioGroupField,
  // @ts-expect-error
} from '#src/components/forms';

import {
  WaitingListConfiguration,
  WaitingListAutoCancellation,
} from '#src/libs/waiting-list/types';
import WaitingListOrderedForm from './WaitingListOrderedForm.component';

const WaitingListConfigurationFormValidationSchema = Yup.object().shape({
  autoCancellationType: Yup.number()
    .oneOf([
      WaitingListAutoCancellation.dumb,
      WaitingListAutoCancellation.smart,
    ])
    .required(),
  autoConsumePack: Yup.boolean().required(),
  autokickDelay: Yup.number()
    .transform((value: number) => (Number.isNaN(value) ? null : value)) // needed to return the error message instead of NaN error
    .nullable()
    .required('form.errors.autokickDelayError'),
  checkCredit: Yup.boolean().required(),
  displayMemberPosition: Yup.boolean().required(),
  dumbDelayMinutes: Yup.mixed() // mixed needed because can be a number and null
    .nullable()
    .test(
      'dumbDelayMinutesError',
      'form.errors.dumbDelayMinutesError',
      function checkDumbDelayMinutesValue(value) {
        const { autoCancellationType } = this.parent;

        if (autoCancellationType !== WaitingListAutoCancellation.dumb) {
          return true;
        }
        return value >= 15;
      },
    ),
  dynamic: Yup.number()
    .oneOf([WAITING_LIST_DYNAMIC_ORDERED, WAITING_LIST_DYNAMIC_UNORDERED])
    .required(),
  isOptionBlocking: Yup.boolean().required(),
  kickIfNoPackWhenAutoConsume: Yup.boolean().required(),
  lastDelayBeforeAutoConsume: Yup.number()
    .transform((value: number) => (Number.isNaN(value) ? null : value)) // needed to return the error message instead of NaN error
    .nullable(),
  smartDelayPercentage: Yup.mixed() // mixed needed because can be a number and null
    .nullable()
    .test(
      'smartDelayPercentageError',
      'form.errors.smartDelayPercentageError',
      function checkSmartDelayPercentageValue(value) {
        const { autoCancellationType } = this.parent;

        if (autoCancellationType !== WaitingListAutoCancellation.smart) {
          return true;
        }

        return value <= 100 && value >= 10;
      },
    ),
});

export type WaitingListConfigurationFormikValues = {
  autoCancellationType: WaitingListAutoCancellation;
  autoConsumePack: boolean;
  autokickDelay: number;
  checkCredit: boolean;
  displayMemberPosition: boolean;
  dumbDelayMinutes: number;
  dynamic: string;
  isOptionBlocking: boolean;
  kickIfNoPackWhenAutoConsume: boolean;
  lastDelayBeforeAutoConsume: number;
  smartDelayPercentage: number;
};

type FormikHOCProps = {
  configuration: WaitingListConfiguration;
  onSubmit: (data: WaitingListConfiguration) => void;
};

type Props = FormikProps<WaitingListConfigurationFormikValues>;

const WaitingListConfigurationForm: React.FC<Props> = ({
  dirty,
  isSubmitting,
  isValid,
  setFieldValue,
  setFieldTouched,
  values,
}) => {
  const { t } = useTranslation('waitingList');
  const classes = useStyles();
  const handleChange = React.useCallback(
    (field: string) => (value: any) => {
      setFieldTouched(field, true, false); // necessary for ErrorMessage from formik
      setFieldValue(field, value, true);
    },
    [setFieldValue, setFieldTouched],
  );

  const handleNumericFieldChange = React.useCallback(
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(field)(parseInt(event.target.value, 10));
    },
    [handleChange],
  );

  const handleAutoCancellationTypeChange = React.useCallback(
    (value: WaitingListAutoCancellation) => () => {
      handleChange('autoCancellationType')(value);
    },
    [handleChange],
  );

  return (
    <Form className={classes.root}>
      <FormControl className={classes.formControl} component="fieldset">
        <div className={classes.field}>
          <CheckboxField
            helperText={
              <Typography
                className={classes.helperText}
                color="textSecondary"
                variant="caption"
              >
                {t('form.is_option_blocking.helper')}
              </Typography>
            }
            label={t('form.is_option_blocking.label')}
            name="isOptionBlocking"
          />
        </div>

        <div className={classes.field}>
          <SwitchField
            helperText={
              <Typography
                className={classes.helperText}
                color="textSecondary"
                variant="caption"
              >
                {t('form.check_credit.helper')}
              </Typography>
            }
            label={t('form.check_credit.label')}
            name="checkCredit"
          />
        </div>

        <FormControl className={classes.field} component="fieldset">
          <FormLabel component="div">{t('form.dynamic.label')}</FormLabel>
          <RadioGroupField
            isRow
            choices={[
              {
                label: t(`form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.label`),
                value: WAITING_LIST_DYNAMIC_ORDERED.toString(),
              },
              {
                label: t(
                  `form.dynamic.${WAITING_LIST_DYNAMIC_UNORDERED}.label`,
                ),
                value: WAITING_LIST_DYNAMIC_UNORDERED.toString(),
              },
            ]}
            name="dynamic"
          />
        </FormControl>
        <div className={classes.settingsInner}>
          <Collapse
            in={values.dynamic === WAITING_LIST_DYNAMIC_ORDERED.toString()}
          >
            <WaitingListOrderedForm
              handleAutoCancellationTypeChange={
                handleAutoCancellationTypeChange
              }
              handleNumericFieldChange={handleNumericFieldChange}
            />
          </Collapse>
          <Collapse
            in={values.dynamic === WAITING_LIST_DYNAMIC_UNORDERED.toString()}
          >
            <div className={classes.singleRow}>
              <InfoOutlineIcon className={classes.leftIcon} />
              <Typography color="textSecondary">
                {t(`form.dynamic.${WAITING_LIST_DYNAMIC_UNORDERED}.explain`)}
              </Typography>
            </div>
          </Collapse>
        </div>
      </FormControl>
      <Button
        color="primary"
        disabled={!dirty || isSubmitting || !isValid}
        type="submit"
        variant="contained"
      >
        {t('form.submit')}
      </Button>
    </Form>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '70%',
  },
  formControl: {
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  field: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  helperText: {
    marginTop: theme.spacing(-1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  singleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  settingsInner: {
    backgroundColor: '#F3F3F3',
    borderRadius: theme.spacing(2),
    border: '1px solid #F3F3F3',
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0px ${theme.spacing(
      2,
    )}px`,
    width: '100%',
  },
}));

const FormikFormWrapper = withFormik<
  FormikHOCProps,
  WaitingListConfigurationFormikValues
>({
  enableReinitialize: true,
  validationSchema: WaitingListConfigurationFormValidationSchema,
  mapPropsToValues: ({ configuration }) => {
    const {
      auto_cancellation_type: autoCancellationType,
      auto_consume_pack: autoConsumePack,
      autokick_delay: autokickDelay,
      check_credit: checkCredit,
      display_member_position: displayMemberPosition,
      dumb_delay_minutes: dumbDelayMinutes,
      dynamic,
      is_option_blocking: isOptionBlocking,
      kick_if_no_pack_when_auto_consume: kickIfNoPackWhenAutoConsume,
      last_delay_before_auto_consume: lastDelayBeforeAutoConsume,
      smart_delay_percentage: smartDelayPercentage,
    } = configuration;
    return {
      autoCancellationType,
      autoConsumePack,
      autokickDelay,
      checkCredit,
      displayMemberPosition,
      dumbDelayMinutes,
      dynamic: dynamic.toString(),
      isOptionBlocking,
      kickIfNoPackWhenAutoConsume,
      lastDelayBeforeAutoConsume: lastDelayBeforeAutoConsume ?? 0,
      smartDelayPercentage,
    };
  },
  handleSubmit: (values, { props: { onSubmit, configuration } }) => {
    const sanitizedConfiguration = {
      ...configuration,
      auto_cancellation_type: values.autoCancellationType,
      auto_consume_pack: values.autoConsumePack,
      autokick_delay: values.autokickDelay,
      check_credit: values.checkCredit,
      display_member_position: values.displayMemberPosition,
      dumb_delay_minutes: values.dumbDelayMinutes,
      dynamic: parseInt(values.dynamic),
      is_option_blocking: values.isOptionBlocking,
      kick_if_no_pack_when_auto_consume: values.kickIfNoPackWhenAutoConsume,
      last_delay_before_auto_consume: values.lastDelayBeforeAutoConsume,
      smart_delay_percentage: values.smartDelayPercentage,
    };
    onSubmit(sanitizedConfiguration);
  },
});

export default React.memo(FormikFormWrapper(WaitingListConfigurationForm));
