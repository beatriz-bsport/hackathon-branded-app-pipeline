import React from 'react';
import { compose } from 'recompose';
import { WithTranslation } from 'react-i18next';

import {
  ButtonBase,
  Typography,
  Fab,
  withStyles,
  Theme,
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { MaterialStyleType } from '../../utils/types';

type OwnProps = {
  items: {
    label: string;
    onClick: () => void;
  }[];
  label?: string;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

interface State {
  openFab: boolean;
}

class FabWithItems extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      openFab: false,
    };
  }

  onClose = () => {
    this.setState({ openFab: false });
  };

  onClick = () => {
    this.setState((prevState) => ({
      openFab: !prevState.openFab,
    }));
  };

  render() {
    return (
      <>
        {this.state.openFab && (
          <ButtonBase
            className={this.props.classes.fabBackgroundContainer}
            disableRipple
            onClick={this.onClose}
          />
        )}

        <div className={this.props.classes.fabContainer}>
          {this.state.openFab && (
            <>
              {this.props.items
                .filter((item) => !!item)
                .map((item) => (
                  <ButtonBase
                    className={this.props.classes.fabItem}
                    onClick={() => {
                      this.setState({ openFab: false });
                      item.onClick();
                    }}
                  >
                    <Typography>{item.label}</Typography>
                  </ButtonBase>
                ))}
            </>
          )}

          <Fab
            color="primary"
            aria-label="add"
            variant={this.props.label ? 'extended' : undefined}
            onClick={this.onClick}
          >
            {this.state.openFab ? <CloseIcon /> : <AddIcon />}
            {this.props.label && (
              <Typography className={this.props.classes.fabLabel}>
                {this.props.label}
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
    bottom: 20,
    right: 20,
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
  // @ts-ignore
  withStyles(styles),
)(FabWithItems);
