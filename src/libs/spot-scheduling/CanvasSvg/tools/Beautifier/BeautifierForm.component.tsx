import React from 'react';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import type { OptionCallback } from '../../../../../state/types';
// @ts-expect-error
import { IntegerField, TextField } from '../../../../../components/forms';
import { CanvasElement } from '../BaseClasses/Base.tool';

const AssetUploaderSchema = Yup.object().shape({
  fill: Yup.string().nullable(),
  height: Yup.number().nullable(false),
  rotation: Yup.number().nullable(false).min(0).max(360),
  stroke: Yup.string().nullable(),
  strokeWidth: Yup.string().nullable(),
  width: Yup.number().nullable(false),
  x: Yup.number().nullable(false),
  y: Yup.number().nullable(false),
});

const getInitialValues = (canvasElement: CanvasElement<any>) => {
  return canvasElement
    ? {
        ...canvasElement.data,
        strokeWidth: canvasElement.data?.strokeWidth
          ? parseInt(canvasElement.data?.strokeWidth)
          : 1,
      }
    : {};
};

type Props = {
  onSubmit: (values: any, options?: OptionCallback) => void;
  loading: boolean;
  canvasElement: CanvasElement<any>;
};

export const BeautifierForm: React.FC<Props> = ({
  onSubmit,
  loading,
  canvasElement,
}) => {
  const { t } = useTranslation('spotScheduling');
  const classes = useStyles();

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
                  <IntegerField fullWidth label="height" name="height" />
                  <IntegerField fullWidth label="width" name="width" />
                  <IntegerField fullWidth label="x" name="x" />
                  <IntegerField fullWidth label="y" name="y" />
                  <IntegerField fullWidth label="rotation" name="rotation" />
                  <IntegerField
                    fullWidth
                    label="strokeWidth"
                    name="strokeWidth"
                  />
                  <TextField
                    transparentColorAvailable
                    label="fill"
                    name="fill"
                  />
                  <TextField
                    transparentColorAvailable
                    label="stroke"
                    name="stroke"
                  />
                  <Button
                    color="primary"
                    disabled={loading}
                    type="submit"
                    variant="contained"
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
  field: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  imageInput: {
    cursor: 'pointer',
    marginTop: theme.spacing(1),
    height: 100,
    width: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[200],
    borderRadius: 5,
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
    },
  },
  imageInputIcon: {
    cursor: 'pointer',
  },
  previewContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: theme.spacing(1),
    alignItems: 'center',
    maxWidth: '100%',
    justifyContent: 'space-around',
  },
  rightIcons: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  fileName: { paddingTop: theme.spacing(1) },
  spotStatus: { whiteSpace: 'nowrap', overFlow: 'hidden' },
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  centered: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
