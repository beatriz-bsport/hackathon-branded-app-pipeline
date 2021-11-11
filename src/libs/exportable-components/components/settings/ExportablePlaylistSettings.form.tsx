import React, { useEffect } from 'react';
import {
  InputLabel,
  Typography,
  MenuItem,
  Select,
  makeStyles,
  FormControl,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { MarketplacePlaylistData } from '../../../marketplace/types';

interface Props {
  playlists: Array<{ id: number; name: string }>;
  config: MarketplacePlaylistData;
  onChange: (config: MarketplacePlaylistData) => void;
  error?: string;
}

const MarketplacePlaylistSettingsForm: React.FC<Props> = (props) => {
  const { playlists, config, onChange, error } = props;
  const classes = useStyles();
  const { t } = useTranslation('settings');

  useEffect(() => {
    if (config.playlistId === undefined && playlists.length) {
      onChange({ playlistId: playlists[0].id });
    }
  }, [config, playlists, onChange]);

  return (
    <div className={classes.flexCol}>
      <FormControl className={classes.marginTop}>
        <InputLabel>
          {t('marketplaceSettings.createDialog.selectPlaylist')}
        </InputLabel>
        <Select
          value={
            config.playlistId !== undefined
              ? config.playlistId
              : (playlists.length && playlists[0].id) || -1
          }
          onChange={(ev: any) => onChange({ playlistId: ev.target.value })}
        >
          {playlists.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </Select>
        {error && <Typography color="error">{t(error)}</Typography>}
      </FormControl>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  marginTop: {
    marginTop: theme.spacing(4),
  },
}));

export default MarketplacePlaylistSettingsForm;
