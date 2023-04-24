// @ts-nocheck
import React, { useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import ExportableComponentConfigurator from '../../exportable-components/components/ExportableComponentConfigurator.component';
import ExportableComponentSelector from '../../exportable-components/components/ExportableComponentSelector.component';

import {
  WIDGET_FRANCHISOR_SUPPORTED_EXPORTABLE_COMPONENTS,
  WIDGET_NOT_FRANCHISOR_SUPPORTED_EXPORTABLE_COMPONENTS,
  CSS_SUPPORTED_EXPORTABLE_COMPONENTS,
} from '../constants';
import { EXPORTABLE_COMPONENT_TYPE_PLAYLIST } from '../../exportable-components/constants';

import { MetaActivity } from '../../meta-activity/types';
import { Coach } from '../../associated-coach/types';
import { Video } from '../../video/types';
import { Playlist } from '../../playlist/types';
import {
  PrivatePassCategory,
  PrivateService,
  PrivateServiceGroup,
} from '../../private-service/types';
import { Establishment, EstablishmentGroup } from '../../establishment/types';

import { Giftcard } from '../../giftcard/types';
import {
  getDefaultConfigByIdentifier,
  checkExportableComponentConfig,
} from '../../exportable-components/utils';
import {
  PaymentPackCategory,
  PaymentPackTemplate,
} from '../../payment-packs/types';
import { Level } from '#libs/level/types';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type Props = {
  componentType: string;
  config: any;
  onConfigChange: (a: { config: any; error: any }) => void;
  onComponentTypeChange: (a: {
    componentType: string;
    config: any;
    error: any;
  }) => void;
  coaches: Array<Coach>;
  metaActivities: Array<MetaActivity>;
  metaActivitiesWorkshop: Array<MetaActivity>;
  establishments: Array<Establishment>;
  privateServices: Array<PrivateService>;
  serviceGroupList: Array<PrivateServiceGroup>;
  videos: Array<Video>;
  playlists: Array<Playlist>;
  hideTypeSelector?: boolean;
  paymentPackCategories?: Array<PaymentPackCategory>;
  privatePassCategories?: Array<PrivatePassCategory>;
  establishmentGroupList: Array<EstablishmentGroup>;
  giftcards?: Array<Giftcard>;
  paymentPackTemplateListAvailable: Array<PaymentPackTemplate>;
  isFranchisor?: boolean;
  cssOnly?: boolean;
  previewDialog?: boolean;
  customLevels: Level[];
};

export const WidgetComponentConfigBuilder = (props: Props) => {
  const { t } = useTranslation(['settings', 'widget']);
  const classes = useStyles();
  const [widgetConfigOpen, setWidgetConfigOpen] = useState(false);

  const onConfigChange = (config: any) => {
    const errors = checkExportableComponentConfig(props.componentType, config);

    props.onConfigChange({
      config,
      error: errors,
    });
  };

  const onComponentTypeChange = (componentType: string) => {
    let playlistError = '';

    if (componentType === EXPORTABLE_COMPONENT_TYPE_PLAYLIST) {
      playlistError = t(
        'settings:marketplaceSettings.createDialog.noPlaylistError',
      );
    }

    props.onComponentTypeChange({
      componentType,
      config: {
        ...props.config,
        [componentType]: getDefaultConfigByIdentifier(componentType),
      },
      error: {
        playlistError,
        privateServiceError: '',
      },
    });
  };

  const selectorSource = useMemo(() => {
    if (props.isFranchisor)
      return WIDGET_FRANCHISOR_SUPPORTED_EXPORTABLE_COMPONENTS;
    if (props.cssOnly) return CSS_SUPPORTED_EXPORTABLE_COMPONENTS;
    return WIDGET_NOT_FRANCHISOR_SUPPORTED_EXPORTABLE_COMPONENTS;
  }, [props.cssOnly, props.isFranchisor]);

  const handleClose = () => setWidgetConfigOpen(false);
  const [config, setConfig] = useState(props.config);

  return (
    <div className={classes.container}>
      {!props.hideTypeSelector && (
        <ExportableComponentSelector
          source={selectorSource}
          value={props.componentType}
          onChange={onComponentTypeChange}
        />
      )}
      {props.previewDialog ? (
        <div>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setWidgetConfigOpen(true)}
            className={classes.openDialogButton}
          >
            <SettingsIcon />
            <Typography variant="body1" className={classes.textButton}>
              {t('widget:widget.configDialog.title')}
            </Typography>
          </Button>

          <GenericResponsiveDialog
            open={widgetConfigOpen}
            onClose={() => setWidgetConfigOpen(false)}
            maxWidth="sm"
          >
            <DialogTitle>{t('widget:widget.configDialog.title')}</DialogTitle>
            <DialogContent>
              <ExportableComponentConfigurator
                paymentPackTemplateListAvailable={
                  props.paymentPackTemplateListAvailable
                }
                componentType={props.componentType}
                coaches={props.coaches}
                establishments={props.establishments}
                metaActivities={props.metaActivities}
                metaActivitiesWorkshop={props.metaActivitiesWorkshop}
                privateServices={props.privateServices}
                playlists={props.playlists}
                videos={props.videos}
                serviceGroupList={props.serviceGroupList}
                config={config}
                onChange={setConfig}
                errors={props.config?.error}
                paymentPackCategories={props.paymentPackCategories}
                privatePassCategories={props.privatePassCategories}
                establishmentGroupList={props.establishmentGroupList}
                giftcards={props.giftcards}
                customLevels={props.customLevels}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>
                {t('widget:widget.configDialog.cancel')}
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  onConfigChange(config);
                  handleClose();
                }}
                color="primary"
              >
                {t('widget:widget.configDialog.submit')}
              </Button>
            </DialogActions>
          </GenericResponsiveDialog>
        </div>
      ) : (
        <ExportableComponentConfigurator
          paymentPackTemplateListAvailable={
            props.paymentPackTemplateListAvailable
          }
          componentType={props.componentType}
          coaches={props.coaches}
          establishments={props.establishments}
          metaActivities={props.metaActivities}
          metaActivitiesWorkshop={props.metaActivitiesWorkshop}
          privateServices={props.privateServices}
          playlists={props.playlists}
          videos={props.videos}
          serviceGroupList={props.serviceGroupList}
          config={props.config}
          onChange={onConfigChange}
          errors={props.config?.error}
          paymentPackCategories={props.paymentPackCategories}
          privatePassCategories={props.privatePassCategories}
          establishmentGroupList={props.establishmentGroupList}
          giftcards={props.giftcards}
          customLevels={props.customLevels}
        />
      )}
    </div>
  );
};
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    alignItems: 'flex-start',
  },
  openDialogButton: {
    border: 'none',
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(1),
    borderRadius: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
      border: 'none',
    },
  },
  textButton: {
    paddingLeft: theme.spacing(1),
  },
}));

export default WidgetComponentConfigBuilder;
