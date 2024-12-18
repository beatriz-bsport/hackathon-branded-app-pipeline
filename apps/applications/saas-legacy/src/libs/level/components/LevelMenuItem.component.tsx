import React from 'react';
import { useTranslation } from 'react-i18next';
import { pure } from 'recompose';

import { makeStyles, Theme } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { Level } from '../types';
import { getLevelColor, getLevelTranslation, MAX_RESERVE_ID } from '../utils';

export type Props = {
  level: Level;
  isSelected?: boolean;
  isDisabled?: boolean;
  withEdit?: boolean;
  onEditLevel?: (id: number) => void;
  onDeleteLevel?: (id: number) => void;
};

export const LevelMenuItem: React.FC<Props> = ({
  level,
  isSelected = false,
  isDisabled = false,
  withEdit = false,
  onEditLevel,
  onDeleteLevel,
}: Props) => {
  const { t } = useTranslation();

  const classes = useStyles(level.id, level.color)();

  return (
    <ListItem
      button
      dense
      className={classes.list}
      disabled={isDisabled}
      selected={isSelected}
    >
      <div className={classes.bookmark} />
      <div className={classes.listInner}>
        <div className={classes.listText}>
          <ListItemText
            primaryTypographyProps={{
              noWrap: true,
            }}
          >
            {getLevelTranslation(level.id, level.name, t)}
          </ListItemText>
        </div>
        {level.id > MAX_RESERVE_ID && withEdit && (
          <div className={classes.row}>
            <IconButton
              onClick={(event) => {
                event.stopPropagation();
                onEditLevel(level.id);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={(event) => {
                event.stopPropagation();
                onDeleteLevel(level.id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )}
      </div>
    </ListItem>
  );
};

const useStyles = (id: number, color: string) =>
  makeStyles((theme: Theme) => {
    const levelColor = getLevelColor(id, color, theme);

    return {
      bookmark: {
        width: 10,
        height: 34,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: levelColor,
      },
      list: {
        padding: 0,
      },
      listText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      row: {
        display: 'flex',
        alignItems: 'center',
      },
      listInner: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
      },
    };
  });

export default pure(LevelMenuItem);
