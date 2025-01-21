// @flow
import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import pick from 'lodash/pick';
import { VideoProvider } from '@bsport/common/lib/master-data/video-provider.js';
import { VideoStatus } from '@bsport/common/lib/master-data/video.js';

import { withFormik, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { Duration } from 'luxon';
import LevelSelectorFormik from '#src/libs/level/components/LevelSelectorFormik.component';
import ImageField from '../../../components/forms/ImageField.component';
import SCTSelectField from '../../category/components/SCTSelectorField.component';
import CoachSelector from '../../associated-coach/components/coach-selector/CoachSelector.component';
import CoachListItemBasic from '../../associated-coach/components/CoachListItemBasic.component';
import {
  TextField,
  IntegerField,
  CheckboxField,
} from '../../../components/forms';
import { Video } from '../types';
import { getDecimalCreditHelperText } from '../../theme/utils';

type Props = {
  coaches: Array<Coach>,
  SCTs: Array<SCT>,
  initial?: Video,
  onRemoveVideoSource: (v: Video) => void,
  values: any,
  handleBlur: {
    (e: React.FocusEvent<HTMLInputElement>): void,
  },

  customLevels: Level[],
  fetchLevelList: (
    params: LevelFilterSet,
    options?: OptionPaginatedCallback<Level>,
  ) => void,
  updateLevel: (id: number, data: Level, options: OptionCallback) => void,
  createLevel: (data: Level, options?: OptionCallback<Level>) => void,
  deleteLevel: (id: number, options?: OptionCallback) => void,
  setFieldValue: (name: string, value: any) => void,
};
const VideoForm = (props: Props) => {
  const { t } = useTranslation(['video']);
  const classes = useStyles();

  const handleDeleteLevel = (deleteLevelId: number) => {
    props.deleteLevel(deleteLevelId, {
      onSuccess: () => {
        if (deleteLevelId === props.values.level) {
          props.setFieldValue('level', null);
        }
        props.fetchLevelList();
      },
    });
  };

  const creditHelperText = useMemo(
    () =>
      getDecimalCreditHelperText(
        props.values.credit_price,
        'video.form.creditPrice.decimalCredit.helperText',
        t,
        t('video.form.creditPrice.helperText'),
      ),
    [props.values.credit_price, t],
  );

  return (
    <div className={classes.container}>
      <div className={classes.field}>
        <ImageField name="cover_main" showError={false} />
        <ErrorMessage
          name="cover_main"
          render={() => (
            <Typography className={classes.alertError} variant="body2">
              {t('video.coverMain.alert')}
            </Typography>
          )}
        />
      </div>
      <div className={classes.field}>
        <TextField
          fullWidth
          required
          inputProps={{ maxLength: 500 }}
          label={t('video.name')}
          name="name"
        />
      </div>
      <div className={classes.field}>
        <SCTSelectField
          fullWidth
          required
          label={t('video.category')}
          name="SCT"
          onBlur={props.handleBlur}
          scts={props.SCTs}
        />
      </div>
      <div className={classes.field}>
        <LevelSelectorFormik
          inScrollBar
          customLevels={props.customLevels}
          fetchLevelList={props.fetchLevelList}
          name="level"
          onCreateLevel={props.createLevel}
          onDeleteLevel={handleDeleteLevel}
          onEditLevel={props.updateLevel}
        />
      </div>
      <div className={classes.field}>
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
                  <div className={classes.emptyCoachText}>
                    <Typography variant="body2">
                      {t('video.form.coach.isEmpty')}
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
                  closeMenuOnSelect
                  nullCurrentValue
                  coaches={[
                    ...(props.coaches || []).filter(
                      (c) => !coaches.includes(c.id) && !c.disabled,
                    ),
                  ]}
                  helperText={t('video.form.coach.helperText')}
                  selectedCoaches={[]}
                  selectOption={(ev) => {
                    if (ev.length) push(ev[0].value);
                  }}
                />
              </div>
            )}
          </FieldArray>
        </div>
      </div>
      <div className={classes.field}>
        <IntegerField
          fullWidth
          required
          helperText={creditHelperText}
          inputProps={{ maxLength: 500 }}
          label={t('video.form.creditPrice.label')}
          name="credit_price"
        />
      </div>

      {props.initial &&
        props.initial.status !== VideoStatus.CREATED &&
        [
          VideoProvider.YOUTUBE_URL_PROVIDER,
          VideoProvider.VIMEO_URL_PROVIDER,
        ].includes(props.initial.provider_identifier) && (
          <>
            <Typography>{t('video.upload.durationLabel')}</Typography>
            <div className={classes.durationWrapper}>
              <IntegerField
                fullWidth
                required
                inputProps={{ maxLength: 500 }}
                label={t('video.upload.hours')}
                name="_duration_hours"
              />

              <IntegerField
                fullWidth
                required
                inputProps={{ maxLength: 500 }}
                label={t('video.upload.minutes')}
                name="_duration_minutes"
              />
            </div>
          </>
        )}

      <div className={classes.field}>
        <CheckboxField
          helperText={t('video.manager_only_helper')}
          label={t('video.manager_only')}
          name="manager_only"
        />
      </div>
      <div className={classes.field}>
        <CheckboxField
          disabled={
            props.initial?.provider_identifier === VideoProvider.EBOOK_PROVIDER
          }
          helperText={t('video.rental.helper')}
          label={t('video.rental.label')}
          name="forRent"
        />
      </div>

      {props.values.forRent && (
        <div className={classes.field}>
          <IntegerField
            fullWidth
            helperText={t('video.rental.rental_days_helper')}
            InputProps={{
              inputProps: {
                min: 1,
                maxLength: 500,
              },
            }}
            label={t('video.rental.duration_helper')}
            name="rental_days"
          />
        </div>
      )}

      <div className={classes.field}>
        <TextField
          fullWidth
          multiline
          required
          label={t('video.description')}
          name="description"
          rows={10}
          variant="outlined"
        />
      </div>

      {props.initial && props.initial.status !== VideoStatus.CREATED && (
        <fieldset>
          <legend className={classes.legend}>
            {t('video.form.video_source.title')}
          </legend>

          <div className={classes.videoSourceContent}>
            <Typography color="textSecondary" variant="subtitle1">
              {t(
                {
                  [VideoProvider.AWS_PROVIDER]:
                    'video.form.video_source.uploaded_video',
                  [VideoProvider.MUX_PROVIDER]:
                    'video.form.video_source.uploaded_video',
                  [VideoProvider.VIMEO_URL_PROVIDER]:
                    'video.form.video_source.vimeo_video',
                  [VideoProvider.YOUTUBE_URL_PROVIDER]:
                    'video.form.video_source.youtube_video',
                  [VideoProvider.EBOOK_PROVIDER]:
                    'video.form.video_source.ebook',
                }[props.initial.provider_identifier],
              )}
            </Typography>

            <Button
              className={classes.videoSourceButton}
              color="primary"
              onClick={() => props.onRemoveVideoSource(props.initial)}
              variant="outlined"
            >
              {t('video.form.video_source.edit_button').toUpperCase()}
            </Button>
          </div>
        </fieldset>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: 400,
  },
  field: {
    marginBottom: theme.spacing(2),
  },
  durationWrapper: {
    display: 'flex',
  },
  managerOnlyContainer: {
    marginBottom: theme.spacing(4),
    display: 'flex',
    justifyContent: 'space-between',
  },
  videoSourceContent: {
    marginTop: theme.spacing(-2),
  },
  videoSourceButton: {
    marginTop: theme.spacing(2),
  },
  selectorWrapper: {
    backgroundColor: '#F4F4F4',
    border: '1px solid white',
    borderRadius: 8,
  },
  emptyCoachText: {
    padding: theme.spacing(1),
  },
  alertError: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.error.dark,
  },
}));

