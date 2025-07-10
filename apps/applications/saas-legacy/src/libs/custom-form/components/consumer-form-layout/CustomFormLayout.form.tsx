import React from 'react';

import { compose } from 'recompose';
import isEqual from 'lodash/isEqual';
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
import { Layout, CustomForm, ResponsiveLayouts } from '../../types';
import { layoutsBuilder } from '../../utils';
import CustomFormSkeleton from '../CustomFormSkeleton.component';
import { useCssVariantActivated } from '../../hooks/useCssVariantActivated';

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
  maxHeight?: string;
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
    maxHeight,
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
    // eslint-disable-next-line
  }, [containerWidth]);

  const handleLayoutChange = (
    newLayouts: Array<Layout>,
    allLayouts: ResponsiveLayouts,
  ) => {
    if (isEqual(allLayouts, layouts)) {
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

  const classes = useStyles({ maxHeight });
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

  const isCssVarientActivated = useCssVariantActivated();
  return (
    <div>
      {initial?.custom_form_field ? (
        <>
          <div className={classes.container}>
            <div className={classes.stickyToolBarContainer}>
              <div>
                <div className={classes.stickyTools}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isEditing}
                        color="primary"
                        name="edit_custom_form"
                        onChange={() => setIsEditing(!isEditing)}
                        size="small"
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
                    <Fab color="primary" onClick={onNewLayout} size="small">
                      <SettingsBackupRestoreIcon />
                    </Fab>
                  </Tooltip>
                  <Tooltip title={t('customForm.layout.redo')}>
                    <Fab
                      color="primary"
                      disabled={
                        !isEditing ||
                        currentLayoutIndex >= recordLayouts.length - 1
                      }
                      onClick={onGoingForward}
                      size="small"
                    >
                      <ArrowForwardIcon />
                    </Fab>
                  </Tooltip>

                  <Tooltip
                    onClick={() => saveLayouts()}
                    title={t('customForm.layout.save')}
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
                        aria-labelledby="continuous-slider"
                        defaultValue={375 + 10}
                        getAriaValueText={valuetext}
                        marks={marks}
                        max={theme.breakpoints.values.lg + 10}
                        min={375 + 10}
                        onChange={(e: any, value: number) =>
                          handleWidthChange(value)
                        }
                        step={null}
                        value={containerWidth}
                        valueLabelFormat={valueLabelFormat}
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
                  className={classes.form}
                  id="custom-form-divice-container"
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
                      customProviderWidth={containerWidth}
                      isEditing={isEditing}
                      layouts={layouts}
                      onLayoutChange={handleLayoutChange}
                      rowHeight={
                        initial?.is_signup
                          ? initial?.layout_configuration?.row_height
                          : null
                      }
                      shouldWrapLayerInCssHoc={isCssVarientActivated}
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

const useStyles = makeStyles<Theme, { maxHeight?: string }>((theme: Theme) => {
  return {
    paperContainer: ({ maxHeight }) => ({
      padding: theme.spacing(2),
      ...(maxHeight
        ? {
            maxHeight,
            overflowY: 'auto',
            overflowX: 'hidden',
            position: 'absolute',
          }
        : {}),
    }),
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: theme.spacing(6),
    },
    stickyToolBarContainer: {
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
