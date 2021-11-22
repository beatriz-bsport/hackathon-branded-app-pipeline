import React from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import type { SmartList } from '../../types';
import { SMARTLIST_MEMBERS_BASE_OPTIONS } from '../constants';

const useStyles = makeStyles((theme: Theme) => ({
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  select: {
    paddingLeft: theme.spacing(1),
  },
}));

type Props = {
  smartlist: SmartList;
  smartListUpdate: (id: number, smartlist: SmartList) => void;
};

export const MemberBaseFilter = (props: Props) => {
  const { smartlist, smartListUpdate } = props;
  const classes = useStyles();

  const { t } = useTranslation('smartList');
  if (!smartlist) {
    return null;
  }
  return (
    <ListItem divider className={classes.listItem}>
      <>
        <Typography variant="body2">{t('memberBase.helperText')}</Typography>
        <div className={classes.select}>
          <Select
            required
            value={smartlist?.member_base}
            onChange={(ev) =>
              smartListUpdate(smartlist.id, {
                ...smartlist,
                member_base: ev.target.value,
              })
            }
          >
            {SMARTLIST_MEMBERS_BASE_OPTIONS.map((option, index) => (
              <MenuItem key={index} value={option}>
                {t(`memberBase.options.${option}`)}
              </MenuItem>
            ))}
          </Select>
        </div>
      </>
    </ListItem>
  );
};

export default MemberBaseFilter;
