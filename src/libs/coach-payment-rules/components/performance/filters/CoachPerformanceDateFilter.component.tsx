import React from 'react';
import moment, { Moment as MomentType } from 'moment-timezone';
import * as Yup from 'yup';
import {
  withFormik,
  Form,
  FormikProps,
  Field,
  FieldProps,
  useFormikContext,
} from 'formik';

import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CalendarToday from '@material-ui/icons/CalendarToday';
import {
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
} from '@material-ui/core';
// @ts-ignore
import { Submit, DateField } from '#components/forms';
import RedButton from '#components/button/RedButton.component';
import type { OptionCallback } from '../../../../../state/types';
import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { MaterialUiMultiSelectorField } from '#libs/custom-form/components/GenericFormik.input';

type InitialValues = {
  dateStart: MomentType;
  frequency: 'w' | 'M'; // comes from moment.unitOfTime.Base
  establishmentsSelected: number[];
};

type OwnProps = {
  disabled?: boolean;
  loading: boolean;
  hideExport?: boolean;
  exportExcelPerformance?: (
    params: {
      start_timestamp: number;
      end_timestamp: number;
    },
    options?: OptionCallback & {
      closeInitialDialog: () => void;
      backgroundDialog?: {
        message: string;
        title: string;
      };
    },
  ) => void;
  handleDateFiltersChange: (
    data: {
      dateStart: MomentType;
      dateEnd: MomentType;
    },
    options?: OptionCallback,
  ) => void;
  updateStateDate: (start: number, end: number) => void;
  startTimestamp?: number;
  endTimestamp?: number;
  isEstablishmentFilterEmbedded?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (
    data: {
      dateStart: MomentType;
      dateEnd: MomentType;
    },
    options?: OptionCallback,
  ) => Promise<void>;
  establishmentsOptions?: {
    value: number;
    label: string;
  }[];
  establishmentsLoading?: boolean;
  setSelectedEstablishmentFilter: (
    selectedEstablishments: number[],
    selectedLocations: number[],
  ) => void;
};

type Props = OwnProps & FormikProps<InitialValues>;

