// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import { Button, LinearProgress } from '@material-ui/core';

import { MetaActivity } from '#libs/meta-activity/types';
import MetaActivitySelectorWithCard from '#libs/meta-activity/components/MetaActivitySelectorWithCard.component';

type Props = {
  metaActivities: MetaActivity[];
  selectedMetaActivity: MetaActivity | null;
  metaActivityLoading: boolean;
  handleSelectActivity: (metaActivity: MetaActivity) => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  type?: string;
};

export const GroupedOfferFormMetaActivitySelect: React.FC<Props> = ({
  metaActivities,
  metaActivityLoading,
  selectedMetaActivity,
  type,
  handleSelectActivity,
  handleNextStep,
  handlePreviousStep,
}) => {
  const { t } = useTranslation('metaActivity');
  const classes = useStyles();

  let placeholder = t('metaActivity:search');
  if (type === 'workshop') {
    placeholder = t('metaActivity:workshopSelect');
  }

  return (
    <>
      {metaActivityLoading && <LinearProgress />}

      {!metaActivityLoading && (
        <MetaActivitySelectorWithCard
          metaActivities={metaActivities}
          placeholder={placeholder}
          value={selectedMetaActivity}
          onChange={handleSelectActivity}
        />
      )}
      <div className={classes.buttonContainer}>
        <Button onClick={handlePreviousStep} className={classes.button}>
          {t('translation:common.cancel')}
        </Button>
        <Button
          color="primary"
          variant="contained"
          disabled={!selectedMetaActivity}
          onClick={handleNextStep}
          className={classes.button}
        >
          {t('translation:common.confirm')}
        </Button>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(2),
  },
}));

export default GroupedOfferFormMetaActivitySelect;
