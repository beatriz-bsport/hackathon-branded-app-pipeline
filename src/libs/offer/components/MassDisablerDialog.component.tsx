// @ts-nocheck
import React from 'react';

import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';

import {
  Button,
  Typography,
  LinearProgress,
  Collapse,
  ButtonBase,
} from '@material-ui/core';
import moment, { Moment } from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import {
  ArrowForwardIos,
  CheckCircleOutline,
  Info,
  Warning,
} from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import InfoIcon from '@material-ui/icons/Info';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  DateField,
  TextFieldEnhancedLabelWithError,
} from '../../../components/forms';
import { OptionCallback } from '../../../state/types';
import RedButtonComponent from '#components/button/RedButton.component';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import { Offer } from '../types';
import OfferListItemV2 from '#libs/offer/components/OfferListItemV2.component';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';

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
  massDisabledOfferInGroup: Offer[];
  numberOfMassDisabledOfferLoading: boolean;
};
type Props = OwnProps;

export const MassDisablerDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('offer');
  const initialValues = { startDate: moment(), endDate: moment() };
  const [secondWarningOpen, setSecondWarningOpen] = React.useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = React.useState(false);
  const [showOfferGroup, setShowOfferGroup] = React.useState(true);

  const numberOfMassDisabledOfferInGroup =
    props?.massDisabledOfferInGroup?.length ?? 0;

  return (
    <GenericResponsiveDialog open fullScreenBreakpoint="xs" maxWidth="sm">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          props.onSubmit({
            start: moment(values.startDate).format('YYYY-MM-DD'),
            end: moment(values.endDate).format('YYYY-MM-DD'),
          });

          actions.setSubmitting(false);
          setSuccessDialogOpen(true);
        }}
        validationSchema={dateRangeScheme}
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
                      bottomError
                      label={t('massDisabler.startDateLabel')}
                      name="startDate"
                    />
                  </div>
                  <ArrowForwardIos className={classes.center} />
                  <div>
                    <DateField
                      bottomError
                      label={t('massDisabler.endDateLabel')}
                      name="endDate"
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
                  <Typography className={classes.infoRed} color="error">
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
                      color="primary"
                      disabled={!formikProps.isValid}
                      onClick={() => {
                        props.retrieveNumberOfDeletedOffer({
                          start: moment(formikProps.values.startDate).format(
                            'YYYY-MM-DD',
                          ),
                          end: moment(formikProps.values.endDate).format(
                            'YYYY-MM-DD',
                          ),
                        });
                        setSecondWarningOpen(true);
                      }}
                      variant="contained"
                    >
                      {t('massDisabler.actions.continue')}
                    </Button>
                  </div>
                </div>
              </div>
              {props.numberOfMassDisabledOfferLoading && <LinearProgress />}
              <GenericResponsiveDialog
                fullScreenBreakpoint="xs"
                maxWidth="sm"
                open={secondWarningOpen}
              >
                <div className={classes.container}>
                  <Typography variant="h6">
                    {t('massDisabler.confirm')}
                  </Typography>

                  <Typography>
                    {t('massDisabler.confirmInfo', {
                      start_date: formatAsDatetimeAdapted(
                        formikProps.values.startDate,
                        'LL',
                      ),
                      end_date: formatAsDatetimeAdapted(
                        formikProps.values.endDate,
                        'LL',
                      ),
                      number_of_deleted_offer:
                        props.numberOfMassDisabledOffer -
                        numberOfMassDisabledOfferInGroup,
                      count:
                        props.numberOfMassDisabledOffer -
                        numberOfMassDisabledOfferInGroup,
                    })}
                  </Typography>
                  <Typography>{t('massDisabler.sure')}</Typography>
                  {numberOfMassDisabledOfferInGroup > 0 && (
                    <div className={classes.iconAndInfo}>
                      <Warning color="error" />
                      <Alert
                        className={classes.alert}
                        icon={<></>}
                        severity="error"
                      >
                        <Typography color="error">
                          {t('massDisabler.warningOfferGroupTitle')}
                        </Typography>
                        <div className={classes.rowWarning}>
                          <InfoIcon color="disabled" />
                          <Typography color="textSecondary">
                            {t('massDisabler.warningOfferGroup')}
                          </Typography>
                        </div>
                        <ButtonBase
                          className={classes.buttonBaseHeader}
                          onClick={() => setShowOfferGroup(!showOfferGroup)}
                        >
                          <Typography>{t('massDisabler.offers')}</Typography>
                          {showOfferGroup ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </ButtonBase>
                        <Collapse in={showOfferGroup}>
                          {props.massDisabledOfferInGroup.map((so) => (
                            <OfferListItemV2
                              key={so.id}
                              checked
                              disabled
                              similarOffer
                              handleChange={null}
                              offer={so}
                            />
                          ))}
                        </Collapse>
                      </Alert>
                    </div>
                  )}
                  <div className={classes.iconAndInfo}>
                    <Warning color="error" />
                    <Typography
                      className={classes.infoRed}
                      color="error"
                      variant="subtitle1"
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
                        delayBeforeActivation={5}
                        disabled={
                          formikProps.values.confirmation !==
                          t('massDisabler.iConfirm')
                        }
                        onClick={() => formikProps.handleSubmit()}
                      >
                        {t('massDisabler.actions.submit')}
                      </RedButtonComponent>
                    </div>
                  </div>
                </div>
                {formikProps.isSubmitting && <LinearProgress />}
              </GenericResponsiveDialog>
              <GenericResponsiveDialog
                fullScreenBreakpoint="xs"
                maxWidth="sm"
                open={successDialogOpen}
              >
                <div className={classes.container}>
                  <Typography variant="h6">
                    {t('massDisabler.success')}
                  </Typography>
                  <div className={classes.centerRow}>
                    <CheckCircleOutline
                      className={classes.icon}
                      color="primary"
                    />
                  </div>
                  <Typography>
                    {t('massDisabler.successInfo', {
                      start_date: formatAsDatetimeAdapted(
                        formikProps.values.startDate,
                        'LL',
                      ),
                      end_date: formatAsDatetimeAdapted(
                        formikProps.values.endDate,
                        'LL',
                      ),
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
  alert: {
    width: '100%',
  },
  rowWarning: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonBaseHeader: {
    marginTop: theme.spacing(2),
  },
}));
export default MassDisablerDialog;
const dateRangeScheme = Yup.object().shape({
  endDate: Yup.date().min(Yup.ref('startDate'), 'common:endBeforeStart'),
  startDate: Yup.date().max(Yup.ref('endDate'), 'common:startAfterEnd'),
});
