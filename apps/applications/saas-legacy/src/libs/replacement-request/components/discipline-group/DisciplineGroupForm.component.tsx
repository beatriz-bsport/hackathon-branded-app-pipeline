import React, { useMemo, useEffect, useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikProps, FieldArray } from 'formik';
import * as Yup from 'yup';
import Immutable from 'seamless-immutable';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import WarningIcon from '@material-ui/icons/Warning';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';

import {
  TextFieldEnhancedLabelWithError,
  CheckboxField,
  Actions,
  Submit,
  // @ts-expect-error
} from '#src/components/forms';
import CoachListItem from '#src/libs/associated-coach/components/CoachListItem.component';
import CoachSelector from '#src/libs/associated-coach/components/coach-selector/CoachSelector.component';
import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
import SCTChip from '#src/libs/category/components/SCTChip.component';

import { DisciplineGroupAPIData } from '#src/libs/replacement-request/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { SCT } from '#src/libs/category/types';
import { Coach } from '#src/libs/associated-coach/types';

import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { EstablishmentSelector } from '#src/libs/establishment/components/EstablishmentSelector.component';
import { EstablishmentGroupSelector } from '#src/libs/establishment/components/EstablishmentGroupSelector.component';
import {
  Establishment,
  EstablishmentGroup,
  EstablishmentSelectOption,
  EstablishmentGroupSelectOption,
} from '#src/libs/establishment/types';
import type { Theme as CompanyTheme } from '#src/libs/theme/types';
import { MultilocationChoice } from '#src/libs/replacement-request/constants';
import { OptionCallback } from '../../../../state/types';

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.DisciplineGroup,
);

type Props = {
  initial?: DisciplineGroupAPIData;
  onSubmit: (
    data: Omit<DisciplineGroupAPIData, 'company'>,
    options?: OptionCallback<DisciplineGroupAPIData>,
  ) => void;
  handleClose: () => void;
  activityList: MetaActivity[];
  workshopList: MetaActivity[];
  categoryList: SCT[];
  coachList: Coach[];
  establishmentList: Establishment[];
  establishmentGroupList: EstablishmentGroup[];
  companyTheme: CompanyTheme;
};

