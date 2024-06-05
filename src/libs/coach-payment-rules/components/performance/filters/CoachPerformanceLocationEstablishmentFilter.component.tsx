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
import { MaterialUiMultiSelectorField } from '#src/libs/custom-form/components/GenericFormik.input';

type Option = {
  value: number;
  label: string;
}[];

type Props = {
  isMultiLocalizationEnabled: boolean;
  areFiltersDisabled?: boolean;
  establishmentsOptions: Option;
  locationsOptions: Option;
  establishmentsLoading: boolean;
  establishmentGroupListLoading: boolean;
};

type Values = {
  byLocation: boolean;
  locationsSelected: number[];
  establishmentsSelected: number[];
};

const CoachPerformanceLocationEstablishmentFilter: React.FC<Props> = ({
  isMultiLocalizationEnabled,
  areFiltersDisabled,
  establishmentsOptions,
  locationsOptions,
  establishmentsLoading,
  establishmentGroupListLoading,
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
              <MaterialUiMultiSelectorField
                isMenuListVirtualized
                isDisabled={areFiltersDisabled}
                name="locationsSelected"
                options={locationsOptions}
                placeholder={t('coachPerformance:form.ifEmptyAllowAll')}
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
            <MaterialUiMultiSelectorField
              isMenuListVirtualized
              isDisabled={areFiltersDisabled}
              name="establishmentsSelected"
              options={establishmentsOptions}
              placeholder={t('coachPerformance:form.ifEmptyAllowAll')}
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
