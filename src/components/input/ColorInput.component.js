// @flow
import React, { Component } from 'react';

import { compose, withState } from 'recompose';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { SketchPicker } from 'react-color';
import withStyles from '@material-ui/core/styles/withStyles';
import Popover from '@material-ui/core/Popover';

export class ColorInput extends Component<Props> {
  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();
  }

  render() {
    const { classes } = this.props;
    return (
      <FormControl>
        <FormLabel>{this.props.label}</FormLabel>
        <ButtonBase
          className={classes.button}
          onClick={() => this.props.setPickerOpen(!this.props.pickerOpen)}
        >
          <div
            ref={this.buttonRef}
            className={classes.colorBlock}
            style={{
              backgroundColor: this.props.color,
            }}
          />
          <Typography color="textSecondary">{this.props.color}</Typography>
        </ButtonBase>
        <Popover
          open={this.props.pickerOpen}
          anchorEl={this.buttonRef.current}
          onClose={() => this.props.setPickerOpen(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <SketchPicker
            disableAlpha
            onChangeComplete={(color) =>
              this.props.onChange && this.props.onChange(color.hex)
            }
            color={this.props.color}
          />
        </Popover>
        <FormHelperText>{this.props.helperText}</FormHelperText>
      </FormControl>
    );
  }
}

const styles = (theme) => ({
  button: {
    borderRadius: theme.spacing.unit,
    border: '1px solid #C1C1C1',
    padding: theme.spacing.unit,
    backgroundColor: '#F8F8F8',
    marginTop: theme.spacing.unit,
  },
  colorBlock: {
    height: 24,
    width: 24,
    marginRight: 12,
    textDecoration: 'none',
  },
});
export default compose(
  withStyles(styles),
  withState('pickerOpen', 'setPickerOpen', false),
)(ColorInput);
