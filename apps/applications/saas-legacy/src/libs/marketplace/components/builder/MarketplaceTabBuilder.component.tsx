import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImmutableArray } from 'seamless-immutable';

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

import { Level } from '#src/libs/level/types';
import { Coach } from '../../../associated-coach/types';
import {
  Establishment,
  EstablishmentGroup,
} from '../../../establishment/types';
import { MetaActivity } from '../../../meta-activity/types';
import {
  PrivatePassCategory,
  PrivateService,
  PrivateServiceGroup,
} from '../../../private-service/types';
import type { Giftcard } from '#src/libs/giftcard/types';
import ExportableComponentSelector from '../../../exportable-components/components/ExportableComponentSelector.component';
import {
  getDefaultConfigByIdentifier,
  checkExportableComponentConfig,
  EXPORTABLE_COMPONENT_WITH_ADVANCED_SETTINGS,
} from '../../../exportable-components/utils-common';
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
  metaActivitiesWorkshop: ImmutableArray<MetaActivity>;
  privateServices: Array<PrivateService>;
  playlists: Array<{ id: number; name: string }>;
  serviceGroupList: PrivateServiceGroup[];
  videos: Array<Video>;
  onSubmit: (tab: any) => void;
  index: number;
  tab: any;
  paymentPackCategories: Array<PaymentPackCategory>;
  privatePassCategories: Array<PrivatePassCategory>;
  establishmentGroupList: Array<EstablishmentGroup>;
  giftcards: Array<Giftcard>;
  customLevels: Level[];
};

const TITLE_MAX_LENGTH = 64;

const MarketPlaceTabBuilder: React.FC<Props> = (props) => {
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
  const { t } = useTranslation('settings');

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

  const handleShowAdvancedSettings = useCallback(
    () => setShowAdvanceSettings(true),
    [],
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
    // @ts-expect-error
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
          inputProps={{ maxLength: TITLE_MAX_LENGTH }}
          label={t('marketplaceSettings.createDialog.inputTitle')}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder={t('')}
          value={title}
          variant="outlined"
        />
        <Typography variant="caption">
          {t('marketplaceSettings.createDialog.titleCaption', {
            count: title?.length,
            max: TITLE_MAX_LENGTH,
          })}
        </Typography>
        {titleError && <Typography color="error">{titleError}</Typography>}

        <div className={classes.marginTop}>
          <ExportableComponentSelector
            error={componentTypeError}
            onChange={onChangeComponentType}
            source={MARKETPLACE_COMPONENT_TYPE_LIST}
            value={componentType === 'calendarV2' ? 'calendar' : componentType}
          />
        </div>

        {!showAdvanceSettings &&
          EXPORTABLE_COMPONENT_WITH_ADVANCED_SETTINGS.includes(
            componentType,
          ) && (
            <div className={classes.showMoreContainer}>
              <Button
                color="primary"
                onClick={handleShowAdvancedSettings}
                variant="outlined"
              >
                {t('marketplaceSettings.createDialog.showAdvanced')}
              </Button>
            </div>
          )}

        {showAdvanceSettings && (
          <ExportableComponentConfigurator
            coaches={props.coaches}
            componentType={componentType}
            config={tabConfig}
            customLevels={props.customLevels}
            errors={configErrors}
            establishmentGroupList={props.establishmentGroupList}
            establishments={props.establishments}
            giftcards={props.giftcards}
            metaActivities={props.metaActivities}
            // @ts-expect-error
            metaActivitiesWorkshop={props.metaActivitiesWorkshop}
            onChange={(config) =>
              setTabConfig({ [componentType]: config[componentType] })
            }
            paymentPackCategories={props.paymentPackCategories}
            playlists={props.playlists}
            privatePassCategories={props.privatePassCategories}
            privateServices={props.privateServices}
            serviceGroupList={props.serviceGroupList}
            videos={props.videos}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button color="secondary" onClick={props.onClose}>
          {t('marketplaceSettings.createDialog.cancel')}
        </Button>
        <Button
          color="primary"
          id="button_role_save"
          onClick={onSubmit_}
          type="submit"
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

export default React.memo(MarketPlaceTabBuilder);
