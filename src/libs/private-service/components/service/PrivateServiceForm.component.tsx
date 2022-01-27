import React from 'react';
import * as Yup from 'yup';
import omit from 'lodash/omit';
import { withFormik, FieldArray, FormikProps } from 'formik';

import { WithTranslation, useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
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
import CoachSelector from '../../../associated-coach/components/coach-selector/CoachSelector.component';
import CoachListItemBasic from '../../../associated-coach/components/CoachListItemBasic.component';
import PrivateServiceGroupField from '../service-group/PrivateServiceGroupField.component';

import {
  TextField,
  ColorField,
  CheckboxField,
  IntegerField,
  RadioGroupField,
  DurationField,
  SwitchField,
} from '../../../../components/forms';
import ImageField from '../../../../components/forms/ImageField.component';
import type { Coach } from '#libs/associated-coach/types';
import type {
  AssociatedEstablishment,
  Establishment,
} from '#libs/establishment/types';
import type { Tag, TagGroup } from '#libs/tag/types';
import type { PrivateServiceGroup } from '#libs/private-service/types';
import PrivateServiceFormTag from './PrivateServiceFormTag.component';

export interface FormikValues {
  cover_main: string;
  name: string;
  description: string;
  color: string;
  manager_only: boolean;
  is_without_coach: boolean;
  use_full_establishment_capacity: boolean;
  coach_capacity_used: 1;
  establishments: [];
  coaches: [];
  establishment_resource_type: string;
  establishment_consumer_attribution: string;
  coach_consumer_attribution: string;
  last_discard_minutes: number;
  last_booking_minutes: number;
  availability_padding_start_minutes: number;
  availability_padding_end_minutes: number;
  allow_unpaid_booking: boolean;
  unpaid_whitelist_tags: Array<number>;
  unpaid_blacklist_tags: Array<number>;
}
type OwnProps = {
  establishments: Array<Establishment>;
  coaches: Array<Coach>;
  allCoaches: Array<Coach>;
  onAddServiceGroup?: () => void;
  serviceGroupList: Array<PrivateServiceGroup>;
  tagList: Array<Tag<TagGroup>>;
};
type Props = OwnProps & WithTranslation & FormikProps<FormikValues>;
const IS_HOME_SERVICE = '0';
const IS_WITHOUT_ESTABLISHMENT = '1';
const IS_WITH_ESTABLISHMENT = '2';

export const PrivateServiceForm = (props: Props) => {
  const { values } = props;
  const { t } = useTranslation('privateService');
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <ImageField id="button_private_service_image" name="cover_main" />
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
          <Fab color="primary" onClick={props.onAddServiceGroup}>
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
        <legend className={classes.legend}>
          {t('service.form.resourceGroup.establishment')}
        </legend>
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
                    {establishments.map((id: number, i: number) => (
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
                    {coaches.map((id: number, i: number) => (
                      <CoachListItemBasic
                        key={`${id}-${i}`}
                        coach={props.allCoaches.find((c) => c.id === id)}
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
                      selectOption={(ev: Array<{ value: number }>) => {
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
              label={t('service.form.coach_capacity_used.label')}
              helperText={t('service.form.coach_capacity_used.helperText')}
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
      <SwitchField
        name="manager_only"
        label={t('service.form.managerOnly.label')}
      />
      <div className={classes.row}>
        <DurationField
          name="last_discard_minutes"
          className={classes.field}
          fullWidth
          label={t('service.form.last_discard_minutes.label')}
          helperText={t('service.form.last_discard_minutes.helperText')}
        />
      </div>
      <div className={classes.row}>
        <DurationField
          name="last_booking_minutes"
          className={classes.field}
          fullWidth
          label={t('service.form.last_booking_minutes.label')}
        />
      </div>
      <Typography>{t('service.form.paddingTitle')}</Typography>
      <div>
        <IntegerField
          name="availability_padding_start_minutes"
          className={classes.integerField}
          fullWidth
          label={t('service.form.paddingStart.label')}
          helperText={
            props.values.availability_padding_start_minutes
              ? t('service.form.paddingStart.helperText', {
                  minutes: props.values.availability_padding_start_minutes,
                })
              : t('service.form.paddingStart.helperText0')
          }
          required
        />
        <IntegerField
          name="availability_padding_end_minutes"
          className={classes.integerField}
          fullWidth
          label={t('service.form.paddingEnd.label')}
          helperText={
            props.values.availability_padding_end_minutes
              ? t('service.form.paddingEnd.helperText', {
                  minutes: props.values.availability_padding_end_minutes,
                })
              : t('service.form.paddingEnd.helperText0')
          }
          required
        />
      </div>
      <fieldset className={classes.unpaidBookingsection}>
        <legend className={classes.legend}>
          {t('service.form.unpaidBooking.title')}
        </legend>
        <SwitchField
          name="allow_unpaid_booking"
          label={t('service.form.unpaidBooking.label')}
        />
        <PrivateServiceFormTag
          open={props.values.allow_unpaid_booking}
          tagList={props.tagList}
          setFieldValue={props.setFieldValue}
          values={props.values}
        />
      </fieldset>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    minWidth: 340,
  },
  field: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  sectionTitle: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
  resourceGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  legend: { marginBottom: 0 },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  selectorWrapper: {
    backgroundColor: '#F4F4F4',
    border: '1px solid white',
    borderRadius: 8,
  },
  integerField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  unpaidBookingsection: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

export const PrivateServiceSchema = Yup.object().shape({
  cover_main: Yup.object().nullable(),
  name: Yup.string().required(),
  description: Yup.string().required(),
  manager_only: Yup.boolean(),
  private_service_group: Yup.number().nullable(),
  color: Yup.string(),
  use_full_establishment_capacity: Yup.boolean(),
  coach_capacity_used: Yup.number().min(1).max(12),
  coaches: Yup.array().of(Yup.number()),
  establishments: Yup.array().of(Yup.number()),
  availability_padding_start_minutes: Yup.number(),
  availability_padding_end_minutes: Yup.number(),
  allow_unpaid_booking: Yup.boolean(),
});

export const PrivateServiceFormikHOC = withFormik<Props, FormikValues>({
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
        establishments: [
          ...initial.establishments.map((ae: AssociatedEstablishment) => ae.id),
        ],
        coaches: [...initial.coaches.map((ac: Coach) => ac.id)],
        coach_capacity_used: parseInt(12 / initial.coach_capacity_used, 10),
        coach_consumer_attribution:
          initial.coach_attribution === RESOURCE_ATTRIBUTION_CONSUMER,
        establishment_consumer_attribution:
          initial.establishment_attribution === RESOURCE_ATTRIBUTION_CONSUMER,
      };
    }
    return {
      cover_main: '',
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
      last_booking_minutes: 0,
      availability_padding_start_minutes: 0,
      availability_padding_end_minutes: 0,
      allow_unpaid_booking: false,
      unpaid_whitelist_tags: [],
      unpaid_blacklist_tags: [],
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
        },
        [
          'slots',
          'coach_consumer_attribution',
          'establishment_consumer_attribution',
          'establishment_resource_type',
          'is_without_coach',
          'cover_thumbnail',
          'company',
          'slots_duration_minute',
          ...(!values.private_service_group ? ['private_service_group'] : []),
        ],
      ),
      {
        onSuccess: () => setSubmitting(false),
        onError: () => setSubmitting(false),
      },
    );
  },
});

export default PrivateServiceForm;
