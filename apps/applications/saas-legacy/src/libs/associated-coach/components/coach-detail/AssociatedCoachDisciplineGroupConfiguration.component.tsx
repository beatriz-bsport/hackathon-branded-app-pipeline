import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
// @ts-expect-error
import Select, { GroupTypeBase, Styles, OptionTypeBase } from 'react-select';
import Immutable from 'seamless-immutable';

import { colors } from '@bsport/common/lib/colors.js';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Radio, RadioGroup } from '@material-ui/core';

import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
import SCTChip from '#src/libs/category/components/SCTChip.component';

import { MetaActivity } from '#src/libs/meta-activity/types';
import { SCT } from '#src/libs/category/types';
import {
  Coach,
  CoachReplacementPreferencesData,
} from '#src/libs/associated-coach/types';
import {
  DisciplineGroup,
  AssignAssociatedCoachDisciplineGroupParams,
} from '#src/libs/replacement-request/types';
import {
  Establishment,
  EstablishmentGroup,
  EstablishmentGroupSelectOption,
  EstablishmentSelectOption,
} from '#src/libs/establishment/types';
import type { Theme as CompanyTheme } from '#src/libs/theme/types';
import { EstablishmentGroupSelector } from '#src/libs/establishment/components/EstablishmentGroupSelector.component';
import { EstablishmentSelector } from '#src/libs/establishment/components/EstablishmentSelector.component';
import { MultilocationChoice } from '#src/libs/replacement-request/constants';
import { OptionCallback } from '../../../../state/types';

const DISSOCIATE_COACH_DISCIPLINE_GROUP = -8000;

type Props = {
  activityList: MetaActivity[];
  workshopList: MetaActivity[];
  categoryList: SCT[];
  establishmentList: Establishment[];
  establishmentGroupList: EstablishmentGroup[];
  disciplineGroupList: DisciplineGroup[];
  coach: Coach;
  companyTheme: CompanyTheme;
  assignDisciplineGroup: (
    params: AssignAssociatedCoachDisciplineGroupParams,
    options?: OptionCallback,
  ) => void;
  updateAssociatedCoachReplacementPreferences: (
    id: number,
    data: CoachReplacementPreferencesData,
  ) => void;
};

