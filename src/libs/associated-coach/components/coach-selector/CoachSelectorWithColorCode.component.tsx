import React from 'react';
import { useTranslation } from 'react-i18next';

import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';

import CoachInput from '#components/input/CoachInput.component';
import CoachColorModifier from '../CoachColorModifier.component';

import type { Coach } from '#libs/associated-coach/types';

type Props = {
  coachId: number;
  loading: boolean;
  associatedCoachList: Array<Coach>;
  onChangeCoach: (coach?: Coach) => void;
  updateCoach: (
    data: any,
    options: { onSuccess?: () => void; onError?: () => void },
  ) => void;
};

export const CoachSelectorWithColorCode: React.FC<Props> = ({
  coachId,
  loading,
  associatedCoachList,
  onChangeCoach,
  updateCoach,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('coach');

  return (
    <div className={classes.container}>
      <div className={classes.input}>
        <CoachInput
          required
          value={coachId}
          onChange={onChangeCoach}
          label={t('selector.label')}
          choices={associatedCoachList}
          onDelete={() => onChangeCoach(null)}
        />
        {loading ? <CircularProgress size="small" /> : null}
      </div>
      <div>
        <CoachColorModifier
          associatedCoachList={
            coachId
              ? associatedCoachList.filter((c) => c.id === coachId)
              : associatedCoachList
          }
          updateCoach={updateCoach}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '2px solid #E2E2E2',
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  input: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(-2),
  },
}));

export default CoachSelectorWithColorCode;
