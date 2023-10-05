import React, { useState, useMemo } from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import {
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Info, KeyboardArrowRight } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { OptionCallback } from '../../../../state/types';
import {
  PerformanceTrackingMemberProgram,
  PerformanceTrackingProgram,
} from '#libs/performance-tracking/types';
import MemberProgramDetail from '#libs/performance-tracking/components/member-program/MemberProgramDetail.component';
import ProgramSelectorDialog from '#libs/performance-tracking/components/program/ProgramSelectorDialog.component';
import { Booking } from '#libs/booking/types';
import { Member } from '#libs/member/types';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type OwnProps = {
  open: boolean;
  members?: Member[];
  memberProgramList: PerformanceTrackingMemberProgram[];
  programList: PerformanceTrackingProgram[];
  booking?: Booking;
  memberName?: string;
  isPreventUpdateMetricValue?: boolean;
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
type Props = OwnProps;
const NEXT_MEMBER = 1;
const PREVIOUS_MEMBER = -1;
export const MemberProgramDetailDialog: React.FC<Props> = (props) => {
  const {
    memberProgramList,
    open,
    programList,
    loading,
    booking,
    members,
    memberName,
    isPreventUpdateMetricValue,
    closeDialog,
    updateMemberMetricValue,
    changeMember,
    createMemberProgram,
  } = props;

  const { t } = useTranslation('performanceTracking');
  const classes = useStyles();
  const [isDialogChooseProgramOpen, setIsDialogChooseProgramOpen] =
    useState(false);

  const firstIndicator = useMemo(() => {
    return booking?.first_in_company ? '★' : '';
  }, [booking]);

  const memberNameWithIndicator = useMemo(() => {
    if (memberName) return memberName;
    if (members && booking) {
      return `${
        members
          ?.filter((m) => !!m && m.id)
          .find((m) => m.id === booking?.member)?.name
      }\u00A0${firstIndicator}`;
    }
    return '';
  }, [booking, members, memberName, firstIndicator]);

  return (
    <GenericResponsiveDialog
      fullScreenBreakpoint="sm"
      maxWidth="lg"
      onClose={closeDialog}
      open={open}
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
                {memberNameWithIndicator}
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
                    withIcon
                    changeMemberMetricValue={(value, metric) =>
                      !isPreventUpdateMetricValue &&
                      updateMemberMetricValue({
                        memberProgram: memberProgram?.id,
                        metric,
                        value,
                      })
                    }
                    isPreventUpdateMetricValue={isPreventUpdateMetricValue}
                    memberProgram={memberProgram}
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
                    color="primary"
                    onClick={() => setIsDialogChooseProgramOpen(true)}
                    variant="outlined"
                  >
                    {t('program.form.addProgram')}
                  </Button>
                </div>
              </div>
            )}
            <ProgramSelectorDialog
              createMemberProgram={createMemberProgram}
              isDialogChooseProgramOpen={isDialogChooseProgramOpen}
              programList={programList?.length ? [...programList] : []}
              setIsDialogChooseProgramOpen={setIsDialogChooseProgramOpen}
            />
            <div className={classes.action}>
              <Button color="primary" onClick={closeDialog} variant="contained">
                {t('form.close')}
              </Button>
            </div>
          </>
        )}
      </div>
    </GenericResponsiveDialog>
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
export default MemberProgramDetailDialog;
