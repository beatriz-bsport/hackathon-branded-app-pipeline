import { Grid, Typography } from '@material-ui/core';
import { useTheme, withStyles } from '@material-ui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ImageIcon from '@material-ui/icons/Image';
import CreateIcon from '@material-ui/icons/Create';
import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import ImageFieldInput from '../../../../components/forms/ImageFieldInput';

// @ts-expect-error
export const PersonalizedSpotCreator = (props) => {
  const { t } = useTranslation('spotScheduling');
  const { classes, renderExample, values } = props;
  const theme = useTheme();

  const renderImageUpload = (name: string, id: string) => {
    return (
      // @ts-expect-error
      <ImageFieldInput id={id} name={name} style={{ maxWidth: 173 }}>
        <div className={classes.imageInput}>
          {/* @ts-expect-error */}
          <ImageIcon color={theme.palette.grey[700]} />
          <Typography color="textSecondary" variant="caption">
            {t('spotImageDialog.imageUploadButton')}
          </Typography>
        </div>
      </ImageFieldInput>
    );
  };

  // @ts-expect-error
  const renderPreview = (file, name, id) => {
    let image = '';
    try {
      image = webkitURL.createObjectURL(file);
    } catch {
      image = file;
    }
    return (
      <div>
        <div className={classes.previewContainer}>
          <svg height={70} width={105}>
            <image height={60} href={image} width={60} x={10} y={5} />;
          </svg>
          <div className={classes.rightIcons}>
            {/* @ts-expect-error */}
            <ImageFieldInput id={id} name={name}>
              <CreateIcon className={classes.imageInputIcon} color="primary" />
            </ImageFieldInput>
            <DeleteIcon onClick={() => props.setFieldValue(name, null)} />
          </div>
        </div>
        <Typography className={classes.fileName} variant="body2">
          {file.name}
        </Typography>
      </div>
    );
  };

  return (
    <div>
      <Typography
        className={classes.field}
        color="textSecondary"
        variant="caption"
      >
        {t('spotCreatorForm.personalizedExplain')}
      </Typography>
      <Grid className={classes.container}>
        <Grid xs={4}>
          <Typography className={classes.spotStatus} variant="body1">
            {t('spotCreatorForm.free')}
          </Typography>
          {renderExample()}
          {!values.free_image
            ? renderImageUpload('free_image', 'free-spot-image-input')
            : renderPreview(
                values.free_image,
                'free_image',
                'free-spot-image-input',
              )}
        </Grid>
        <Grid xs={4}>
          <Typography className={classes.spotStatus} variant="body1">
            {t('spotCreatorForm.taken')}
          </Typography>
          {/* @ts-expect-error  */}
          {renderExample('', theme.palette.grey[600], theme.palette.grey[400])}
          {!values.taken_image
            ? renderImageUpload('taken_image', 'taken-spot-image-input')
            : renderPreview(
                values.taken_image,
                'taken_image',
                'taken-spot-image-input',
              )}
        </Grid>
        <Grid xs={4}>
          <Typography className={classes.spotStatus} variant="body1">
            {t('spotCreatorForm.selected')}
          </Typography>
          {renderExample(
            '',
            // @ts-expect-error
            theme.palette.primary.main,
            // @ts-expect-error
            theme.palette.primary.light,
          )}
          {!values.selected_image
            ? renderImageUpload('selected_image', 'selected-spot-image-input')
            : renderPreview(
                values.selected_image,
                'selected_image',
                'selected-spot-image-input',
              )}
        </Grid>
      </Grid>
      <div className={classes.formatContainer}>
        <InfoIcon />
        <Typography variant="body2">
          {t('spotImageDialog.imageFormat')}
        </Typography>
      </div>
    </div>
  );
};

// @ts-expect-error
const styles = (theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    display: 'flex',
    gap: theme.spacing(2),
  },
  field: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  imageInput: {
    cursor: 'pointer',
    marginTop: theme.spacing(1),
    minHeight: 73,
    maxWidth: 173,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[200],
    borderRadius: 5,
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
    },
  },
  imageInputIcon: {
    cursor: 'pointer',
  },
  previewContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: theme.spacing(1),
    alignItems: 'center',
    maxWidth: 173,
    justifyContent: 'space-around',
  },
  rightIcons: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  formatContainer: {
    paddingTop: theme.spacing(3),
    display: 'flex',
    gap: theme.spacing(2),
    color: '#2196F3',
    alignItems: 'center',
  },
  fileName: { paddingTop: theme.spacing(1) },
  spotStatus: { whiteSpace: 'nowrap', overFlow: 'hidden' },
});

// @ts-expect-error
export default withStyles(styles)(PersonalizedSpotCreator);
