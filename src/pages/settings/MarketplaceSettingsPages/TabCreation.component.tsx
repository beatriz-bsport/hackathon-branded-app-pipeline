import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';


import { Coach } from "../../../libs/associated-coach/types";
import { Establishment } from "../../../libs/establishment/types";
import { MetaActivity } from "../../../libs/meta-activity/types";
import { PrivateService } from "../../../libs/private-service/types";

import {
  MarketplaceCalendarData,
  MarketplaceComponentData,
  MarketplaceComponentsEnum,
  MarketplacePlaylistData, MarketplacePrivateServiceData,
  MarketplaceTabConfig,
} from "../../../libs/marketplace/types";

import CoachSelector from "../../../libs/associated-coach/components/CoachSelector.component.js";
import EstablishmentSelector from "../../../libs/establishment/components/EstablishmentSelector.component.js";
import MetaActivitySelector from "../../../libs/meta-activity/components/MetaActivitySelector.component.js";
import LevelSelector from "../../../libs/category/components/LevelSelector.component.js";

type Props = {
  onClose: () => void,
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
  metaActivities: Array<MetaActivity>;
  privateServices: Array<PrivateService>;
  playlists: Array<{id: number, name: string}>
  onSubmit: (tab: MarketplaceTabConfig) => void;
  tab: MarketplaceTabConfig | null;
};

