// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FilterListIcon from '@material-ui/icons/FilterList';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ExpandMoreSharpIcon from '@material-ui/icons/ExpandMoreSharp';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Chip from '@material-ui/core/Chip';
import SvgIcon from '@material-ui/core/SvgIcon';

import CoachSelector from '#libs/associated-coach/components/coach-selector/CoachSelector.component';
import CoachGroupChip from '#libs/associated-coach/components/CoachGroupChip.component';

import type { Coach } from '#libs/associated-coach/types';

type SubMenuProps = {
  onClick: () => void;
  onDelete: () => void;
  label: string;
  icon: typeof SvgIcon;
  show: boolean;
};

type MenuProps = {
  openFunction: () => void;
  label: string;
  open: boolean;
  onChange?: (field?: string, value?: any) => void;
  onClick?: () => void;
  onDelete?: () => void;
  icon?: typeof SvgIcon;
  show?: boolean;
  subMenu?: Array<SubMenuProps>;
  type?: string;

  coaches?: Array<Coach>;
  selectedCoaches?: Array<number>;
};

type Props = {
  menu: Array<MenuProps>;
  emptyLabel?: string;
};

const ITEM_HEIGHT = 48;

const getCoachesById = (coaches: Array<Coach>, coaches_id: Array<number>) =>
  coaches.filter((c) => coaches_id.includes(c.id));

export const FilterMenu: React.FC<Props> = ({ menu, emptyLabel }) => {
  const classes = useStyles();
  const { t } = useTranslation('booking');

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const open = Boolean(anchorEl);

  // handling the open and close of the the main Menu
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const noFilter = menu.reduce(
    (acc, m) => acc && m.subMenu?.filter((s) => s.show).length === 0,
    true,
  );

  const handleCoachDelete =
    (
      selectedCoaches: number[],
      onChange: (field?: string, value?: any) => void,
    ) =>
    (coach: Coach) =>
      onChange(
        'coaches',
        [...selectedCoaches].filter((c) => c !== coach.id),
      );

  return (
    <div className={classes.row}>
      <div>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <FilterListIcon />
        </IconButton>
        {noFilter && emptyLabel && (
          <Typography
            className={classes.emptyText}
            variant="caption"
            color="textSecondary"
          >
            {emptyLabel}
          </Typography>
        )}
        <Menu
          id="short-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          getContentAnchorEl={null}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 6.5,
              width: '33ch',
            },
          }}
        >
          {menu.map((m) => (
            <div key={m.label}>
              <MenuItem
                dense
                className={m.openFunction && classes.subMenu}
                onClick={
                  m.openFunction
                    ? (ev) => {
                        ev.stopPropagation();
                        ev.preventDefault();
                        m.openFunction();
                      }
                    : (ev) => {
                        ev.stopPropagation();
                        ev.preventDefault();
                        m.onClick();
                        setAnchorEl(null);
                      }
                }
              >
                {!m.openFunction && (
                  <ListItemIcon>
                    <m.icon color="primary" />
                  </ListItemIcon>
                )}
                <Typography variant="inherit">{m.label}</Typography>
                {m.openFunction && !m.open && (
                  <ListItemIcon button>
                    <ExpandMoreSharpIcon color="primary" />
                  </ListItemIcon>
                )}
                {m.openFunction && m.open && (
                  <ListItemIcon button>
                    <ExpandLessIcon color="primary" />
                  </ListItemIcon>
                )}
              </MenuItem>
              <Collapse in={m.open}>
                {m.type === 'coach' ? (
                  <div className={classes.marginSelector}>
                    <CoachSelector
                      placeholder={t('filters.pickCoach')}
                      coaches={m.coaches}
                      selectedCoaches={m.selectedCoaches}
                      isClearable
                      selectOption={(
                        ev: { value: number; label: string }[],
                      ) => {
                        m.onChange(
                          'coaches',
                          ev.map((e) => e.value),
                        );
                      }}
                    />
                  </div>
                ) : (
                  <List subheader={<li />}>
                    <Divider color="primary" />
                    {m.subMenu.map((s) => (
                      <ListItem
                        key={s.label}
                        button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          ev.preventDefault();
                          s.onClick();
                          setAnchorEl(null);
                          m.openFunction();
                        }}
                      >
                        <ListItemIcon>
                          <s.icon color="primary" />
                        </ListItemIcon>
                        <Typography variant="inherit">{s.label}</Typography>
                      </ListItem>
                    ))}
                    <Divider color="primary" />
                  </List>
                )}
              </Collapse>
            </div>
          ))}
        </Menu>
      </div>
      <div className={classes.actionFilterList}>
        {menu.map((m) =>
          m.onClick ? (
            <div key={m.label}>
              {m.show && (
                <Chip
                  icon={<m.icon />}
                  label={m.label}
                  onDelete={m.onDelete}
                  variant="outlined"
                  size="small"
                />
              )}
            </div>
          ) : (
            <>
              {m.label === t('filters.coach') ? (
                <div className={classes.filters} key={m.label}>
                  <CoachGroupChip
                    coaches={getCoachesById(m.coaches, m.selectedCoaches)}
                    onDelete={handleCoachDelete(m.selectedCoaches, m.onChange)}
                  />
                </div>
              ) : (
                m.subMenu.reduce(
                  (previous, s) => previous || s.show,
                  false,
                ) && (
                  <div className={classes.filters} key={m.label}>
                    {m.subMenu.map(
                      (s) =>
                        s.show && (
                          <div key={s.label}>
                            <Chip
                              icon={<s.icon />}
                              label={s.label}
                              onDelete={s.onDelete}
                              variant="outlined"
                              size="small"
                            />
                          </div>
                        ),
                    )}
                  </div>
                )
              )}
            </>
          ),
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  emptyText: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
  subMenu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(0),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  filters: {
    flexWrap: 'wrap',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  actionFilterList: {
    flexWrap: 'wrap',
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: '100%',
    '& > *': {
      margin: theme.spacing(1) / 2,
    },
  },
  marginSelector: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(3),
  },
}));

export default FilterMenu;
