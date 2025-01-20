import React, { useMemo } from 'react';
import * as Yup from 'yup';
import omit from 'lodash/omit';
import { withFormik, FieldArray, FormikProps, ErrorMessage } from 'formik';

import { WithTranslation, useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Slide from '@material-ui/core/Collapse';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import TooltipInfo from '#src/components/TooltipInfo.component';

import {
  RESOURCE_ATTRIBUTION_CONSUMER,
  RESOURCE_ATTRIBUTION_AUTO,
} from '@bsport/common/lib/master-data/resource-attribution-methods.js';
import type { Coach } from '#src/libs/associated-coach/types';
import type {
  AssociatedEstablishment,
  Establishment,
} from '#src/libs/establishment/types';
import type { Tag, TagGroup, TagOption } from '#src/libs/tag/types';
import type {
  PrivateService,
  PrivateServiceGroup,
} from '#src/libs/private-service/types';
import type { OptionCallback } from '#src/state/types';

import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import {
  checkClassPassEligibility,
  getCoachCorrespondingCapacity,
} from '#src/libs/private-service/utils';

// @ts-expect-error
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';
import EstablishmentSelector from '../../../establishment/components/EstablishmentSelector.component';
import CoachSelector from '../../../associated-coach/components/coach-selector/CoachSelector.component';
import CoachListItemBasic from '../../../associated-coach/components/CoachListItemBasic.component';

// @ts-expect-error
import PrivateServiceGroupField from '../service-group/PrivateServiceGroupField.component';

import {
  CLASSPASS_MAXIMUM_CONCURRENT_APPOINTMENT_PER_COACH,
  CLASSPASS_AVAILABILITY_PADDING,
  MAXIMUM_CONCURRENT_APPOINTMENT_PER_COACH_OPTIONS,
} from '#src/libs/private-service/constants';

import {
  TextField,
  ColorField,
  CheckboxField,
  IntegerField,
  RadioGroupField,
  DurationField,
  // @ts-expect-error
} from '../../../../components/forms';
import { SwitchField } from '#src/libs/custom-form/components/GenericFormik.input';

// @ts-expect-error
import ImageField from '../../../../components/forms/ImageField.component';
import PrivateServiceFormTag from './PrivateServiceFormTag.component';
import { ButtonBase, Collapse } from '@material-ui/core';
import {
  Block,
  Check,
  ExpandLess,
  ExpandMore,
  Settings,
} from '@material-ui/icons';
import TagSelector from '#src/libs/tag/components/TagSelector.selector';

const { trackFormSuccess } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.PrivateService,
);
export interface FormikValues {
  cover_main: string;
  name: string;
  description: string;
  color: string;
  manager_only: boolean;
  is_without_coach: boolean;
  use_full_establishment_capacity: boolean;
  maxConcurrentAppointmentsPerCoach: 1;
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
  pad_before_booking: boolean;
  member_whitelist_tags: Array<number>;
  member_blacklist_tags: Array<number>;
  available_on_partnership: boolean;
  has_own_availability_slots: boolean;
}

type FormProps = {
  onSubmit: (
    data: Partial<FormikValues>,
    options?: OptionCallback<PrivateService>,
  ) => void;
};

type OwnProps = {
  isIntegratedWithClassPass: boolean;
  availableEstablishments: Array<Establishment>;
  allEstablishments: Array<Establishment>;
  coaches: Array<Coach>;
  allCoaches: Array<Coach>;
  onAddServiceGroup?: () => void;
  serviceGroupList: Array<PrivateServiceGroup>;
  tagList: Array<Tag<TagGroup>>;
  initial?: PrivateService<Coach, AssociatedEstablishment>;
  companyId: number;
};

type Props = OwnProps & WithTranslation & FormikProps<FormikValues>;

const IS_HOME_SERVICE = '0';
const IS_WITHOUT_ESTABLISHMENT = '1';
const IS_WITH_ESTABLISHMENT = '2';

