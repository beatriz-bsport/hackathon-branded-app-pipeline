import React from 'react';

import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';

import { Button, Typography, LinearProgress } from '@material-ui/core';
import moment, { Moment } from 'moment';
import { useTranslation } from 'react-i18next';
import {
  ArrowForwardIos,
  CheckCircleOutline,
  Info,
  Warning,
} from '@material-ui/icons';
import {
  DateField,
  TextFieldEnhancedLabelWithError,
} from '../../../components/forms';
import { OptionCallback } from '../../../state/types';
import RedButtonComponent from '#components/button/RedButton.component';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type OwnProps = {
  onClose: () => void;
  onSubmit: (
    date: { start: string; end: string },
    options?: OptionCallback,
  ) => void;
  retrieveNumberOfDeletedOffer: (
    params: { start: string; end: string },
    options?: OptionCallback,
  ) => void;
  numberOfMassDisabledOffer: number;
  numberOfMassDisabledOfferLoading: boolean;
};
type Props = OwnProps;

export const MassDisablerDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('offer');
  const initialValues = { startDate: moment(), endDate: moment() };
  const [secondWarningOpen, setSecondWarningOpen] = React.useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = React.useState(false);

  return (
    <GenericResponsiveDialog open maxWidth="sm" fullScreenBreakpoint="xs">
      <Formik
        validationSchema={dateRangeScheme}
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          props.onSubmit({
            start: moment(values.startDate).format('YYYY-MM-DD'),
            end: moment(values.endDate).format('YYYY-MM-DD'),
          });

          actions.setSubmitting(false);
          setSuccessDialogOpen(true);
        }}
      >
        {(
          formikProps: FormikProps<{
            startDate: Moment;
            endDate: Moment;
            confirmation: string;
          }>,
        ) => {
          return (
            <>
              <div className={classes.container}>
                <Typography variant="h6">{t('massDisabler.title')}</Typography>

                <Typography>{t('massDisabler.explain')}</Typography>
                <div className={classes.row}>
                  <div>
                    <DateField
                      name="startDate"
                      label={t('massDisabler.startDateLabel')}
                      bottomError
                    />
                  </div>
                  <ArrowForwardIos className={classes.center} />
                  <div>
                    <DateField
                      name="endDate"
                      bottomError
                      label={t('massDisabler.endDateLabel')}
                    />
                  </div>
                </div>
                <div className={classes.iconAndInfo}>
                  <Info />
                  <Typography className={classes.info}>
                    {t('massDisabler.info')}
                  </Typography>
                </div>
                <div className={classes.iconAndInfo}>
                  <Warning color="error" />
                  <Typography color="error" className={classes.infoRed}>
                    {t('massDisabler.warning')}
                  </Typography>
                </div>

                <div className={classes.actions}>
                  <div>
                    <Button onClick={props.onClose}>
                      {t('massDisabler.actions.cancel')}
                    </Button>
                  </div>
                  <div>
                    <Button
                      disabled={!formikProps.isValid}
                      onClick={() => {
                        props.retrieveNumberOfDeletedOffer(
                          {
                            start: moment(formikProps.values.startDate).format(
                              'YYYY-MM-DD',
                            ),
                            end: moment(formikProps.values.endDate).format(
                              'YYYY-MM-DD',
                            ),
                          },
                          {
                            onSuccess: () => {
                              setSecondWarningOpen(true);
                            },
                          },
                        );
                      }}
                      variant="contained"
                      color="primary"
                    >
                      {t('massDisabler.actions.continue')}
                    </Button>
                  </div>
                </div>
              </div>
              {props.numberOfMassDisabledOfferLoading && <LinearProgress />}
              <GenericResponsiveDialog
                open={secondWarningOpen}
                maxWidth="sm"
                fullScreenBreakpoint="xs"
              >
                <div className={classes.container}>
                  <Typography variant="h6">
                    {t('massDisabler.confirm')}
                  </Typography>

                  <Typography>
                    {t('massDisabler.confirmInfo', {
                      start_date: moment(formikProps.values.startDate).format(
                        'LL',
                      ),
                      end_date: moment(formikProps.values.endDate).format('LL'),
                      number_of_deleted_offer: props.numberOfMassDisabledOffer,
                      count: props.numberOfMassDisabledOffer,
                    })}
                  </Typography>
                  <Typography>{t('massDisabler.sure')}</Typography>
                  <div className={classes.iconAndInfo}>
                    <Warning color="error" />
                    <Typography
                      color="error"
                      variant="subtitle1"
                      className={classes.infoRed}
                    >
                      {t('massDisabler.secondWarning')}
                    </Typography>
                  </div>
                  <Typography>
                    {t('massDisabler.confirmationExplain')}
                  </Typography>
                  <TextFieldEnhancedLabelWithError name="confirmation" />

                  <div className={classes.actions}>
                    <div>
                      <Button
                        onClick={() => {
                          setSecondWarningOpen(false);
                        }}
                      >
                        {t('massDisabler.actions.cancel')}
                      </Button>
                    </div>
                    <div>
                      <RedButtonComponent
                        onClick={() => formikProps.handleSubmit()}
                        delayBeforeActivation={5}
                        disabled={
                          formikProps.values.confirmation !==
                          t('massDisabler.iConfirm')
                        }
                      >
                        {t('massDisabler.actions.submit')}
                      </RedButtonComponent>
                    </div>
                  </div>
                </div>
                {formikProps.isSubmitting && <LinearProgress />}
              </GenericResponsiveDialog>
              <GenericResponsiveDialog
                open={successDialogOpen}
                maxWidth="sm"
                fullScreenBreakpoint="xs"
              >
                <div className={classes.container}>
                  <Typography variant="h6">
                    {t('massDisabler.success')}
                  </Typography>
                  <div className={classes.centerRow}>
                    <CheckCircleOutline
                      color="primary"
                      className={classes.icon}
                    />
                  </div>
                  <Typography>
                    {t('massDisabler.successInfo', {
                      start_date: moment(formikProps.values.startDate).format(
                        'LL',
                      ),
                      end_date: moment(formikProps.values.endDate).format('LL'),
                    })}
                  </Typography>
                  <div className={classes.actions}>
                    <div>
                      <Button
                        onClick={() => {
                          setSecondWarningOpen(false);
                          props.onClose();
                        }}
                      >
                        {t('common:close')}
                      </Button>
                    </div>
                  </div>
                </div>
              </GenericResponsiveDialog>
            </>
          );
        }}
      </Formik>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  icon: { width: theme.spacing(8), height: theme.spacing(8) },
  centerRow: { display: 'flex', justifyContent: 'center', width: '100%' },
  content: { display: 'flex', flexDirection: 'column', gap: theme.spacing(2) },
  center: { position: 'relative', top: theme.spacing(2) },
  info: {
    backgroundColor: '#E8E8E8',
    borderRadius: '5px',
    padding: theme.spacing(1),
  },
  infoRed: {
    fontWeight: 500,
    backgroundColor: '#F0E6E6',
    borderRadius: '5px',
    padding: theme.spacing(1),
  },
  iconAndInfo: { display: 'flex', gap: theme.spacing(1), alignItems: 'center' },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(4),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: theme.spacing(4),

    justifyContent: 'center',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}));
export default MassDisablerDialog;
const dateRangeScheme = Yup.object().shape({
  endDate: Yup.date().min(Yup.ref('startDate'), 'common:endBeforeStart'),
  startDate: Yup.date().max(Yup.ref('endDate'), 'common:startAfterEnd'),
});
