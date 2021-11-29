// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';

import CoachInput from '../../../../components/input/CoachInput.component';
import CoachColorModifier from '../CoachColorModifier.component';

type Props = {
  coachId: number,
  loading: boolean,
  associatedCoachList: Array<AssociatedCoach>,
  onChangeCoach: (coach: ?AssociatedCoach) => void,
  updateCoach: (
    data: any,
    options: { onSuccess?: () => void, onError?: () => void },
  ) => void,
  classes: Object,
  t: TFunction,
};
export const CoachSelectorWithColorCode = (props: Props) => {
  return (
    <div className={props.classes.container}>
      <div className={props.classes.input}>
        <CoachInput
          required
          value={props.coachId}
          onChange={props.onChangeCoach}
          label={props.t('selector.label')}
          choices={props.associatedCoachList}
          onDelete={() => props.onChangeCoach(null)}
        />
        {props.loading ? (
          <CircularProgress className={props.classes.leftIcon} size="small" />
        ) : null}
      </div>
      <div className={props.classes.row}>
        <CoachColorModifier
          associatedCoachList={
            props.coachId
              ? props.associatedCoachList.filter((c) => c.id === props.coachId)
              : props.associatedCoachList
          }
          updateCoach={props.updateCoach}
        />
      </div>
    </div>
  );
};

const styles = (theme) => ({
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
});

export default compose(
  withTranslation(['coach']),
  withStyles(styles),
)(CoachSelectorWithColorCode);
