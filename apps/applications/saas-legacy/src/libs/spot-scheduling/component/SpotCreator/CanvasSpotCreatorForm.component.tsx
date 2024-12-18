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
import type {
  SpotType,
  SpotToUpdate,
  SpotNameFormatCustomization,
  SpotNameFormatCustomizationChoices,
} from '#src/libs/spot-scheduling/types';
import { OptionCallback } from '../../../../state/types';
import PersonalizedSpotCreator from './PersonalizedSpotCreator.component';
import PredefinedSpotCreator from './PredefinedSpotCreator.component';

// @ts-expect-error
import { TextField, RadioGroupField } from '../../../../components/forms';
import SpotNameCustomizationCreatorComponent from './SpotNameCustomizationCreator.component';
import {
  NO_NAME_CUSTOMIZATION,
  PREFIX_NAME_CUSTOMIZATION,
  SUFFIX_NAME_CUSTOMIZATION,
} from '#src/libs/spot-scheduling/constants';

type Props = {
  onCreateSpot: (
    spotType: SpotType,
    options: OptionCallback,
    default_spot: boolean,
    name_format_customization: SpotNameFormatCustomization,
  ) => void;
  onUpdateSpot: (
    spotType: SpotType,
    options: OptionCallback,
    name_format_customization: SpotNameFormatCustomization,
  ) => void;
  spotTypeToUpdate: false | SpotToUpdate;
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
  const NO_NAME_CUSTOMIZATION_FORMAT: SpotNameFormatCustomizationChoices = {
    value: NO_NAME_CUSTOMIZATION,
    label: t('spotCreatorForm.nameCustomization.none'),
  };
  const PREFIX_NAME_CUSTOMIZATION_FORMAT: SpotNameFormatCustomizationChoices = {
    value: PREFIX_NAME_CUSTOMIZATION,
    label: t('spotCreatorForm.nameCustomization.prefix'),
  };
  const SUFFIX_NAME_CUSTOMIZATION_FORMAT: SpotNameFormatCustomizationChoices = {
    value: SUFFIX_NAME_CUSTOMIZATION,
    label: t('spotCreatorForm.nameCustomization.suffix'),
  };
  const SPOT_NAME_FORMAT_CUSTOMIZATION: SpotNameFormatCustomizationChoices[] = [
    NO_NAME_CUSTOMIZATION_FORMAT,
    PREFIX_NAME_CUSTOMIZATION_FORMAT,
    SUFFIX_NAME_CUSTOMIZATION_FORMAT,
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
    suffix: '',
    customization: PREDEFINED_CUSTOMIZATION,
    shape: 'circular',
    stroke_color: 'black',
    fill_color: '',
    free_image: '',
    taken_image: '',
    selected_image: '',
    name_format_customization: NO_NAME_CUSTOMIZATION,
  };
  let updating = '';
  let initialShape = SPOT_SHAPE_CHOICE[0];
  let initialNameFormat = NO_NAME_CUSTOMIZATION_FORMAT;
  if (spotTypeToUpdate) {
    updating = spotTypeToUpdate.free_image;

    const customization = spotTypeToUpdate.customization;

    switch (spotTypeToUpdate.shape) {
      case 'triangle':
        initialShape = SPOT_SHAPE_CHOICE[1];
        break;
      case 'rectangle':
        initialShape = SPOT_SHAPE_CHOICE[2];
        break;
      case 'square':
        initialShape = SPOT_SHAPE_CHOICE[3];
        break;
      default:
        break;
    }

    if (!spotTypeToUpdate.name_format_customization) {
      // Happens when loading an existing spot, as long as name_format_customization isn't stored in the database,
      // we need to infer it from the prefix and suffix
      if (spotTypeToUpdate.prefix) {
        initialNameFormat = PREFIX_NAME_CUSTOMIZATION_FORMAT;
      } else if (spotTypeToUpdate.suffix) {
        initialNameFormat = SUFFIX_NAME_CUSTOMIZATION_FORMAT;
      } else {
        initialNameFormat = NO_NAME_CUSTOMIZATION_FORMAT;
      }
    }

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
      suffix: spotTypeToUpdate.suffix ? spotTypeToUpdate.suffix : '',
      name_format_customization:
        spotTypeToUpdate.name_format_customization ?? initialNameFormat.value,
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
        <svg height="26" width="26">
          <circle
            cx="13"
            cy="13"
            fill={fill || 'white'}
            r="11"
            stroke={stroke || 'black'}
            strokeWidth="2"
          />
          <text
            dominantBaseline="middle"
            style={{ userSelect: 'none' }}
            textAnchor="middle"
            x="13"
            y="14"
          >
            {text}
          </text>
        </svg>
      </div>
    );
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        if (spotTypeToUpdate) {
          onUpdateSpot(
            values,
            {
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
            },
            values.name_format_customization,
          );
        } else {
          onCreateSpot(
            values,
            {
              onSuccess: () => {
                actions.setSubmitting(false);
                // @ts-expect-error
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
            values.name_format_customization,
          );
        }
      }}
      validationSchema={CanvasSpotCreatorSchema}
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
                fullWidth
                required
                id="textfield_spot_name"
                inputProps={{ maxLength: 100 }}
                label={t('spotCreatorForm.name')}
                name="name"
              />
              <Typography
                className={classes.explain}
                color="textSecondary"
                variant="caption"
              >
                {t('spotCreatorForm.nameExplain')}
              </Typography>
            </div>
            <SpotNameCustomizationCreatorComponent
              choices={SPOT_NAME_FORMAT_CUSTOMIZATION}
              defaultValue={initialNameFormat}
              renderExample={renderExample}
              setFieldValue={formikProps.setFieldValue}
              values={formikProps.values}
            />
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
              choices={SPOT_CUSTOMIZATION_CHOICE}
              className={classes.spotCustomization}
              name="customization"
            />
            {formikProps.values?.customization === PREDEFINED_CUSTOMIZATION && (
              <PredefinedSpotCreator
                choices={SPOT_SHAPE_CHOICE}
                defaultValue={initialShape}
                setFieldValue={formikProps.setFieldValue}
                values={formikProps.values}
              />
            )}

            {formikProps.values?.customization ===
              PERSONALIZED_CUSTOMIZATION && (
              <PersonalizedSpotCreator
                // @ts-expect-error
                renderExample={(text?, stroke?, fill?) =>
                  renderExample(
                    classes.exampleBottom,
                    text || '',
                    stroke || '',
                    fill || 'transparent',
                  )
                }
                setFieldValue={formikProps.setFieldValue}
                updating={updating}
                values={formikProps.values}
              />
            )}
            {defaultSpot && (
              <div className={classes.alertDefaultSpot}>
                <Alert
                  className={props.classes.alert}
                  severity="error"
                  variant="outlined"
                >
                  {t('spotCreatorForm.alertDefaultSpot')}
                </Alert>
              </div>
            )}
            <DialogActions className={classes.action}>
              <Button color="secondary" onClick={props.closeDialog}>
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
  suffix: Yup.string()
    .max(1, 'spotScheduling:spotCreatorForm.suffixError')
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
  // @ts-expect-error
  withStyles(styles),
  withTranslation('spotScheduling'),
  // @ts-expect-error
)(CanvasSpotCreatorForm);
