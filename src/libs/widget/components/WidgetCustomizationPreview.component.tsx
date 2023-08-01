import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { Alert } from '@material-ui/lab';
import { compose } from 'recompose';

import { Paper, Typography } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { DIALOG_MODE_IFRAME } from '@bsport/common/lib/master-data/widget-dialog-mode';

import WidgetComponentConfigBuilder from './WidgetComponentConfigBuilder.component';
import withPageHeightHOC from '#hocs/with-page-height.hoc';
import { Coach } from '#libs/associated-coach/types';
import { Establishment, EstablishmentGroup } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Level } from '#libs/level/types';
import { WidgetCustomCSS } from '#libs/theme/types';
import { WidgetCodeStringGenerator } from '#libs/marketplace/utils';
import WidgetPreview from './WidgetPreview.component';

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

  let codeStringPreview = '';

  codeStringPreview = WidgetCodeStringGenerator.getString({
    company,
    franchise: null,
    componentType,
    config,
    useIframe: false,
    language: 'none',
    dialogMode: DIALOG_MODE_IFRAME,
    fullScreenPopup: false,
    showFab: false,
    uuid,
    responsiveIframe: true,
    styles,
    isBackofficePreview: true,
  });

  return (
    <Paper className={classes.paper} style={{ maxHeight: pageHeight }}>
      <Typography className={classes.title} variant="h6">
        <VisibilityIcon className={classes.icon} />
        {t('widget.cssEditor.preview')}
      </Typography>
      <div className={classes.config}>
        <WidgetComponentConfigBuilder
          cssOnly
          previewDialog
          coaches={coaches}
          componentType={componentType}
          config={config}
          customLevels={customLevels}
          establishmentGroupList={establishmentGroupList}
          establishments={establishments}
          giftcards={[]}
          hideTypeSelector={false}
          isFranchisor={false}
          metaActivities={metaActivities}
          metaActivitiesWorkshop={metaActivitiesWorkshop}
          onComponentTypeChange={onComponentTypeChange}
          onConfigChange={onConfigChange}
          paymentPackCategories={[]}
          paymentPackTemplateListAvailable={[]}
          playlists={[]}
          privatePassCategories={[]}
          privateServices={[]}
          serviceGroupList={[]}
          videos={[]}
        />
      </div>
      <Alert className={classes.alert} severity="info">
        {t('widget.cssEditor.selectAlert')}
      </Alert>
      <WidgetPreview
        customizationPreview
        codeStringPreview={codeStringPreview}
      />
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    flex: 1,
    overflowY: 'auto',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  config: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
  },
  icon: {
    fill: theme.palette.grey[600],
  },
  alert: {
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

export default compose(withPageHeightHOC())(WidgetCustomizationPreview);
