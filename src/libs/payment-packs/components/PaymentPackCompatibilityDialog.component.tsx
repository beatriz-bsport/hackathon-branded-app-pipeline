import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import CategoryIcon from '@material-ui/icons/Category';
import StarIcon from '@material-ui/icons/Star';
import RoomIcon from '@material-ui/icons/Room';

import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import DialogContent from '@material-ui/core/DialogContent';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import { MetaActivity } from '#libs/meta-activity/types';
import { Establishment } from '#libs/establishment/types';
import { SCS } from '#libs/category/types';

type Props = {
  activities: Array<MetaActivity>;
  categories: Array<SCS>;
  establishments: Array<Establishment>;
  onClose: () => void;
  onModify: () => void;
  open: boolean;
  isManager: boolean;
};

export const PaymentPackCompatibilityDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack']);
  const { open, categories, establishments, activities, isManager } = props;
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = 3;
  const theme = useTheme();
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const renderCompatibableWithAll = () => {
    return (
      <div className={classes.allCompatibilitySection}>
        <Typography>{t('compatibility.all')}</Typography>
      </div>
    );
  };
  const renderCategories = () => {
    if (!categories?.length) {
      return renderCompatibableWithAll();
    }
    return (
      <div className={classes.compatibilityList}>
        {categories.map((c: SCS) =>
          c ? <Chip key={c.id} label={c.name} /> : null,
        )}
      </div>
    );
  };
  const renderActivities = () => {
    if (!activities?.length) {
      return renderCompatibableWithAll();
    }
    return (
      <div className={classes.compatibilityList}>
        {activities.map((a: MetaActivity) =>
          a ? <Chip key={a.id} label={a.name} /> : null,
        )}
      </div>
    );
  };

  const renderEstablishments = () => {
    if (!establishments?.length) {
      return renderCompatibableWithAll();
    }
    return (
      <div className={classes.compatibilityList}>
        {establishments.map((e: Establishment) =>
          e ? <Chip key={e.id} label={e.title} /> : null,
        )}
      </div>
    );
  };
  return (
    <GenericResponsiveDialog maxWidth="md" open={open}>
      <DialogContent>
        <MobileStepper
          activeStep={activeStep}
          backButton={
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              size="small"
            >
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              {t('previous')}
            </Button>
          }
          classes={{ root: classes.transparentBackGround }}
          nextButton={
            <Button
              disabled={activeStep === maxSteps - 1}
              onClick={handleNext}
              size="small"
            >
              {t('next')}
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          position="static"
          steps={maxSteps}
          variant="text"
        />
        <div className={classes.allSteps}>
          <div className={classes.stepWithIcon}>
            <CategoryIcon
              className={classNames(classes.topIcon, {
                [classes.highligthed]: activeStep === 0,
              })}
            />
            <Typography
              className={classNames({
                [classes.highligthed]: activeStep === 0,
              })}
              variant="h6"
            >
              {t('categories')}
            </Typography>
          </div>
          <div className={classes.stepWithIcon}>
            <StarIcon
              className={classNames(classes.topIcon, {
                [classes.highligthed]: activeStep === 1,
              })}
            />
            <Typography
              className={classNames({
                [classes.highligthed]: activeStep === 1,
              })}
              variant="h6"
            >
              {t('activities')}
            </Typography>
          </div>
          <div className={classes.stepWithIcon}>
            <RoomIcon
              className={classNames(classes.topIcon, {
                [classes.highligthed]: activeStep === 2,
              })}
            />
            <Typography
              className={classNames({
                [classes.highligthed]: activeStep === 2,
              })}
              variant="h6"
            >
              {t('establishments')}
            </Typography>
          </div>
        </div>
        <div className={classes.stepContainer}>
          {activeStep === 0 ? renderCategories() : null}
          {activeStep === 1 ? renderActivities() : null}
          {activeStep === 2 ? renderEstablishments() : null}
        </div>
      </DialogContent>
      <DialogActions>
        <Button id="button_exit" onClick={props.onClose}>
          {t('actions.close')}
        </Button>
        {isManager && (
          <Button color="primary" id="button_modify" onClick={props.onModify}>
            {t('actions.edit')}
          </Button>
        )}
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  topIcon: {
    color: '#868686',
    height: 30,
  },
  highligthed: {
    color: theme.palette.primary.main,
  },
  compatibilityList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    alignItems: 'center',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  transparentBackGround: {
    backgroundColor: 'transparent',
  },
  listItem: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  allSteps: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  stepContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  stepWithIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  allCompatibilitySection: {
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

export default PaymentPackCompatibilityDialog;
