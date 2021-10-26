import { withStyles } from '@material-ui/styles';
import React from 'react';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  onClickZoomIn: () => void;
  onClickZoomOut: () => void;
  onClickCenter: () => void;
};

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

class CanvasZoomButtons extends React.PureComponent<Props> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Button variant="contained" onClick={this.props.onClickZoomIn}>
          <ZoomInIcon />
        </Button>

        {this.props.onClickCenter && (
          <Button variant="contained" onClick={this.props.onClickCenter}>
            <CenterFocusStrongIcon />
          </Button>
        )}

        <Button variant="contained" onClick={this.props.onClickZoomOut}>
          <ZoomOutIcon />
        </Button>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    position: 'absolute',
    left: 20,
    top: 20,
    display: 'flex',
    flexDirection: 'row',
  },
});

export default compose<any, OwnProps>(withStyles(styles))(CanvasZoomButtons);
