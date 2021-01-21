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

import { MarketplacePlaylistData } from '../../types';

interface Props {
  playlists: Array<{ id: number; name: string }>;
  config: MarketplacePlaylistData;
  onChange: (config: MarketplacePlaylistData) => void;
  error?: string;
}

const MarketplacePlaylistSettingsForm: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('settings');

  useEffect(() => {
    if (props.config.playlistId === undefined && props.playlists.length) {
      props.onChange({ playlistId: props.playlists[0].id });
    }
  }, []);

  return (
    <div className={classes.flexCol}>
      <FormControl className={classes.marginTop}>
        <InputLabel>
          {t('marketplaceSettings.createDialog.selectPlaylist')}
        </InputLabel>
        <Select
          value={
            props.config.playlistId !== undefined
              ? props.config.playlistId
              : (props.playlists.length && props.playlists[0].id) || -1
          }
          onChange={(ev: any) =>
            props.onChange({ playlistId: ev.target.value })
          }
        >
          {props.playlists.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </Select>
        {props.error && <Typography color="error">{props.error}</Typography>}
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
