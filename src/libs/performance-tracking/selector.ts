import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';
import { RootState } from '../../reducers';

import { getMemberListData } from '#libs/member/selectors';

const getProgramAllIds = (state: RootState) =>
  state.performanceTracking.program.allIds;

export const getProgramDict = (state: RootState) =>
  state.performanceTracking.program.byId;

export const getMemberProgramAllIds = (state: RootState) =>
  state.performanceTracking.memberProgram.allIds;

export const getMemberProgramDict = (state: RootState) =>
  state.performanceTracking.memberProgram.byId;

export const getProgram = (state: RootState, id: number) =>
  getProgramDict(state)[id];

export const getDisabledProgramList = createSelector(
  [getProgramAllIds, getProgramDict],
  (programAllDisabledIds, programDict) => {
    return programAllDisabledIds
      .map((id) => programDict[id])
      .filter((program) => program?.is_disabled === true);
  },
);

export const getMetricDict = (state: RootState) =>
  state.performanceTracking.metricList.byId;

export const getProgramList = createSelector(
  [getProgramAllIds, getProgramDict],
  (programAllIds, programDict) => {
    return programAllIds
      .map((id) => programDict[id])
      .filter((program) => program?.is_disabled === false);
  },
);

export const composeProgramWithMetrics = memoize(
  (selector: (state: RootState, id?: number) => any) =>
    createSelector(
      [selector, getMetricDict],
      (programOrProgramList, metricDict) => {
        if (!programOrProgramList) return null;
        if (Array.isArray(programOrProgramList)) {
          return programOrProgramList.map((program) => ({
            ...program,
            metric_list: program?.metric_list
              ?.map((id) => metricDict[id])
              .filter((metric) => metric?.is_disabled === false),
          }));
        }
        return {
          ...programOrProgramList,
          metric_list: programOrProgramList?.metric_list
            ?.map((id) => metricDict[id])
            .filter((metric) => metric?.is_disabled === false),
        };
      },
    ),
);

export const getMemberProgramByMemberDict = (state: RootState) => {
  return state.performanceTracking.memberProgram.byMemberId;
};

export const getMemberProgramByMemberList = createSelector(
  [
    getMemberProgramByMemberDict,
    getMemberProgramDict,
    getMetricDict,
    getProgramDict,
    (_: RootState, id: number) => id,
  ],
  (
    memberProgramByMemberDict,
    memberProgramDict,
    metricDict,
    programDict,
    memberId,
  ) => {
    if (!memberProgramByMemberDict || !memberProgramByMemberDict[memberId])
      return null;
    return memberProgramByMemberDict[memberId]
      ?.map((id) => memberProgramDict[id])
      ?.filter((mp) => !mp.is_disabled)
      ?.filter((mp) => programDict[mp.program]?.is_disabled === false)
      .map((memberProgram) => ({
        ...memberProgram,
        metric_record: {
          ...memberProgram.metric_record,
          general: {
            ...memberProgram?.metric_record?.general,
            metrics: memberProgram?.metric_record?.general?.metric_ids
              ?.filter((id) => metricDict[id])
              .map((id) => memberProgram?.metric_record?.general?.metrics[id]),
          },
        },
      }));
  },
);

export const getMemberProgram = createSelector(
  [getMemberProgramDict, getMetricDict, (_: RootState, id: number) => id],
  (memberProgramDict, metricDict, id) => {
    return {
      ...memberProgramDict[id],
      metric_record: {
        ...memberProgramDict[id]?.metric_record,
        general: {
          ...memberProgramDict[id]?.metric_record?.general,
          metrics: memberProgramDict[id]?.metric_record?.general?.metric_ids
            ?.filter((m_id) => metricDict[m_id])
            .map(
              (pp_id) =>
                memberProgramDict[id]?.metric_record?.general?.metrics[pp_id],
            ),
        },
      },
    };
  },
);

export const getMemberProgramList = createSelector(
  [getMemberProgramAllIds, getMetricDict, getMemberProgramDict],
  (memberProgramList, metricDict, memberProgramDict) => {
    return memberProgramList
      .map((id) => memberProgramDict[id])
      .filter((memberProgram) => !memberProgram.is_disabled)
      .map((memberProgram) => ({
        ...memberProgram,
        metric_record: {
          ...memberProgram.metric_record,
          general: {
            ...memberProgram?.metric_record?.general,
            metrics: memberProgram?.metric_record?.general?.metric_ids
              ?.filter((id) => metricDict[id])
              .map((id) => memberProgram?.metric_record?.general?.metrics[id]),
          },
        },
      }));
  },
);

export const getMemberProgramListIdsIn = createSelector(
  [getMemberProgramList, (_: RootState, ids: Array<number>) => ids],
  (memberProgramList, ids) => {
    return memberProgramList?.filter((mp) => ids?.includes(mp.id));
  },
);

export const composeMemberProgramWithProgram = memoize(
  (selector: (state: RootState, ids?: Array<number> | number) => any) =>
    createSelector([selector, getProgramDict], (memberProgram, programDict) => {
      if (!memberProgram) return null;
      if (!Array.isArray(memberProgram)) {
        return {
          ...memberProgram,
          program: programDict[memberProgram.program],
        };
      }
      return memberProgram.map((mp) => ({
        ...mp,
        program: programDict[mp.program],
      }));
    }),
);

export const composeMemberProgramWithMetric = memoize(
  (selector: (state: RootState, ids?: Array<number> | number) => any) =>
    createSelector([selector, getMetricDict], (memberProgram, metricDict) => {
      if (!memberProgram) return null;
      if (!Array.isArray(memberProgram)) {
        return {
          ...memberProgram,
          metric_record: {
            ...memberProgram?.metric_record,
            general: {
              ...memberProgram?.metric_record.general,
              metrics: memberProgram?.metric_record?.general.metrics
                ?.map((metric) => ({
                  ...metric,
                  metric: { ...metricDict[metric.metric_id] },
                }))
                .filter((metric) => metric.metric?.is_disabled === false),
            },
          },
        };
      }
      return memberProgram.map((mp) => ({
        ...mp,
        metric_record: {
          ...mp?.metric_record,
          general: {
            ...mp.metric_record?.general,
            metrics: mp.metric_record?.general.metrics
              ?.map((metric) => ({
                ...metric,
                metric: metricDict[metric?.metric_id],
              }))
              .filter((metric) => metric.metric?.is_disabled === false),
          },
        },
      }));
    }),
);

export const composeMemberProgramWithMember = memoize(
  (selector: (state: RootState, ids?: Array<number> | number) => any) =>
    createSelector(
      [selector, getMemberListData],
      (memberProgram, memberData) => {
        if (!memberProgram) return null;
        if (!Array.isArray(memberProgram)) {
          return {
            ...memberProgram,
            member: memberData[memberProgram.member],
          };
        }
        return memberProgram.map((mp) => ({
          ...mp,
          member: memberData[mp.member],
        }));
      },
    ),
);
