// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import { withFormik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import omit from 'lodash/omit';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import {
  DialogContent,
  DialogTitle,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { TextField, IconField, AlertError } from '#components/forms';
import { MuiIconName } from '#components/input/muiIcon/MuiIconNameType';
import { OptionCallback } from '../../../state/types';
import { CustomShopRedirection } from '../types';

interface FormikValues {
  name: string;
  icon: MuiIconName;
  url: string;
}

type Props = {
  // eslint-disable-next-line react/no-unused-prop-types
  initial: CustomShopRedirection;
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (param: {
    id: number;
    values: CustomShopRedirection;
    options: OptionCallback;
  }) => void;
};

const MobileShopCustomShopRedirectionDialog: React.FC<
  FormikProps<FormikValues> & Props
> = ({ open, isSubmitting, dirty, isValid, onClose, handleSubmit }) => {
  const { t } = useTranslation(['settings']);
  const classes = useStyles();

  return (
    <Form>
      <Dialog
        classes={{
          paper: classes.popup,
        }}
        onClose={onClose}
        open={open}
      >
        <DialogTitle>
          {t('mobilePersonalization.externalShopRedirection.popup.title')}
        </DialogTitle>

        <DialogContent>
          <div className={classes.container}>
            <div className={classes.innerRow}>
              <TextField
                label={t(
                  'mobilePersonalization.externalShopRedirection.popup.name',
                )}
                name="name"
              />
              <div className={classes.error}>
                <AlertError name="name" />
              </div>
            </div>
            <div className={classes.innerRow}>
              <TextField
                label={t(
                  'mobilePersonalization.externalShopRedirection.popup.link',
                )}
                name="url"
              />
              <AlertError name="url" />
            </div>
            <IconField
              required
              label={t(
                'mobilePersonalization.externalShopRedirection.popup.icon',
              )}
              name="icon"
            />
            <AlertError name="icon" />
          </div>
          <DialogActions>
            <Button color="secondary" disabled={isSubmitting} onClick={onClose}>
              {t('mobilePersonalization.externalShopRedirection.popup.cancel')}
            </Button>
            <Button
              color="primary"
              disabled={isSubmitting || !dirty || !isValid}
              onClick={() => {
                handleSubmit();
              }}
              type="submit"
              variant="contained"
            >
              {t('mobilePersonalization.externalShopRedirection.popup.submit')}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  popup: {
    minWidth: 600,
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
  error: {
    '& p::first-letter': {
      textTransform: 'uppercase',
    },
  },
}));

const MobileShopCustomShopRedirectionDialogSchema = Yup.object().shape({
  name: Yup.string().required('performanceTracking:requiredField'),
  url: Yup.string()
    .required()
    .test('valid-link', 'errors.invalidUrl', (url) => {
      try {
        const testUrl = new URL(url);
        return !!testUrl;
      } catch (_) {
        return false;
      }
    }),
  icon: Yup.string().required(),
});

const MobileShopCustomShopRedirectionDialogHOC = withFormik<
  Props,
  FormikValues
>({
  mapPropsToValues: (props) => {
    if (props?.inital) {
      return {
        name: '',
        icon: 'Link',
        url: '',
      };
    }
    return {
      name: props?.initial?.name ?? '',
      icon: props?.initial?.icon ?? 'Link',
      url: props?.initial?.url ?? '',
    };
  },
  validationSchema: MobileShopCustomShopRedirectionDialogSchema,
  handleSubmit: (values, { props: { onSubmit, initial }, setSubmitting }) => {
    onSubmit({
      id: initial?.id,
      values: omit(values, 'id'),
      options: {
        onSuccess: () => setSubmitting(false),
        onError: () => setSubmitting(false),
      },
    });
  },
});

export default MobileShopCustomShopRedirectionDialogHOC(
  MobileShopCustomShopRedirectionDialog,
);