const TabCreation: React.FC<Props> = (props) => {
  const [componentType, setComponentType] = useState(props.tab?.componentType);
  const [title, setTitle] = useState(props.tab?.title);
  const [data, setData] = useState<MarketplaceComponentData>(props.tab?.data);
  const [showAdvanceSettings, setShowAdvanceSettings] = useState(false);
  const [componentTypeError, setComponentTypeError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [playlistError, setPlaylistError] = useState('');

  const classes = useStyles();
  const { t } = useTranslation('settings');


  useEffect(() => {
    componentType && setComponentTypeError('');
    title && setTitleError('');
  }, [componentType, title]);

  const onChangeComponentType = useCallback((type) => {
    if (type === MarketplaceComponentsEnum.calendar) {
      const _data: MarketplaceCalendarData = {
        coaches: [],
        establishments: [],
        metaActivities: [],
        levels: [],
      };
      setData(_data);
    } else if (type === MarketplaceComponentsEnum.playlist) {
      const _data: MarketplacePlaylistData = {
        playlistId: '',
        name: '',
      };
      setData(_data);
    } else {
      setData({});
    }

    setComponentType(type);
    setTitle(t(`marketplaceSettings.componentType.${type}`));
    setShowAdvanceSettings(false);
  }, []);

  const setCalendarData = useCallback((key: keyof MarketplaceCalendarData, values: any) => {
    setData((prevState: MarketplaceCalendarData) => {
        return {
          ...prevState,
          [key]: values.map((value: any) => ({ id: value.value, name: value.label })) };
    });
  }, [data, componentType]);

  const setPrivateServiceDetailData = useCallback((value: any) => {
    setData({
      serviceId: value,
      name: props.privateServices.find((ps: PrivateService) => ps.id === value).name,
    });
  }, [data, componentType]);

  const setPlaylistData = useCallback((value: any) => {
    setData({
      playlistId: value,
      name: props.playlists.find((p: any) => p.id === value).name,
    });
  }, [data, componentType]);

  const onSubmit = useCallback(() => {
    if (!componentType) {
      setComponentTypeError(t('marketplaceSettings.createDialog.noComponentTypeError'));
      return;
    }

    if (!title || !title.trim()) {
      setTitleError(t('marketplaceSettings.createDialog.noTitleError'));
      return;
    }

    if (componentType === MarketplaceComponentsEnum.playlist) {
      if (data && !(data as MarketplacePlaylistData).playlistId) {
        setPlaylistError(t('marketplaceSettings.createDialog.noPlaylistError'));
        return;
      }
    }

    const tab: MarketplaceTabConfig = {
      componentType,
      title,
      data,
    };

    props.onSubmit(tab);
  }, [componentType, title, data]);


  const renderOptionalData = useCallback(() => {
    if (componentType === MarketplaceComponentsEnum.calendar && showAdvanceSettings) {
      return (
        <div className={classes.flexCol}>
          <div className={classes.marginTop}>
            <CoachSelector
              coaches={props.coaches}
              selectedCoaches={(data as MarketplaceCalendarData).coaches.map((c) => c.id)}
              selectOption={(ev: any) => setCalendarData("coaches", ev)}
            />
          </div>
          <div className={classes.marginTop}>
            <EstablishmentSelector
              establishments={props.establishments}
              selectedEstablishment={(data as MarketplaceCalendarData).establishments.map((e) => e.id)}
              selectOption={(ev: any) => setCalendarData("establishments", ev)}
            />
          </div>
          <div className={classes.marginTop}>
            <MetaActivitySelector
              metaActivities={props.metaActivities}
              selectedMetaActivities={(data as MarketplaceCalendarData).metaActivities.map((m) => m.id)}
              selectOption={(ev: any) => setCalendarData("metaActivities", ev)}
            />
          </div>
          <div className={classes.marginTop}>
            <LevelSelector
              selectedLevels={(data as MarketplaceCalendarData).levels.map((l) => l.id)}
              selectOption={(ev: any) => setCalendarData("levels", ev)}
            />
          </div>
        </div>
      );
    }

    if (componentType === MarketplaceComponentsEnum.privateService && showAdvanceSettings) {
      return (
        <div className={classes.flexCol}>
          <FormControl className={classes.marginTop}>
            <InputLabel>
              {t('marketplaceSettings.createDialog.selectPrivateService')}
            </InputLabel>
            <Select
              value={(data as MarketplacePrivateServiceData).serviceId}
              onChange={(ev) =>
                setPrivateServiceDetailData(ev.target.value)
              }
            >
              {props.privateServices.map((privateService) => (
                <MenuItem key={privateService.id} value={privateService.id}>
                  {privateService.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      );
    }

    if (componentType === MarketplaceComponentsEnum.playlist) {
      return (
        <div className={classes.flexCol}>
          <FormControl className={classes.marginTop}>
            <InputLabel>
              {t('marketplaceSettings.createDialog.selectPlaylist')}
            </InputLabel>
            <Select
              value={(data as MarketplacePlaylistData).playlistId}
              onChange={(ev) =>
                setPlaylistData(ev.target.value)
              }
            >
              {props.playlists.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
            {playlistError && (
              <Typography color="error">{playlistError}</Typography>
            )}
          </FormControl>
        </div>
      );
    }

    return null;
  }, [componentType, data, showAdvanceSettings, playlistError]);

  return (
    <Dialog open className={classes.container}>
      <DialogTitle>{t('marketplaceSettings.createDialog.dialogTitle')}</DialogTitle>
      <DialogContent className={classes.container}>
        <FormControl className={classes.fullWidth}>
          <InputLabel>
            {t('marketplaceSettings.createDialog.selectComponent')}
          </InputLabel>
          <Select
            className={classes.fullWidth}
            value={componentType}
            onChange={(ev) => onChangeComponentType(ev.target.value)}
          >
            {Object.values(MarketplaceComponentsEnum).map((component) => (
              <MenuItem key={component} value={component}>
                {t(`marketplaceSettings.componentType.${component}`)}
              </MenuItem>
            ))}
          </Select>
          {componentTypeError && (
              <Typography color="error">{componentTypeError}</Typography>
          )}
        </FormControl>

        <div className={classes.marginTop}>
          <TextField
            className={classes.fullWidth}
            variant="outlined"
            placeholder={t('')}
            label={t('marketplaceSettings.createDialog.inputTitle')}
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          {titleError && (
              <Typography color="error">{titleError}</Typography>
          )}
        </div>

        {(
            !showAdvanceSettings &&
            (
              componentType === MarketplaceComponentsEnum.calendar ||
              componentType === MarketplaceComponentsEnum.privateService
            )
        ) && (
            <div className={classes.showMoreContainer}>
            <ButtonBase onClick={() => setShowAdvanceSettings(true)}>
              <Typography color="primary">Voir les options avancées</Typography>
            </ButtonBase>
            </div>
        )}
        {renderOptionalData()}
      </DialogContent>

      <DialogActions>
        <Button onClick={props.onClose} color="secondary">
          {t('marketplaceSettings.createDialog.cancel')}
        </Button>
        <Button
          type="submit"
          onClick={onSubmit}
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
