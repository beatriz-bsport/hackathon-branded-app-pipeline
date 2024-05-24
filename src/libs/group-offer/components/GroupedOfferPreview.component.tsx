import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DateTime } from 'luxon';

import { compose } from 'recompose';
import * as Yup from 'yup';
import { withFormik, Form, FormikProps, FieldArray } from 'formik';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Alert } from '@material-ui/lab';
import Calendar from '#components/offer/Calendar.component';
import DelayedTextField from '#components/DelayedTextField.component';
// @ts-expect-error
import { Submit } from '#components/forms';
import { MetaActivity } from '#libs/meta-activity/types';
import { OffersGroup } from '#libs/group-offer/types';
import { OptionCallback } from '../../../state/types';
import ReccurenceDisplay from './RecurrenceDisplay.component';
import {
  FREQUENCE_STRING_CONVERTER,
  getDisplayDateFromRecurrence,
} from '#libs/group-offer/utils';
import { Offer } from '#libs/offer/types';

export type OuterProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (arg1: {
    values: OffersGroup<Offer>[];
    options: OptionCallback;
  }) => void;
  groups: OffersGroup<Offer>[];
  metaActivity: MetaActivity;
  handlePreviousStep: () => void;
};

type Values = {
  formikGroups: OffersGroup<Offer>[];
};

const GroupedOfferPreviewSchema = Yup.object().shape({
  formikGroups: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
      }),
    )
    .test('size-check', 'required', (item) => {
      return item.length > 0;
    }),
});

export const GroupedOfferPreviewForm: React.FC<
  OuterProps & FormikProps<Values>