export function CoachPerformanceForm(props: Props) {
  const {
    isSubmitting,
    loading,
    handleDateFiltersChange,
    updateStateDate,
    isEstablishmentFilterEmbedded,
    establishmentsOptions,
    establishmentsLoading,
    setSelectedEstablishmentFilter,
  } = props;
  const [openExportDialog, setOpenExportDialog] = React.useState<boolean>();
  const { values, setSubmitting, initialValues }: FormikProps<InitialValues> =
    useFormikContext();

  const [previousValues, setPreviousValues] =
    React.useState<InitialValues>(initialValues);
  const classes = useStyles();
  const { t } = useTranslation([
    'paymentRules',
    'coachPerformance',
    'translation',
  ]);
  const handleExcelExportation = () => {
    setOpenExportDialog(false);
    const backgroundDialog = {
      message: t('coachPerformance:export.completed.message'),
      title: t('coachPerformance:export.completed.title'),
    };
    const params = {
      start_timestamp: props.startTimestamp,
      end_timestamp: props.endTimestamp,
    };

    props.exportExcelPerformance(params, {
      backgroundDialog,
      closeInitialDialog: () => {
        setOpenExportDialog(false);
      },
    });
  };
  React.useEffect(() => {
    if (
      !loading &&
      !isSubmitting &&
      (previousValues?.frequency !== values.frequency ||
        previousValues?.dateStart !== values.dateStart)
    ) {
      if (isEstablishmentFilterEmbedded) {
        setSelectedEstablishmentFilter(values.establishmentsSelected, []);
      }
      setSubmitting(true);
      setPreviousValues(values);
      handleDateFiltersChange(
        {
          ...values,
          dateEnd: moment(values.dateStart).add(1, values.frequency),
        },
        {
          onSuccess: () => setSubmitting(false),
          onError: () => setSubmitting(false),
        },
      );
      updateStateDate(
        moment(values.dateStart).unix(),
        moment(values.dateStart).add(1, values.frequency).unix(),
      );
    }
  }, [
    values,
    handleDateFiltersChange,
    isSubmitting,
    setSubmitting,
    loading,
    previousValues,
    updateStateDate,
    isEstablishmentFilterEmbedded,
    setSelectedEstablishmentFilter,
  ]);
  return (
    <>
      <Form className={classes.flexSection}>
        <div className={classes.date}>
          <DateField
            required
            className={classes.dateField}
            disabled={isSubmitting || loading}
            id="textfield_remuneration_beginning"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday />
                </InputAdornment>
              ),
              className: classes.input,
            }}
            name="dateStart"
            variant="outlined"
          />

          <Field name="frequency">
            {(fieldProps: FieldProps) => (
              <RadioGroup
                row
                name="row-radio-buttons-group"
                onChange={(ev) => {
                  fieldProps.form.setFieldValue('frequency', ev.target.value);
                }}
                value={fieldProps.field.value}
              >
                <FormControlLabel
                  control={<Radio disabled={isSubmitting || loading} />}
                  label={t('common:weekly')}
                  value="w"
                />
                <FormControlLabel
                  control={<Radio disabled={isSubmitting || loading} />}
                  label={t('common:monthly')}
                  value="M"
                />
              </RadioGroup>
            )}
          </Field>
          {isEstablishmentFilterEmbedded &&
            (establishmentsLoading ? (
              <CircularProgress />
            ) : (
              <MaterialUiMultiSelectorField
                isMenuListVirtualized
                className={classes.establishmentsFilter}
                defaultNumberShown={1}
                isDisabled={loading}
                name="establishmentsSelected"
                options={establishmentsOptions}
                placeholder={t('coachPerformance:form.selectEstablishments')}
              />
            ))}
        </div>
        <>
          <Submit
            color="secondary"
            disabled={isSubmitting || !!props.disabled || props.loading}
            id="button_remuneration_calculate"
            variant="outlined"
          >
            {t('calculate')}
          </Submit>
          <ObjectLevelPermissionProviderComponent requiredPermission="export.allowed_actions.payroll">
            {(hasPermission) =>
              hasPermission &&
              !props.hideExport && (
                <Button
                  color="secondary"
                  disabled={isSubmitting || !!props.disabled || props.loading}
                  id="button_remuneration_export"
                  onClick={() => setOpenExportDialog(true)}
                  variant="outlined"
                >
                  {t('coachPerformance:export.buttonText')}
                </Button>
              )
            }
          </ObjectLevelPermissionProviderComponent>
        </>
      </Form>

      <Dialog
        aria-describedby="popup-excel-report"
        aria-labelledby="popup-excel-report"
        onClose={() => setOpenExportDialog(false)}
        open={openExportDialog}
      >
        <DialogTitle id="alert-dialog-title">
          {t('coachPerformance:export.dialog.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('coachPerformance:export.dialog.message')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <RedButton
            delayBeforeActivation={2}
            onClick={() => handleExcelExportation()}
          >
            {t('coachPerformance:export.dialog.buttonText')}
          </RedButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  date: {
    display: 'flex',
    gap: theme.spacing(2),
    width: '100%',
  },
  flexSection: {
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    backgroundColor: 'white',
    color: '#868686',
  },
  establishmentsFilter: {
    display: 'flex',
    justifyContent: 'center',
    width: '30%',
  },
  dateField: { display: 'flex', justifyContent: 'center' },
}));

const CoachPerformanceSchema = Yup.object().shape({
  dateStart: Yup.date(),
  establishmentsSelected: Yup.array().of(Yup.number()),
});

export default compose<any, OwnProps>(
  withFormik<Props, InitialValues>({
    mapPropsToValues: () => ({
      dateStart: moment().startOf('month'),
      frequency: 'M',
      establishmentsSelected: [],
    }),
    validationSchema: CoachPerformanceSchema,
    handleSubmit: (
      values,
      {
        props: {
          onSubmit,
          isEstablishmentFilterEmbedded,
          setSelectedEstablishmentFilter,
        },
        setSubmitting,
      },
    ) => {
      const timeIntervalValue = {
        ...values,
        dateEnd: moment(values.dateStart).add(1, values.frequency),
      };
      if (isEstablishmentFilterEmbedded) {
        setSelectedEstablishmentFilter(values.establishmentsSelected, []);
      }
      onSubmit(timeIntervalValue, {
        onError: () => setSubmitting(false),
        onSuccess: () => {
          setSubmitting(false);
        },
      });
    },
  }),
)(React.memo(CoachPerformanceForm));
