import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

import { MetaActivity } from '#src/libs/meta-activity/types';
import MetaActivitySelectorWithCard from '#src/libs/meta-activity/components/MetaActivitySelectorWithCard.component';

type Props = {
  metaActivities: MetaActivity[];
  metaActivityLoading: boolean;
  handleSelectActivity: (metaActivity: MetaActivity) => void;
  handlePreviousStep: () => void;
  type?: string;
};

export const GroupedOfferFormMetaActivitySelect: React.FC<Props> = ({
  metaActivities,
  metaActivityLoading,
  type,
  handleSelectActivity,
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
      <MetaActivitySelectorWithCard
        isLoading={metaActivityLoading}
        metaActivities={metaActivities}
        onChange={handleSelectActivity}
        placeholder={placeholder}
      />
      <div className={classes.buttonContainer}>
        <Button className={classes.button} onClick={handlePreviousStep}>
          {t('translation:common.cancel')}
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
