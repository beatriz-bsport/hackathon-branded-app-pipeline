import React from 'react';
import classnames from 'classnames';
import { compose } from 'recompose';
import { Formik, FormikProps } from 'formik';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import InfoIcon from '@material-ui/icons/Info';
import CreateIcon from '@material-ui/icons/Create';
import { useTranslation, withTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { Divider, Theme, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { OptionCallback } from '../../../../state/types';
import PersonalizedSpotCreator from './PersonalizedSpotCreator.component';
import PredefinedSpotCreator from './PredefinedSpotCreator.component';

import { TextField, RadioGroupField } from '../../../../components/forms';
import { SpotType } from '#libs/spot-scheduling/types';

type Props = {
  onCreateSpot: (
    spotType: SpotType,
    options: OptionCallback,
    default_spot: boolean,
  ) => void;
  onUpdateSpot: (spotType: SpotType, options: OptionCallback) => void;
  spotTypeToUpdate: false | SpotType;
  closeDialog: () => void;
  resetInitial: () => void;
  classes: any;
  defaultSpot: boolean;
};

export const PREDEFINED_CUSTOMIZATION = 'predefined';
export const PERSONALIZED_CUSTOMIZATION = 'personalized';

export const CanvasSpotCreatorForm = (props: Props) => {
  const {
    closeDialog,
    resetInitial,
    classes,
    onCreateSpot,
    onUpdateSpot,
    spotTypeToUpdate,
    defaultSpot,
  } = props;
  const { t } = useTranslation('spotScheduling');

  const SPOT_SHAPE_CHOICE = [
    { value: 'circular', label: t('spotCreatorForm.circular') },
    { value: 'triangle', label: t('spotCreatorForm.triangle') },
    { value: 'rectangle', label: t('spotCreatorForm.rectangle') },
    { value: 'square', label: t('spotCreatorForm.square') },
  ];
  const SPOT_CUSTOMIZATION_CHOICE = [
    { label: t('spotCreatorForm.predefined'), value: PREDEFINED_CUSTOMIZATION },
    {
      label: t('spotCreatorForm.personalized'),
      value: PERSONALIZED_CUSTOMIZATION,
    },
  ];
  let initialValues = {
    name: '',
    prefix: '',
    customization: PREDEFINED_CUSTOMIZATION,
    shape: 'circular',
    stroke_color: 'black',
    fill_color: '',
    free_image: '',
    taken_image: '',
    selected_image: '',
  };
  let updating = '';
  if (spotTypeToUpdate) {
    updating = spotTypeToUpdate.free_image;

    const customization = spotTypeToUpdate.customization;
    initialValues = {
      ...spotTypeToUpdate,
      customization,
      fill_color: spotTypeToUpdate.fill_color
        ? spotTypeToUpdate.fill_color
        : '',
      stroke_color: spotTypeToUpdate.stroke_color
        ? spotTypeToUpdate.stroke_color
        : 'black',
      prefix: spotTypeToUpdate.prefix ? spotTypeToUpdate.prefix : '',
    };
  }

  const renderExample = (
    className: string,
    text?: string,
    stroke?: string,
    fill?: string,
  ) => {
    return (
      <div className={className}>
        <Typography variant="body2">
          {className === classes.exampleTop ? 'Ex' : 'Ex :'}
        </Typography>
        <svg width="26" height="26">
          <circle
            cx="13"
            cy="13"
            r="11"
            fill={fill || 'white'}
            stroke={stroke || 'black'}
            strokeWidth="2"
          />
          <text
            x="13"
            y="14"
            dominantBaseline="middle"
            textAnchor="middle"
            style={{ userSelect: 'none' }}
          >
            {text}
          </text>
        </svg>
      </div>
    );
  };

  return (
    <Formik
      onSubmit={(values, actions) => {
        if (spotTypeToUpdate) {
          onUpdateSpot(values, {
            onSuccess: () => {
              actions.setSubmitting(false);
              closeDialog && closeDialog();
              resetInitial && resetInitial();
            },
            onError: () => {
              actions.setSubmitting(false);
              closeDialog && closeDialog();
              resetInitial && resetInitial();
            },
          });
        } else {
          onCreateSpot(
            values,
            {
              onSuccess: () => {
                actions.setSubmitting(false);
                closeDialog && closeDialog(defaultSpot);
                resetInitial && resetInitial();
              },
              onError: () => {
                actions.setSubmitting(false);
                closeDialog && closeDialog();
                resetInitial && resetInitial();
              },
            },
            defaultSpot,
          );
        }
      }}
      initialValues={initialValues}
      validationSchema={CanvasSpotCreatorSchema}
      enableReinitialize
    >
      {(formikProps: FormikProps<any>) => {
        return (
          <form onSubmit={formikProps.handleSubmit}>
            <div className={classes.headerWithIcon}>
              <InfoIcon
                className={classnames(classes.leftIcon, classes.greyIcon)}
              />
              <Typography variant="h6">
                {t('spotCreatorForm.generalInfo')}
              </Typography>
            </div>
            <div className={classes.field}>
              <TextField
                id="textfield_spot_name"
                label={t('spotCreatorForm.name')}
                name="name"
                required
                fullWidth
                inputProps={{ maxLength: 100 }}
              />
              <Typography
                className={classes.explain}
                variant="caption"
                color="textSecondary"
              >
                {t('spotCreatorForm.nameExplain')}
              </Typography>
            </div>
            <div className={classes.field}>
              <TextField
                id="textfield_spot_prefix"
                name="prefix"
                label={t('spotCreatorForm.prefix')}
                fullWidth
              />
              <Typography
                className={classes.explain}
                variant="caption"
                color="textSecondary"
              >
                <div className={classes.nameExplain}>
                  <div>{t('spotCreatorForm.prefixExplain')}</div>
                  <div>{formikProps.values?.prefix ? '1/1' : '0/1'}</div>
                </div>
              </Typography>
            </div>
            {renderExample(classes.exampleTop, '1B')}
            <Divider className={classes.divider} />
            <div className={classes.field}>
              <div className={classes.headerWithIcon}>
                <CreateIcon
                  className={classnames(classes.leftIcon, classes.greyIcon)}
                />
                <Typography variant="h6">
                  {t('spotCreatorForm.customization')}
                </Typography>
              </div>
            </div>
            <RadioGroupField
              name="customization"
              className={classes.spotCustomization}
              choices={SPOT_CUSTOMIZATION_CHOICE}
            />
            {formikProps.values?.customization === PREDEFINED_CUSTOMIZATION && (
              <PredefinedSpotCreator
                choices={SPOT_SHAPE_CHOICE}
                setFieldValue={formikProps.setFieldValue}
                values={formikProps.values}
                defaultValue={SPOT_SHAPE_CHOICE[0]}
              />
            )}

            {formikProps.values?.customization ===
              PERSONALIZED_CUSTOMIZATION && (
              <PersonalizedSpotCreator
                renderExample={(text?, stroke?, fill?) =>
                  renderExample(
                    classes.exampleBottom,
                    text || '',
                    stroke || '',
                    fill || 'transparent',
                  )
                }
                values={formikProps.values}
                setFieldValue={formikProps.setFieldValue}
                updating={updating}
              />
            )}
            {defaultSpot && (
              <div className={classes.alertDefaultSpot}>
                <Alert
                  severity="error"
                  variant="outlined"
                  className={props.classes.alert}
                >
                  {t('spotCreatorForm.alertDefaultSpot')}
                </Alert>
              </div>
            )}
            <DialogActions className={classes.action}>
              <Button onClick={props.closeDialog} color="secondary">
                {t('cancel')}
              </Button>
              <Button color="primary" type="submit" variant="contained">
                {t('save')}
              </Button>
            </DialogActions>
          </form>
        );
      }}
    </Formik>
  );
};

const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  field: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  explain: {
    marginBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  headerWithIcon: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: theme.spacing(2),
  },
  greyIcon: {
    color: '#868686',
  },
  nameExplain: { display: 'flex', justifyContent: 'space-between' },
  spotCustomization: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  selectField: { marginTop: theme.spacing(4), maxWidth: '40%' },
  sectionContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  customItemContainer: {
    opacity: '35%',
  },
  preview: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: theme.spacing(1),
    justifyContent: 'space-around',
    maxWidth: 300,
  },
  action: {
    padding: theme.spacing(4),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
  exampleTop: {
    display: 'flex',
    gap: theme.spacing(1),
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: theme.spacing(1),
    alignItems: 'center',
    maxWidth: 80,
    height: 34,
    justifyContent: 'space-around',
    marginBottom: theme.spacing(1),
  },
  exampleBottom: {
    display: 'flex',
    gap: '4px',
    borderRadius: theme.spacing(1),
    alignItems: 'center',
    maxWidth: 80,
    height: 34,
  },
  divider: {
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
    marginBottom: theme.spacing(2),
  },
  alertDefaultSpot: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(1),
    },
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  alert: {
    alignItems: 'center',
  },
});

const CanvasSpotCreatorSchema = Yup.object().shape({
  name: Yup.string().required(),
  prefix: Yup.string()
    .max(1, 'spotScheduling:spotCreatorForm.prefixError')
    .nullable(false),
  stroke_color: Yup.string(),
  fill_color: Yup.string(),
  customization: Yup.string().required(),
  free_image: Yup.mixed().when('customization', {
    is: PERSONALIZED_CUSTOMIZATION,
    then: Yup.mixed().required('spotScheduling:spotCreatorForm.missImageFree'),
  }),
  taken_image: Yup.mixed().when('customization', {
    is: PERSONALIZED_CUSTOMIZATION,
    then: Yup.mixed().required('spotScheduling:spotCreatorForm.missImageTaken'),
  }),
  selected_image: Yup.mixed().when('customization', {
    is: PERSONALIZED_CUSTOMIZATION,
    then: Yup.mixed().required(
      'spotScheduling:spotCreatorForm.missImageSelected',
    ),
  }),
});

export default compose(
  withStyles(styles),
  withTranslation('spotScheduling'),
)(CanvasSpotCreatorForm);
