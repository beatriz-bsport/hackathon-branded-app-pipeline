// @flow

import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { useTranslation } from 'react-i18next';
import type { VideoView, VideoPurchase } from '../types';

type Props = {
  item: VideoView | VideoPurchase,
  onClick: ?() => void,
  secondaryText: string,
};

const VodMemberGenericListItem = (props: Props) => {
  const { secondaryText } = props;
  const { member } = props.item;
  const { t } = useTranslation('member');
  return (
    <ListItem
      dense
      divider
      button={!!props.onClick}
      onClick={props.onClick || null}
    >
      <ListItemAvatar>
        <Avatar src={member ? member.photo : null} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography>
              {`${member && member.name ? member.name : '-'}`}
            </Typography>
            {member && member.archived && (
              <Typography variant="caption" color="secondary">
                {`${'\u00A0'}(${t('member:archived')})`}
              </Typography>
            )}
          </div>
        }
        secondary={secondaryText}
      />
    </ListItem>
  );
};

export default VodMemberGenericListItem;
