import React from 'react';
import { compose } from 'recompose';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Button, createStyles, Theme } from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import ImageUploader169 from '../../../components/input/ImageUploader169.component';
import ColorInput from '../../../components/input/ColorInput.component';

export type OwnProps = {
  id: number;
  cover: string;
  primaryColor: string;
  secondaryColor: string;
  submitIsDisabled: boolean;
  handleCoverChange: (value: File) => void;
  handleChange: (
    key: 'primaryColor' | 'secondaryColor' | 'cover',
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

  return (
    <div>
      <Typography variant="h6" className={classes.idContainer}>
        {`BSPORT ID: ${id}`}
      </Typography>

      <div className={classes.inputContainer}>
        <ImageUploader169
          label={t('forms.cover.label')}
          helperText={t('forms.cover.helperText')}
          onChange={onCoverChange}
          initial={cover}
        >
          <FranchiseCoverPreview />
        </ImageUploader169>
      </div>
      <div className={classes.inputContainer}>
        <div className={classes.horizontalInput}>
          <ColorInput
            label={t('forms.primary_color.label')}
            helperText={t('forms.primary_color.helperText')}
            onChange={(color: any) => handleChange('primaryColor')(color)}
            color={primaryColor}
          />
        </div>
        <div className={classes.horizontalInput}>
          <ColorInput
            onChange={(color: any) => handleChange('secondaryColor')(color)}
            label={t('forms.secondary_color.label')}
            helperText={t('forms.secondary_color.helperText')}
            color={secondaryColor}
          />
        </div>
      </div>
      <Button
        onClick={onSubmit}
        disabled={submitIsDisabled}
        variant="contained"
        color="primary"
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
  });

export default compose(
  withStyles(styles),
  withTranslation(['theme']),
)(FranchiseThemeForm);
