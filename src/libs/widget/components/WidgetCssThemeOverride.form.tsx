// @ts-nocheck
import React, { useEffect, useCallback, useRef } from 'react';
import { TFunction } from 'i18next';

import { compose } from 'recompose';
import * as Yup from 'yup';
import { withFormik, Form, FormikProps, useField } from 'formik';
import { useTranslation } from 'react-i18next';
import EditIcon from '@material-ui/icons/Edit';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import InputAdornment from '@material-ui/core/InputAdornment';
import HeightIcon from '@material-ui/icons/Height';
import CropFreeIcon from '@material-ui/icons/CropFree';
import ColorizeIcon from '@material-ui/icons/Colorize';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import ReplayIcon from '@material-ui/icons/Replay';

import {
  ButtonBase,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import { Submit, IntegerField, ColorField } from '#components/forms';
import withConfirm from '#hocs/with-confirm.hoc';
import { MaterialUiSingleSelectorField } from '#libs/custom-form/components/GenericFormik.input';
import { CompanyTheme, WidgetCustomCSS } from '#libs/theme/types';

type OuterProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  initial: WidgetCustomCSS;
  theme: CompanyTheme;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (
    values: WidgetCustomCSS,
    setSubmitting?: (bool: boolean) => void,
  ) => void;
  onPreview: (values: WidgetCustomCSS) => void;
};

type Values = WidgetCustomCSS;

const WidgetCssThemeOverrideSchema = Yup.object().shape({});

const getDefault = (theme: CompanyTheme) => ({
  fontFamily: 'Roboto',
  spacing: 8,
  border: 4,
  backgroundPaper: '#ffffff',
  secondaryBackgroundPaper: '#f6f8fa',
  background: '#ffffff00',
  primaryColor: theme.primary_color,
  secondaryColor: theme.secondary_color,
  greyDark: '#2D3748',
  grey: '#687586',
  greyLight: '#f1f3f4',
});

export const WidgetCssThemeOverrideForm: React.FC<
  OuterProps & FormikProps<Values>
> = ({
  theme,
  isSubmitting,
  isValid,
  values,
  onSubmit,
  setValues,
  onPreview,
}) => {
  const { t } = useTranslation(['widget']);
  const classes = useStyles();

  useEffect(() => {
    onPreview(values);
  }, [onPreview, values]);

  const handleReset = useCallback(() => {
    const defaultStyle = getDefault(theme);
    setValues(defaultStyle);
    onSubmit(defaultStyle);
  }, [onSubmit, setValues, theme]);

  return (
    <Form>
      <div className={classes.fieldsWrapper}>
        <div>
          <Typography className={classes.title} variant="h6">
            <EditIcon className={classes.icon} />
            {t('widget.cssEditor.general')}
          </Typography>
          <div className={classes.spacedRow}>
            <ResetableField theme={theme} name="spacing">
              <IntegerField
                name="spacing"
                label={t('widget.cssEditor.spacing')}
                helperText={t('widget.cssEditor.spacingHelper', {
                  base: values.spacing,
                })}
                variant="outlined"
                castAsNumber
                InputProps={{
                  min: 0,
                  step: 1,
                  startAdornment: (
                    <InputAdornment position="start">
                      <HeightIcon className={classes.icon} />
                    </InputAdornment>
                  ),
                }}
              />
            </ResetableField>
            <ResetableField theme={theme} name="border">
              <IntegerField
                name="border"
                label={t('widget.cssEditor.rounding')}
                helperText={t('widget.cssEditor.roundingHelper', {
                  base: values.border,
                })}
                variant="outlined"
                castAsNumber
                InputProps={{
                  min: 0,
                  step: 1,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CropFreeIcon className={classes.icon} />
                    </InputAdornment>
                  ),
                }}
              />
            </ResetableField>
          </div>
          <Typography className={classes.title} variant="h6">
            <TextFieldsIcon className={classes.icon} />
            {t('widget.cssEditor.typography')}
          </Typography>
          <div className={classes.spacedRow}>
            <ResetableField theme={theme} name="fontFamily">
              <MaterialUiSingleSelectorField
                name="fontFamily"
                placeholder="Font"
                label="Font"
                options={SAFE_FONTS}
              />
            </ResetableField>
            <ResetableField theme={theme} name="greyDark">
              <ColorField
                name="greyDark"
                label={t('widget.cssEditor.typographyColor')}
              />
            </ResetableField>
            <ResetableField theme={theme} name="grey">
              <ColorField
                name="grey"
                label={t('widget.cssEditor.subtypographyColor')}
              />
            </ResetableField>
          </div>
        </div>
        <div>
          <Typography className={classes.title} variant="h6">
            <ColorLensIcon className={classes.icon} />
            {t('widget.cssEditor.colors')}
          </Typography>
          <div className={classes.spacedRow}>
            <ResetableField theme={theme} name="primaryColor">
              <ColorField
                name="primaryColor"
                label={t('widget.cssEditor.mainColor')}
              />
            </ResetableField>
            <ResetableField theme={theme} name="secondaryColor">
              <ColorField
                name="secondaryColor"
                label={t('widget.cssEditor.secondaryColor')}
              />
            </ResetableField>
            <ResetableField theme={theme} name="greyLight">
              <ColorField
                name="greyLight"
                label={t('widget.cssEditor.borderColor')}
              />
            </ResetableField>
          </div>
          <Typography className={classes.title} variant="h6">
            <ColorizeIcon className={classes.icon} />
            {t('widget.cssEditor.backgroundColor')}
          </Typography>
          <div className={classes.spacedRow}>
            <ResetableField theme={theme} name="background">
              <ColorField
                name="background"
                label={t('widget.cssEditor.backgroundColorPage')}
                withAlpha
              />
            </ResetableField>
            <ResetableField theme={theme} name="backgroundPaper">
              <ColorField
                name="backgroundPaper"
                label={t('widget.cssEditor.backgroundColorElement')}
                withAlpha
              />
            </ResetableField>
            <ResetableField theme={theme} name="secondaryBackgroundPaper">
              <ColorField
                name="secondaryBackgroundPaper"
                label={t('widget.cssEditor.secondaryBackgroundColorElement')}
                withAlpha
                buttonStyle={classes.colorButton}
              />
            </ResetableField>
          </div>
        </div>
        <ButtonWithConfirmMenuItem onClick={handleReset} />
      </div>
      <div className={classes.submitWrapper}>
        <Submit disabled={isSubmitting || !isValid} color="primary">
          {t('widget.cssEditor.submit')}
        </Submit>
      </div>
    </Form>
  );
};

