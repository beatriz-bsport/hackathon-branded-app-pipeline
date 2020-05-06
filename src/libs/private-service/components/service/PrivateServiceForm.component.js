// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import * as Yup from 'yup';
import omit from 'lodash/omit';
import { withFormik, FieldArray } from 'formik';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Slide from '@material-ui/core/Collapse';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';

import {
  RESOURCE_ATTRIBUTION_CONSUMER,
  RESOURCE_ATTRIBUTION_AUTO,
} from '@bsport/common/lib/master-data/resource-attribution-methods';
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';
import EstablishmentSelector from '../../../establishment/components/EstablishmentSelector.component';
import CoachSelector from '../../../associated-coach/components/CoachSelector.component';
import CoachListItemBasic from '../../../associated-coach/components/CoachListItemBasic.component';
import PrivateServiceGroupField from '../service-group/PrivateServiceGroupField.component';

import {
  TextField,
  ColorField,
  CheckboxField,
  IntegerField,
  RadioGroupField,
  DurationField,
} from '../../../../components/forms';

type Props = {
  t: TFunction,
  classes: Object,
  values: PrivateServiceData,
  establishments: Array<Establishment>,
  coaches: Array<Coach>,
  onAddServiceGroup: ?() => void,
};

const IS_HOME_SERVICE = '0';
const IS_WITHOUT_ESTABLISHMENT = '1';
const IS_WITH_ESTABLISHMENT = '2';

export const PrivateServiceForm = (props: Props) => {
  const { values, classes, t } = props;
  return (
    <div className={classes.container}>
      <TextField
        className={classes.field}
        name="name"
        required
        fullWidth
        label={t('service.form.name.label')}
        placeholder={t('service.form.name.placeholder')}
      />
      <div className={classes.row}>
        <div style={{ display: 'flex', flex: 1 }}>
          <PrivateServiceGroupField
            serviceGroupList={props.serviceGroupList}
            fullWidth
            name="private_service_group"
          />
        </div>
        {!!props.onAddServiceGroup && (
          <Fab
            variant="contained"
            color="primary"
            onClick={props.onAddServiceGroup}
          >
            <AddIcon />
          </Fab>
        )}
      </div>
      <ColorField
        label={t('service.form.color')}
        name="color"
        transparentColorAvailable
      />
      <fieldset className={classes.resourceGroup}>
        <legend>{t('service.form.resourceGroup.establishment')}</legend>
        <div className={classes.field}>
          <RadioGroupField
            name="establishment_resource_type"
            choices={[
              {
                label: t(
                  'service.form.establishmentResourceType.isHomeService.label',
                ),
                value: IS_HOME_SERVICE,
                helperText: t(
                  'service.form.establishmentResourceType.isHomeService.helperText',
                ),
              },
              {
                label: t(
                  'service.form.establishmentResourceType.isWithoutEstablishment.label',
                ),
                value: IS_WITHOUT_ESTABLISHMENT,
                helperText: t(
                  'service.form.establishmentResourceType.isWithoutEstablishment.helperText',
                ),
              },
              {
                label: t(
                  'service.form.establishmentResourceType.isWithEstablishment.label',
                ),
                value: IS_WITH_ESTABLISHMENT,
                helperText: t(
                  'service.form.establishmentResourceType.isWithEstablishment.helperText',
                ),
              },
            ]}
          />
        </div>
        <Slide
          in={values.establishment_resource_type === IS_WITH_ESTABLISHMENT}
        >
          <div>
            <div className={classes.selectorWrapper}>
              <FieldArray name="establishments">
                {({
                  push,
                  remove,
                  form: {
                    values: { establishments },
                  },
                }) => (
                  <div>
                    {establishments.length === 0 ? (
                      <div className={classes.row}>
                        <WarningIcon
                          color="error"
                          className={classes.leftIcon}
                        />
                        <Typography>
                          {t(
                            'service.form.establishmentResourceType.isWithEstablishment.isEmpty',
                          )}
                        </Typography>
                      </div>
                    ) : null}
                    {establishments.map((id, i) => (
                      <EstablishmentListItem
                        key={`${id}-${i}`}
                        establishment={props.establishments.find(
                          (e) => e.id === id,
                        )}
                        showCapacity
                        onClickDelete={() => remove(i)}
                      />
                    ))}
                    <EstablishmentSelector
                      establishments={[
                        ...props.establishments.filter(
                          (c) => !establishments.includes(c.id),
                        ),
                      ]}
                      showCapacity
                      nullCurrentValue
                      selectedEstablishments={[]}
                      closeMenuOnSelect
                      selectOption={(ev) => {
                        if (ev.length) push(ev[0].value);
                      }}
                    />
                  </div>
                )}
              </FieldArray>
            </div>
            <CheckboxField
              label={t('service.form.use_full_establishment_capacity.label')}
              helperText={t(
                'service.form.use_full_establishment_capacity.helperText',
              )}
              name="use_full_establishment_capacity"
            />
            <CheckboxField
              label={t('service.form.establishment_consumer_attribution.label')}
              helperText={t(
                'service.form.establishment_consumer_attribution.helperText',
              )}
              name="establishment_consumer_attribution"
            />
          </div>
        </Slide>
      </fieldset>
      <fieldset className={classes.resourceGroup}>
        <legend>{t('service.form.resourceGroup.coach')}</legend>
        <CheckboxField
          label={t('service.form.is_without_coach')}
          name="is_without_coach"
        />
        <Slide in={!values.is_without_coach}>
          <div>
            <div className={classes.selectorWrapper}>
              <FieldArray name="coaches">
                {({
                  push,
                  remove,
                  form: {
                    values: { coaches },
                  },
                }) => (
                  <div>
                    {coaches.length === 0 ? (
                      <div className={classes.row}>
                        <WarningIcon
                          color="error"
                          className={classes.leftIcon}
                        />
                        <Typography>
                          {t('service.form.coach.isEmpty')}
                        </Typography>
                      </div>
                    ) : null}
                    {coaches.map((id, i) => (
                      <CoachListItemBasic
                        key={`${id}-${i}`}
                        coach={props.coaches.find((c) => c.id === id)}
                        onDelete={() => remove(i)}
                      />
                    ))}
                    <CoachSelector
                      coaches={[
                        ...props.coaches.filter((c) => !coaches.includes(c.id)),
                      ]}
                      closeMenuOnSelect
                      nullCurrentValue
                      selectedCoaches={[]}
                      selectOption={(ev) => {
                        if (ev.length) push(ev[0].value);
                      }}
                    />
                  </div>
                )}
              </FieldArray>
            </div>
            <IntegerField
              name="coach_capacity_used"
              className={classes.field}
              fullWidth
              label={props.t('service.form.coach_capacity_used.label')}
              helperText={props.t(
                'service.form.coach_capacity_used.helperText',
              )}
            />
            <CheckboxField
              label={t('service.form.coach_consumer_attribution.label')}
              helperText={t(
                'service.form.coach_consumer_attribution.helperText',
              )}
              name="coach_consumer_attribution"
            />
          </div>
        </Slide>
      </fieldset>
      <TextField
        className={classes.field}
        multiline
        fullWidth
        variant="outlined"
        rows={12}
        name="description"
        label={t('service.form.description.label')}
        required
      />
      <DurationField
        name="last_discard_minutes"
        className={classes.field}
        fullWidth
        label={props.t('service.form.last_discard_minutes.label')}
        helperText={props.t('service.form.last_discard_minutes.helperText')}
      />
    </div>
  );
};

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 340,
  },
  field: {
    marginBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 2,
  },
  sectionTitle: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.unit * 2,
  },
  resourceGroup: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  selectorWrapper: {
    backgroundColor: '#F4F4F4',
    border: '1px solid white',
    borderRadius: 8,
  },
});

