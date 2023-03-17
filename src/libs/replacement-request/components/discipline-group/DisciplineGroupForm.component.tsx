import React, { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikProps, FieldArray } from 'formik';
import * as Yup from 'yup';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import WarningIcon from '@material-ui/icons/Warning';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';

import {
  TextFieldEnhancedLabelWithError,
  CheckboxField,
  Actions,
  Submit,
} from '#components/forms';
import CoachListItem from '#libs/associated-coach/components/CoachListItem.component';
import CoachSelector from '#libs/associated-coach/components/coach-selector/CoachSelector.component';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import SCTChip from '#libs/category/components/SCTChip.component';

import { OptionCallback } from '../../../../state/types';
import { DisciplineGroupAPIData } from '#libs/replacement-request/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { SCT } from '#libs/category/types';
import { Coach } from '#libs/associated-coach/types';

import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

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
};

export const DisciplineGroupForm: React.FC<Props> = ({
  initial,
  onSubmit,
  handleClose,
  activityList,
  workshopList,
  categoryList,
  coachList,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  useEffect(() => {
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

  return (
    <Formik
      validationSchema={disciplineGroupSchema}
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

        trackFormSubmitIntent(valuesToSubmit.id);

        onSubmit(valuesToSubmit, {
          onSuccess: () => {
            actions.setSubmitting(false);
            trackFormSuccess(valuesToSubmit.id);
            handleClose();
          },
          onError: () => {
            actions.setSubmitting(false);
          },
        });
      }}
    >
      {({
        isSubmitting,
        setFieldValue,
        values,
        errors,
      }: FormikProps<DisciplineGroupAPIData>) => {
        return (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextFieldEnhancedLabelWithError
                  id="textfield_discipline_group_title"
                  fullWidth
                  name="name"
                  required
                  label={t('disciplineGroup.form.name')}
                  helperText={t('disciplineGroup.form.nameHelperText')}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">
                  {t('disciplineGroup.form.groupTypes')}
                </Typography>
              </Grid>
              <Grid item container xs={12} direction="row" alignItems="center">
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
                          isDisabled={all_activities}
                          options={activityValuesList}
                          isMulti
                          defaultNumberShown={3}
                          isMenuListVirtualized
                          value={
                            all_activities === false
                              ? meta_activities?.map((id) => ({
                                  label: activityList.find((ma) => ma.id === id)
                                    ?.name,
                                  value: id,
                                }))
                              : []
                          }
                          onChange={(ev: Array<{ value: number }>) =>
                            setFieldValue(
                              'meta_activities',
                              ev?.map((e) => e.value),
                            )
                          }
                          placeholder={t('disciplineGroup.form.pickActivity')}
                        />
                      </div>
                    )}
                  </FieldArray>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.checkboxes}>
                <CheckboxField
                  id="checkboxfield_discipline_group_all_activities"
                  fullWidth
                  name="all_activities"
                  label={t('disciplineGroup.form.allActivities')}
                />
              </Grid>
              <Grid item container xs={12} direction="row" alignItems="center">
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
                          isDisabled={all_workshops}
                          options={workshopValuesList}
                          isMulti
                          defaultNumberShown={3}
                          isMenuListVirtualized
                          value={
                            all_workshops === false
                              ? workshops?.map((id) => ({
                                  label: workshopList.find((w) => w.id === id)
                                    ?.name,
                                  value: id,
                                }))
                              : []
                          }
                          onChange={(ev: Array<{ value: number }>) =>
                            setFieldValue(
                              'workshops',
                              ev?.map((e) => e.value),
                            )
                          }
                          placeholder={t('disciplineGroup.form.pickWorkshop')}
                        />
                      </div>
                    )}
                  </FieldArray>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.checkboxes}>
                <CheckboxField
                  id="checkboxfield_discipline_group_all_workshops"
                  fullWidth
                  name="all_workshops"
                  label={t('disciplineGroup.form.allWorkshops')}
                />
              </Grid>
              <Grid item container xs={12} direction="row" alignItems="center">
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
                          isDisabled={all_categories}
                          options={categoryValuesList}
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
                          value={
                            all_categories === false
                              ? categories?.map((id) => ({
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
                          onChange={(ev: Array<{ value: number }>) =>
                            setFieldValue(
                              'categories',
                              ev?.map((e) => e.value),
                            )
                          }
                          placeholder={t('disciplineGroup.form.pickCategory')}
                        />
                      </div>
                    )}
                  </FieldArray>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.checkboxes}>
                <CheckboxField
                  id="checkboxfield_discipline_group_all_categories"
                  fullWidth
                  name="all_categories"
                  label={t('disciplineGroup.form.allCategories')}
                />
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
                        coaches={[
                          ...choicesForCoachSelector.filter(
                            (c) => !associated_coaches.includes(c.id),
                          ),
                        ]}
                        closeMenuOnSelect
                        nullCurrentValue
                        associatedCoachOutput
                        selectedCoaches={associated_coaches}
                        selectOption={(ev: Array<{ value: number }>) => {
                          if (ev.length) push(ev[0].value);
                        }}
                      />
                      {errors.associated_coaches ? (
                        <div className={classes.row}>
                          <WarningIcon
                            color="error"
                            className={classes.leftIcon}
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
                              coach={coachList.find(
                                (c) => c.associated_coach_id === id,
                              )}
                              deleteCoach={() => remove(i)}
                              divider
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
                  initial?.id ? trackFormCancel(initial.id) : trackFormCancel();
                }}
              >
                {t('disciplineGroup.form.close')}
              </Button>
              <Submit
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
                color="primary"
              >
                {t('disciplineGroup.form.submit')}
              </Submit>
            </Actions>
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
}));

export default DisciplineGroupForm;

const disciplineGroupSchema = Yup.object().shape({
  name: Yup.string().required('replacement:disciplineGroup.form.required'),
  meta_activities: Yup.array().of(Yup.number()),
  all_activities: Yup.boolean(),
  workshops: Yup.array().of(Yup.number()),
  all_workshops: Yup.boolean(),
  categories: Yup.array().of(Yup.number()),
  all_categories: Yup.boolean(),
  associated_coaches: Yup.array().of(Yup.number()).min(1).required(),
});