const ButtonWithConfirmMenuItem = withConfirm(
  ({ onClick }: { onClick: () => void }) => {
    const { t } = useTranslation(['widget']);
    const classes = useStyles();

    return (
      <ButtonBase className={classes.buttonReset} onClick={onClick}>
        <ReplayIcon className={classes.icon} />
        <Typography color="textSecondary" className={classes.upperCase}>
          {t('widget.cssEditor.reset')}
        </Typography>
      </ButtonBase>
    );
  },
  'onClick',
  {
    title: 'widget:widget.cssEditor.dialog.title',
    cancel: 'widget:widget.cssEditor.dialog.cancel',
    confirm: 'widget:widget.cssEditor.dialog.confirm',
    Content: ({ t }: { t: TFunction }) => (
      <p>{t('widget:widget.cssEditor.dialog.content')}</p>
    ),
    isDeletion: true,
  },
);

const SAFE_FONTS = [
  { label: 'Roboto', value: 'Roboto' },
  {
    label: 'Arial',
    value: 'Arial, sans-serif, Roboto, Arial',
  },
  {
    label: 'Verdana',
    value: 'Verdana, sans-serif, Roboto, Arial',
  },
  {
    label: 'Helvetica',
    value: 'Helvetica, sans-serif, Roboto, Arial',
  },
  {
    label: 'Tahoma',
    value: 'Tahoma, sans-serif, Roboto, Arial',
  },
  {
    label: 'Trebuchet MS',
    value: "'Trebuchet MS', sans-serif,  Roboto, Arial",
  },
  {
    label: 'Times New Roman',
    value: "'Times New Roman', serif,  Roboto, Arial",
  },
  {
    label: 'Georgia',
    value: 'Georgia, serif, Roboto, Arial',
  },
  {
    label: 'Garamond',
    value: 'Garamond, serif, Roboto, Arial',
  },
  {
    label: 'Courier New',
    value: "'Courier New', monospace,  Roboto, Arial",
  },
  {
    label: 'Brush Script MT',
    value: "'Brush Script MT', cursive,  Roboto, Arial",
  },
];

const useStyles = makeStyles((theme: Theme) => ({
  colorButton: {
    width: 'fit-content',
  },
  fieldsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    position: 'relative',
  },
  spacedRow: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(4),
  },
  reset: {
    width: 42,
    height: 42,
  },
  resetRow: {
    flex: 1,
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
  },
  submitWrapper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  icon: {
    fill: theme.palette.grey[600],
  },
  buttonReset: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 5,
  },
  upperCase: {
    textTransform: 'uppercase',
  },
}));

const ResetableField: React.FC<{ name: keyof Values; theme: CompanyTheme }> = ({
  name,
  theme,
  children,
}) => {
  const classes = useStyles();
  const defaultValue = useRef(getDefault(theme)?.[name]);
  const [field, , helpers] = useField(name);
  const handleReset = useCallback(() => {
    helpers.setValue(defaultValue.current);
  }, [helpers]);

  return (
    <div className={classes.resetRow}>
      {children}
      <div className={classes.reset}>
        {defaultValue.current !== field.value && (
          <IconButton color="inherit" onClick={handleReset}>
            <ReplayIcon
              width={20}
              height={20}
              className={classes.icon}
              fontSize="small"
            />
          </IconButton>
        )}
      </div>
    </div>
  );
};
export default compose<any, OuterProps>(
  withFormik<OuterProps, Values>({
    mapPropsToValues: ({ initial, theme }) => {
      const defaultStyle = getDefault(theme);

      return {
        fontFamily: initial?.fontFamily ?? defaultStyle?.fontFamily,
        spacing: initial?.spacing ?? defaultStyle?.spacing,
        border: initial?.border ?? defaultStyle?.border,
        backgroundPaper:
          initial?.backgroundPaper ?? defaultStyle?.backgroundPaper,
        secondaryBackgroundPaper:
          initial?.secondaryBackgroundPaper ??
          defaultStyle?.secondaryBackgroundPaper,
        background: initial?.background ?? defaultStyle?.background,
        primaryColor: initial?.primaryColor ?? defaultStyle?.primaryColor,
        secondaryColor: initial?.secondaryColor ?? defaultStyle?.secondaryColor,
        greyDark: initial?.greyDark ?? defaultStyle?.greyDark,
        grey: initial?.grey ?? defaultStyle?.grey,
        greyLight: initial?.greyLight ?? defaultStyle?.greyLight,
      };
    },
    enableReinitialize: true,
    validationSchema: WidgetCssThemeOverrideSchema,
    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
      setSubmitting(true);
      onSubmit(values, setSubmitting);
    },
  }),
)(WidgetCssThemeOverrideForm);
