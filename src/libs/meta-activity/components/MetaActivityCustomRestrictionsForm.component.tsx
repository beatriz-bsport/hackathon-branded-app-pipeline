import React from 'react';
import { WithTranslation, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Theme, useTheme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import DateRangeIcon from '@material-ui/icons/DateRange';
import DeleteIcon from '@material-ui/icons/Delete';
import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import TuneIcon from '@material-ui/icons/Tune';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import { FieldArray, useFormikContext, FormikProps } from 'formik';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import { Alert } from '@material-ui/lab';
import { MaterialStyleType } from '../../../utils/types';

import { DurationField } from '../../../components/forms';

import TagSelector from '#libs/tag/components/TagSelector.selector';
import { Tag, TagGroup } from '#libs/tag/types';

type OwnProps = {
  variant?: string;
  tags: Array<Tag<TagGroup>>;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof useStyles>> &
  WithTranslation;

type FormValues = {
  custom_restriction_rule: Array<{
    last_booking_minutes: number;
    last_discard_minutes: number;
    first_booking_minutes_until: number;
  }>;
};
type FormikValues = FormikProps<FormValues>;
export const MetaActivityCustomRestrictionsForms: React.FC<Props> = ({
  variant,
  tags,
}) => {
  const { t } = useTranslation('translation');
  const classes = useStyles();
  const theme = useTheme();
  const [openCustomRestrcition, setOpenCustomRestrictions] =
    React.useState(false);
  const { values, setFieldValue }: FormikValues = useFormikContext();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = values?.custom_restriction_rule?.length ?? 0;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isFirstBookingMinutesUntilZero = (index: number) => {
    return !values?.custom_restriction_rule[index]?.first_booking_minutes_until;
  };

  return (
    <div className={classes.container}>
      <ButtonBase
        onClick={() => setOpenCustomRestrictions(!openCustomRestrcition)}
        className={classes.flexHeader}
        disableRipple
      >
        <div className={classes.headerWithIcon}>
          <TuneIcon className={classes.leftIcon} />
          <Typography variant="h6">
            {t('restrictions.personnalizedHeader')}
          </Typography>
        </div>
        <>{openCustomRestrcition ? <ExpandLessIcon /> : <ExpandMoreIcon />}</>
      </ButtonBase>
      <Typography variant="body2">
        {t('restrictions.personnalizedHelper')}
      </Typography>
      <Collapse in={openCustomRestrcition}>
        {maxSteps ? (
          <MobileStepper
            steps={maxSteps}
            position="static"
            variant="text"
            activeStep={activeStep}
            classes={{ root: classes.transparentBackGround }}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
              >
                {t('restrictions.next')}
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                {t('restrictions.back')}
              </Button>
            }
          />
        ) : null}

        <FieldArray name="custom_restriction_rule">
          {({
            push,
            remove,
            form: {
              values: { custom_restriction_rule },
              errors: {
                custom_restriction_rule: custom_restriction_rule_error,
              },
            },
          }) => (
            <>
              {custom_restriction_rule.map((crr, i: number) => (
                <div
                  key={`custoom_restriction_${i}`}
                  className={classNames(
                    classes.personnalizedRestrictionOutterContainer,
                    { [classes.hidden]: i !== activeStep },
                  )}
                >
                  <div className={classes.flexHeader}>
                    <Typography variant="h6">
                      {t('restrictions.personnalizedRestrictionsIndex', {
                        count: i + 1,
                      })}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        remove(i);
                        setActiveStep(0);
                      }}
                      aria-label="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                  <div
                    className={classes.personnalizedRestrictionInnerContainer}
                  >
                    {custom_restriction_rule_error &&
                      custom_restriction_rule_error[i]?.tags && (
                        <div>
                          <Typography variant="caption" color="error">
                            {t(`restrictions.tags.mandatory`)}
                          </Typography>
                        </div>
                      )}
                    <div className={classes.tagSelector}>
                      <TagSelector
                        allTagsWithTagGroup={tags || []}
                        placeholder={t('restrictions.tags.selectPlaceHolder')}
                        onChange={(
                          items: Array<{
                            item: Tag & { label: string; value: number };
                          }>,
                        ) => {
                          return setFieldValue(
                            `custom_restriction_rule.${i}.tags`,
                            items.map((item) => item.value),
                          );
                        }}
                        onDeleteTag={(itemId: number) =>
                          setFieldValue(
                            `custom_restriction_rule.${i}.tags`,
                            crr?.tags?.filter(
                              (tagId: number) => tagId !== itemId,
                            ),
                          )
                        }
                        selectedTags={crr?.tags || []}
                        isClearable
                        closeMenuOnSelect
                        inScrollBar
                      />
                    </div>
                    <>
                      <div className={classes.headerWithIcon}>
                        <EventAvailableIcon className={classes.leftIcon} />
                        <Typography variant="h6">
                          {t('restrictions.lastBookingBeforeMinutes')}
                        </Typography>
                      </div>
                      <div className={classes.field}>
                        <DurationField
                          name={`custom_restriction_rule.${i}.last_booking_minutes`}
                          label={
                            variant === 'workshop'
                              ? t('workshopActivity.lastBookingBeforeMinutes')
                              : t('activity.lastBookingBeforeMinutes')
                          }
                          variant={variant === 'workshop' ? 'long' : null}
                          fullWidth
                          required
                        />
                      </div>
                    </>
                    <>
                      <div className={classes.headerWithIcon}>
                        <EventBusyIcon className={classes.leftIcon} />
                        <Typography variant="h6">
                          {t('restrictions.lastDiscardBeforeMinutes')}
                        </Typography>
                      </div>
                      <div className={classes.field}>
                        <DurationField
                          name={`custom_restriction_rule.${i}.last_discard_minutes`}
                          label={
                            variant === 'workshop'
                              ? t('workshopActivity.lastDiscardBeforeMinutes')
                              : t('activity.lastDiscardBeforeMinutes')
                          }
                          fullWidth
                          required
                        />
                      </div>
                    </>
                    <>
                      <div className={classes.headerWithIcon}>
                        <DateRangeIcon className={classes.leftIcon} />
                        <Typography variant="h6">
                          {t('restrictions.firstBookingMinutesUntil')}
                        </Typography>
                      </div>
                      <div className={classes.field}>
                        <DurationField
                          name={`custom_restriction_rule.${i}.first_booking_minutes_until`}
                          label={t('activity.firstBookingMinutesUntil')}
                          fullWidth
                          required
                        />
                      </div>
                      {isFirstBookingMinutesUntilZero(i) && (
                        <Alert
                          severity="warning"
                          className={classes.alignCenter}
                        >
                          {t('activity.firstMinutesBookingUntilWarning')}
                        </Alert>
                      )}
                    </>
                  </div>
                </div>
              ))}
              <div className={classes.actionsContainer}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    push({
                      last_booking_minutes: 0,
                      last_discard_minutes: 0,
                      first_booking_minutes_until: 60 * 24 * 30 * 6,
                    });

                    setActiveStep(Math.min(maxSteps, 3));
                  }}
                  disabled={values?.custom_restriction_rule?.length >= 3}
                >
                  <AddIcon className={classes.leftIcon} />
                  {t('restrictions.add', {
                    count: values?.custom_restriction_rule?.length ?? 0,
                    max: 3,
                  })}
                </Button>
              </div>
            </>
          )}
        </FieldArray>
      </Collapse>
    </div>
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingTop: theme.spacing(2),
  },
  personnalizedRestrictionOutterContainer: {
    paddingTop: theme.spacing(2),
  },
  personnalizedRestrictionInnerContainer: {
    paddingLeft: theme.spacing(2),
    borderLeft: `1px solid ${theme.palette.grey[200]}`,
  },
  field: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  headerWithIcon: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: theme.spacing(2),
  },
  flexHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    // paddingBottom: theme.spacing(1),
    gap: theme.spacing(2),
  },
  actionsContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  hidden: {
    display: 'none',
  },
  transparentBackGround: {
    backgroundColor: 'transparent',
  },
  tagSelector: {
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  alignCenter: {
    alignItems: 'center',
  },
}));
export default MetaActivityCustomRestrictionsForms;