export const DisciplineGroupForm: React.FC<Props> = ({
  initial,
  onSubmit,
  handleClose,
  activityList,
  workshopList,
  categoryList,
  coachList,
  establishmentList,
  establishmentGroupList,
  companyTheme,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  useEffect(() => {
    // @ts-expect-error
    trackFormAdd(initial?.id);
  }, [initial]);

  const choicesForCoachSelector = useMemo(
    () => coachList.filter((coach) => !coach.discipline_group),
    [coachList],
  );

  const activityValuesList = useMemo(
    () =>
      [
        ...activityList?.map((ma) => ({
          label: ma.name,
          value: ma.id,
        })),
      ] || [],
    [activityList],
  );

  const workshopValuesList = useMemo(
    () =>
      [
        ...workshopList?.map((w) => ({
          label: w.name,
          value: w.id,
        })),
      ] || [],
    [workshopList],
  );

  const categoryValuesList = useMemo(
    () =>
      [
        ...categoryList?.map((category) => ({
          label: category.name,
          value: category.id,
          parentCategory: category.SCS.id,
        })),
      ] || [],
    [categoryList],
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

  const [multiLocationChoice, setMultiLocationChoice] = useState(
    initial && initial.establishment_groups?.length !== 0
      ? MultilocationChoice.Locations
      : MultilocationChoice.Establishments,
  );

  return (
    <Formik
      initialValues={
        initial || {
          name: '',
          meta_activities: [],
          all_activities: false,
          workshops: [],
          all_workshops: false,
          categories: [],
          all_categories: false,
          associated_coaches: [],
          establishments: [],
          establishment_groups: [],
        }
      }
      onSubmit={(values, actions) => {
        const valuesToSubmit: Omit<DisciplineGroupAPIData, 'company'> = {
          ...values,
        };
        if (values.all_activities) {
          valuesToSubmit.meta_activities = [];
        }
        if (values.all_workshops) {
          valuesToSubmit.workshops = [];
        }
        if (values.all_categories) {
          valuesToSubmit.categories = [];
        }

        // @ts-expect-error
        trackFormSubmitIntent(valuesToSubmit.id);

        onSubmit(valuesToSubmit, {
          onSuccess: () => {
            actions.setSubmitting(false);
            // @ts-expect-error
            trackFormSuccess(valuesToSubmit.id);
            handleClose();
          },
          onError: () => {
            actions.setSubmitting(false);
          },
        });
      }}
      validationSchema={disciplineGroupSchema}
    >
      {({
        isSubmitting,
        setFieldValue,
        values,
        errors,
      }: FormikProps<DisciplineGroupAPIData>) => {
        const onChangeRadioButton = (
          _: ChangeEvent<HTMLInputElement>,
          value: string,
        ) => {
          // @ts-expect-error
          setMultiLocationChoice(value);
          setFieldValue('establishments', []);
          setFieldValue('establishment_groups', []);
        };
        const selectOptionEstablishments = (
          list: EstablishmentSelectOption[],
        ) => {
          if (!list) {
            setFieldValue('establishments', []);
          } else {
            setFieldValue(
              'establishments',
              list.map((s) => s.value),
            );
          }
        };
        const selectOptionLocations = (
          list: EstablishmentGroupSelectOption[],
        ) => {
          if (!list) {
            setFieldValue('establishment_groups', []);
          } else {
            setFieldValue(
              'establishment_groups',
              list.map((s) => s.value),
            );
          }
        };
        return (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextFieldEnhancedLabelWithError
                  fullWidth
                  required
                  helperText={t('disciplineGroup.form.nameHelperText')}
                  id="textfield_discipline_group_title"
                  label={t('disciplineGroup.form.name')}
                  name="name"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">
                  {t('disciplineGroup.form.groupTypes')}
                </Typography>
              </Grid>
              <Grid container item alignItems="center" direction="row" xs={12}>
                <Grid item xs={2}>
                  <Typography variant="body1">
                    {t('disciplineGroup.form.activities')}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <FieldArray name="meta_activities">
                    {({
                      form: {
                        values: { meta_activities, all_activities },
                      },
                    }) => (
                      <div>
                        <MaterialUISelector
                          isMenuListVirtualized
                          isMulti
                          defaultNumberShown={3}
                          isDisabled={all_activities}
                          onChange={(ev: Array<{ value: number }>) =>
                            setFieldValue(
                              'meta_activities',
                              ev?.map((e) => e.value),
                            )
                          }
                          options={activityValuesList}
                          placeholder={t('disciplineGroup.form.pickActivity')}
                          value={
                            all_activities === false
                              ? // @ts-expect-error
                                meta_activities?.map((id) => ({
                                  label: activityList.find((ma) => ma.id === id)
                                    ?.name,
                                  value: id,
                                }))
                              : []
                          }
                        />
                      </div>
                    )}
                  </FieldArray>
                </Grid>
              </Grid>
              <Grid item className={classes.checkboxes} xs={12}>
                <CheckboxField
                  fullWidth
                  id="checkboxfield_discipline_group_all_activities"
                  label={t('disciplineGroup.form.allActivities')}
                  name="all_activities"
                />
              </Grid>
              <Grid container item alignItems="center" direction="row" xs={12}>
                <Grid item xs={2}>
                  <Typography variant="body1">
                    {t('disciplineGroup.form.workshops')}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <FieldArray name="workshops">
                    {({
                      form: {
                        values: { workshops, all_workshops },
                      },
                    }) => (
                      <div>
                        <MaterialUISelector
                          isMenuListVirtualized
                          isMulti
                          defaultNumberShown={3}
                          isDisabled={all_workshops}
                          onChange={(ev: Array<{ value: number }>) =>
                            setFieldValue(
                              'workshops',
                              ev?.map((e) => e.value),
                            )
                          }
                          options={workshopValuesList}
                          placeholder={t('disciplineGroup.form.pickWorkshop')}
                          value={
                            all_workshops === false
                              ? // @ts-expect-error
                                workshops?.map((id) => ({
                                  label: workshopList.find((w) => w.id === id)
                                    ?.name,
                                  value: id,
                                }))
                              : []
                          }
                        />
                      </div>
                    )}
                  </FieldArray>
                </Grid>
              </Grid>
              <Grid item className={classes.checkboxes} xs={12}>
                <CheckboxField
                  fullWidth
                  id="checkboxfield_discipline_group_all_workshops"
                  label={t('disciplineGroup.form.allWorkshops')}
                  name="all_workshops"
                />
              </Grid>
              <Grid container item alignItems="center" direction="row" xs={12}>
                <Grid item xs={2}>
                  <Typography variant="body1">
                    {t('disciplineGroup.form.categories')}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <FieldArray name="categories">
                    {({
                      form: {
                        values: { categories, all_categories },
                      },
                    }) => (
                      <div>
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
                          isDisabled={all_categories}
                          onChange={(ev: Array<{ value: number }>) =>
                            setFieldValue(
                              'categories',
                              ev?.map((e) => e.value),
                            )
                          }
                          options={categoryValuesList}
                          placeholder={t('disciplineGroup.form.pickCategory')}
                          value={
                            all_categories === false
                              ? // @ts-expect-error
                                categories?.map((id) => ({
                                  label: categoryList.find(
                                    (sct) => sct.id === id,
                                  )?.name,
                                  value: id,
                                  parentCategory: categoryList.find(
                                    (sct) => sct.id === id,
                                  )?.SCS.id,
                                }))
                              : []
                          }
                        />
                      </div>
                    )}
                  </FieldArray>
                </Grid>
              </Grid>
              <Grid item className={classes.checkboxes} xs={12}>
                <CheckboxField
                  fullWidth
                  id="checkboxfield_discipline_group_all_categories"
                  label={t('disciplineGroup.form.allCategories')}
                  name="all_categories"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">
                  {t('disciplineGroup.form.establishments')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FieldArray name="establishments">
                  {({
                    form: {
                      values: { establishments, establishment_groups },
                    },
                  }) => (
                    <div>
                      {isMultiLocalizationActivated && (
                        <div className={classes.radioButtons}>
                          <RadioGroup
                            name="multilocationRadioGroup"
                            onChange={onChangeRadioButton}
                            value={multiLocationChoice}
                          >
                            {multiLocalizationChoices.map(
                              ({ value, label: l }) => (
                                <div key={value}>
                                  <FormControlLabel
                                    key={value}
                                    control={<Radio />}
                                    label={l}
                                    value={value}
                                  />
                                </div>
                              ),
                            )}
                          </RadioGroup>
                        </div>
                      )}
                      {multiLocationChoice === MultilocationChoice.Locations ? (
                        // @ts-expect-error
                        <EstablishmentGroupSelector
                          isClearable
                          establishmentGroups={establishmentGroupList}
                          placeholder={t(
                            'disciplineGroup.form.pickEstablishment',
                          )}
                          selectedEstablishmentGroups={establishment_groups}
                          selectOption={selectOptionLocations}
                        />
                      ) : (
                        // @ts-expect-error
                        <EstablishmentSelector
                          isClearable
                          establishments={establishmentList}
                          placeholder={t(
                            'disciplineGroup.form.pickEstablishment',
                          )}
                          selectedEstablishments={establishments}
                          selectOption={selectOptionEstablishments}
                        />
                      )}
                    </div>
                  )}
                </FieldArray>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">
                  {t('disciplineGroup.form.coaches')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FieldArray name="associated_coaches">
                  {({
                    push,
                    remove,
                    form: {
                      values: { associated_coaches },
                    },
                  }) => (
                    <div>
                      <CoachSelector
                        associatedCoachOutput
                        closeMenuOnSelect
                        // @ts-expect-error
                        nullCurrentValue
                        coaches={[
                          ...choicesForCoachSelector.filter(
                            (c) => !associated_coaches.includes(c.id),
                          ),
                        ]}
                        selectedCoaches={associated_coaches}
                        selectOption={(ev: Array<{ value: number }>) => {
                          if (ev.length) push(ev[0].value);
                        }}
                      />
                      {errors.associated_coaches ? (
                        <div className={classes.row}>
                          <WarningIcon
                            className={classes.leftIcon}
                            color="error"
                          />
                          <Typography>
                            {t('disciplineGroup.form.coachRequired')}
                          </Typography>
                        </div>
                      ) : (
                        <div className={classes.coachesContainer}>
                          {associated_coaches.map((id: number, i: number) => (
                            <CoachListItem
                              key={`${id}-${i}`}
                              divider
                              coach={coachList.find(
                                (c) => c.associated_coach_id === id,
                              )}
                              deleteCoach={() => remove(i)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </FieldArray>
              </Grid>
            </Grid>
            <Actions>
              <Button
                onClick={() => {
                  handleClose();
                  // @ts-expect-error
                  initial?.id ? trackFormCancel(initial.id) : trackFormCancel();
                }}
              >
                {t('disciplineGroup.form.close')}
              </Button>
              <Submit
                color="primary"
                disabled={
                  isSubmitting ||
                  values.associated_coaches.length === 0 ||
                  values.name === '' ||
                  (!values.all_activities &&
                    !values.all_workshops &&
                    !values.all_categories &&
                    values.meta_activities.length +
                      values.workshops.length +
                      values.categories.length ===
                      0)
                }
              >
                {t('disciplineGroup.form.submit')}
              </Submit>
            </Actions>
            {values.associated_coaches.length === 0 && (
              <div className={classes.bottomMargin} />
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

const useStyles = makeStyles((theme) => ({
  coachesContainer: {
    marginTop: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  checkboxes: {
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
  },
  radioButtons: {
    marginBottom: theme.spacing(1),
  },
  bottomMargin: {
    marginBottom: theme.spacing(10),
  },
}));

export default DisciplineGroupForm;

const disciplineGroupSchema = Yup.object()
  .shape({
    name: Yup.string().required('replacement:disciplineGroup.form.required'),
    meta_activities: Yup.array().of(Yup.number()),
    all_activities: Yup.boolean(),
    workshops: Yup.array().of(Yup.number()),
    all_workshops: Yup.boolean(),
    categories: Yup.array().of(Yup.number()),
    all_categories: Yup.boolean(),
    establishments: Yup.array().of(Yup.number()),
    establishment_groups: Yup.array().of(Yup.number()),
    associated_coaches: Yup.array().of(Yup.number()).min(1).required(),
  })
  .test(
    'establishments-and-locations-both-set',
    'replacement:disciplineGroup.form.establishmentSelectorError',
    (discipline_group) => {
      const establishmentsAreSet = discipline_group.establishments.length > 0;
      const establishmentGroupsAreSet =
        discipline_group.establishment_groups.length > 0;
      return !(establishmentsAreSet && establishmentGroupsAreSet);
    },
  );
