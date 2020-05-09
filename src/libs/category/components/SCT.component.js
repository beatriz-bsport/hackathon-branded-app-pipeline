// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import SPORTS from '@bsport/common/lib/master-data/sports';
import classnames from 'classnames';

type Props = {
  parentCategory: number,
  SCTName: string,
  noname: ?boolean,
  variant: ?string,
  classes: Object,
  isFocused?: boolean,
  isSelected?: boolean,
  paddingLeft?: boolean,
};

export function Sport(props: Props) {
  const {
    parentCategory,
    classes,
    isSelected,
    isFocused,
    SCTName,
    noname,
    paddingLeft,
  } = props;
  const variant = props.variant || 'body2';

  const sport = SPORTS.filter((s) => s.id === parentCategory)[0];

  return (
    <div
      className={classnames(
        classes.container,
        isSelected ? classes.selected : null,
        isFocused ? classes.focused : null,
        paddingLeft ? classes.paddingLeft : null,
      )}
    >
      <img src={sport.icon} height={26} width={26} alt="coach profile" />
      {noname ? null : (
        <Typography className={classes.text} variant={variant}>
          {SCTName || sport.text}
        </Typography>
      )}
    </div>
  );
}

const styles = (theme) => ({
  focused: { backgroundColor: '#efefef' },
  selected: { backgroundColor: '#e0e0e0' },
  paddingLeft: { paddingLeft: theme.spacing(1) },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: theme.spacing(1),
  },
});

export default withStyles(styles)(Sport);
