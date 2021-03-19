import React from 'react';
import {
  Typography,
  withStyles,
  Collapse,
  ButtonBase,
  Divider,
  Theme,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { Variant } from '@material-ui/core/styles/createTypography';
import { compose } from 'recompose';
import { MaterialStyleType } from '../utils/types';
import DividerLinearGradient from './DividerLinearGradient.component';

type OwnProps = {
  title: string;
  in: boolean;
  onSwitch: () => void;
  titleVariant?: Variant | 'inherit';
};

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

class CollapsibleSection extends React.PureComponent<Props> {
  onSwitch = () => {
    if (!this.props.in) {
      this.props.onSwitch();
    }
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        <ButtonBase
          onClick={this.onSwitch}
          className={this.props.classes.topBar}
          disableRipple={this.props.in}
        >
          <div className={this.props.classes.topBarIconContainer}>
            {this.props.in ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
          <Typography
            variant={this.props.titleVariant || 'h5'}
            color={this.props.in ? 'inherit' : 'textSecondary'}
          >
            {this.props.title}
          </Typography>
        </ButtonBase>
        {this.props.in ? <DividerLinearGradient /> : <Divider />}

        <Collapse in={this.props.in}>{this.props.children}</Collapse>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
  },
  topBar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(1),
  },
  topBarIconContainer: {
    marginRight: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
)(CollapsibleSection);