const HelpPaddingDialog = ({
  onClose,
  open,
}: {
  onClose: () => void;
  open: boolean;
}) => {
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogContent>
        <Typography>{t('privateService.padBeforeBooking.explain1')}</Typography>
        <Typography style={{ marginTop: 16 }} variant="body2">
          {t('privateService.padBeforeBooking.explain2')}
        </Typography>
        <div className={classes.nestedExplain}>
          <Typography variant="body2">
            {t('privateService.padBeforeBooking.explain3')}
          </Typography>
          <Typography variant="body2">
            {t('privateService.padBeforeBooking.explain4')}
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export const PrivateServiceForm = (props: Props) => {
  const { values, setValues, setFieldValue, initial, companyId } = props;
  const { t } = useTranslation('privateService');
  const classes = useStyles();

  const [isOpenPadDialog, setIsOpenPadDialog] = React.useState<boolean>(false);
  const [openPaddingDialog, closePaddingDialog] = [
    () => setIsOpenPadDialog(true),
    () => setIsOpenPadDialog(false),
  ];
  const [openAdvancedOptions, setOpenAdvancedOptions] = React.useState(false);

  const [
    isMaximumAppointmentPerCoachDisabled,
    setIsMaximumAppointmentPerCoachDisabled,
  ] = React.useState(false);

  const [
    isAvailabilityStartBufferDisabled,
    setIsAvailabilityStartBufferDisabled,
  ] = React.useState(false);

  const [isAvailabilityEndBufferDisabled, setIsAvailabilityEndBufferDisabled] =
    React.useState(false);

  React.useEffect(() => {
    if (values.available_on_partnership) {
      setIsMaximumAppointmentPerCoachDisabled(true);
      setIsAvailabilityStartBufferDisabled(true);
      setIsAvailabilityEndBufferDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allWhitelistTagsWithTagGroup = React.useMemo(() => {
    return (
      [
        ...props.tagList?.filter(
          (tag) => !values.member_blacklist_tags?.includes(tag.id),
        ),
      ] || []
    );
  }, [props.tagList, values.member_blacklist_tags]);

  const allBlacklistTagsWithTagGroup = React.useMemo(() => {
    return (
      [
        ...props.tagList?.filter(
          (tag) => !values.member_whitelist_tags?.includes(tag.id),
        ),
      ] || []
    );
  }, [props.tagList, values.member_whitelist_tags]);

  const toggleAdvancedOptions = React.useCallback(() => {
    setOpenAdvancedOptions((prev) => !prev);
  }, []);

  const updateWhitelist = React.useCallback(
    (items: TagOption[]) => {
      setValues({
        ...values,
        member_whitelist_tags: items.map((item) => item.value),
      });
    },
    [setValues, values],
  );

  const deleteFromWhitelist = React.useCallback(
    (itemId: number) => {
      setValues({
        ...values,
        member_whitelist_tags: values.member_whitelist_tags.filter(
          (tagId) => tagId !== itemId,
        ),
      });
    },
    [setValues, values],
  );

  const updateBlacklist = React.useCallback(
    (items: TagOption[]) => {
      setValues({
        ...values,
        member_blacklist_tags: items.map((item) => item.value),
      });
    },
    [setValues, values],
  );

  const deleteFromBlacklist = React.useCallback(
    (itemId: number) => {
      setValues({
        ...values,
        member_blacklist_tags: values.member_blacklist_tags.filter(
          (tagId) => tagId !== itemId,
        ),
      });
    },
    [setValues, values],
  );

  const changeAvailableOnPartnership = React.useCallback(() => {
    if (values.available_on_partnership) {
      setFieldValue('available_on_partnership', false);
      setIsMaximumAppointmentPerCoachDisabled(false);
      setIsAvailabilityStartBufferDisabled(false);
      setIsAvailabilityEndBufferDisabled(false);
    } else {
      setValues({
        ...values,
        pad_before_booking: false,
        is_without_coach: false,
        use_full_establishment_capacity: true,
        establishment_resource_type: IS_WITH_ESTABLISHMENT,
        available_on_partnership: !values.available_on_partnership,
      });

      if (!initial) {
        setFieldValue(
          'maxConcurrentAppointmentsPerCoach',
          CLASSPASS_MAXIMUM_CONCURRENT_APPOINTMENT_PER_COACH,
        );
        setFieldValue(
          'availability_padding_start_minutes',
          CLASSPASS_AVAILABILITY_PADDING,
        );
        setFieldValue(
          'availability_padding_end_minutes',
          CLASSPASS_AVAILABILITY_PADDING,
        );
      }

      if (
        values.maxConcurrentAppointmentsPerCoach ===
        CLASSPASS_MAXIMUM_CONCURRENT_APPOINTMENT_PER_COACH
      )
        setIsMaximumAppointmentPerCoachDisabled(true);
      if (
        values.availability_padding_start_minutes ===
        CLASSPASS_AVAILABILITY_PADDING
      )
        setIsAvailabilityStartBufferDisabled(true);

      if (
        values.availability_padding_end_minutes ===
        CLASSPASS_AVAILABILITY_PADDING
      )
        setIsAvailabilityEndBufferDisabled(true);
    }
  }, [setValues, setFieldValue, values, initial]);

  const showClassPassAvailabilityStartPaddingError = useMemo(
    () =>
      values.availability_padding_start_minutes !==
        CLASSPASS_AVAILABILITY_PADDING && values.available_on_partnership,
    [
      values.availability_padding_start_minutes,
      values.available_on_partnership,
    ],
  );

  const showClassPassAvailabilityEndPaddingError = useMemo(
    () =>
      values.availability_padding_end_minutes !==
        CLASSPASS_AVAILABILITY_PADDING && values.available_on_partnership,
    [values.availability_padding_end_minutes, values.available_on_partnership],
  );

  const isCompanyEligibleForClassPass = checkClassPassEligibility(companyId);

  return (
    <div className={classes.container}>
      <ImageField id="button_private_service_image" name="cover_main" />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('service.form.name.label')}
        name="name"
        placeholder={t('service.form.name.placeholder')}
      />
      <div className={classes.row}>
        <div style={{ display: 'flex', flex: 1 }}>
          <PrivateServiceGroupField
            fullWidth
            name="private_service_group"
            serviceGroupList={props.serviceGroupList}
          />
        </div>
        {!!props.onAddServiceGroup && (
          <Fab color="primary" onClick={props.onAddServiceGroup}>
            <AddIcon />
          </Fab>
        )}
      </div>
      <ColorField
        transparentColorAvailable
        label={t('service.form.color')}
        name="color"
      />
      <TextField
        fullWidth
        multiline
        required
        className={classes.field}
        label={t('service.form.description.label')}
        name="description"
        variant="outlined"
      />
      {props.isIntegratedWithClassPass && isCompanyEligibleForClassPass && (
        <div id="private-pass-available_on_partnership-switch-field-container">
          <SwitchField
            label={t('service.form.availableOnPartnership.label')}
            name="available_on_partnership"
            onChange={changeAvailableOnPartnership}
          />
        </div>
      )}

      <Slide in={values.available_on_partnership}>
        <Alert className={classes.alertPadding} severity="info">
          {t('service.form.availableOnPartnership.alert')}
        </Alert>
      </Slide>

      <fieldset className={classes.resourceGroup}>
        <legend className={classes.legend}>
          {t('service.form.resourceGroup.establishment')}
        </legend>
        <div className={classes.fieldTopMargin}>
          <RadioGroupField
            choices={[
              {
                label: t(
                  'service.form.establishmentResourceType.isHomeService.label',
                ),
                value: IS_HOME_SERVICE,
                helperText: t(
                  'service.form.establishmentResourceType.isHomeService.helperText',
                ),
                disabled: values.available_on_partnership,
              },
              {
                label: t(
                  'service.form.establishmentResourceType.isWithoutEstablishment.label',
                ),
                value: IS_WITHOUT_ESTABLISHMENT,
                helperText: t(
                  'service.form.establishmentResourceType.isWithoutEstablishment.helperText',
                ),
                disabled: values.available_on_partnership,
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
            name="establishment_resource_type"
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
                    {establishments.length === 0 && (
                      <Typography
                        className={classes.selectorTitle}
                        variant="caption"
                      >
                        {t('service.form.establishmentSelectorTitle')}
                      </Typography>
                    )}

                    {establishments.map((id: number, i: number) => (
                      <EstablishmentListItem
                        key={`${id}-${i}`}
                        showCapacity
                        establishment={props.allEstablishments.find(
                          (e) => e.id === id,
                        )}
                        onClickDelete={() => remove(i)}
                      />
                    ))}
                    <EstablishmentSelector
                      closeMenuOnSelect
                      nullCurrentValue
                      // @ts-expect-error
                      showCapacity
                      establishments={[
                        ...props.availableEstablishments.filter(
                          (c) => !establishments.includes(c.id),
                        ),
                      ]}
                      selectedEstablishments={[]}
                      selectOption={(ev) => {
                        // @ts-expect-error
                        if (ev.length) push(ev[0].value);
                      }}
                    />
                    <ErrorMessage component="div" name="establishments">
                      {(errorMessage) => (
                        <div className={classes.errorMessageContainer}>
                          <Typography
                            className={classes.errorMessageText}
                            variant="caption"
                          >
                            {t(errorMessage)}
                          </Typography>
                        </div>
                      )}
                    </ErrorMessage>
                  </div>
                )}
              </FieldArray>
            </div>
            <CheckboxField
              disabled={values.available_on_partnership}
              helperText={t(
                'service.form.use_full_establishment_capacity.helperText',
              )}
              label={t('service.form.use_full_establishment_capacity.label')}
              name="use_full_establishment_capacity"
            />
            <CheckboxField
              helperText={t(
                'service.form.establishment_consumer_attribution.helperText',
              )}
              label={t('service.form.establishment_consumer_attribution.label')}
              name="establishment_consumer_attribution"
            />
          </div>
        </Slide>
      </fieldset>
      <fieldset className={classes.resourceGroup}>
        <legend className={classes.legendCoach}>
          {t('service.form.resourceGroup.coach')}
        </legend>
        <div className={classes.tooltipRow}>
          <div className={classes.paddingBottom}>
            <CheckboxField
              disabled={values.available_on_partnership}
              label={t('service.form.is_without_coach')}
              name="is_without_coach"
            />
          </div>
          {values.available_on_partnership && (
            <div className={classes.noTeacher}>
              <TooltipInfo helpText={t('service.form.tooltip.noTeacher')} />
            </div>
          )}
        </div>
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
                    {coaches.length === 0 && (
                      <Typography
                        className={classes.selectorTitle}
                        variant="caption"
                      >
                        {t('service.form.coachSelectorTitle')}
                      </Typography>
                    )}
                    {coaches.map((id: number, i: number) => (
                      <CoachListItemBasic
                        key={`${id}-${i}`}
                        // @ts-expect-error
                        coach={props.allCoaches.find((c) => c.id === id)}
                        onDelete={() => remove(i)}
                      />
                    ))}
                    <CoachSelector
                      closeMenuOnSelect
                      // @ts-expect-error
                      nullCurrentValue
                      coaches={[
                        ...props.coaches.filter((c) => !coaches.includes(c.id)),
                      ]}
                      selectedCoaches={[]}
                      selectOption={(ev: Array<{ value: number }>) => {
                        if (ev.length) push(ev[0].value);
                      }}
                    />
                    <ErrorMessage name="coaches">
                      {(errorMessage) => (
                        <div className={classes.errorMessageContainer}>
                          <Typography
                            className={classes.errorMessageText}
                            variant="caption"
                          >
                            {t(errorMessage)}
                          </Typography>
                        </div>
                      )}
                    </ErrorMessage>
                  </div>
                )}
              </FieldArray>
            </div>
            <div className={classes.row}>
              <IntegerField
                fullWidth
                className={classes.fieldTopMargin}
                disabled={isMaximumAppointmentPerCoachDisabled}
                helperText={
                  !values.available_on_partnership &&
                  t('service.form.coach_capacity_used.helperText')
                }
                label={t('service.form.coach_capacity_used.label')}
                min={1}
                name="maxConcurrentAppointmentsPerCoach"
              />
              {isMaximumAppointmentPerCoachDisabled && (
                <div className={classes.maxConcurrentAppointmentPerCoachAlert}>
                  <TooltipInfo
                    helpText={t('service.form.tooltip.oneBookingPerTeacher')}
                  />
                </div>
              )}
            </div>
            <ErrorMessage
              component="div"
              name="maxConcurrentAppointmentsPerCoach"
            >
              {(errorMessage) => (
                <div className={classes.paddingContainer}>
                  <Typography
                    className={classes.errorMessageText}
                    variant="caption"
                  >
                    {t(errorMessage)}
                  </Typography>
                </div>
              )}
            </ErrorMessage>
            <Slide in={!values.available_on_partnership}>
              <Alert className={classes.alignCenter} severity="info">
                {t('service.form.coach_capacity_used.alertText')}
              </Alert>
            </Slide>
            <CheckboxField
              helperText={t(
                'service.form.coach_consumer_attribution.helperText',
              )}
              label={t('service.form.coach_consumer_attribution.label')}
              name="coach_consumer_attribution"
            />
          </div>
        </Slide>
      </fieldset>

      <fieldset className={classes.field}>
        <legend>{t('service.form.settingsTitle')}</legend>
        <SwitchField
          label={t('service.form.managerOnly.label')}
          name="manager_only"
        />
        <div className={classes.row}>
          <DurationField
            fullWidth
            className={classes.field}
            helperText={t('service.form.last_discard_minutes.helperText')}
            label={t('service.form.last_discard_minutes.label')}
            name="last_discard_minutes"
          />
        </div>
        <div className={classes.row}>
          <DurationField
            fullWidth
            className={classes.field}
            label={t('service.form.last_booking_minutes.label')}
            name="last_booking_minutes"
          />
        </div>
      </fieldset>
      <fieldset className={classes.unpaidBookingsection}>
        <legend className={classes.legend}>
          {t('service.form.paddingTitle')}
        </legend>
        <Slide
          in={
            isAvailabilityEndBufferDisabled && isAvailabilityStartBufferDisabled
          }
        >
          <Alert className={classes.alertPadding} severity="info">
            {t('service.form.availableOnPartnership.buffersAlert')}
          </Alert>
        </Slide>
        <IntegerField
          fullWidth
          required
          className={classes.integerField}
          // Different behaviour between editing and creating a new appointment
          disabled={isAvailabilityStartBufferDisabled}
          helperText={
            !values.available_on_partnership &&
            (props.values.availability_padding_start_minutes
              ? t('service.form.paddingStart.helperText', {
                  minutes: props.values.availability_padding_start_minutes,
                })
              : t('service.form.paddingStart.helperText0'))
          }
          label={t('service.form.paddingStart.label')}
          name="availability_padding_start_minutes"
        />
        {showClassPassAvailabilityStartPaddingError && (
          <ErrorMessage
            component="div"
            name="availability_padding_start_minutes"
          >
            {(errorMessage) => (
              <Typography
                className={classes.errorMessageText}
                variant="caption"
              >
                {t(errorMessage)}
              </Typography>
            )}
          </ErrorMessage>
        )}

        <IntegerField
          fullWidth
          required
          className={classes.integerField}
          // Different behaviour between editing and creating a new appointment
          disabled={isAvailabilityEndBufferDisabled}
          helperText={
            !values.available_on_partnership &&
            (props.values.availability_padding_end_minutes
              ? t('service.form.paddingEnd.helperText', {
                  minutes: props.values.availability_padding_end_minutes,
                })
              : t('service.form.paddingEnd.helperText0'))
          }
          label={t('service.form.paddingEnd.label')}
          name="availability_padding_end_minutes"
        />
        {showClassPassAvailabilityEndPaddingError && (
          <ErrorMessage component="div" name="availability_padding_end_minutes">
            {(errorMessage) => (
              <Typography
                className={classes.errorMessageText}
                variant="caption"
              >
                {t(errorMessage)}
              </Typography>
            )}
          </ErrorMessage>
        )}
        <div className={classes.row}>
          <SwitchField
            disabled={values.available_on_partnership}
            label={t('service.form.pad_before_booking.label')}
            name="pad_before_booking"
          />
          <IconButton onClick={openPaddingDialog}>
            <HelpOutlineIcon />
          </IconButton>
          <HelpPaddingDialog
            onClose={closePaddingDialog}
            open={isOpenPadDialog}
          />
        </div>
      </fieldset>
      <fieldset className={classes.unpaidBookingsection}>
        <legend className={classes.legend}>
          {t('service.form.unpaidBooking.title')}
        </legend>
        <SwitchField
          label={t('service.form.unpaidBooking.label')}
          name="allow_unpaid_booking"
        />
        <PrivateServiceFormTag
          open={props.values.allow_unpaid_booking}
          setFieldValue={props.setFieldValue}
          tagList={props.tagList}
          values={props.values}
        />
      </fieldset>
      <div className={classes.fieldGroup}>
        <div className={classes.advancedOptionsSection}>
          <ButtonBase
            className={classes.advancedOptionsHeader}
            onClick={toggleAdvancedOptions}
          >
            <Settings className={classes.settings} />
            <Typography variant="h6">
              {t('service.form.advancedOptions.header')}
            </Typography>
            {openAdvancedOptions ? <ExpandLess /> : <ExpandMore />}
          </ButtonBase>
          <Collapse in={openAdvancedOptions}>
            <div className={classes.tagSection}>
              <Typography className={classes.title}>
                {t('service.form.advancedOptions.tag.header')}
              </Typography>
              <Slide in={values.available_on_partnership}>
                <Alert className={classes.alertPadding} severity="info">
                  {t('service.form.availableOnPartnership.tagsAlert')}
                </Alert>
              </Slide>
              <Typography variant="caption">
                {t('service.form.advancedOptions.tag.helperText')}
              </Typography>
              <div className={classes.tagSelector}>
                <div className={classes.tagSelectorLabel}>
                  <Check className={classes.tagSelectorLabelIcon} />
                  <Typography variant="subtitle1">
                    {t('service.form.advancedOptions.tag.allowed')}
                  </Typography>
                </div>
                <TagSelector
                  closeMenuOnSelect
                  inScrollBar
                  isClearable
                  allTagsWithTagGroup={allWhitelistTagsWithTagGroup}
                  onChange={updateWhitelist}
                  onDeleteTag={deleteFromWhitelist}
                  placeholder={t(
                    'service.form.advancedOptions.tag.doNotSelectToAllowAllMembers',
                  )}
                  selectedTags={values.member_whitelist_tags}
                />
              </div>
              <div className={classes.tagSelector}>
                <div className={classes.tagSelectorLabel}>
                  <Block className={classes.tagSelectorLabelIcon} />
                  <Typography variant="subtitle1">
                    {t('service.form.advancedOptions.tag.notAllowed')}
                  </Typography>
                </div>
                <TagSelector
                  closeMenuOnSelect
                  inScrollBar
                  isClearable
                  allTagsWithTagGroup={allBlacklistTagsWithTagGroup}
                  onChange={updateBlacklist}
                  onDeleteTag={deleteFromBlacklist}
                  placeholder={t(
                    'service.form.advancedOptions.tag.doNotSelectToAllowAllMembers',
                  )}
                  selectedTags={values.member_blacklist_tags}
                />
              </div>
            </div>
          </Collapse>
        </div>
      </div>
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
  fieldTopMargin: {
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
  nestedExplain: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1.5),
    '&>*': {
      marginTop: theme.spacing(1),
    },
  },
  alignCenter: {
    alignItems: 'center',
  },
  fieldGroup: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  title: {
    fontWeight: 500,
  },
  settings: {
    color: '#868686',
  },
  tagSelectorLabel: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
  },
  tagSelectorLabelIcon: {
    marginRight: theme.spacing(1),
  },
  tagSelector: {
    paddingBottom: theme.spacing(2),
  },
  tagSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  advancedOptionsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(2),
  },
  advancedOptionsSection: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: theme.spacing(2),
  },
  selectorTitle: {
    display: 'flex',
    flexGrow: 1,
    color: theme.palette.text.secondary,
    background: theme.palette.common.white,
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(2),
  },
  errorMessageContainer: {
    background: theme.palette.common.white,
    paddingTop: theme.spacing(2),
    flexGrow: 1,
  },
  paddingContainer: {
    padding: theme.spacing(1),
  },
  legendCoach: {
    paddingBottom: 0,
    marginBottom: theme.spacing(0.5),
  },
  maxConcurrentAppointmentPerCoachAlert: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(1),
  },
  noTeacher: {
    paddingBottom: theme.spacing(0.8),
    marginLeft: 0,
  },
  errorMessageText: {
    color: '#E31B0C',
  },
  alertPadding: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  tooltipRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  paddingBottom: {
    paddingBottom: theme.spacing(1),
    paddingRight: 0,
  },
  oneBookingPerTeacherTooltipIcon: {
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
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
  maxConcurrentAppointmentsPerCoach: Yup.number()
    .min(1, 'service.form.validation.zeroValueError')
    .test(
      'maxConcurrentAppointmentsPerCoach-validation',
      'error-maxConcurrentAppointmentsPerCoach',
      function checkMaxConcurrentAppointmentsPerCoach(value) {
        const { available_on_partnership, is_without_coach } = this.parent;

        // Priority: available_on_partnership validation
        if (available_on_partnership) {
          return (
            value === CLASSPASS_MAXIMUM_CONCURRENT_APPOINTMENT_PER_COACH ||
            this.createError({
              message: 'service.form.validation.coachCapacityUsed',
            })
          );
        }

        // If available_on_partnership is false, check is_without_coach condition
        if (!is_without_coach) {
          return (
            MAXIMUM_CONCURRENT_APPOINTMENT_PER_COACH_OPTIONS.includes(value) ||
            this.createError({
              message: 'service.form.coach_capacity_used.alertText',
            })
          );
        }

        // If no other conditions apply, the value is valid
        return true;
      },
    ),
  coaches: Yup.array()
    .of(Yup.number())
    .when('is_without_coach', {
      is: false,
      then: Yup.array()
        .of(Yup.number())
        .required('service.form.validation.oneOption')
        .min(1),
      otherwise: Yup.array().of(Yup.number()),
    }),
  establishments: Yup.array()
    .of(Yup.number())
    .when('establishment_resource_type', {
      is: IS_WITH_ESTABLISHMENT,
      then: Yup.array()
        .of(Yup.number())
        .required('service.form.validation.oneOption')
        .min(1),
      otherwise: Yup.array().of(Yup.number()),
    }),
  availability_padding_start_minutes: Yup.number()
    .nullable()
    .when('available_on_partnership', {
      is: true,
      then: Yup.number().test(
        'is-zero',
        'service.form.validation.availabilityBuffers',
        (value) => value === CLASSPASS_AVAILABILITY_PADDING,
      ),
    }),
  availability_padding_end_minutes: Yup.number()
    .nullable()
    .when('available_on_partnership', {
      is: true,
      then: Yup.number().test(
        'is-zero',
        'service.form.validation.availabilityBuffers',
        (value) => value === CLASSPASS_AVAILABILITY_PADDING,
      ),
    }),
  allow_unpaid_booking: Yup.boolean(),
});

