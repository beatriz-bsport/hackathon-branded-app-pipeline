/* eslint-disable jsx-a11y/click-events-have-key-events */
// @flow
import React from 'react';
import { compose } from 'recompose';
import { WithStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

import executeOnDeprecatedVersion from '../utils/executeOnDeprecatedVersion';
import RELEASE_VERSION from '../release';
import RELEASE_DATE from '../release-date';
import Tooltip from './Tooltip.component';

type State = {
  isOutdatedVersion: boolean;
};

class VersionVisualizer extends React.Component<
  WithStyles<typeof styles>,
  State
> {
  state = {
    isOutdatedVersion: false,
  };

  componentDidMount() {
    executeOnDeprecatedVersion(() => {
      this.setState({
        isOutdatedVersion: true,
      });
    });
  }

  reloadIfOudated = () => {
    if (this.state.isOutdatedVersion) {
      window.location.reload();
    }
  };

  render() {
    const { classes } = this.props;

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div className={classes.version} onClick={this.reloadIfOudated}>
        <Tooltip title={RELEASE_DATE}>
          <div>
            {this.state.isOutdatedVersion
              ? `⬤ ${RELEASE_VERSION}`
              : RELEASE_VERSION}
          </div>
        </Tooltip>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  version: {
    alignSelf: 'center',
    justifySelf: 'self-end',
    color: theme.palette.grey[300],
    marginBottom: theme.spacing(2),
    fontSize: 10,
  },
});

export default compose(withStyles(styles, { withTheme: true }))(
  VersionVisualizer,
);