export default VideoForm;

export const VideoSchema = Yup.object().shape({
  cover_main: Yup.mixed().required(),
  name: Yup.string().required(),
  description: Yup.string().required(),
  coaches: Yup.array().of(Yup.number()),
  SCT: Yup.number().integer(),
  credit_price: Yup.number().integer(),
  manager_only: Yup.boolean(),
  _duration_minutes: Yup.number().when('_duration_hours', {
    is: (value) => value > 0,
    then: Yup.number(),
    otherwise: Yup.number(),
  }),
  _duration_hours: Yup.number(),
  rental_days: Yup.number().min(1),
});

export const VideoFormHOC = withFormik({
  mapPropsToValues: ({ initial }) => {
    if (initial) {
      const duration = Duration.fromObject({
        seconds: initial.duration_second,
      });

      return {
        ...initial,
        coaches: [...initial.coaches.map((ac) => ac.id)],
        SCT: initial.SCT ? initial.SCT.id : null,
        manager_only: initial.manager_only,
        _duration_minutes: duration.minutes,
        _duration_hours: duration.hours,
        forRent: initial.rental_days > 0,
        rental_days: initial.rental_days > 0 ? initial.rental_days : 30,
      };
    }
    return {
      name: '',
      description: '',
      coaches: [],
      cover_main: '',
      SCT: null,
      level: 1,
      credit_price: 0,
      manager_only: false,
      rental_days: 30,
    };
  },
  validationSchema: VideoSchema,
  handleSubmit: (
    values,
    { props: { initial, onSubmit, onSuccess, onError }, setSubmitting },
  ) => {
    const keys = [
      'name',
      'description',
      'SCT',
      'coaches',
      'level',
      'credit_price',
      'manager_only',
      'rental_days',
    ];

    const { cover_main } = values;
    const data = {
      ...pick(values, keys),
    };
    if (typeof cover_main !== 'string' && !!cover_main) {
      data.cover_main = cover_main;
    }
    if (initial && initial.id) {
      data.id = initial.id;
    }
    if (!values.forRent) data.rental_days = 0;

    if (
      initial &&
      [
        VideoProvider.YOUTUBE_URL_PROVIDER,
        VideoProvider.VIMEO_URL_PROVIDER,
      ].includes(initial.provider_identifier)
    ) {
      const hours = values._duration_hours;
      const minutes = values._duration_minutes;

      const duration_second = minutes * 60 + hours * 3600;
      data.duration_second = duration_second;
    }
    onSubmit(data, {
      onSuccess: () => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess();
        setSubmitting(false);
      },
      onError: () => {
        if (onError && typeof onError === 'function') onError();
        setSubmitting(false);
      },
    });
  },
});
