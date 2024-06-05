import React from 'react';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import type { SpotType } from '#libs/spot-scheduling/types';
import type { OptionCallback } from '../../../../../state/types';

import {
  HeightField,
  WidthField,
  PositionXField,
  PositionYField,
  RotationField,
  StrokeLineCapField,
  StrokeWidthField,
  StrokeColorField,
  FillField,
  ImageLinkField,
  FontSizeField,
  TextOffsetXField,
  TextOffsetYField,
  FontColorField,
  FontWeightField,
  StrokeDasharrayField,
  TextStrokeField,
  TextStrokeWidthField,
  FontStyleField,
  FontColorOnTakenField,
  FontColorOnSelectedField,
} from './BeautifierInputForm.component';
import { CanvasElement } from '../BaseClasses/Base.tool';
import { CANVAS_SELECTABLE_TOOLS } from '../CanvasStrategy';
import useBeautifierField from './useBeautifierField.hook';

const AssetUploaderSchema = Yup.object().shape({
  type: Yup.string().oneOf([
    CANVAS_SELECTABLE_TOOLS.door,
    CANVAS_SELECTABLE_TOOLS.line,
    CANVAS_SELECTABLE_TOOLS.rect,
    CANVAS_SELECTABLE_TOOLS.screen,
    CANVAS_SELECTABLE_TOOLS.spot,
    CANVAS_SELECTABLE_TOOLS.spotCustomized,
    CANVAS_SELECTABLE_TOOLS.teacher,
  ]),
  fill: Yup.string().nullable(),
  height: Yup.number().nullable(false),
  rotation: Yup.number().nullable(false).min(0).max(360),
  stroke: Yup.string().nullable(),
  strokeLinecap: Yup.string().oneOf(['butt', 'round', 'square']),
  strokeWidth: Yup.string().nullable(),
  width: Yup.number().nullable(false),
  x: Yup.number().nullable(false),
  y: Yup.number().nullable(false),
  image: Yup.string().nullable(),
  fontSize: Yup.number().nullable(),
  textOffsetX: Yup.number().nullable(),
  textOffsetY: Yup.number().nullable(),
  fontColor: Yup.string().nullable(),
});

const getInitialValues = (canvasElement: CanvasElement<any>) => {
  if (!canvasElement) {
    return {};
  }
  switch (canvasElement.type) {
    case CANVAS_SELECTABLE_TOOLS.door:
      return {
        type: canvasElement.type,
        ...canvasElement.data,
        strokeWidth: canvasElement.data?.strokeWidth
          ? parseInt(canvasElement.data?.strokeWidth)
          : 5,
      };
    default:
      return {
        type: canvasElement.type,
        ...canvasElement.data,
        strokeWidth: canvasElement.data?.strokeWidth
          ? parseInt(canvasElement.data?.strokeWidth)
          : 1,
      };
  }
};

type Props = {
  onSubmit: (values: any, options?: OptionCallback) => void;
  loading: boolean;
  canvasElement: CanvasElement<any>;
  spotTypes: SpotType[];
};

export const BeautifierForm: React.FC<Props> = ({
  onSubmit,
  loading,
  canvasElement,
  spotTypes,
}) => {
  const { t } = useTranslation('spotScheduling');
  const classes = useStyles();

  const {
    displayFill,
    displayHeight,
    displayRotation,
    displayStroke,
    displayStrokeLineCap,
    displayStrokeWidth,
    displayWidth,
    displayX,
    displayY,
    displayImageLink,
    displayFontSize,
    displayTextOffsetX,
    displayTextOffsetY,
    displayFontColor,
    displayFontWeight,
    displayStrokeDasharray,
    displayTextStroke,
    displayTextStrokeWidth,
    displayFontStyle,
    displayFontColorOnTaken,
    displayFontColorOnSelected,
  } = useBeautifierField(canvasElement, spotTypes);

  return (
    <Formik
      enableReinitialize
      initialValues={getInitialValues(canvasElement)}
      onSubmit={(values, actions) => {
        onSubmit(
          { ...values, strokeWidth: values?.strokeWidth?.toString() ?? '1' },
          {
            onSuccess: () => actions.resetForm(),
            onError: () => actions.resetForm(),
          },
        );
      }}
      validationSchema={AssetUploaderSchema}
    >
      {(formikProps: FormikProps<any>) => {
        return (
          <form onSubmit={formikProps.handleSubmit}>
            <div style={{ width: '100%' }}>
              <div className={classes.centered}>
                <div className={classes.formContainer}>
                  {displayHeight && <HeightField />}
                  {displayWidth && <WidthField />}
                  {displayX && <PositionXField />}
                  {displayY && <PositionYField />}
                  {displayFill && <FillField />}
                  {displayRotation && <RotationField />}
                  {displayStroke && <StrokeColorField />}
                  {displayStrokeWidth && <StrokeWidthField />}
                  {displayStrokeLineCap && <StrokeLineCapField />}
                  {displayTextStroke && <TextStrokeField />}
                  {displayFontStyle && <FontStyleField />}
                  {displayTextStrokeWidth && <TextStrokeWidthField />}
                  {displayImageLink && <ImageLinkField />}
                  {displayFontSize && <FontSizeField />}
                  {displayFontColor && <FontColorField />}
                  {displayFontColorOnTaken && <FontColorOnTakenField />}
                  {displayFontColorOnSelected && <FontColorOnSelectedField />}
                  {displayFontWeight && <FontWeightField />}
                  {displayTextOffsetX && <TextOffsetXField />}
                  {displayTextOffsetY && <TextOffsetYField />}
                  {displayStrokeDasharray && <StrokeDasharrayField />}
                  <Button
                    color="primary"
                    disabled={loading}
                    type="submit"
                    variant="text"
                  >
                    {t('assetUpoadForm.submit')}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

const useStyles = makeStyles((theme) => ({
  centered: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
  formContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default React.memo(BeautifierForm);
