import React from 'react';
import { Form, withFormik, FormikProps } from 'formik';
import { compose } from 'recompose';
import * as Yup from 'yup';

import AppBar from '@material-ui/core/AppBar';
import Collapse from '@material-ui/core/Collapse';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FilterListIcon from '@material-ui/icons/FilterList';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import type { DateTime } from 'luxon';
import type { ImmutableArray } from 'seamless-immutable';

import { useTranslation } from 'react-i18next';
// @ts-expect-error
import { Submit } from '#components/forms';
import CoachPerformanceDateFilter from '#libs/coach-payment-rules/components/performance/filters/CoachPerformanceDateFilter.component';

import type { OptionCallback } from '../../../../../state/types';
import type {
  Establishment,
  EstablishmentGroupAPI,
} from '#libs/establishment/types';

import CoachPerformanceLocationEstablishmentFilter from './CoachPerformanceLocationEstablishmentFilter.component';

type FormikValues = {
  byLocation: boolean;
  locationsSelected: Array<number>;
  establishmentsSelected: Array<number>;
};

type Props = {
  handleDateFiltersChange: (
    data: {
      dateStart: DateTime;
      dateEnd: DateTime;
    },
    options: OptionCallback,
  ) => Promise<void>;
  loading: boolean;
  onSubmit: (
    data: {
      dateStart: DateTime;
      dateEnd: DateTime;
    },
    options?: OptionCallback,
  ) => Promise<void>;
  updateStateDate: (dateStart: number, dateEnd: number) => void;
  establishments: ImmutableArray<Establishment>;
  establishmentGroupList: EstablishmentGroupAPI[];
  isMultiLocalizationEnabled: boolean;
  establishmentsLoading: boolean;
  establishmentGroupListLoading: boolean;
  setSelectedEstablishmentFilter: (
    selectedEstablishments: number[],
    selectedLocations: number[],
  ) => void;
} & Partial<FormikProps<FormikValues>>;

type FormProps = {
  selectedEstablishments: number[];
  selectedLocations: number[];
};

export const CoachPerformanceDateAndEstablishmentFilter: React.FC<Props> = ({
  handleDateFiltersChange,
  loading,
  onSubmit,
  setSelectedEstablishmentFilter,
  updateStateDate,
  establishments,
  establishmentGroupList,
  isMultiLocalizationEnabled,
  resetForm,
  isSubmitting,
  establishmentsLoading,
  establishmentGroupListLoading,
}) => {
  const [openSection, setOptionSection] = React.useState(false);
  const { t } = useTranslation('coachPerformance');
  const classes = useStyles();

  const establishmentsOptions = React.useMemo(
    () =>
      ([...establishments] || []).map((establishment) => {
        return { value: establishment?.id, label: establishment?.title };
      }),
    [establishments],
  );

  const establishmentGroupLocationsOptions = React.useMemo(
    () =>
      [...(establishmentGroupList ?? [])]?.map((establishmentGroup) => {
        return {
          value: establishmentGroup?.id,
          label: establishmentGroup?.name,
        };
      }) || [],
    [establishmentGroupList],
  );

  const handleResetForm = React.useCallback(() => {
    resetForm();
    setSelectedEstablishmentFilter([], []);
  }, [resetForm, setSelectedEstablishmentFilter]);

  const handleOpenSection = React.useCallback(
    () => setOptionSection((prevState) => !prevState),
    [],
  );

  return (
    <div>
      <Form>
        <AppBar className={classes.bar} color="default" position="static">
          <CoachPerformanceDateFilter
            hideExport
            establishmentsLoading={establishmentsLoading}
            establishmentsOptions={establishmentsOptions}
            handleDateFiltersChange={handleDateFiltersChange}
            isEstablishmentFilterEmbedded={!isMultiLocalizationEnabled}
            loading={loading}
            onSubmit={onSubmit}
            setSelectedEstablishmentFilter={setSelectedEstablishmentFilter}
            updateStateDate={updateStateDate}
          />
        </AppBar>
        {isMultiLocalizationEnabled && (
          <>
            <ButtonBase
              disableRipple
              className={classes.flexHeader}
              disabled={loading}
              onClick={handleOpenSection}
            >
              <div className={classes.flexHeader}>
                <FilterListIcon color="primary" />
                <Typography variant="h6">
                  {t('coachPerformance:advancedFilters.header')}
                </Typography>
                {openSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
            </ButtonBase>
            <Collapse in={openSection}>
              <CoachPerformanceLocationEstablishmentFilter
                establishmentGroupListLoading={establishmentGroupListLoading}
                establishmentsLoading={establishmentsLoading}
                establishmentsOptions={establishmentsOptions}
                isMultiLocalizationEnabled={isMultiLocalizationEnabled}
                locationsOptions={establishmentGroupLocationsOptions}
              />
              <div className={classes.bottomActions}>
                <Button
                  color="secondary"
                  disabled={isSubmitting || establishmentsLoading}
                  onClick={handleResetForm}
                  variant="outlined"
                >
                  {t('coachPerformance:advancedFilters.reset')}
                </Button>
                <Submit
                  color="primary"
                  disabled={isSubmitting || establishmentsLoading}
                  id="button_set_advanced_filters"
                  variant="outlined"
                >
                  {t('coachPerformance:advancedFilters.apply')}
                </Submit>
              </div>
            </Collapse>
          </>
        )}
      </Form>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  bar: {
    width: `calc(100% + ${theme.spacing(6)}px)`,
    marginTop: theme.spacing(-2),
    marginRight: theme.spacing(-3),
    marginLeft: theme.spacing(-3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  flexHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
    gap: theme.spacing(2),
  },
  bottomActions: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
}));

const ValidationSchema = Yup.object().shape({
  selectedLocations: Yup.array().of(Yup.number()),
  establishmentsSelected: Yup.array().of(Yup.number()),
  byLocation: Yup.boolean(),
});

export default compose<any, Props & FormProps>(
  withFormik<Props & FormProps, FormikValues>({
    mapPropsToValues: ({
      selectedLocations,
      selectedEstablishments,
      isMultiLocalizationEnabled,
    }) => ({
      establishmentsSelected: selectedEstablishments,
      locationsSelected: selectedLocations,
      byLocation: isMultiLocalizationEnabled
        ? selectedEstablishments?.length === 0
        : false,
    }),
    validationSchema: ValidationSchema,
    enableReinitialize: true,
    handleSubmit: (
      values,
      { props: { setSelectedEstablishmentFilter }, setSubmitting },
    ) => {
      if (!values.byLocation && values.establishmentsSelected?.length !== 0) {
        setSelectedEstablishmentFilter(values.establishmentsSelected, []);
      } else if (values.byLocation && values.locationsSelected?.length !== 0) {
        setSelectedEstablishmentFilter([], values.locationsSelected);
      } else {
        setSelectedEstablishmentFilter([], []);
      }
      setSubmitting(false);
    },
  }),
)(React.memo(CoachPerformanceDateAndEstablishmentFilter));