export const AssociatedCoachDisciplineGroupConfiguration: React.FC<Props> = ({
  activityList,
  workshopList,
  categoryList,
  establishmentList,
  establishmentGroupList,
  disciplineGroupList,
  coach,
  companyTheme,
  assignDisciplineGroup,
  updateAssociatedCoachReplacementPreferences,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  const assignDisciplineGroupHandler = useCallback(
    (associatedCoachDisciplineGroupId: number) => {
      const associatedCoachId = coach.associated_coach_id;
      assignDisciplineGroup({
        associatedCoachId,
        associatedCoachDisciplineGroupId,
      });
    },
    [assignDisciplineGroup, coach.associated_coach_id],
  );

  const [values, setValues] = useState({
    disciplineGroup: coach.discipline_group,
    activities: coach.meta_activities_taught || [],
    allActivities: coach.is_teaching_all_activities || false,
    workshops: coach.workshops_taught || [],
    allWorkshops: coach.is_teaching_all_workshops || false,
    categories: coach.categories_taught || [],
    allCategories: coach.is_teaching_all_categories || false,
    establishments: coach.discipline_group_establishments,
    establishmentGroups: coach.discipline_group_establishment_groups,
  });

  useEffect(() => {
    setValues({
      disciplineGroup: coach.discipline_group,
      activities: coach.meta_activities_taught || [],
      allActivities: coach.is_teaching_all_activities || false,
      workshops: coach.workshops_taught || [],
      allWorkshops: coach.is_teaching_all_workshops || false,
      categories: coach.categories_taught || [],
      allCategories: coach.is_teaching_all_categories || false,
      establishments: coach.discipline_group_establishments,
      establishmentGroups: coach.discipline_group_establishment_groups,
    });
  }, [coach]);

  const [multiLocationChoice, setMultiLocationChoice] = useState(
    coach.discipline_group_establishment_groups.length !== 0
      ? MultilocationChoice.Locations
      : MultilocationChoice.Establishments,
  );

  const disciplineGroupOptions = useMemo(
    () =>
      disciplineGroupList.map((dg) => ({
        value: dg.id,
        label: dg.name,
      })),
    [disciplineGroupList],
  );

  const metaActivitySelectorOptions = useMemo(
    () =>
      activityList
        ? [
            ...activityList.map((ma) => ({
              label: ma.name,
              value: ma.id,
            })),
          ]
        : [],
    [activityList],
  );

  const metaActivitySelectorValue = useMemo(
    () =>
      values.allActivities === false
        ? values.activities?.map((id) => ({
            label: activityList.find((ma) => ma.id === id)?.name,
            value: id,
          }))
        : [],
    [values.allActivities, values.activities, activityList],
  );

  const workshopSelectorOptions = useMemo(
    () =>
      workshopList
        ? [
            ...workshopList.map((w) => ({
              label: w.name,
              value: w.id,
            })),
          ]
        : [],
    [workshopList],
  );

  const workshopSelectorValue = useMemo(
    () =>
      values.allWorkshops === false
        ? values.workshops?.map((id) => ({
            label: workshopList.find((w) => w.id === id)?.name,
            value: id,
          }))
        : [],
    [values.allWorkshops, values.workshops, workshopList],
  );

  const categorySelectorOptions = useMemo(
    () =>
      categoryList
        ? [
            ...categoryList.map((category) => ({
              label: category.name,
              value: category.id,
              parentCategory: category.SCS.id,
            })),
          ]
        : [],
    [categoryList],
  );

  const categorySelectorValue = useMemo(
    () =>
      values.allCategories === false
        ? values.categories?.map((id) => ({
            label: categoryList.find((category) => category.id === id)?.name,
            value: id,
            parentCategory: categoryList.find((category) => category.id === id)
              ?.SCS.id,
          }))
        : [],
    [values.allCategories, values.categories, categoryList],
  );

  const handleChange = useCallback(
    (
      field: string,
      value: number | number[] | boolean | (string | number)[],
    ) => {
      const newValues = { ...values, [field]: value };
      setValues(newValues);
      if (field !== 'disciplineGroup') {
        updateAssociatedCoachReplacementPreferences(coach.id, {
          meta_activities_taught: newValues.activities,
          workshops_taught: newValues.workshops,
          categories_taught: newValues.categories,
          discipline_group_establishments: newValues.establishments,
          discipline_group_establishment_groups: newValues.establishmentGroups,
          is_teaching_all_activities: newValues.allActivities,
          is_teaching_all_workshops: newValues.allWorkshops,
          is_teaching_all_categories: newValues.allCategories,
        });
      }
    },
    [setValues, updateAssociatedCoachReplacementPreferences, coach.id, values],
  );

  const selectOptionEstablishments = useCallback(
    (ev: EstablishmentSelectOption[]) => {
      handleChange(
        'establishments',
        ev?.map((e) => e.value),
      );
    },
    [handleChange],
  );

  const selectOptionLocations = useCallback(
    (ev: EstablishmentGroupSelectOption[]) => {
      handleChange(
        'establishmentGroups',
        ev?.map((e) => e.value),
      );
    },
    [handleChange],
  );

  const onChangeRadioButton = useCallback(
    (_: ChangeEvent<HTMLInputElement>, value: string) => {
      clearEstablishmentSelector();
      // @ts-expect-error
      setMultiLocationChoice(value);
    },
    // @ts-expect-error
    [clearEstablishmentSelector],
  );

  const isMultiLocalizationActivated = companyTheme.enable_multi_localization;
  const multiLocalizationChoices = useMemo(
    () =>
      Immutable([
        {
          label: t('disciplineGroup.form.establishments'),
          value: MultilocationChoice.Establishments,
        },
        {
          label: t('disciplineGroup.form.locations'),
          value: MultilocationChoice.Locations,
        },
      ]),
    [t],
  );

  const clearEstablishmentSelector = useCallback(() => {
    const emptyNumbers: number[] = [];
    const newValues = {
      ...values,
      establishments: emptyNumbers,
      establishmentGroups: emptyNumbers,
    };
    setValues(newValues);
    updateAssociatedCoachReplacementPreferences(coach.id, {
      meta_activities_taught: newValues.activities,
      workshops_taught: newValues.workshops,
      categories_taught: newValues.categories,
      discipline_group_establishments: newValues.establishments,
      discipline_group_establishment_groups: newValues.establishmentGroups,
      is_teaching_all_activities: newValues.allActivities,
      is_teaching_all_workshops: newValues.allWorkshops,
      is_teaching_all_categories: newValues.allCategories,
    });
  }, [
    setValues,
    updateAssociatedCoachReplacementPreferences,
    coach.id,
    values,
  ]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">{t('coachEdit.title')}</Typography>
      </Grid>
      <Grid item className={classes.descriptionContainer} xs={12}>
        <InfoOutlinedIcon className={classes.infoIcon} />
        <Typography className={classes.description} variant="body2">
          {t('coachEdit.description')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container className={classes.row} direction="row" spacing={2}>
          <Grid item md={4} xs={12}>
            <Typography>{t('coachEdit.disciplineGroup')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Select
              closeMenuOnSelect
              isClearable
              onChange={(ev) => {
                if (!ev) {
                  // selector has been cleared
                  assignDisciplineGroupHandler(
                    DISSOCIATE_COACH_DISCIPLINE_GROUP,
                  );
                  return;
                }
                // @ts-expect-error
                assignDisciplineGroupHandler(ev.value);
              }}
              options={[...disciplineGroupOptions] || []}
              placeholder={t('coachEdit.disciplineGroup')}
              styles={selectStyles}
              value={disciplineGroupOptions.filter(
                (option) => option.value === coach.discipline_group,
              )}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button
          color="secondary"
          disabled={!values.disciplineGroup}
          onClick={() =>
            assignDisciplineGroupHandler(DISSOCIATE_COACH_DISCIPLINE_GROUP)
          }
          variant="outlined"
        >
          {t('coachEdit.customRules')}
        </Button>
      </Grid>
      <Grid item className={classes.groupTypes} xs={12}>
        <Typography variant="h6">
          {t('disciplineGroup.form.groupTypes')}
        </Typography>
      </Grid>
      <Grid
        container
        item
        alignItems="center"
        direction="row"
        spacing={1}
        xs={12}
      >
        <Grid item className={classes.label} md={2} xs={12}>
          <Typography variant="body1">{t('coachEdit.activities')}</Typography>
        </Grid>
        <Grid item xs={8}>
          <MaterialUISelector
            isMenuListVirtualized
            isMulti
            defaultNumberShown={3}
            isDisabled={values.allActivities || !!values.disciplineGroup}
            onChange={(ev: OptionTypeBase[]) => {
              handleChange(
                'activities',
                ev?.map((e) => e.value),
              );
            }}
            options={metaActivitySelectorOptions}
            placeholder={t('coachEdit.pickActivity')}
            value={metaActivitySelectorValue}
          />
        </Grid>
      </Grid>
      <Grid item className={classes.checkboxes} xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={values.allActivities}
              disabled={!!values.disciplineGroup}
              onChange={(_ev, checked) => {
                handleChange('allActivities', checked);
              }}
            />
          }
          label={t('coachEdit.allActivities')}
        />
      </Grid>
      <Grid
        container
        item
        alignItems="center"
        direction="row"
        spacing={1}
        xs={12}
      >
        <Grid item className={classes.label} md={2} xs={12}>
          <Typography variant="body1">{t('coachEdit.workshops')}</Typography>
        </Grid>
        <Grid item xs={8}>
          <MaterialUISelector
            isMenuListVirtualized
            isMulti
            defaultNumberShown={3}
            isDisabled={values.allWorkshops || !!values.disciplineGroup}
            onChange={(ev: OptionTypeBase[]) => {
              handleChange(
                'workshops',
                ev?.map((e) => e.value),
              );
            }}
            options={workshopSelectorOptions}
            placeholder={t('coachEdit.pickWorkshop')}
            value={workshopSelectorValue}
          />
        </Grid>
      </Grid>
      <Grid item className={classes.checkboxes} xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={values.allWorkshops}
              disabled={!!values.disciplineGroup}
              onChange={(_ev, checked) => {
                handleChange('allWorkshops', checked);
              }}
            />
          }
          label={t('coachEdit.allWorkshops')}
        />
      </Grid>
      <Grid
        container
        item
        alignItems="center"
        direction="row"
        spacing={1}
        xs={12}
      >
        <Grid item className={classes.label} md={2} xs={12}>
          <Typography variant="body1">{t('coachEdit.categories')}</Typography>
        </Grid>
        <Grid item xs={8}>
          <MaterialUISelector
            isMenuListVirtualized
            isMulti
            chipsRenderer={(chipProps: {
              data: {
                label: string;
                value: number;
                parentCategory: number;
              };
              onDelete: () => void;
            }) => (
              <SCTChip
                onDelete={chipProps.onDelete}
                parentCategory={chipProps.data.parentCategory}
                SCTName={chipProps.data.label}
              />
            )}
            defaultNumberShown={3}
            isDisabled={values.allCategories || !!values.disciplineGroup}
            onChange={(ev: OptionTypeBase[]) => {
              handleChange(
                'categories',
                ev?.map((e) => e.value),
              );
            }}
            options={categorySelectorOptions}
            placeholder={t('coachEdit.pickCategory')}
            value={categorySelectorValue}
          />
        </Grid>
      </Grid>
      <Grid item className={classes.checkboxes} xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={values.allCategories}
              disabled={!!values.disciplineGroup}
              onChange={(_ev, checked) => {
                handleChange('allCategories', checked);
              }}
            />
          }
          label={t('coachEdit.allCategories')}
        />
      </Grid>
      <Grid
        container
        item
        alignItems="center"
        direction="row"
        spacing={2}
        xs={12}
      >
        <Grid item xs={12}>
          <Typography variant="h6">
            {t('disciplineGroup.form.establishments')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {isMultiLocalizationActivated && (
            <RadioGroup
              name="multilocationRadioGroup"
              onChange={onChangeRadioButton}
              value={multiLocationChoice}
            >
              {multiLocalizationChoices.map(({ value, label: l }) => (
                <div key={value}>
                  <FormControlLabel
                    key={value}
                    control={<Radio />}
                    disabled={!!values.disciplineGroup}
                    label={l}
                    value={value}
                  />
                </div>
              ))}
            </RadioGroup>
          )}
          <div className={classes.establishmentSeletor}>
            {multiLocationChoice === MultilocationChoice.Locations ? (
              // @ts-expect-error
              <EstablishmentGroupSelector
                isClearable
                disabled={!!values.disciplineGroup}
                establishmentGroups={establishmentGroupList}
                placeholder={t('disciplineGroup.form.pickEstablishment')}
                selectedEstablishmentGroups={values.establishmentGroups}
                selectOption={selectOptionLocations}
              />
            ) : (
              // @ts-expect-error
              <EstablishmentSelector
                isClearable
                disabled={!!values.disciplineGroup}
                establishments={establishmentList}
                placeholder={t('disciplineGroup.form.pickEstablishment')}
                selectedEstablishments={values.establishments}
                selectOption={selectOptionEstablishments}
              />
            )}
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  row: {
    alignItems: 'center',
  },
  checkboxes: {
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
  },
  descriptionContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: `0 ${theme.spacing(4)}px`,
    },
  },
  description: {
    color: chroma(theme.palette.info.dark).darken(1.5).hex(),
  },
  infoIcon: {
    color: theme.palette.info.main,
    marginRight: theme.spacing(1),
  },
  label: {
    [theme.breakpoints.up('md')]: { marginRight: theme.spacing(2) },
  },
  groupTypes: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  establishmentSeletor: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
}));

