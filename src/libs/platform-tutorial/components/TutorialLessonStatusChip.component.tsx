import React from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { makeStyles } from '@material-ui/core';

import classNames from 'classnames';
import { isLessonViewed, isUpsellNotSubscribed } from '../utils';

// @ts-expect-error
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';
import ToolTip from '#components/Tooltip.component';

import { FeatureList } from '#libs/company/types';
import {
  TutorialCompletion,
  TutorialLesson,
} from '#libs/platform-tutorial/types';

type Props = {
  lesson: TutorialLesson;
  tutorial_completion?: TutorialCompletion;
  withToolTip?: boolean;
};

const LessonStatusChips: React.FC<Props> = ({
  lesson,
  tutorial_completion,
  withToolTip,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('tutorial');
  return (
    <div className={classes.flex}>
      {!!tutorial_completion &&
        !isLessonViewed(lesson, tutorial_completion) && (
          <div className={classes.chipBase}>{t('lessonList.new')}</div>
        )}
      <FeatureListProvider>
        {(featureList: FeatureList) => {
          const hasAddOnChip = isUpsellNotSubscribed(lesson, featureList);
          return withToolTip ? (
            <>
              {hasAddOnChip && (
                <ToolTip title={t('lessonList.missingUpsell')}>
                  <div
                    className={classNames(
                      classes.chipBase,
                      classes.colorInfo,
                      classes.contentCenter,
                    )}
                  >
                    {t('sectionList.addOn')}
                  </div>
                </ToolTip>
              )}
            </>
          ) : (
            <>
              {hasAddOnChip && (
                <div
                  className={classNames(
                    classes.chipBase,
                    classes.colorInfo,
                    classes.contentCenter,
                  )}
                >
                  {t('lessonHeader.addOn')}
                </div>
              )}
            </>
          );
        }}
      </FeatureListProvider>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'initial',
    gap: theme.spacing(1),
  },
  chipBase: {
    display: 'flex',
    borderRadius: theme.spacing(0.5),
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.1).hex(),
    color: theme.palette.primary.main,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  colorInfo: {
    color: theme.palette.info.main,
    backgroundColor: chroma(theme.palette.info.main).alpha(0.1).hex(),
  },
  contentCenter: {
    justifyContent: 'center',
  },
}));

export default LessonStatusChips;