> = ({
  values,
  errors,
  metaActivity,
  isSubmitting,
  isValid,
  groups,
  handlePreviousStep,
  resetForm,
}) => {
  const { t } = useTranslation('metaActivity');
  const classes = useStyles(metaActivity);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  // Format the values of group with a dictionnary of event by midnight from date start and array of group containing the offers date_start
  const formatedData = useMemo(
    () =>
      values?.formikGroups?.reduce(
        (acc, group) => {
          acc.groups.push([
            ...group.offers.map((o) =>
              // @ts-expect-error
              DateTime.fromSeconds(o.date_start).toISODate(),
            ),
          ]);
          group.offers.forEach((o) => {
            // @ts-expect-error
            const midnight = DateTime.fromSeconds(o.date_start).startOf('day');
            // @ts-expect-error
            if (!acc.events[midnight]) {
              // @ts-expect-error
              acc.events[midnight] = [];
            }
            // @ts-expect-error
            acc.events[midnight].push(o);
          });
          return acc;
        },
        {
          groups: [],
          events: {},
        },
      ) ?? {
        groups: [],
        events: {},
      },
    [values],
  );

  const outOfTheScopeGroupedOffers = useMemo(() => {
    return groups.filter((group) => {
      return group.offers.some((offer) => {
        // @ts-expect-error
        const luxonOfferDateStart = DateTime.fromSeconds(offer.date_start);
        return luxonOfferDateStart.diffNow('years').years > 3;
      });
    });
  }, [groups]);

  const outOfTheScopeGroupedOffersListItems = outOfTheScopeGroupedOffers.map(
    (group) => {
      const firstOfferDate = DateTime.fromSeconds(
        // @ts-expect-error
        group.offers[0].date_start,
      ).toISODate();
      const lastOfferDate = DateTime.fromSeconds(
        // @ts-expect-error
        group.offers[group.offers.length - 1].date_start,
      ).toISODate();
      return (
        <ListItem key={firstOfferDate} disabled className={classes.listItemBox}>
          <ListItemText
            primary={
              <div className={classes.listItem}>
                <div className={classes.listItemInner}>
                  <DelayedTextField
                    disabled
                    // @ts-expect-error
                    shrink
                    className={classes.textField}
                    label={t('groupedOption.modal.form.groupName')}
                    value={group.name}
                  />
                </div>
              </div>
            }
            secondary={t('groupedOption.offerDescription', {
              count: group.offers.length,
              firstSession: DateTime.fromISO(firstOfferDate).toFormat('D'),
              lastSession: DateTime.fromISO(lastOfferDate).toFormat('D'),
            })}
          />
          <div className={classes.recurrence}>
            <Typography color="error">
              {t('groupedOption.modal.form.creationError')}
            </Typography>
          </div>
        </ListItem>
      );
    },
  );

  const [dateSelected, setDateSelected] = useState(
    values?.formikGroups?.[0]?.offers?.[0]?.date_start
      ? DateTime.fromSeconds(
          // @ts-expect-error
          values?.formikGroups?.[0]?.offers?.[0]?.date_start,
        ).toISODate()
      : DateTime.now().toISODate(),
  );

  const recurrence_rule = values?.formikGroups?.[0]?.recurrence_rule ?? null;

  const getHelperText = useCallback(() => {
    if (!recurrence_rule) return null;
    const intervalIsPlural = recurrence_rule.interval > 1;
    const frequenceIsYearly = recurrence_rule.frequence >= 2;

    const firstDate = values?.formikGroups?.[0]?.offers?.[0]?.date_start
      ? // @ts-expect-error
        DateTime.fromSeconds(values?.formikGroups?.[0]?.offers?.[0]?.date_start)
      : DateTime.now();

    if (frequenceIsYearly) {
      return (
        <div className={classes.row}>
          {/* @ts-expect-error */}
          <Alert className={classes.alertInfo} color="grey" severity="info">
            {t(
              `groupedOption.helperText.year${
                intervalIsPlural ? '_plural' : ''
              }`,
              {
                count: recurrence_rule.interval ?? 0,
                // @ts-expect-error
                day: getDisplayDateFromRecurrence(firstDate, {
                  frequence: 1,
                }),
                month: firstDate.toFormat('LLLL'),
              },
            )}
          </Alert>
        </div>
      );
    }

    return (
      <div className={classes.row}>
        {/*  @ts-expect-error */}
        <Alert className={classes.alertInfo} color="grey" severity="info">
          <Typography color="textSecondary">
            {t(
              `groupedOption.helperText.${
                FREQUENCE_STRING_CONVERTER[recurrence_rule.frequence]
              }${intervalIsPlural ? '_plural' : ''}`,
              {
                count: recurrence_rule.interval ?? 0,
                day: getDisplayDateFromRecurrence(firstDate, recurrence_rule),
              },
            )}
          </Typography>
        </Alert>
      </div>
    );
  }, [classes, recurrence_rule, t, values?.formikGroups]);

  if (groups.length === 0) {
    return (
      <div className={classes.main}>
        <div className={classes.form}>
          <Typography>
            {t('groupedOption.modal.form.impossibleState')}
          </Typography>
          <div className={classes.buttonContainer}>
            <Button onClick={handlePreviousStep}>
              {t('groupedOption.modal.form.back')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.main}>
      {getHelperText()}
      <div className={classes.calendar}>
        <Calendar
          forceMonthDisplay
          date={dateSelected}
          events={formatedData.events}
          onDateChange={(date) => {
            setDateSelected(date);
          }}
          ranges={formatedData.groups.map((fg) => [fg[0], fg[fg.length - 1]])}
        />
      </div>
      <Form className={classes.form}>
        {outOfTheScopeGroupedOffers.length > 0 && (
          <div className={classes.warningContainer}>
            <Alert className={classes.warning} severity="warning">
              {t('groupedOption.warning.uncreatedGroups')}
            </Alert>
          </div>
        )}
        <List className={classes.list}>
          <FieldArray name="formikGroups">
            {({
              remove,
              replace,
              form: {
                values: { formikGroups },
              },
            }) =>
              // @ts-expect-error
              formikGroups.map((group, index) => {
                const firstOfferDate = DateTime.fromSeconds(
                  group.offers[0].date_start,
                ).toISODate();
                const lastOfferDate = DateTime.fromSeconds(
                  group.offers[group.offers.length - 1].date_start,
                ).toISODate();

                const handleRemove = () => {
                  remove(index);
                };

                return (
                  <ListItem
                    key={firstOfferDate}
                    button
                    className={classes.listItemBox}
                    onClick={() => {
                      setDateSelected(firstOfferDate);
                    }}
                  >
                    <ListItemText
                      primary={
                        <div className={classes.listItem}>
                          {/* eslint-disable-next-line */}
                          <div
                            className={classes.listItemInner}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              ev.preventDefault();
                            }}
                          >
                            <DelayedTextField
                              required
                              // @ts-expect-error
                              shrink
                              className={classes.textField}
                              error={
                                // @ts-expect-error
                                errors?.formikGroups?.[index]?.name ?? false
                              }
                              label={t('groupedOption.modal.form.groupName')}
                              onChange={(
                                ev: React.ChangeEvent<HTMLInputElement>,
                              ) => {
                                replace(index, {
                                  ...group,
                                  name: ev.target.value,
                                });
                              }}
                              value={group.name}
                            />
                          </div>
                        </div>
                      }
                      secondary={t('groupedOption.offerDescription', {
                        count: group.offers.length,
                        firstSession:
                          DateTime.fromISO(firstOfferDate).toFormat('D'),
                        lastSession:
                          DateTime.fromISO(lastOfferDate).toFormat('D'),
                      })}
                    />
                    {formikGroups.length > 1 && (
                      <IconButton
                        className={classes.icon}
                        onClick={handleRemove}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                    <div className={classes.recurrence}>
                      <ReccurenceDisplay
                        recurrenceRule={group.recurrence_rule}
                      />
                    </div>
                  </ListItem>
                );
              })
            }
          </FieldArray>
        </List>
        {errors?.formikGroups === 'required' && (
          <Typography color="error">
            {t('groupedOption.modal.form.required')}
          </Typography>
        )}
        {outOfTheScopeGroupedOffers.length > 0 && (
          <>
            <div className={classes.subtitle}>
              <Typography variant="h6">
                {t('groupedOption.modal.form.uncreatedGroupsTitle')}
              </Typography>
            </div>
            <div className={classes.warningContainer}>
              <Alert className={classes.warning} severity="warning">
                {t('groupedOption.warning.groupsWithOutOfTheRangeOffers')}
              </Alert>
            </div>
            <List className={classes.list}>
              {outOfTheScopeGroupedOffersListItems}
            </List>
          </>
        )}
        <Divider className={classes.divider} />
        <div className={classes.buttonContainer}>
          <Button onClick={handlePreviousStep}>
            {t('groupedOption.modal.form.back')}
          </Button>
          <Submit color="primary" disabled={isSubmitting || !isValid}>
            {isSubmitting ? (
              <CircularProgress />
            ) : (
              t('groupedOption.modal.form.submit')
            )}
          </Submit>
        </div>
      </Form>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  main: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  calendar: { padding: theme.spacing(2) },
  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  recurrence: {
    position: 'absolute',
    bottom: theme.spacing(1),
    right: theme.spacing(2),
  },

  field: {
    marginBottom: theme.spacing(1),
  },
  buttonContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(-6),
    marginRight: theme.spacing(-6),
    marginBottom: theme.spacing(2),
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    flex: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  row: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  textField: {
    minWidth: 300,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  listItemInner: {
    width: '50%',
  },
  subtitle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  warningContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(2),
  },
  warning: {
    width: '100%',
    alignItems: 'center',
  },
  listItemBox: {
    borderLeftWidth: 5,
    borderLeftStyle: 'solid',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    position: 'relative',
    boxShadow:
      '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12)',
    // @ts-expect-error
    color: (metaActivity) => metaActivity.color,
  },
}));

export default compose<any, OuterProps>(
  withFormik<OuterProps, Values>({
    mapPropsToValues: ({ groups }) => {
      const filteredGroups = [...groups].filter((group) => {
        return group.offers.every((offer) => {
          // @ts-expect-error
          const luxonOfferDateStart = DateTime.fromSeconds(offer.date_start);
          return luxonOfferDateStart.diffNow('years').years < 3;
        });
      });
      return {
        formikGroups: filteredGroups,
      };
    },
    validationSchema: GroupedOfferPreviewSchema,
    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
      onSubmit({
        values: values.formikGroups,
        options: {
          onSuccess: () => setSubmitting(false),
          onError: () => setSubmitting(false),
        },
      });
    },
  }),
)(GroupedOfferPreviewForm);
