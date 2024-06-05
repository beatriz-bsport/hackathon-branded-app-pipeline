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

// @ts-expect-error
import { ColorField } from '#src/components/forms';
import FormSection from '#src/components/forms/FormSection';
import { useOfferFormStyles } from '#src/libs/offer/hooks';
import { Level as LevelType } from '../types';
import { OptionCallback } from '../../../state/types';

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
      classes={{
        paper: classes.popup,
      }}
      onClose={onClose}
      open={open}
    >
      <Formik
        initialValues={{
          name: initial?.name ?? '',
          color: initial?.color ?? '#FFFFFF',
        }}
        onSubmit={handleSubmit}
        validationSchema={CreateLevelModalSchema}
      >
        {(formik) => (
          <Form>
            <FormSection
              sectionCustomIconStyle={offerFormClasses.sectionIcon}
              sectionIcon={DateRange}
              sectionIconContainerStyle={offerFormClasses.sectionIconContainer}
              sectionTitle={t('offer:form.dialog.createLevel')}
            >
              <div className={classes.inputsContainer}>
                <div className={classes.inputField}>
                  <Typography variant="body1">
                    {t('offer:levels.modal.name')} *
                  </Typography>
                  <TextField
                    required
                    className={classNames({
                      [offerFormClasses.bigWidth]: !isMobile,
                    })}
                    inputProps={{ maxLength: NAME_MAX_LENGTH }}
                    name="name"
                    onChange={formik.handleChange}
                    placeholder={t('offer:levels.modal.name')}
                    size="small"
                    value={formik.values.name}
                    variant="outlined"
                  />
                </div>

                <div className={classes.inputField}>
                  <Typography variant="body1">
                    {t('levels.modal.color')} *
                  </Typography>
                  <ColorField
                    buttonStyle={classes.colorInput}
                    name="color"
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
            </FormSection>

            <DialogActions className={classes.actionsContainer}>
              <Button
                color="secondary"
                disabled={formik.isSubmitting}
                onClick={onClose}
              >
                {t('common:cancel')}
              </Button>
              <Button
                color="primary"
                disabled={
                  formik.isSubmitting || !formik.dirty || !formik.isValid
                }
                type="submit"
                variant="contained"
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