export const PrivateServiceSchema = Yup.object().shape({
  // cover_main: Yup.object().nullable(),
  name: Yup.string().required(),
  description: Yup.string().required(),
  manager_only: Yup.boolean(),
  color: Yup.string(),
  use_full_establishment_capacity: Yup.boolean(),
  coach_capacity_used: Yup.number()
    .min(1)
    .max(12),
  coaches: Yup.array().of(Yup.number()),
  establishments: Yup.array().of(Yup.number()),
});

export const PrivateServiceFormikHOC = withFormik({
  mapPropsToValues: ({ initial }) => {
    if (initial) {
      return {
        ...initial,
        is_without_coach: !initial.coaches || !initial.coaches.length,
        // eslint-disable-next-line
        establishment_resource_type: initial.is_home_service
          ? IS_HOME_SERVICE
          : initial.establishments.length
          ? IS_WITH_ESTABLISHMENT
          : IS_WITHOUT_ESTABLISHMENT,
        establishments: [...initial.establishments.map((ae) => ae.id)],
        coaches: [...initial.coaches.map((ac) => ac.id)],
        coach_capacity_used: parseInt(12 / initial.coach_capacity_used, 10),
        coach_consumer_attribution:
          initial.coach_attribution === RESOURCE_ATTRIBUTION_CONSUMER,
        establishment_consumer_attribution:
          initial.establishment_attribution === RESOURCE_ATTRIBUTION_CONSUMER,
      };
    }
    return {
      name: '',
      description: '',
      color: '',
      // cover_main: '',
      manager_only: false,
      is_without_coach: true,
      use_full_establishment_capacity: true,
      coach_capacity_used: 1,
      establishments: [],
      coaches: [],
      establishment_resource_type: IS_HOME_SERVICE,
      establishment_consumer_attribution: RESOURCE_ATTRIBUTION_CONSUMER,
      coach_consumer_attribution: RESOURCE_ATTRIBUTION_CONSUMER,
      last_discard_minutes: 24 * 60,
    };
  },
  validationSchema: PrivateServiceSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(
      omit(
        {
          ...values,
          coaches: values.is_without_coach ? [] : values.coaches,
          coach_capacity_used: parseInt(12 / values.coach_capacity_used, 10),
          coach_attribution: values.coach_consumer_attribution
            ? RESOURCE_ATTRIBUTION_CONSUMER
            : RESOURCE_ATTRIBUTION_AUTO,
          establishment_attribution: values.establishment_consumer_attribution
            ? RESOURCE_ATTRIBUTION_CONSUMER
            : RESOURCE_ATTRIBUTION_AUTO,
          establishments:
            values.establishment_resource_type === IS_WITH_ESTABLISHMENT
              ? values.establishments
              : [],
          is_home_service:
            values.establishment_resource_type === IS_HOME_SERVICE,
          // cover_main:
          // typeof values.cover_main !== 'string' && !!values.cover_main
          // ? values.cover_main
          // : null,
        },
        [
          'slots',
          'coach_consumer_attribution',
          'establishment_consumer_attribution',
          'establishment_resource_type',
          'is_without_coach',
          'cover_thumbnail',
        ],
      ),
      {
        onSuccess: () => setSubmitting(false),
        onError: () => setSubmitting(false),
      },
    );
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(PrivateServiceForm);
