import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { Alert } from '@material-ui/lab';
import { compose } from 'recompose';

import { Paper, Typography } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { DIALOG_MODE_IFRAME } from '@bsport/common/lib/master-data/widget-dialog-mode';

import WidgetPreviewWithoutIFrame from './WidgetPreviewWithoutIFrame.component';

import WidgetComponentConfigBuilder from './WidgetComponentConfigBuilder.component';
import withPageHeightHOC from '#hocs/with-page-height.hoc';
import { Coach } from '#libs/associated-coach/types';
import { Establishment, EstablishmentGroup } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Level } from '#libs/level/types';
import { WidgetCustomCSS } from '#libs/theme/types';

type Props = {
  pageHeight: number;
  uuid: string;
  config: any;
  company: number;
  componentType: string;
  coaches: Coach[];
  establishments: Establishment[];
  metaActivities: MetaActivity[];
  metaActivitiesWorkshop: MetaActivity[];
  customLevels: Level[];
  styles: WidgetCustomCSS;
  establishmentGroupList: EstablishmentGroup[];
  onComponentTypeChange: (value: {
    componentType: string;
    config: any;
  }) => void;
  onConfigChange: (config: any) => void;
};

const WidgetCustomizationPreview: React.FC<Props> = ({
  componentType,
  coaches,
  establishments,
  metaActivities,
  metaActivitiesWorkshop,
  establishmentGroupList,
  config,
  customLevels,
  company,
  uuid,
  styles,
  onComponentTypeChange,
  onConfigChange,
  pageHeight,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('widget');

  return (
    <Paper className={classes.paper} style={{ maxHeight: pageHeight }}>
      <Typography variant="h6" className={classes.title}>
        <VisibilityIcon className={classes.icon} />
        {t('widget.cssEditor.preview')}
      </Typography>
      <div className={classes.config}>
        <WidgetComponentConfigBuilder
          paymentPackTemplateListAvailable={[]}
          isFranchisor={false}
          hideTypeSelector={false}
          coaches={coaches}
          establishments={establishments}
          metaActivities={metaActivities}
          metaActivitiesWorkshop={metaActivitiesWorkshop}
          privateServices={[]}
          playlists={[]}
          videos={[]}
          serviceGroupList={[]}
          config={config}
          onConfigChange={onConfigChange}
          paymentPackCategories={[]}
          privatePassCategories={[]}
          establishmentGroupList={establishmentGroupList}
          giftcards={[]}
          customLevels={customLevels}
          cssOnly
          onComponentTypeChange={onComponentTypeChange}
          componentType={componentType}
        />
      </div>
      <Alert className={classes.alert} severity="info">
        {t('widget.cssEditor.selectAlert')}
      </Alert>
      <WidgetPreviewWithoutIFrame
        company={company}
        franchise={null}
        componentType={componentType}
        config={config}
        language="none"
        dialogMode={DIALOG_MODE_IFRAME}
        fullScreenPopup={false}
        showFab={false}
        uuid={uuid}
        styles={styles}
        key={uuid}
      />
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
  },
  title: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  config: {
    marginBottom: theme.spacing(3),
  },
  icon: {
    fill: theme.palette.grey[600],
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
}));

export default compose(withPageHeightHOC())(WidgetCustomizationPreview);