const isNumber = <T,>(value: T) => !Number.isNaN(Number(value));

const getIds = <T extends { id: number }>(list: T[]) =>
  (list || [])
    .map((value) => (isNumber<T>(value) ? value : value.id))
    .filter((_value) => !!_value);

export const PrivateServiceFormikHOC = withFormik<
  Props & FormProps,
  FormikValues
>({
  enableReinitialize: true,
  // @ts-expect-error
  mapPropsToValues: ({ initial }) => {
    if (initial) {
      return {
        ...initial,
        is_without_coach: !initial.coaches || !initial.coaches.length,

        establishment_resource_type: initial.is_home_service
          ? IS_HOME_SERVICE
          : initial.establishments.length
          ? IS_WITH_ESTABLISHMENT
          : IS_WITHOUT_ESTABLISHMENT,
        establishments: [
          ...getIds<AssociatedEstablishment>(initial.establishments),
        ],
        coaches: [...getIds<Coach>(initial.coaches)],
        maxConcurrentAppointmentsPerCoach: getCoachCorrespondingCapacity(
          initial.coach_capacity_used,
        ),
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
      maxConcurrentAppointmentsPerCoach: 1,
      establishments: [],
      coaches: [],
      establishment_resource_type: IS_HOME_SERVICE,
      establishment_consumer_attribution: RESOURCE_ATTRIBUTION_CONSUMER,
      coach_consumer_attribution: RESOURCE_ATTRIBUTION_CONSUMER,
      last_discard_minutes: 24 * 60,
      pad_before_booking: false,
      last_booking_minutes: 0,
      availability_padding_start_minutes: 0,
      availability_padding_end_minutes: 0,
      allow_unpaid_booking: false,
      available_on_partnership: false,
      has_own_availability_slots: false,
      unpaid_whitelist_tags: [],
      unpaid_blacklist_tags: [],
      member_blacklist_tags: [],
      member_whitelist_tags: [],
    };
  },
  validationSchema: PrivateServiceSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(
      omit(
        {
          ...values,
          coaches: values.is_without_coach ? [] : values.coaches,
          coach_capacity_used: getCoachCorrespondingCapacity(
            values.maxConcurrentAppointmentsPerCoach,
          ),
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
          // @ts-expect-error
          ...(!values.private_service_group ? ['private_service_group'] : []),
        ],
      ),
      {
        onSuccess: () => {
          // @ts-expect-error
          trackFormSuccess(values?.id);
          setSubmitting(false);
        },
        onError: () => setSubmitting(false),
      },
    );
  },
});

export default PrivateServiceForm;
