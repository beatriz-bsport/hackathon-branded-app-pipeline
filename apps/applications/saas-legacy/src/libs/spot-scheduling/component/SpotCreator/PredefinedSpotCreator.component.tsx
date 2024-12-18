import { Grid, Typography, Theme, makeStyles } from '@material-ui/core';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
// @ts-expect-error
import { ColorField } from '../../../../components/forms';
import CanvasSpotComponent from '../../CanvasSvg/tools/Spot/CanvasSpot.component';
import {
  PREFIX_NAME_CUSTOMIZATION,
  SUFFIX_NAME_CUSTOMIZATION,
} from '../../constants';

const useStyles = makeStyles((theme: Theme) => ({
  selectField: { marginTop: theme.spacing(4), maxWidth: '40%' },
  sectionContainer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
  },
  customItemContainer: {
    opacity: '35%',
    height: '100%',
  },
  preview: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: theme.spacing(1),
    justifyContent: 'space-around',
    maxWidth: '300px',
    height: '78px',
  },
}));

// @ts-expect-error
export const PersonalizedSpotCreator = (props) => {
  const { t } = useTranslation('spotScheduling');
  const { choices, values, setFieldValue } = props;
  const classes = useStyles();
  const formattedValues = useMemo(
    () => ({
      ...values,
      prefix:
        values?.name_format_customization === PREFIX_NAME_CUSTOMIZATION
          ? values?.prefix
          : '',
      suffix:
        values?.name_format_customization === SUFFIX_NAME_CUSTOMIZATION
          ? values?.suffix
          : '',
    }),
    [values],
  );

  return (
    <div>
      <MaterialUISelector
        fullWidth
        className={classes.selectField}
        defaultValue={props.defaultValue}
        name="shape"
        // @ts-expect-error
        onChange={(option) => {
          setFieldValue('shape', option.value);
        }}
        options={choices}
      />
      <Grid className={classes.sectionContainer}>
        <Grid item xs={3}>
          <Typography className={classes.customItemContainer}>
            {t('toolsMenu.customStroke')}
          </Typography>
          <ColorField name="stroke_color" />
        </Grid>
        <Grid item xs={3}>
          <Typography className={classes.customItemContainer}>
            {t('toolsMenu.customFill')}
          </Typography>
          <ColorField name="fill_color" />
        </Grid>
        <Grid item className={classes.preview} xs={7}>
          <Typography>{t('spotCreatorForm.preview')}</Typography>
          <svg height={70} width={115}>
            {/* @ts-expect-error */}
            <CanvasSpotComponent
              fill={values?.fill_color}
              id={values?.id}
              index={1}
              indexType={1}
              selected={false}
              spotType={formattedValues}
              stroke={values?.stroke_color}
              taken={false}
              trianglePreview={values?.shape === 'triangle'}
              type={values?.shape}
              x={1}
              y={4}
            />
          </svg>
        </Grid>
      </Grid>
    </div>
  );
};

export default React.memo(PersonalizedSpotCreator);
