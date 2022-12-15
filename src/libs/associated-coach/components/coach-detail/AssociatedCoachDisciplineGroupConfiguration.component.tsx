import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import Select, { GroupTypeBase, Styles, OptionTypeBase } from 'react-select';

import { colors } from '@bsport/common/lib/colors';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import makeStyles from '@material-ui/core/styles/makeStyles';

import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import SCTChip from '#libs/category/components/SCTChip.component';

import { MetaActivity } from '#libs/meta-activity/types';
import { SCT } from '#libs/category/types';
import {
  Coach,
  CoachReplacementPreferencesData,
} from '#libs/associated-coach/types';
import {
  DisciplineGroup,
  AssignAssociatedCoachDisciplineGroupParams,
} from '#libs/replacement-request/types';
import { OptionCallback } from '../../../../state/types';

const DISSOCIATE_COACH_DISCIPLINE_GROUP = -8000;

type Props = {
  activityList: MetaActivity[];
  workshopList: MetaActivity[];
  categoryList: SCT[];
  disciplineGroupList: DisciplineGroup[];
  coach: Coach;
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
  disciplineGroupList,
  coach,
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
    });
  }, [coach]);

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
    (field: string, value: number | number[] | boolean) => {
      const newValues = { ...values, [field]: value };
      setValues(newValues);
      if (field !== 'disciplineGroup') {
        updateAssociatedCoachReplacementPreferences(coach.id, {
          meta_activities_taught: newValues.activities,
          workshops_taught: newValues.workshops,
          categories_taught: newValues.categories,
          is_teaching_all_activities: newValues.allActivities,
          is_teaching_all_workshops: newValues.allWorkshops,
          is_teaching_all_categories: newValues.allCategories,
        });
      }
    },
    [setValues, updateAssociatedCoachReplacementPreferences, coach.id, values],
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">{t('coachEdit.title')}</Typography>
      </Grid>
      <Grid item xs={12} className={classes.descriptionContainer}>
        <InfoOutlinedIcon className={classes.infoIcon} />
        <Typography className={classes.description} variant="body2">
          {t('coachEdit.description')}
        </Typography>
      </Grid>
      <Grid item xs={10}>
        <Grid container direction="row" spacing={2} className={classes.row}>
          <Grid item xs={4}>
            <Typography>{t('coachEdit.disciplineGroup')}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Select
              closeMenuOnSelect
              isClearable
              placeholder={t('coachEdit.disciplineGroup')}
              options={[...disciplineGroupOptions] || []}
              value={disciplineGroupOptions.filter(
                (option) => option.value === coach.discipline_group,
              )}
              onChange={(ev) => {
                if (!ev) {
                  // selector has been cleared
                  assignDisciplineGroupHandler(
                    DISSOCIATE_COACH_DISCIPLINE_GROUP,
                  );
                  return;
                }
                assignDisciplineGroupHandler(ev.value);
              }}
              styles={selectStyles}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() =>
            assignDisciplineGroupHandler(DISSOCIATE_COACH_DISCIPLINE_GROUP)
          }
          disabled={!values.disciplineGroup}
        >
          {t('coachEdit.customRules')}
        </Button>
      </Grid>
      <Grid item container xs={12} direction="row" alignItems="center">
        <Grid item xs={2}>
          <Typography variant="body1">{t('coachEdit.activities')}</Typography>
        </Grid>
        <Grid item xs={10}>
          <MaterialUISelector
            isDisabled={values.allActivities || !!values.disciplineGroup}
            options={metaActivitySelectorOptions}
            isMulti
            defaultNumberShown={3}
            isMenuListVirtualized
            value={metaActivitySelectorValue}
            onChange={(ev: OptionTypeBase[]) => {
              handleChange(
                'activities',
                ev?.map((e) => e.value),
              );
            }}
            placeholder={t('coachEdit.pickActivity')}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.checkboxes}>
        <FormControlLabel
          control={
            <Checkbox
              disabled={!!values.disciplineGroup}
              onChange={(_ev, checked) => {
                handleChange('allActivities', checked);
              }}
              checked={values.allActivities}
            />
          }
          label={t('coachEdit.allActivities')}
        />
      </Grid>
      <Grid item container xs={12} direction="row" alignItems="center">
        <Grid item xs={2}>
          <Typography variant="body1">{t('coachEdit.workshops')}</Typography>
        </Grid>
        <Grid item xs={10}>
          <MaterialUISelector
            isDisabled={values.allWorkshops || !!values.disciplineGroup}
            options={workshopSelectorOptions}
            isMulti
            defaultNumberShown={3}
            isMenuListVirtualized
            value={workshopSelectorValue}
            onChange={(ev: OptionTypeBase[]) => {
              handleChange(
                'workshops',
                ev?.map((e) => e.value),
              );
            }}
            placeholder={t('coachEdit.pickWorkshop')}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.checkboxes}>
        <FormControlLabel
          control={
            <Checkbox
              disabled={!!values.disciplineGroup}
              onChange={(_ev, checked) => {
                handleChange('allWorkshops', checked);
              }}
              checked={values.allWorkshops}
            />
          }
          label={t('coachEdit.allWorkshops')}
        />
      </Grid>
      <Grid item container xs={12} direction="row" alignItems="center">
        <Grid item xs={2}>
          <Typography variant="body1">{t('coachEdit.categories')}</Typography>
        </Grid>
        <Grid item xs={10}>
          <MaterialUISelector
            isDisabled={values.allCategories || !!values.disciplineGroup}
            options={categorySelectorOptions}
            isMulti
            defaultNumberShown={3}
            isMenuListVirtualized
            chipsRenderer={(chipProps: {
              data: {
                label: string;
                value: number;
                parentCategory: number;
              };
              onDelete: () => void;
            }) => (
              <SCTChip
                parentCategory={chipProps.data.parentCategory}
                SCTName={chipProps.data.label}
                onDelete={chipProps.onDelete}
              />
            )}
            value={categorySelectorValue}
            onChange={(ev: OptionTypeBase[]) => {
              handleChange(
                'categories',
                ev?.map((e) => e.value),
              );
            }}
            placeholder={t('coachEdit.pickCategory')}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.checkboxes}>
        <FormControlLabel
          control={
            <Checkbox
              disabled={!!values.disciplineGroup}
              onChange={(_ev, checked) => {
                handleChange('allCategories', checked);
              }}
              checked={values.allCategories}
            />
          }
          label={t('coachEdit.allCategories')}
        />
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
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
  multiValue: (styles) => {
    const color = chroma(colors.secondary);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: colors.secondary,
  }),
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
