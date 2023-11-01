import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import ImageIcon from '@material-ui/icons/Image';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import Alert from '@material-ui/lab/Alert/Alert';

import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import ImageFieldInput from '../../../../components/forms/ImageFieldInput';
import type { OptionCallback } from '../../../../state/types';

const AssetUploaderSchema = Yup.object().shape({
  image: Yup.mixed().required(),
});

const getInitialValues = () => ({
  image: '',
});

const ImageUpload: React.FC<{ name: string; id: string }> = React.memo(
  ({ name, id }) => {
    const classes = useStyles();
    const { t } = useTranslation('spotScheduling');
    return (
      // @ts-expect-error
      <ImageFieldInput id={id} name={name} style={{ maxWidth: 173 }}>
        <div className={classes.imageInput}>
          <ImageIcon />
          <Typography color="textSecondary" variant="caption">
            {t('spotImageDialog.imageUploadButton')}
          </Typography>
        </div>
      </ImageFieldInput>
    );
  },
);

const ImageUploadedPreview: React.FC<{
  name: string;
  id: string;
  file: File;
  handleDeleteImage: () => void;
}> = React.memo(({ name, id, file, handleDeleteImage }) => {
  const classes = useStyles();
  let image = '';
  try {
    image = webkitURL.createObjectURL(file);
  } catch {
    // @ts-expect-error
    image = file;
  }
  return (
    <>
      <div className={classes.previewContainer}>
        <svg height={300} width={500}>
          <image height={500} href={image} width={1100} x={10} y={5} />;
        </svg>
        <div className={classes.rightIcons}>
          {/* @ts-expect-error */}
          <ImageFieldInput id={id} name={name}>
            <CreateIcon className={classes.imageInputIcon} color="primary" />
          </ImageFieldInput>
          <DeleteIcon onClick={handleDeleteImage} />
        </div>
      </div>
      <Typography className={classes.fileName} variant="body2">
        {file.name}
      </Typography>
    </>
  );
});

type Props = {
  onCreateAsset: (image: File, options?: OptionCallback) => void;
  loading: boolean;
};

export const AssetUploaderForm: React.FC<Props> = ({
  onCreateAsset,
  loading,
}) => {
  const { t } = useTranslation('spotScheduling');
  const classes = useStyles();

  return (
    <Formik
      enableReinitialize
      initialValues={getInitialValues()}
      onSubmit={(values, actions) => {
        onCreateAsset(values, {
          onSuccess: () => actions.resetForm(),
          onError: () => actions.resetForm(),
        });
      }}
      validationSchema={AssetUploaderSchema}
    >
      {(formikProps: FormikProps<any>) => {
        const handleDeleteImage = () =>
          formikProps.setFieldValue('image', null);
        return (
          <form onSubmit={formikProps.handleSubmit}>
            <div style={{ width: '100%' }}>
              <Alert className={classes.alertInfo} severity="info">
                {t('assetUpoadForm.description')}
              </Alert>
              <div className={classes.centered}>
                <div className={classes.formContainer}>
                  {!formikProps?.values.image ? (
                    <ImageUpload
                      id="unbounded-asset-image-input"
                      name="image"
                    />
                  ) : (
                    <ImageUploadedPreview
                      file={formikProps?.values.image}
                      handleDeleteImage={handleDeleteImage}
                      id="unbounded-asset-image-input"
                      name="image"
                    />
                  )}
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

export default React.memo(AssetUploaderForm);
