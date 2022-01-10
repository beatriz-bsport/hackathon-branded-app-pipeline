import React, { useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles, useTheme } from '@material-ui/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
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
  open: boolean;
  memberName: string;
  memberProgramList: Array<PerformanceTrackingMemberProgram>;
  programList: Array<PerformanceTrackingProgram>;
  updateMemberMetricValue: (
    data: { memberProgram: number; metric: number; value: number },
    options?: any,
  ) => void;
  changeMember?: (i: 1 | -1) => void;
  closeDialog: () => void;
  loading: boolean;
  createMemberProgram: (
    programToAddToMember: number,
    option?: OptionCallback,
  ) => void;
};
type Props = OwnProps & WithTranslation;
const NEXT_MEMBER = 1;
const PREVIOUS_MEMBER = -1;
export const MemberProgramDetailDialog: React.FC<Props> = (props) => {
  const {
    memberName,
    memberProgramList,
    open,
    programList,
    loading,
    t,
    closeDialog,
    updateMemberMetricValue,
    changeMember,
    createMemberProgram,
  } = props;

  const classes = useStyles();
  const [isDialogChooseProgramOpen, setIsDialogChooseProgramOpen] =
    useState(false);
  const theme: Theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Dialog
      maxWidth="lg"
      open={open}
      fullScreen={fullScreen}
      scroll="body"
      onClose={() => closeDialog()}
    >
      <div className={classes.container}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <div className={classes.row}>
              {changeMember && (
                <IconButton onClick={() => changeMember(PREVIOUS_MEMBER)}>
                  <KeyboardArrowLeft />
                </IconButton>
              )}
              <Typography className={classes.memberName} variant="h6">
                {memberName}
              </Typography>
              {changeMember && (
                <IconButton onClick={() => changeMember(NEXT_MEMBER)}>
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
                        memberProgram: memberProgram?.id,
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
                    <Typography>
                      {t('memberProgram.infoNoMemberProgram')}
                    </Typography>
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
              programList={programList?.length ? [...programList] : []}
              isDialogChooseProgramOpen={isDialogChooseProgramOpen}
              setIsDialogChooseProgramOpen={setIsDialogChooseProgramOpen}
              createMemberProgram={createMemberProgram}
            />
            <div className={classes.action}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => closeDialog()}
              >
                {t('form.close')}
              </Button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  memberName: { fontWeight: 500 },
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
