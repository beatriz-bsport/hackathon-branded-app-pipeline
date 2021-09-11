// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonBase from '@material-ui/core/ButtonBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  t: TFunction,
  setMenuAnchor: (e: ?HTMLElement) => void,
  classes: Object,
  privateServiceId: ?number,
  privateSlotId: ?number,
  privateServiceList: Array<PrivateService>,
  menuAnchor: ?HTMLElement,
  onSelect: (serviceId: number, slotId: number) => void,
};

export class PrivateServiceSelectorWithSlot extends React.Component<Props> {
  render() {
    return (
      <div>
        <ButtonBase
          onClick={(ev) => this.props.setMenuAnchor(ev.currentTarget)}
          className={this.props.classes.button}
        >
          <SearchIcon className={this.props.classes.leftIcon} />
          {this.props.privateServiceId && this.props.privateSlotId ? (
            (() => {
              const p = this.props.privateServiceList.find(
                (ps) => ps.id === this.props.privateServiceId,
              );
              if (!p) return <CircularProgress />;
              const s = p.slots.find(
                (s_) => s_.id === this.props.privateSlotId,
              );
              if (!s) return <CircularProgress />;
              return (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography variant="body" color="textSecondary" align="left">
                    {p.name}
                  </Typography>
                  <Typography variant="body2" align="left">
                    {s.name}
                  </Typography>
                </div>
              );
            })()
          ) : (
            <Typography color="textSecondary" align="left">
              {this.props.t('service.selector.placeholder')}
            </Typography>
          )}
        </ButtonBase>
        <Menu
          open={!!this.props.menuAnchor}
          anchorEl={this.props.menuAnchor}
          onClose={() => this.props.setMenuAnchor(null)}
          className={this.props.classes.menu}
        >
          {this.props.privateServiceList &&
          this.props.privateServiceList.length ? (
            this.props.privateServiceList
              .filter((ps) => ps.slots.length)
              .map((ps) => (
                <List
                  disablePadding
                  key={ps.id}
                  className={this.props.classes.menu}
                  subheader={
                    <ListSubheader
                      className={this.props.classes.subheader}
                      dense
                      component="div"
                    >
                      {ps.name}
                    </ListSubheader>
                  }
                >
                  <div
                    style={{
                      borderLeft: `4px solid ${ps.color || 'white'}`,
                    }}
                  >
                    {ps.slots.map((s) => (
                      <ListItem
                        dense
                        disableGutters
                        button
                        onClick={() => {
                          this.props.onSelect(ps.id, s.id);
                          this.props.setMenuAnchor(null);
                        }}
                      >
                        <ListItemText inset primary={s ? s.name : ' - '} />
                      </ListItem>
                    ))}
                  </div>
                </List>
              ))
          ) : (
            <ListItem dense>
              {this.props.t('service.selector.isEmpty')}
            </ListItem>
          )}
        </Menu>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {},
  button: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: '#F8F8F8',
    borderRadius: theme.spacing(1),
    minWidth: 200,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '&:hover': {
      backgroundColor: '#E8E8E8',
    },
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  menu: {
    minWidth: 200,
  },
  subheader: {
    backgroundColor: '#F4F4F4',
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
  withState('menuAnchor', 'setMenuAnchor', null),
)(PrivateServiceSelectorWithSlot);
