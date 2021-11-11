import React from 'react';

import { compose } from 'recompose';
import lodash from 'lodash';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Theme, Paper, Fab, Tooltip, makeStyles } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PhoneIphone from '@material-ui/icons/PhoneIphone';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import { useTranslation, WithTranslation } from 'react-i18next';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import { useTheme } from '@material-ui/styles';
import {
  ConsumerFormFields,
  ConsumerFormFieldsHOC,
} from '../consumer-form/CustomForm.formik-hoc';
import type { CustomForm, ResponsiveLayouts } from '../../types';
import { Layout } from '../../types';
import { layoutsBuilder } from '../../utils';
import CustomFormSkeleton from '../CustomFormSkeleton.component';

type OwnProps = {
  asManager: Boolean;
  initial?: CustomForm;
  editable: boolean;
  layouts?: ResponsiveLayouts;
  saveLayouts?: () => void;
  onLayoutChange: (allLayouts: ResponsiveLayouts) => void;
  waiver?: string;
  general_terms_and_conditions?: string;
  setOutterContainerWidth: (width: number) => void;
  defaultEditMode?: boolean;
};

type Props = OwnProps & WithTranslation;

export const CustomFormLayoutView = (props: Props) => {
  const {
    initial,
    editable,
    layouts: propsLayouts,
    saveLayouts,
    onLayoutChange,
    setOutterContainerWidth,
    defaultEditMode,
  } = props;
  const [currentLayoutIndex, setCurrentLayoutIndex] = React.useState(-1);
  const [isEditing, setIsEditing] = React.useState(defaultEditMode || false);
  const [recordLayouts, setRecordLayouts] = React.useState(
    Object.keys(props?.layouts || {})?.length === 4 ? [propsLayouts] : [],
  );
  const [layouts, setLayouts] = React.useState(
    Object.keys(props?.layouts || {})?.length !== 4 ? null : propsLayouts,
  );
  const [customLoading, setCustomLoading] = React.useState(false);
  const [containerWidth, setContainerWith] = React.useState(385);
  const theme: Theme = useTheme();

  React.useEffect(() => {
    if (isEditing && !layouts && !recordLayouts.length) {
      setLayouts(layoutsBuilder([...props?.initial?.custom_form_field]));
    }
  }, [props?.initial?.custom_form_field, isEditing, layouts, recordLayouts]);

  const onNewLayout = () => {
    setCurrentLayoutIndex(0);
    setRecordLayouts(layouts?.length ? [layouts] : []);
    setLayouts(null);
  };

  React.useEffect(() => {
    setCustomLoading(true);
    setTimeout(() => {
      setCustomLoading(false);
    }, 500);
    setOutterContainerWidth && setOutterContainerWidth(containerWidth);
  }, [containerWidth, setOutterContainerWidth]);

  const handleLayoutChange = (
    newLayouts: Array<Layout>,
    allLayouts: ResponsiveLayouts,
  ) => {
    if (lodash.isEqual(allLayouts, layouts)) {
      return;
    }

    if (!editable) {
      return;
    }

    setRecordLayouts([
      ...recordLayouts.slice(0, currentLayoutIndex + 1),
      allLayouts,
      ...recordLayouts.slice(currentLayoutIndex + 1),
    ]);
    setCurrentLayoutIndex(currentLayoutIndex + 1);
    setLayouts(allLayouts);
    onLayoutChange(allLayouts);
  };

  const onGoingBack = () => {
    setLayouts(recordLayouts[currentLayoutIndex - 1]);
    setCurrentLayoutIndex(currentLayoutIndex - 1);
    onLayoutChange(recordLayouts[currentLayoutIndex - 1]);
  };

  const onGoingForward = () => {
    setCurrentLayoutIndex(currentLayoutIndex + 1);
    setLayouts(recordLayouts[currentLayoutIndex + 1]);
    onLayoutChange(recordLayouts[currentLayoutIndex + 1]);
  };

  const handleWidthChange = (newValue: number) => {
    setContainerWith(newValue);
  };

  const classes = useStyles();
  const { t } = useTranslation('marketing');
  const marks = [
    {
      value: 375 + 10,
      label: t('customForm.breakpoints.xs'),
    },
    {
      value: theme.breakpoints.values.sm + 10,
      label: t('customForm.breakpoints.sm'),
    },
    {
      value: theme.breakpoints.values.md + 10,
      label: t('customForm.breakpoints.md'),
    },
    {
      value: theme.breakpoints.values.lg + 10,
      label: t('customForm.breakpoints.lg'),
    },
  ];

  const valuetext = (value: number) => {
    return `${value}`;
  };

  const valueLabelFormat = (value: number) => {
    return marks.findIndex((mark) => mark.value === value) + 1;
  };
  return (
    <div>
      {initial?.custom_form_field ? (
        <>
          <div className={classes.container}>
            <div className={classes.sitckyToolBarContainer}>
              <div>
                <div className={classes.stickyTools}>
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={isEditing}
                        onChange={() => setIsEditing(!isEditing)}
                        name="edit_custom_form"
                        color="primary"
                      />
                    }
                    label={t('customForm.layout.editLayout')}
                  />
                  <Tooltip title={t('customForm.layout.undo')}>
                    <Fab
                      color="primary"
                      disabled={!isEditing || currentLayoutIndex === 0}
                      onClick={onGoingBack}
                      size="small"
                    >
                      <ArrowBackIcon />
                    </Fab>
                  </Tooltip>
                  <Tooltip title={t('customForm.layout.reset')}>
                    <Fab color="primary" size="small" onClick={onNewLayout}>
                      <SettingsBackupRestoreIcon />
                    </Fab>
                  </Tooltip>
                  <Tooltip title={t('customForm.layout.redo')}>
                    <Fab
                      color="primary"
                      size="small"
                      disabled={
                        !isEditing ||
                        currentLayoutIndex >= recordLayouts.length - 1
                      }
                      onClick={onGoingForward}
                    >
                      <ArrowForwardIcon />
                    </Fab>
                  </Tooltip>

                  <Tooltip
                    title={t('customForm.layout.save')}
                    onClick={() => saveLayouts()}
                  >
                    <Fab color="primary" size="small">
                      <SaveIcon />
                    </Fab>
                  </Tooltip>
                </div>

                <div className={classes.slider}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <PhoneIphone />
                    </Grid>
                    <Grid item xs>
                      <Slider
                        defaultValue={375 + 10}
                        value={containerWidth}
                        onChange={(e: any, value: number) =>
                          handleWidthChange(value)
                        }
                        step={null}
                        aria-labelledby="continuous-slider"
                        marks={marks}
                        valueLabelFormat={valueLabelFormat}
                        getAriaValueText={valuetext}
                        min={375 + 10}
                        max={theme.breakpoints.values.lg + 10}
                      />
                    </Grid>
                    <Grid item>
                      <DesktopWindowsIcon />
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
            <div className={classes.formContainer}>
              <Paper className={classes.paperContainer}>
                <div
                  id="custom-form-divice-container"
                  className={classes.form}
                  style={{ width: `${containerWidth}px` }}
                >
                  {customLoading ? (
                    <CustomFormSkeleton
                      customForm={initial}
                      layouts={layouts}
                    />
                  ) : (
                    <ConsumerFormFields
                      {...props}
                      onLayoutChange={handleLayoutChange}
                      layouts={layouts}
                      isEditing={isEditing}
                      customProviderWidth={containerWidth}
                    />
                  )}
                </div>
              </Paper>
            </div>
          </div>
        </>
      ) : (
        <CustomFormSkeleton customForm={initial} layouts={layouts} />
      )}
    </div>
  );
};

export default compose<any, Props>(ConsumerFormFieldsHOC)(CustomFormLayoutView);

const useStyles = makeStyles((theme: Theme) => {
  return {
    paperContainer: {
      padding: theme.spacing(2),
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: theme.spacing(6),
    },
    sitckyToolBarContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    stickyTools: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
    },
    form: {
      width: '100%',
    },
    formContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    slider: {
      paddingTop: theme.spacing(1),
    },
  };
});
