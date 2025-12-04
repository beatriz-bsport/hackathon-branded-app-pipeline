import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withFormik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DialogActions from '@material-ui/core/DialogActions';
import {
  DialogContent,
  DialogTitle,
  FormLabel,
  makeStyles,
  Theme,
} from '@material-ui/core';
// @ts-expect-error
import { TextField, AlertError } from '#src/components/forms';
// @ts-expect-error
import ImageField from '#src/components/forms/ImageField.component';

import { OptionCallback } from '../../../state/types';
import { CustomMobilePopup, CustomMobilePopupCreateOrEditData } from '../types';
import { createUrl } from '../../../utils/createUrlHandlers';

interface FormikValues {
  name: string;
  image: string;
  link: string;
}

type Props = {
  // eslint-disable-next-line react/no-unused-prop-types
  initial: CustomMobilePopup;
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (param: {
    id: string;
    values: FormData;
    options: OptionCallback;
  }) => void;
};

const CustomMobilePopupDialog: React.FC<FormikProps<FormikValues> & Props> = ({
  open,
  values,
  isSubmitting,
  dirty,
  isValid,
  handleSubmit,
  onClose,
}) => {
  const { t } = useTranslation(['settings']);
  const classes = useStyles();
  const [showPreview, setShowPreview] = useState(false);

  const closePreview = () => {
    setShowPreview(false);
  };

  const openPreview = () => {
    setShowPreview(true);
  };

  return (
    <>
      <Form>
        <Dialog
          classes={{
            paper: classes.popup,
          }}
          onClose={onClose}
          open={open}
        >
          <DialogTitle>
            {t('mobilePersonalization.popup.editPopup.title')}
          </DialogTitle>

          <DialogContent>
            <div className={classes.container}>
              <div className={classes.innerRow}>
                <TextField
                  label={t('mobilePersonalization.popup.editPopup.name')}
                  name="name"
                />
                <AlertError name="name" />
              </div>
              <FormLabel>
                {t('mobilePersonalization.popup.editPopup.image')}
              </FormLabel>
              <ImageField name="image" />
              <div className={classes.innerRow}>
                <TextField
                  label={t('mobilePersonalization.popup.editPopup.link')}
                  name="link"
                />
                <AlertError name="link" />
              </div>
            </div>
            <Button
              color="primary"
              disabled={
                isSubmitting || !dirty || !isValid || values.image === undefined
              }
              onClick={openPreview}
              variant="outlined"
            >
              <VisibilityIcon className={classes.icon} />
              {t('mobilePersonalization.popup.editPopup.preview')}
            </Button>
            <DialogActions>
              <Button
                color="secondary"
                disabled={isSubmitting}
                onClick={onClose}
              >
                {t('mobilePersonalization.popup.editPopup.cancel')}
              </Button>
              <Button
                color="primary"
                disabled={
                  isSubmitting ||
                  !dirty ||
                  !isValid ||
                  values.image === undefined
                }
                onClick={() => {
                  handleSubmit();
                }}
                type="submit"
                variant="contained"
              >
                {t('mobilePersonalization.popup.editPopup.submit')}
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Form>
      {showPreview && (
        <Dialog
          open
          classes={{
            paper: classes.mobilePopup,
          }}
          onClose={closePreview}
        >
          <DialogTitle>
            {t('mobilePersonalization.popup.editPopup.previewPopup.title')}
          </DialogTitle>
          <div className={classes.previewInner}>
            <div className={classes.previewTitle}>
              {values.name}
              <CloseIcon />
            </div>
            <img
              alt="some-cover"
              src={getUrl(values.image)}
              style={{
                width: '100%',
                objectFit: 'cover',
              }}
            />
            <div className={classes.previewBottom}>
              <Button
                className={classes.previewBottomButton}
                color="primary"
                variant="contained"
              >
                {t('mobilePersonalization.popup.editPopup.preview')}
              </Button>
            </div>
          </div>
          <DialogActions>
            <Button
              color="secondary"
              disabled={isSubmitting}
              onClick={closePreview}
            >
              {t('mobilePersonalization.popup.editPopup.cancel')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  popup: {
    minWidth: 600,
  },
  mobilePopup: {
    width: 380,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  innerRow: {
    display: 'flex',
    flexDirection: 'column',
  },
  icon: {
    fill: theme.palette.primary.main,
    marginRight: theme.spacing(2),
  },
  previewInner: {
    background: '#FFFFFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    boxShadow: theme.shadows[5],
  },
  previewTitle: {
    display: 'flex',
    padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 22,
  },
  previewBottom: {
    padding: theme.spacing(2),
  },
  previewBottomButton: {
    width: '100%',
    padding: theme.spacing(2),
  },
}));

const getUrl = (value: string | Object) => {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object') {
    // @ts-expect-error
    return createUrl(value);
  }

  return null;
};

const CustomMobilePopupDialogSchema = Yup.object().shape({
  name: Yup.string()
    .required('performanceTracking:requiredField')
    .max(200, 'performanceTracking:maxLength200'),
  link: Yup.string()
    .required()
    .test('valid-link', 'errors.invalidUrl', (link) => {
      try {
        const testUrl = new URL(link);
        return !!testUrl;
      } catch (_) {
        return false;
      }
    }),
  image: Yup.object().nullable(),
});

const CustomMobilePopupDialogHOC = withFormik<Props, FormikValues>({
  mapPropsToValues: (props) => {
    // @ts-expect-error
    if (props?.inital) {
      return {
        name: '',
        image: '',
        link: '',
      };
    }
    return {
      ...props.initial,
    };
  },
  validationSchema: CustomMobilePopupDialogSchema,
  handleSubmit: (values, { props: { onSubmit, initial }, setSubmitting }) => {
    const formData = new FormData();
    const keys: (keyof CustomMobilePopupCreateOrEditData)[] = ['name', 'link'];
    const { image } = values;
    if (typeof image !== 'string' && !!image) {
      formData.append('image', image);
    }
    keys.forEach((key) => {
      formData.append(key, values[key]);
    });

    onSubmit({
      // @ts-expect-error
      id: initial?.id,
      values: formData,
      options: {
        onSuccess: () => setSubmitting(false),
        onError: () => setSubmitting(false),
      },
    });
  },
});

export default CustomMobilePopupDialogHOC(CustomMobilePopupDialog);
