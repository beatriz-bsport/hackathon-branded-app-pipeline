// @ts-nocheck
import React, { useCallback } from 'react';

import * as Yup from 'yup';
import { Form, Formik, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { DateRange } from '@material-ui/icons';
import classNames from 'classnames';

import { OptionCallback } from '../../../state/types';
import { ColorField } from '#components/forms';
import { Level as LevelType } from '../types';
import FormSection from '#components/forms/FormSection';
import { useOfferFormStyles } from '#libs/offer/hooks';

const NAME_MAX_LENGTH = 30;

export type Props = {
  initial: LevelType;
  open: boolean;
  onSubmit: (arg1: {
    id?: number;
    values: Omit<LevelType, 'id'>;
    options: OptionCallback;
  }) => void;
  onClose: () => void;
};

type InitialFormikValues = {
  name: string;
  color: string;
};

const CreateLevelModalSchema = Yup.object({
  name: Yup.string().required('required'),
  color: Yup.string().required('required'),
});

export const CreateLevelModal = (props: Props) => {
  const { open, initial, onClose, onSubmit } = props;
  const { t } = useTranslation(['offer', 'common']);
  const offerFormClasses = useOfferFormStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  const { setSubmitting } = useFormikContext<InitialFormikValues>();

  const handleFinishSubmitting = useCallback(() => {
    setSubmitting(false);
  }, [setSubmitting]);

  const handleSubmit = useCallback(
    (values: InitialFormikValues) => {
      onSubmit({
        id: initial?.id,
        values: {
          ...(initial ?? {}),
          ...values,
        },
        options: {
          onSuccess: handleFinishSubmitting,
          onError: handleFinishSubmitting,
        },
      });
    },
    [handleFinishSubmitting, initial, onSubmit],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      classes={{
        paper: classes.popup,
      }}
    >
      <Formik
        initialValues={{
          name: initial?.name ?? '',
          color: initial?.color ?? '#FFFFFF',
        }}
        validationSchema={CreateLevelModalSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <FormSection
              sectionTitle={t('offer:form.dialog.createLevel')}
              sectionIcon={DateRange}
              sectionCustomIconStyle={offerFormClasses.sectionIcon}
              sectionIconContainerStyle={offerFormClasses.sectionIconContainer}
            >
              <div className={classes.inputsContainer}>
                <div className={classes.inputField}>
                  <Typography variant="body1">
                    {t('offer:levels.modal.name')} *
                  </Typography>
                  <TextField
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    variant="outlined"
                    className={classNames({
                      [offerFormClasses.bigWidth]: !isMobile,
                    })}
                    size="small"
                    required
                    placeholder={t('offer:levels.modal.name')}
                    inputProps={{ maxLength: NAME_MAX_LENGTH }}
                  />
                </div>

                <div className={classes.inputField}>
                  <Typography variant="body1">
                    {t('levels.modal.color')} *
                  </Typography>
                  <ColorField
                    name="color"
                    onChange={formik.handleChange}
                    buttonStyle={classes.colorInput}
                  />
                </div>
              </div>
            </FormSection>

            <DialogActions className={classes.actionsContainer}>
              <Button
                color="secondary"
                onClick={onClose}
                disabled={formik.isSubmitting}
              >
                {t('common:cancel')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={
                  formik.isSubmitting || !formik.dirty || !formik.isValid
                }
              >
                {t('common:saveRecord')}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  popup: {
    minWidth: 600,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      minWidth: 'inherit',
      width: '80vh',
    },
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
  name: {
    width: '80%',
  },
  color: {
    width: '40%',
  },
  inputField: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.25),
  },
  inputsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr',
    },
  },
  actionsContainer: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  colorInput: {
    margin: 0,
    width: '125px',
    height: '40px',
    '& p': {
      textOverflow: 'ellipsis',
      whiteSpace: 'noWrap',
      overflow: 'hidden',
    },
  },
}));

export default CreateLevelModal;
