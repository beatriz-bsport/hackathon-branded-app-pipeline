import React, { useCallback, useMemo } from 'react';
import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
import { Theme, Typography, makeStyles } from '@material-ui/core';
import {
  NO_NAME_CUSTOMIZATION,
  PREFIX_NAME_CUSTOMIZATION,
  SUFFIX_NAME_CUSTOMIZATION,
} from '#src/libs/spot-scheduling/constants';
// @ts-expect-error
import { TextField } from '#src/components/forms';
import { useTranslation } from 'react-i18next';
import type {
  SpotNameFormatCustomizationChoices,
  SpotToUpdate,
} from '#src/libs/spot-scheduling/types';

interface Props {
  choices: SpotNameFormatCustomizationChoices[];
  values: SpotToUpdate;
  setFieldValue: (key: string, value: any) => void;
  renderExample: (
    className: string,
    text?: string,
    stroke?: string,
    fill?: string,
  ) => React.ReactNode;
  defaultValue: { value: string; label: string };
}

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1) / 2,
  },
  selectField: {
    maxWidth: '40%',
  },
  selectFieldNoSpotNameFormat: {
    maxWidth: '40%',
    marginBottom: theme.spacing(3),
  },
  nameExplain: { display: 'flex', justifyContent: 'space-between' },
  field: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  explain: {
    marginBottom: theme.spacing(2),
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
    marginBottom: theme.spacing(3),
  },
}));

export const PersonalizedSpotNameCustomizationCreator: React.FC<Props> = ({
  choices,
  values,
  setFieldValue,
  renderExample,
  defaultValue,
}) => {
  const { t } = useTranslation('spotScheduling');
  const classes = useStyles();

  const showNoNameCustomization = useMemo(
    () =>
      NO_NAME_CUSTOMIZATION === values?.name_format_customization ||
      !values?.name_format_customization,
    [values?.name_format_customization],
  );

  const setNameCustomization = useCallback(
    (option: { value: number; label: string }): void => {
      setFieldValue('name_format_customization', option.value);
    },
    [setFieldValue],
  );

  return (
    <div>
      <Typography
        className={classes.title}
        color="textSecondary"
        variant="subtitle1"
      >
        {t('spotCreatorForm.nameCustomization.title')}
      </Typography>
      <MaterialUISelector
        fullWidth
        className={
          showNoNameCustomization
            ? classes.selectFieldNoSpotNameFormat
            : classes.selectField
        }
        defaultValue={defaultValue}
        name="name_format_customization"
        onChange={setNameCustomization}
        options={choices}
      />
      {PREFIX_NAME_CUSTOMIZATION === values?.name_format_customization && (
        <>
          <div className={classes.field}>
            <TextField
              fullWidth
              id="textfield_spot_prefix"
              inputProps={{ maxLength: 1 }}
              label={t('spotCreatorForm.prefix')}
              name="prefix"
            />
            <Typography
              className={classes.explain}
              color="textSecondary"
              variant="caption"
            >
              <div className={classes.nameExplain}>
                <div>{t('spotCreatorForm.prefixExplain')}</div>
                <div>{values?.prefix ? '1/1' : '0/1'}</div>
              </div>
            </Typography>
          </div>
          {renderExample(classes.exampleTop, 'B1')}
        </>
      )}
      {SUFFIX_NAME_CUSTOMIZATION === values?.name_format_customization && (
        <>
          <div className={classes.field}>
            <TextField
              fullWidth
              id="textfield_spot_suffix"
              inputProps={{ maxLength: 1 }}
              label={t('spotCreatorForm.suffix')}
              name="suffix"
            />
            <Typography
              className={classes.explain}
              color="textSecondary"
              variant="caption"
            >
              <div className={classes.nameExplain}>
                <div>{t('spotCreatorForm.suffixExplain')}</div>
                <div>{values?.suffix ? '1/1' : '0/1'}</div>
              </div>
            </Typography>
          </div>
          {renderExample(classes.exampleTop, '1B')}
        </>
      )}
    </div>
  );
};

export default React.memo(PersonalizedSpotNameCustomizationCreator);
