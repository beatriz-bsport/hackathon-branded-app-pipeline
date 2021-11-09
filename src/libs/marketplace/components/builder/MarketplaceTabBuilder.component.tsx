import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';

import { Coach } from '../../../associated-coach/types';
import {
  Establishment,
  EstablishmentGroup,
} from '../../../establishment/types';
import { MetaActivity } from '../../../meta-activity/types';
import {
  PrivateService,
  PrivateServiceGroup,
} from '../../../private-service/types';

import ExportableComponentSelector from '../../../exportable-components/components/ExportableComponentSelector.component';
import {
  getDefaultConfigByIdentifier,
  checkExportableComponentConfig,
  EXPORTABLE_COMPONENT_WITH_ADVANCED_SETTINGS,
} from '../../../exportable-components/utils';
import { EXPORTABLE_COMPONENT_TYPE_CALENDAR } from '../../../exportable-components/constants';
import ExportableComponentConfigurator from '../../../exportable-components/components/ExportableComponentConfigurator.component';
import { Video } from '../../../video/types';
import { MARKETPLACE_COMPONENT_TYPE_LIST } from '../../constants';
import { PaymentPackCategory } from '../../../payment-packs/types';

type Props = {
  onClose: () => void;
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
  metaActivities: Array<MetaActivity>;
  metaActivitiesWorkshop: Array<MetaActivity>;
  privateServices: Array<PrivateService>;
  playlists: Array<{ id: number; name: string }>;
  serviceGroupList: PrivateServiceGroup[];
  videos: Array<Video>;
  onSubmit: (tab: any) => void;
  index: number;
  tab: any;
  paymentPackCategories: Array<PaymentPackCategory>;
  establishmentGroupList: Array<EstablishmentGroup>;
};

const TabCreation: React.FC<Props> = (props) => {
  const [componentType, setComponentType] = useState(
    props.tab?.component_type || EXPORTABLE_COMPONENT_TYPE_CALENDAR,
  );
  const [title, setTitle] = useState(props.tab?.title);
  const [tabConfig, setTabConfig] = useState(props.tab?.config);
  const [showAdvanceSettings, setShowAdvanceSettings] = useState(false);
  const [componentTypeError, setComponentTypeError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [configErrors, setConfigError] = useState({});

  const classes = useStyles();
  const { t } = useTranslation(['settings']);

  useEffect(() => {
    if (tabConfig) {
      if (tabConfig[componentType]) {
        const componentConfig = tabConfig[componentType];
        for (const key in componentConfig) {
          if (key in componentConfig) {
            // @ts-ignore
            const val = componentConfig[key];
            if (Array.isArray(val)) {
              val.length && setShowAdvanceSettings(true);
            } else {
              val && setShowAdvanceSettings(true);
            }
          }
        }
      }
    }
  }, [setShowAdvanceSettings, tabConfig, componentType]);

  useEffect(() => {
    componentType && setComponentTypeError('');
    title && setTitleError('');
  }, [componentType, title]);

  const onChangeComponentType = useCallback(
    (type: string) => {
      const config = {
        [type]: getDefaultConfigByIdentifier(type),
      };
      setTabConfig(config);
      setComponentType(type);
      setTitle(t(`marketplaceSettings.componentType.${type}`));
      setShowAdvanceSettings(false);
    },
    [setComponentType, setTitle, setShowAdvanceSettings, setTabConfig, t],
  );

  const { onSubmit, index } = props;
  const onSubmit_ = useCallback(() => {
    if (!componentType) {
      setComponentTypeError(
        t('marketplaceSettings.createDialog.noComponentTypeError'),
      );
      return;
    }

    if (!title || !title.trim()) {
      setTitleError(t('marketplaceSettings.createDialog.noTitleError'));
      return;
    }

    const errors = checkExportableComponentConfig(componentType, tabConfig);
    setConfigError(errors);
    if (Object.values(errors).reduce((e, acc) => !!e || acc, false)) {
      return;
    }
    onSubmit({
      component_type: componentType,
      title,
      index,
      config: tabConfig,
    });
  }, [componentType, title, tabConfig, index, onSubmit, t]);

  return (
    <Dialog open className={classes.container} onClose={props.onClose}>
      <DialogTitle>
        {t('marketplaceSettings.createDialog.dialogTitle')}
      </DialogTitle>
      <DialogContent className={classes.container}>
        <TextField
          className={classes.fullWidth}
          variant="outlined"
          placeholder={t('')}
          label={t('marketplaceSettings.createDialog.inputTitle')}
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        {titleError && <Typography color="error">{titleError}</Typography>}

        <div className={classes.marginTop}>
          <ExportableComponentSelector
            source={MARKETPLACE_COMPONENT_TYPE_LIST}
            value={componentType}
            onChange={onChangeComponentType}
            error={componentTypeError}
          />
        </div>

        {!showAdvanceSettings &&
          EXPORTABLE_COMPONENT_WITH_ADVANCED_SETTINGS.includes(
            componentType,
          ) && (
            <div className={classes.showMoreContainer}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowAdvanceSettings(true)}
              >
                {t('marketplaceSettings.createDialog.showAdvanced')}
              </Button>
            </div>
          )}

        {showAdvanceSettings && (
          <ExportableComponentConfigurator
            componentType={componentType}
            coaches={props.coaches}
            establishments={props.establishments}
            metaActivities={props.metaActivities}
            metaActivitiesWorkshop={props.metaActivitiesWorkshop}
            privateServices={props.privateServices}
            serviceGroupList={props.serviceGroupList}
            playlists={props.playlists}
            videos={props.videos}
            errors={configErrors}
            config={tabConfig}
            onChange={(config) =>
              setTabConfig({ [componentType]: config[componentType] })
            }
            paymentPackCategories={props.paymentPackCategories}
            establishmentGroupList={props.establishmentGroupList}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={props.onClose} color="secondary">
          {t('marketplaceSettings.createDialog.cancel')}
        </Button>
        <Button
          type="submit"
          onClick={onSubmit_}
          color="primary"
          id="button_role_save"
        >
          {t('marketplaceSettings.createDialog.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: 600,
  },
  fullWidth: {
    width: '100%',
  },
  marginTop: {
    marginTop: theme.spacing(4),
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  showMoreContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
}));

export default TabCreation;
