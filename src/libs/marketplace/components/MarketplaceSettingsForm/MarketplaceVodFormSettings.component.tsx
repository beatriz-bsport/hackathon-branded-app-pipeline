import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { MarketplaceVODData } from '../../types';
import { Video } from '../../../video/types';

interface Props {
  videos: Video[];
  config: MarketplaceVODData;
  onChange: (config: MarketplaceVODData) => void;
}

const MarketplaceVodSettingsForm: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('settings');

  return (
    <div className={classes.flexCol}>
      <FormControl className={classes.marginTop}>
        <InputLabel>
          {t('marketplaceSettings.createDialog.selectVideo')}
        </InputLabel>
        <Select
          value={props.config.videoId || -1}
          onChange={(ev: any) => props.onChange({ videoId: ev.target.value })}
        >
          <MenuItem value={null}>---</MenuItem>
          {props.videos.map((video) => (
            <MenuItem key={video.id} value={video.id}>
              {props.videos.find((ps) => ps.id === video.id).name}
            </MenuItem>
          ))}
        </Select>
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

export default MarketplaceVodSettingsForm;
