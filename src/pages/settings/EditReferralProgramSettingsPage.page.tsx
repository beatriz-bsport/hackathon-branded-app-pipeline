import React from 'react';
import { Paper, makeStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import type { CompanyTheme } from '#libs/theme/types';
import EditReferralProgramSettingsForm from '#libs/referral/components/EditReferralProgramSettingsForm/EditReferralProgramSettingsForm.component';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import { updateCompanyTheme } from '#libs/theme/actions';
import {
  retrieveReferralProgram as retrieveReferralProgramAction,
  updateReferralProgram as updateReferralProgramAction,
} from '#libs/referral/actions';
import { getAllTagsWithTagGroup } from '#libs/tag/selectors';
import type { Tag } from '#libs/tag/types';
import {
  getReferralProgramsLoading,
  getTheReferralProgram,
} from '#libs/referral/selectors';
import { getTheme, getThemeLoading } from '#libs/theme/selectors';
import type { ReferralProgram } from '#libs/referral/types';
import type { OptionCallback } from '../../state/types';
import type { RootState } from '../../reducers';

type Props = {
  companyTheme: CompanyTheme;
  companyThemeLoading: boolean;
  referralProgram?: ReferralProgram;
  referralProgramLoading: boolean;
  tagList: Tag[];
  tagsLoading: boolean;
  submitReferralProgram: (
    data: ReferralProgram,
    options?: OptionCallback<ReferralProgram>,
  ) => void;
  submitCompanyTheme: (
    companyId: number,
    data: { is_referral_program_activated: boolean },
    options?: OptionCallback,
  ) => void;
  retrieveReferralProgram: () => void;
};

const EditReferralProgramSettingsPage: React.FC<Props> = ({
  companyTheme,
  companyThemeLoading,
  referralProgram,
  referralProgramLoading,
  tagList,
  tagsLoading,
  submitReferralProgram,
  submitCompanyTheme,
  retrieveReferralProgram,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('referral');
  const onSubmit = React.useCallback(
    (
      newReferralProgram: ReferralProgram,
      newDataCompanyTheme: { is_referral_program_activated: boolean },
      options?: OptionCallback<ReferralProgram>,
    ) => {
      submitReferralProgram(newReferralProgram, options);
      submitCompanyTheme(companyTheme.company, newDataCompanyTheme);
    },
    [submitReferralProgram, submitCompanyTheme, companyTheme.company],
  );

  React.useEffect(() => {
    retrieveReferralProgram();
  }, [retrieveReferralProgram]);

  const loading =
    companyThemeLoading ||
    referralProgramLoading ||
    !referralProgram ||
    tagsLoading;

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <>
      <Helmet>
        <title>{t('form.title')}</title>
      </Helmet>
      <div className={classes.container}>
        <Paper className={classes.paperContainer}>
          <EditReferralProgramSettingsForm
            companyTheme={companyTheme}
            onSubmit={onSubmit}
            referralProgram={referralProgram}
            tagList={tagList}
          />
        </Paper>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    paddingBottom: '20vh',
  },
  paperContainer: {
    padding: theme.spacing(3),
  },
}));

export default compose(
  React.memo,
  connect(
    (state: RootState) => ({
      tagsLoading: state.tag.tag.loading || state.tag.group.loading,
      tagList: getAllTagsWithTagGroup(state),
      referralProgram: getTheReferralProgram(state),
      referralProgramLoading: getReferralProgramsLoading(state),
      companyTheme: getTheme(state),
      companyThemeLoading: getThemeLoading(state),
    }),
    {
      retrieveReferralProgram: retrieveReferralProgramAction,
      submitReferralProgram: updateReferralProgramAction,
      submitCompanyTheme: updateCompanyTheme,
    },
  ),
)(EditReferralProgramSettingsPage);
