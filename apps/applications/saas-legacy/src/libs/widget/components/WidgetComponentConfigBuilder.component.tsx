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
import { Level } from '#src/libs/level/types';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import type { Tag, TagGroupAPI } from '#src/libs/tag/types';
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
} from '../../exportable-components/utils-common';
import {
  PaymentPackCategory,
  PaymentPackTemplate,
} from '../../payment-packs/types';

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
  tagList: Array<Tag<TagGroupAPI>>;
  tagsLoading: boolean;
  companyId?: number;
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
          onChange={onComponentTypeChange}
          source={selectorSource}
          value={props.componentType}
        />
      )}
      {props.previewDialog ? (
        <div>
          <Button
            className={classes.openDialogButton}
            color="primary"
            onClick={() => setWidgetConfigOpen(true)}
            variant="outlined"
          >
            <SettingsIcon />
            <Typography className={classes.textButton} variant="body1">
              {t('widget:widget.configDialog.title')}
            </Typography>
          </Button>

          <GenericResponsiveDialog
            maxWidth="sm"
            onClose={() => setWidgetConfigOpen(false)}
            open={widgetConfigOpen}
          >
            <DialogTitle>{t('widget:widget.configDialog.title')}</DialogTitle>
            <DialogContent>
              <ExportableComponentConfigurator
                coaches={props.coaches}
                componentType={props.componentType}
                config={config}
                customLevels={props.customLevels}
                errors={props.config?.error}
                establishmentGroupList={props.establishmentGroupList}
                establishments={props.establishments}
                giftcards={props.giftcards}
                metaActivities={props.metaActivities}
                metaActivitiesWorkshop={props.metaActivitiesWorkshop}
                onChange={setConfig}
                paymentPackCategories={props.paymentPackCategories}
                paymentPackTemplateListAvailable={
                  props.paymentPackTemplateListAvailable
                }
                playlists={props.playlists}
                privatePassCategories={props.privatePassCategories}
                privateServices={props.privateServices}
                serviceGroupList={props.serviceGroupList}
                tagList={props.tagList}
                tagsLoading={props.tagsLoading}
                videos={props.videos}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>
                {t('widget:widget.configDialog.cancel')}
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  onConfigChange(config);
                  handleClose();
                }}
                type="submit"
              >
                {t('widget:widget.configDialog.submit')}
              </Button>
            </DialogActions>
          </GenericResponsiveDialog>
        </div>
      ) : (
        <ExportableComponentConfigurator
          coaches={props.coaches}
          componentType={props.componentType}
          config={props.config}
          customLevels={props.customLevels}
          errors={props.config?.error}
          establishmentGroupList={props.establishmentGroupList}
          establishments={props.establishments}
          giftcards={props.giftcards}
          metaActivities={props.metaActivities}
          metaActivitiesWorkshop={props.metaActivitiesWorkshop}
          onChange={onConfigChange}
          paymentPackCategories={props.paymentPackCategories}
          paymentPackTemplateListAvailable={
            props.paymentPackTemplateListAvailable
          }
          playlists={props.playlists}
          privatePassCategories={props.privatePassCategories}
          privateServices={props.privateServices}
          serviceGroupList={props.serviceGroupList}
          tagList={props.tagList}
          tagsLoading={props.tagsLoading}
          videos={props.videos}
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
