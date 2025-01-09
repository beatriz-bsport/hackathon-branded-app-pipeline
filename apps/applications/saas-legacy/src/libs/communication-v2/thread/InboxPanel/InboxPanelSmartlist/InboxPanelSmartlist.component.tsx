import React, { memo, useCallback } from 'react';

import type { CallHistoryMethodAction } from 'connected-react-router';

import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';
import type { SmartList } from '#src/libs/smart-list/types';
import { CustomChip } from '#src/components/chip/CustomChip.component';
import type { Tag, TagGroup } from '#src/libs/tag/types';
import InboxPanelSmartlistTags from './InboxPanelSmartlistTags.component';

type Props = {
  smartlist: SmartList;
  memberCount: number;
  filters: any;
  includedTags: Tag<TagGroup>[];
  excludedTags: Tag<TagGroup>[];
  goToSmartlistPage?: (
    id: number,
  ) => CallHistoryMethodAction<[string, unknown?]>;
};

const InboxPanelSmartlist: React.FC<Props> = ({
  smartlist,
  memberCount,
  filters,
  includedTags,
  excludedTags,
  goToSmartlistPage,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('smartList');

  const theme = useTheme();

  const hasTagFilters = !!includedTags?.length || !!excludedTags?.length;

  const handleClick = useCallback(() => {
    smartlist?.id && goToSmartlistPage(smartlist.id);
  }, [goToSmartlistPage, smartlist]);

  return (
    <div className={classes.container}>
      <div className={classes.paddingTopContainer}>
        <div className={classes.countMemberContainer}>
          <Typography color="primary" variant="h5">
            {memberCount}
          </Typography>
          <Typography color="textPrimary" variant="caption">
            {t('communication:thread.panel.smartlist.memberCount')}
          </Typography>
        </div>
      </div>

      <div className={classes.sectionContainer}>
        <Typography color="textPrimary" variant="body1">
          {t('communication:thread.panel.smartlist.filters')}
        </Typography>
        <div className={classes.smallPaddingTop}>
          <CustomChip
            displayedValue={t(`memberBase.options.${smartlist?.member_base}`)}
            icon="Person"
            iconColor={theme.palette.common.black}
            mainColor={theme.palette.common.black}
          />
        </div>
        <div className={classes.filterContainer}>
          {filters.map((filter: any) => (
            <div className={classes.chipContainer}>
              <CustomChip
                displayedValue={t(`filters.${filter.filter_identifier}.name`)}
                mainColor={theme.palette.common.black}
              />
            </div>
          ))}
        </div>
      </div>

      {hasTagFilters && (
        <InboxPanelSmartlistTags
          excludedTags={excludedTags}
          includedTags={includedTags}
        />
      )}

      {smartlist?.description && (
        <div className={classes.sectionContainer}>
          <Typography color="textPrimary" variant="body1">
            {t('communication:thread.panel.smartlist.description')}
          </Typography>
          <Typography
            className={classes.smallPaddingTop}
            color="textPrimary"
            variant="body2"
          >
            {smartlist?.description}
          </Typography>
        </div>
      )}

      <div className={classes.sectionContainer}>
        <ButtonBase onClick={handleClick}>
          <Typography color="primary">
            {t(
              `communication:thread.panel.navigation.${ChatThreadKinds.Smartlist}`,
            ).toUpperCase()}
          </Typography>
          <ArrowForwardIcon className={classes.arrowIcon} color="primary" />
        </ButtonBase>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  countMemberContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    width: '100%',
    borderRadius: theme.spacing(1),
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: theme.spacing(4),
  },
  chipContainer: {
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  smallPaddingTop: {
    paddingTop: theme.spacing(1),
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: theme.spacing(1),
    flexWrap: 'wrap',
  },
  paddingTopContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(4),
  },
  arrowIcon: {
    paddingLeft: theme.spacing(1),
  },
}));

export default memo(InboxPanelSmartlist);
