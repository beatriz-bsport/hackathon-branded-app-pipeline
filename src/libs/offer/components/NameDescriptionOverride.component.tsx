import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import { useFormikContext } from 'formik';
// @ts-expect-error
import { TextField } from '#components/forms';
import type { OfferFormValues } from '#libs/offer/types';

export type Props = {
  isOpen: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const NameDescriptionOverride: React.FC<Props> = ({ isOpen, onChange }) => {
  const { t } = useTranslation('offer');
  const { values } = useFormikContext<OfferFormValues>();

  const classes = useStyles();
  return (
    <Collapse in={isOpen}>
      <div className={classes.container}>
        <div className={classes.nameInput}>
          <TextField
            fullWidth
            id="offer-form-name-override-input"
            inputProps={{ maxLength: 500 }}
            label={t('form.section.nameDescriptionOverride.name.label')}
            name="nameOverride"
            onChange={onChange}
            value={values.nameOverride}
          />
          <Typography color="textSecondary" variant="caption">
            {t('form.section.nameDescriptionOverride.name.captionText')}
          </Typography>
        </div>
        <div className={classes.descriptionInput}>
          <TextField
            fullWidth
            multiline
            id="offer-form-description-override-input"
            label={t('form.section.nameDescriptionOverride.description.label')}
            name="descriptionOverride"
            onChange={onChange}
            rows={5}
            value={values.descriptionOverride}
            variant="outlined"
          />
          <Typography color="textSecondary" variant="caption">
            {t('form.section.nameDescriptionOverride.description.captionText')}
          </Typography>
        </div>
      </div>
    </Collapse>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  nameInput: {
    display: 'flex',
    flexDirection: 'column',
  },
  descriptionInput: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default React.memo(NameDescriptionOverride);
