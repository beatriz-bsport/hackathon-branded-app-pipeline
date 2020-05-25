// @flow
import React, { Component } from 'react';

import { compose, withState } from 'recompose';
import { withTranslation } from 'react-i18next';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
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
    const { classes, t } = this.props;
    return (
      <FormControl>
        <FormLabel>{this.props.label}</FormLabel>
        <ButtonBase
          className={classes.button}
          onClick={() => this.props.setPickerOpen(!this.props.pickerOpen)}
        >
          <div
            ref={this.buttonRef}
            className={
              this.props.color ? classes.colorBlock : classes.emptyColorBlock
            }
            style={{
              backgroundColor: this.props.color,
            }}
          />
          <Typography color="textSecondary">
            {this.props.color ? this.props.color : t('colorPicker.noColor')}
          </Typography>
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
          {this.props.transparentColorAvailable ? (
            <div className={classes.buttonContainer}>
              <Button
                onClick={() => {
                  this.props.onChange('');
                  this.props.setPickerOpen(!this.props.pickerOpen);
                }}
                className={classes.buttons}
              >
                {t('colorPicker.delete')}
              </Button>
              <Button
                onClick={() => {
                  this.props.setPickerOpen(!this.props.pickerOpen);
                }}
                className={classes.buttons}
              >
                {t('colorPicker.validate')}
              </Button>
            </div>
          ) : null}
        </Popover>
        {this.props.helperText ? (
          <FormHelperText>{this.props.helperText}</FormHelperText>
        ) : null}
      </FormControl>
    );
  }
}

const styles = (theme) => ({
  buttons: {
    padding: '3px',
    marginLeft: '10px',
    marginRight: '10px',
    marginTop: '5px',
    marginBottom: '5px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    background: 'white',
    marginTop: '-5px',
  },
  button: {
    borderRadius: theme.spacing(1),
    border: '1px solid #C1C1C1',
    padding: theme.spacing(1),
    backgroundColor: '#F8F8F8',
    marginTop: theme.spacing(1),
  },
  colorBlock: {
    height: 24,
    width: 24,
    marginRight: 12,
    textDecoration: 'none',
  },
  emptyColorBlock: {
    height: 0,
    width: 0,
  },
});
export default compose(
  withStyles(styles),
  withTranslation(['common']),
  withState('pickerOpen', 'setPickerOpen', false),
)(ColorInput);
