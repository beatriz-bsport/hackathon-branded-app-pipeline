import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';

import { marketingActionIconDict } from '#src/libs/sequential_marketing/components/helpers/utils';
import { TRIGGER_FORM_DEFAULT_HEIGHT } from '#src/libs/sequential_marketing/constants';
import CustomMuiIcon from '#src/components/icons/CustomMuiIcon.component';
import type {
  MarketingActionEssentials,
  StepMarketingActions,
} from '#src/libs/sequential_marketing/types';
import MarketingActionContent from './MarketingActionContent.component';

import { getMarketingActionType } from './utils';

type Props = {
  color: string;
  isLast: boolean;
  isOpen: boolean;
  marketingAction: Partial<StepMarketingActions>;
  marketingActionList?: StepMarketingActions[];
  withoutCollapseAnimation: boolean;
  deleteAction: () => void;
  openOrCloseAction: () => void;
  updateAction: (data: StepMarketingActions) => void;
} & MarketingActionEssentials;

const CollapsibleMarketingActionContent: React.FC<Props> = ({
  color,
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  isLast,
  isOpen,
  marketingAction,
  marketingActionList,
  resolvedGenericTags,
  tagCategories,
  tagList,
  withoutCollapseAnimation,
  deleteAction,
  fetchEmailSummaryList,
  getEmailDetail,
  openOrCloseAction,
  updateAction,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  const marketingActionKind = React.useMemo(
    () => getMarketingActionType(marketingAction),
    [marketingAction],
  );

  const handleOnClickItem = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      openOrCloseAction();
    },
    [openOrCloseAction],
  );

  const handleDeleteAction = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      deleteAction();
    },
    [deleteAction],
  );

  return (
    <>
      <div className={classes.content}>
        <ButtonBase
          disableRipple
          className={classes.header}
          onClick={handleOnClickItem}
        >
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          <CustomMuiIcon
            defaultBackGround
            customColor={color}
            icon={marketingActionIconDict[marketingActionKind]}
            withBackground={false}
          />
          <Typography variant="body1">
            {t(`cadence.form.marketing_action.${marketingActionKind}`)}
          </Typography>
          <IconButton
            className={classes.deleteButton}
            onClick={handleDeleteAction}
            size="small"
          >
            <CustomMuiIcon
              defaultBackGround
              icon="Cancel"
              withBackground={false}
            />
          </IconButton>
        </ButtonBase>
        <Collapse
          in={isOpen}
          timeout={withoutCollapseAnimation ? 0 : undefined}
        >
          <div className={classes.collapseSection}>
            <MarketingActionContent
              withoutValidation
              emailDetailList={emailDetailList}
              emailDetailListLoading={emailDetailListLoading}
              emailSummaryList={emailSummaryList}
              emailSummaryListLoading={emailSummaryListLoading}
              fetchEmailSummaryList={fetchEmailSummaryList}
              getEmailDetail={getEmailDetail}
              marketingAction={marketingAction}
              marketingActionList={marketingActionList}
              resolvedGenericTags={resolvedGenericTags}
              submit={updateAction}
              tagCategories={tagCategories}
              tagList={tagList}
            />
          </div>
        </Collapse>
      </div>
      {!isLast && <Divider />}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(2),
    width: '100%',
    height: TRIGGER_FORM_DEFAULT_HEIGHT,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
  },
  collapseSection: {
    paddingTop: theme.spacing(1),
  },
}));

export default React.memo(CollapsibleMarketingActionContent);
