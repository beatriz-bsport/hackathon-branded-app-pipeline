import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import {
  CADENCE_TEMPLATE_CARD_WIDTH,
  CADENCE_TEMPLATE_IMAGE_HEIGHT,
} from '#src/libs/sequential_marketing/constants';

type Props = {
  image?: string;
  description?: string;
  variant: 'template' | 'scratch';
  onButtonClick: () => void;
};

const CadenceTemplateCard: React.FC<Props> = ({
  image,
  description,
  variant,
  onButtonClick,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();
  const buttonText =
    variant === 'template'
      ? t('audience.template.useTemplate')
      : t('audience.template.createFromScratch');
  const descriptionText =
    variant === 'template' && description
      ? t(description)
      : t('audience.template.createFromScratchDescription');

  return (
    <div className={classes.card}>
      <div className={classes.imageContainer}>
        {variant === 'template' ? (
          <img alt="Template preview" className={classes.image} src={image} />
        ) : (
          <AddIcon className={classes.addIcon} />
        )}
      </div>
      <Typography
        className={classes.description}
        color="textPrimary"
        variant="body1"
      >
        {descriptionText}
      </Typography>
      <Button color="primary" onClick={onButtonClick} variant="outlined">
        {buttonText}
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: CADENCE_TEMPLATE_CARD_WIDTH,
    height: 'auto',
    gap: theme.spacing(2),
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: CADENCE_TEMPLATE_IMAGE_HEIGHT,
    overflow: 'hidden',
    backgroundColor: theme.palette.grey[200],
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  description: {
    display: 'flex',
    height: theme.spacing(9),
    overflow: 'auto',
    scrollbarWidth: 'thin',
  },
  addIcon: {
    display: 'flex',
    width: 'auto',
    height: theme.spacing(8),
    fill: theme.palette.grey[600],
  },
}));

export default React.memo(CadenceTemplateCard);
