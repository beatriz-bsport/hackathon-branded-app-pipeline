import React from 'react';
import { compose } from 'recompose';
import { WithTranslation } from 'react-i18next';

import {
  ButtonBase,
  Typography,
  Fab,
  withStyles,
  Theme,
  Badge,
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { MaterialStyleType } from '../../utils/types';
import ExtendedFabBadge from '#components/ExtendedFabBadge.component';

type OwnProps = {
  items: {
    label: string;
    onClick: () => void;
    badgeValue?: number;
  }[];
  label?: string;
  badgeValue?: number;
  hidden?: boolean;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

interface State {
  openFab: boolean;
  badgeButtonBaseValue: number;
}

class FabWithItems extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      openFab: false,
      badgeButtonBaseValue: 0,
    };
  }

  componentDidUpdate(prevProps: OwnProps) {
    if (
      this.props.badgeValue &&
      this.props.badgeValue !== prevProps.badgeValue
    ) {
      this.setState({
        badgeButtonBaseValue: this.props.badgeValue,
      });
    }
  }

  onClose = () => {
    this.setState({ openFab: false });
  };

  onClick = () => {
    this.setState((prevState) => ({
      openFab: !prevState.openFab,
      badgeButtonBaseValue: prevState.openFab ? this.props.badgeValue : 0,
    }));
  };

  render() {
    const { classes, label, hidden } = this.props;
    if (hidden) {
      return null;
    }
    return (
      <>
        {this.state.openFab && (
          <ButtonBase
            disableRipple
            className={classes.fabBackgroundContainer}
            onClick={this.onClose}
          />
        )}

        <div className={classes.fabContainer}>
          {this.state.openFab && (
            <>
              {this.props.items
                .filter((item) => !!item)
                .map((item) => (
                  <Badge badgeContent={item.badgeValue} color="error">
                    <ButtonBase
                      key={item.label}
                      className={classes.fabItem}
                      onClick={() => {
                        this.setState({ openFab: false });
                        item.onClick();
                      }}
                    >
                      <Typography>{item.label}</Typography>
                    </ButtonBase>
                  </Badge>
                ))}
            </>
          )}

          <Fab
            aria-label="add"
            color="primary"
            onClick={this.onClick}
            variant={label ? 'extended' : undefined}
          >
            <ExtendedFabBadge badgeValue={this.state.badgeButtonBaseValue} />
            {this.state.openFab ? <CloseIcon /> : <AddIcon />}
            {label && (
              <Typography className={classes.fabLabel} variant="inherit">
                {label}
              </Typography>
            )}
          </Fab>
        </div>
      </>
    );
  }
}

const styles = (theme: Theme) => ({
  fabBackgroundContainer: {
    width: '100%',
    height: '100%',
    position: 'fixed',
    backgroundColor: '#00000033',
    zIndex: 999,
    top: 0,
    left: 0,
  },
  fabContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    zIndex: 9999,
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabLabel: {
    marginLeft: theme.spacing(1),
  },
  fabItem: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    marginBottom: theme.spacing(2),
    borderRadius: 5,
    backgroundColor: 'white',
    'box-shadow': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  },
});

export default compose<any, OwnProps>(
  // @ts-expect-error
  withStyles(styles),
)(FabWithItems);
