import React from 'react';

import { useFormikContext } from 'formik';

import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { useTranslation } from 'react-i18next';
import { ObjectSearchField } from '#src/libs/custom-form/components/GenericFormik.input';

import type { AllOrNothing } from '#src/libs/types';
import type { CoachProfilePerformanceFilterParams } from '#src/libs/associated-coach/types';

type Props = {
  isMultiLocalizationEnabled: boolean;
  areFiltersDisabled?: boolean;
  establishmentsLoading: boolean;
  establishmentGroupListLoading: boolean;
  isCoachSpace?: boolean;
} & AllOrNothing<CoachProfilePerformanceFilterParams>;

type Values = {
  byLocation: boolean;
  locationsSelected: number[];
  establishmentsSelected: number[];
};

const CoachPerformanceLocationEstablishmentFilter: React.FC<Props> = ({
  isMultiLocalizationEnabled,
  areFiltersDisabled,
  establishmentsLoading,
  establishmentGroupListLoading,
  isCoachSpace,
  companyId,
}) => {
  const { t } = useTranslation('coachPerformance');
  const classes = useStyles();

  const { setFieldValue, values } = useFormikContext<Values>();
  const handleLocationRadioFilter = React.useCallback(
    (value: boolean) => () => {
      setFieldValue('byLocation', value);
    },
    [setFieldValue],
  );

  return (
    <>
      <RadioGroup
        row
        className={classes.radioGroup}
        name="byLocation"
        value={values.byLocation}
      >
        {isMultiLocalizationEnabled && (
          <FormControlLabel
            control={
              <Radio
                checked={values.byLocation}
                onClick={handleLocationRadioFilter(true)}
              />
            }
            label={t('coachPerformance:advancedFilters.locations')}
          />
        )}
        <FormControlLabel
          control={
            <Radio
              checked={isMultiLocalizationEnabled ? !values.byLocation : true}
              onClick={handleLocationRadioFilter(false)}
            />
          }
          label={t('coachPerformance:advancedFilters.establishments')}
        />
      </RadioGroup>

      {isMultiLocalizationEnabled && (
        <Collapse in={values.byLocation}>
          <div className={classes.select}>
            <Typography variant="subtitle1">
              {t('coachPerformance:advancedFilters.locations')}
            </Typography>
            {establishmentGroupListLoading ? (
              <CircularProgress />
            ) : (
              <ObjectSearchField
                isMulti
                additionalParams={
                  isCoachSpace && companyId ? { companyId } : undefined
                }
                isDisabled={areFiltersDisabled}
                name="locationsSelected"
                placeholder={t('coachPerformance:form.ifEmptyAllowAll')}
                searchedObjectType="establishment_group"
                variant="mui-selector"
              />
            )}
          </div>
        </Collapse>
      )}
      <Collapse in={!values.byLocation}>
        <div className={classes.select}>
          <Typography variant="subtitle1">
            {t('coachPerformance:advancedFilters.establishments')}
          </Typography>
          {establishmentsLoading ? (
            <CircularProgress />
          ) : (
            <ObjectSearchField
              isMulti
              additionalParams={
                isCoachSpace && companyId ? { company: companyId } : undefined
              }
              isDisabled={areFiltersDisabled}
              name="establishmentsSelected"
              placeholder={t('coachPerformance:form.ifEmptyAllowAll')}
              searchedObjectType="establishment"
              variant="mui-selector"
            />
          )}
        </div>
      </Collapse>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  select: { flex: '1 0', minWidth: '240px' },
  radioGroup: { paddingBottom: theme.spacing(2) },
}));

export default React.memo(CoachPerformanceLocationEstablishmentFilter);
