import React, { useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import { Button, IconButton, Typography } from '@material-ui/core';
import { Info, KeyboardArrowRight } from '@material-ui/icons';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { OptionCallback } from '../../../../state/types';
import {
  PerformanceTrackingMemberProgram,
  PerformanceTrackingProgram,
} from '#libs/performance-tracking/types';
import MemberProgramDetail from './MemberProgramDetail.component';
import ProgramSelectorDialog from '../program/ProgramSelectorDialog.component';

type OwnProps = {
  memberName: string;
  memberProgramList: Array<PerformanceTrackingMemberProgram>;
  programList: Array<PerformanceTrackingProgram>;
  updateMemberMetricValue: (
    data: { memberProgram: number; value: number; id: number },
    options?: any,
  ) => void;
  changeMember?: (i: 1 | -1) => void;
  closeDialog: () => void;
  createMemberProgram: (
    programToAddToMember: number,
    option?: OptionCallback,
  ) => void;
};
type Props = OwnProps & WithTranslation;
export const MemberProgramDetailDialog: React.FC<Props> = (props) => {
  const {
    memberName,
    memberProgramList,

    t,
    programList,
    closeDialog,
    updateMemberMetricValue,
    changeMember,
    createMemberProgram,
  } = props;

  const classes = useStyles();
  const [isDialogChooseProgramOpen, setIsDialogChooseProgramOpen] =
    useState(false);
  return (
    <div className={classes.container}>
      <div className={classes.row}>
        {changeMember && (
          <IconButton onClick={() => changeMember(-1)}>
            <KeyboardArrowLeft />
          </IconButton>
        )}
        <Typography>{memberName}</Typography>
        {changeMember && (
          <IconButton onClick={() => changeMember(1)}>
            <KeyboardArrowRight />
          </IconButton>
        )}
      </div>
      {memberProgramList?.length ? (
        <div>
          {memberProgramList?.map((memberProgram) => (
            <MemberProgramDetail
              memberProgram={memberProgram}
              withIcon
              changeMemberMetricValue={(value, metric) =>
                updateMemberMetricValue({
                  memberProgram: memberProgram.id,
                  metric,
                  value,
                })
              }
            />
          ))}
        </div>
      ) : (
        <div className={classes.noProgram}>
          <div className={classes.end}>
            <div className={classes.infoAndText}>
              <Info />
              <Typography>{t('memberProgram.infoNoMemberProgram')}</Typography>
            </div>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsDialogChooseProgramOpen(true)}
            >
              {t('program.form.addProgram')}
            </Button>
          </div>
        </div>
      )}
      <ProgramSelectorDialog
        programList={[...programList]}
        isDialogChooseProgramOpen={isDialogChooseProgramOpen}
        setIsDialogChooseProgramOpen={setIsDialogChooseProgramOpen}
        createMemberProgram={createMemberProgram}
      />
      <div className={classes.action}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => closeDialog()}
        >
          {t('form.close')}
        </Button>
      </div>
    </div>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(6),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  noProgram: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  infoAndText: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  end: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: theme.spacing(2),
  },
  action: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  },
}));
export default compose(withTranslation('performanceTracking'))(
  MemberProgramDetailDialog,
);