const selectStyles: Partial<
  Styles<
    {
      value: number;
      label: any;
    },
    boolean,
    GroupTypeBase<{
      value: number;
      label: any;
    }>
  >
> = {
  // @ts-expect-error
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  // @ts-expect-error
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  // @ts-expect-error
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    const colorChroma = chroma(colors.secondary);

    let backgroundColor;
    let color;

    if (isDisabled) {
      backgroundColor = null;
    } else if (isSelected) {
      backgroundColor = colors.secondary;
    } else if (isFocused) {
      backgroundColor = colorChroma.alpha(0.1).css();
    } else {
      backgroundColor = null;
    }

    if (isDisabled) {
      color = '#ccc';
    } else if (isSelected) {
      if (chroma.contrast(colorChroma, 'white') > 2) {
        color = 'white';
      } else {
        color = 'black';
      }
    } else {
      color = colors.secondary;
    }

    /* eslint-disable */
    return {
      ...styles,
      backgroundColor,
      color,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor:
          !isDisabled &&
          (isSelected ? colors.secondary : colorChroma.alpha(0.3).css()),
      },
    };
    /* eslint-enable */
  },
  // @ts-expect-error
  multiValue: (styles) => {
    const color = chroma(colors.secondary);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  // @ts-expect-error
  multiValueLabel: (styles) => ({
    ...styles,
    color: colors.secondary,
  }),
  // @ts-expect-error
  multiValueRemove: (styles) => ({
    ...styles,
    color: colors.secondary,
    ':hover': {
      backgroundColor: colors.secondary,
      color: 'white',
    },
  }),
};

export default AssociatedCoachDisciplineGroupConfiguration;
