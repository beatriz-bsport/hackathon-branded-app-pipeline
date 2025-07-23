import React from 'react';
import { compose } from 'recompose';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import {
  Button,
  createStyles,
  FormHelperText,
  FormLabel,
  Switch,
  type Theme,
} from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

// @ts-expect-error
import EmailInput from '../../../components/input/EmailInput.component';
import { StopSubscriptionInfoModal } from '#src/libs/theme/components/StopSubscriptionInfoModal';

// @ts-expect-error
import ImageUploader169 from '../../../components/input/ImageUploader169.component';
import ColorInput from '../../../components/input/ColorInput.component';
import { getIntercomLink } from '#src/intercom';

export type OwnProps = {
  id: number;
  cover: string;
  primaryColor: string;
  secondaryColor: string;
  marketingEmail: string;
  displayStopSubscriptionOnMemberSide: boolean;
  submitIsDisabled: boolean;
  handleCoverChange: (value: File) => void;
  handleChange: (
    key:
      | 'primaryColor'
      | 'secondaryColor'
      | 'marketingEmail'
      | 'displayStopSubscriptionOnMemberSide',
  ) => (value: string) => void;
  onSubmit: () => void;
};

type Props = OwnProps & WithTranslation & WithStyles<typeof styles>;

type PreviewProps = WithStyles<typeof styles> & { cover?: string };

const FranchiseCoverPreview = (props: PreviewProps) => {
  if (!props.cover) {
    return <div className={props.classes.coverPreview} />;
  }
  return (
    <img
      alt="company logo"
      className={props.classes.coverPreview}
      src={props.cover}
    />
  );
};

const FranchiseThemeForm = (props: Props) => {
  const {
    primaryColor,
    secondaryColor,
    marketingEmail,
    displayStopSubscriptionOnMemberSide,
    cover,
    id,
    classes,
    submitIsDisabled,
    onSubmit,
    handleChange,
    handleCoverChange,
    t,
  } = props;

  const onCoverChange = (coverFile?: File) => {
    if (coverFile && typeof coverFile !== 'string') {
      handleCoverChange(coverFile);
    }
  };

  const [isStopSubscriptionModalOpen, setIsStopSubscriptionModalOpen] =
    React.useState(false);

  const handleCancelSwitchStopSubscription = React.useCallback(() => {
    setIsStopSubscriptionModalOpen(false);
    handleChange('displayStopSubscriptionOnMemberSide')('false');
  }, [handleChange]);

  const handleValidateSwitchStopSubscription = React.useCallback(() => {
    setIsStopSubscriptionModalOpen(false);
    handleChange('displayStopSubscriptionOnMemberSide')('true');
  }, [handleChange]);

  const handleChangeSwitchStopSubscription = React.useCallback(
    (event) => {
      if (event.target.checked) {
        setIsStopSubscriptionModalOpen(true);
      }
      handleChange('displayStopSubscriptionOnMemberSide')(
        event.target.checked ? 'true' : 'false',
      );
    },
    [handleChange],
  );

  return (
    <div>
      <Typography className={classes.idContainer} variant="h6">
        {`BSPORT ID: ${id}`}
      </Typography>

      <div className={classes.inputContainer}>
        <ImageUploader169
          helperText={t('forms.cover.helperText')}
          initial={cover}
          label={t('forms.cover.label')}
          onChange={onCoverChange}
        >
          <FranchiseCoverPreview classes={classes} />
        </ImageUploader169>
      </div>
      <div className={classes.inputContainer}>
        <div className={classes.horizontalInput}>
          <ColorInput
            color={primaryColor}
            helperText={t('forms.primary_color.helperText')}
            label={t('forms.primary_color.label')}
            onChange={(color: string) => handleChange('primaryColor')(color)}
          />
        </div>
        <div className={classes.horizontalInput}>
          <ColorInput
            color={secondaryColor}
            helperText={t('forms.secondary_color.helperText')}
            label={t('forms.secondary_color.label')}
            onChange={(color: string) => handleChange('secondaryColor')(color)}
          />
        </div>
      </div>
      <div className={classes.inputContainer}>
        <div>
          <EmailInput
            autoComplete="email"
            label={t('marketingEmail.label')}
            // @ts-expect-error
            onChange={(ev) => handleChange('marketingEmail')(ev.target.value)}
            placeholder={t('marketingEmail.placeholder')}
            type="email"
            value={marketingEmail}
          />
          <div>
            <Typography className={classes.grey} variant="caption">
              {t('marketingEmail.caption')}
            </Typography>
          </div>
        </div>
      </div>
      <div>
        <div className={classes.horizontalGroup}>
          <Switch
            checked={displayStopSubscriptionOnMemberSide}
            onChange={handleChangeSwitchStopSubscription}
          />
          <FormLabel className={classes.switchLabel}>
            {t(
              'forms.themePersonalization.displayStopSubscriptionFromMemberSide.label',
            )}
          </FormLabel>
          <a
            className={classes.link}
            href={getIntercomLink('stopSubscriptionOnMemberSide')}
            rel="noreferrer"
            target="_blank"
          >
            <HelpOutlineIcon />
          </a>
        </div>
        <FormHelperText className={classes.helperText}>
          <div>
            {t(
              'forms.themePersonalization.displayStopSubscriptionFromMemberSide.helperText.simple',
            )}
          </div>
          <div>
            {t(
              'forms.themePersonalization.displayStopSubscriptionFromMemberSide.helperText.lawCompliance',
            )}
          </div>
          <div>
            {t(
              'forms.themePersonalization.displayStopSubscriptionFromMemberSide.helperText.franchisor',
            )}
          </div>
        </FormHelperText>
        <StopSubscriptionInfoModal
          link={getIntercomLink('stopSubscriptionOnMemberSide')}
          onClose={handleCancelSwitchStopSubscription}
          onValidate={handleValidateSwitchStopSubscription}
          open={isStopSubscriptionModalOpen}
        />
      </div>
      <Button
        className={classes.submit}
        color="primary"
        disabled={submitIsDisabled}
        onClick={onSubmit}
        variant="contained"
      >
        {t('forms.submit')}
      </Button>
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    horizontalInput: {
      marginRight: theme.spacing(3),
    },
    idContainer: {
      marginBottom: theme.spacing(3),
    },
    link: {
      textDecoration: 'none',
      display: 'flex',
      color: 'black',
      '&:focus, &:hover, &:visited, &:link, &:active': {
        textDecoration: 'none',
        color: 'black',
      },
    },
    horizontalGroup: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: theme.spacing(-1),
    },
    switchLabel: {
      marginRight: theme.spacing(1),
    },
    helperText: {
      marginTop: theme.spacing(-1),
    },
    inputContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: theme.spacing(3),
    },
    textField: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: theme.spacing(3),
      width: '90%',
      maxWidth: 400,
    },
    coverPreview: {
      backgroundColor: '#F2F2F2',
      borderRadius: 35,
      height: '100%',
      width: '100%',
    },
    submit: {
      marginTop: theme.spacing(2),
    },
    grey: {
      color: theme.palette.grey[700],
    },
  });

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['theme']),
)(FranchiseThemeForm);
